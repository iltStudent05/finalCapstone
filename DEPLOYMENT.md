# Deployment Guide

This guide covers deploying the Project Task Tracker to AWS EKS and setting up CI/CD.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Setup](#docker-setup)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [AWS ECR & EKS](#aws-ecr--eks)
5. [CI/CD Pipeline](#cicd-pipeline)

## Local Development

### Quick Start

```bash
# Install dependencies
npm run install:all

# Start development services with Docker
docker-compose up --build

# Access the application
# - Landing page: http://localhost:3000/
# - React app: http://localhost:3000/app/
# - API health: http://localhost:3000/api/health
```

### Development Servers (Native)

```bash
# Terminal 1: API
cd api
npm run dev

# Terminal 2: React
cd client
npm run dev

# Terminal 3: Optional - run tests
npm run test
```

## Docker Setup

### Building Images Locally

```bash
# Build and tag images
docker build -t task-tracker-web:latest -f client/Dockerfile .
docker build -t task-tracker-api:latest -f api/Dockerfile .

# Run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f web
docker-compose logs -f api
docker-compose logs -f mongo

# Stop services
docker-compose down
```

### Dockerfile Structure

#### Client (Nginx + React)
- Multi-stage build reduces final image size
- Vite builds React app to `/app/dist`
- Landing page served at `/`
- Nginx proxies `/api/` to Express backend

#### API (Node.js)
- Alpine base image (~180 MB)
- TypeScript compiled to JavaScript
- Express runs on port 4000

### Docker Compose Services

- **web** — Nginx (port 3000)
- **api** — Express.js (port 4000)
- **mongo** — MongoDB (port 27017)
- **mongo-network** — Internal service discovery

## Kubernetes Deployment

### Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Helm (optional but recommended)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# EKS CLI
pip install awscli-local
aws eks update-kubeconfig --name task-tracker-prod --region us-east-1
```

### Kubernetes Manifests

Place in `k8s/` directory:

#### Namespace
```yaml
# k8s/namespace.yml
apiVersion: v1
kind: Namespace
metadata:
  name: task-tracker
```

#### ConfigMap & Secrets
```yaml
# k8s/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: task-tracker
data:
  NODE_ENV: "production"
  PORT: "4000"
  CLIENT_URL: "https://task-tracker.example.com"

---
# k8s/secret.yml
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
  namespace: task-tracker
type: Opaque
stringData:
  JWT_SECRET: "your-secure-jwt-secret"
  MONGODB_URI: "mongodb://admin:password@mongo:27017/task-tracker"
```

#### MongoDB StatefulSet
```yaml
# k8s/mongodb.yml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongo
  namespace: task-tracker
spec:
  serviceName: mongo
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
      - name: mongo
        image: mongo:6-alpine
        ports:
        - containerPort: 27017
        volumeMounts:
        - name: mongo-storage
          mountPath: /data/db
  volumeClaimTemplates:
  - metadata:
      name: mongo-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

#### API Deployment
```yaml
# k8s/api-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: task-tracker
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: your-ecr-repo/task-tracker-api:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 4000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: api-config
              key: NODE_ENV
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: JWT_SECRET
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: MONGODB_URI
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 4000
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: api
  namespace: task-tracker
spec:
  selector:
    app: api
  ports:
  - protocol: TCP
    port: 4000
    targetPort: 4000
  type: ClusterIP
```

#### Web (Nginx) Deployment
```yaml
# k8s/web-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: task-tracker
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: your-ecr-repo/task-tracker-web:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /app/
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: web
  namespace: task-tracker
spec:
  selector:
    app: web
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

### Deploy to EKS

```bash
# Create namespace
kubectl apply -f k8s/namespace.yml

# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments -n task-tracker
kubectl get pods -n task-tracker
kubectl get svc -n task-tracker

# Get LoadBalancer external IP
kubectl get svc web -n task-tracker -o wide

# Monitor rollout
kubectl rollout status deployment/api -n task-tracker
kubectl rollout status deployment/web -n task-tracker

# View logs
kubectl logs -f deployment/api -n task-tracker
kubectl logs -f deployment/web -n task-tracker
```

## AWS ECR & EKS

### ECR Setup

```bash
# Create ECR repositories
aws ecr create-repository --repository-name task-tracker-web --region us-east-1
aws ecr create-repository --repository-name task-tracker-api --region us-east-1

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Push images
docker tag task-tracker-web:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/task-tracker-web:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/task-tracker-web:latest

docker tag task-tracker-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/task-tracker-api:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/task-tracker-api:latest
```

### EKS Cluster Setup

```bash
# Create cluster (via AWS Console or CLI)
aws eks create-cluster \
  --name task-tracker-prod \
  --version 1.27 \
  --role-arn arn:aws:iam::123456789:role/eks-service-role \
  --resources-vpc-config subnetIds=subnet-123,subnet-456

# Update kubeconfig
aws eks update-kubeconfig --name task-tracker-prod --region us-east-1

# Add worker nodes
aws eks create-nodegroup \
  --cluster-name task-tracker-prod \
  --nodegroup-name task-tracker-nodes \
  --subnets subnet-123 subnet-456 \
  --node-role arn:aws:iam::123456789:role/eks-node-role
```

## CI/CD Pipeline

### GitHub Actions Workflow

The `.github/workflows/ci.yml` handles:

1. **Code Quality**
   - TypeScript type checking
   - ESLint linting
   - Build verification

2. **Testing**
   - Unit tests (Vitest)
   - Integration tests

3. **Build Artifacts**
   - Docker image creation
   - ECR push (on main/dev)

4. **Deployment** (future phase)
   - Automatic EKS deployment
   - Health checks
   - Rollback on failure

### Secrets Management

In GitHub repo settings, add:

```
AWS_ACCOUNT_ID = "123456789"
AWS_ECR_REGION = "us-east-1"
AWS_ACCESS_KEY_ID = "AKIA..."
AWS_SECRET_ACCESS_KEY = "..."
JWT_SECRET = "production-secret"
MONGODB_URI = "mongodb+srv://..."
```

## Monitoring & Logging

### kubectl Useful Commands

```bash
# View cluster status
kubectl cluster-info
kubectl get nodes
kubectl top nodes

# Scaling
kubectl scale deployment api --replicas=3 -n task-tracker

# Update image (triggers rollout)
kubectl set image deployment/api api=ecr-repo/api:v1.1.0 -n task-tracker

# Rollback on failure
kubectl rollout undo deployment/api -n task-tracker

# Debug container
kubectl exec -it pod-name -n task-tracker -- /bin/sh

# View events
kubectl get events -n task-tracker --sort-by='.lastTimestamp'
```

### CloudWatch Logs (AWS)

```bash
# View log group
aws logs describe-log-groups --region us-east-1

# Stream logs
aws logs tail /ecs/task-tracker-api --follow
```

## Performance Optimization

1. **Image Caching**: Use Docker layer caching in CI/CD
2. **Resource Limits**: Set requests/limits in Pod specs
3. **Horizontal Scaling**: Auto-scale with HPA
4. **CDN**: Cache static assets with CloudFront
5. **Database**: Optimize MongoDB indexes, use connection pooling

## Security Checklist

- [ ] Secrets stored in Kubernetes Secrets (not ConfigMap)
- [ ] HTTPS enabled with TLS certificates
- [ ] Network policies restrict pod-to-pod communication
- [ ] Service accounts with minimal RBAC permissions
- [ ] Container images scanned for vulnerabilities
- [ ] Regular backups configured for MongoDB
- [ ] API rate limiting enabled
- [ ] CORS configured properly

## Troubleshooting Deployment

### Pod won't start
```bash
kubectl describe pod pod-name -n task-tracker
kubectl logs pod-name -n task-tracker
```

### Service unreachable
```bash
# Check service endpoints
kubectl get endpoints -n task-tracker
# Check DNS
kubectl run -it --rm debug --image=alpine --restart=Never -- nslookup api.task-tracker.svc.cluster.local
```

### High memory/CPU
```bash
kubectl top pods -n task-tracker
# Increase resource limits in deployment
```

---

For detailed Architecture Diagrams, see [docs/architecture.md](docs/architecture.md)
