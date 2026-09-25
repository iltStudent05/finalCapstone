# Project Task Tracker

> A collaborative project management application demonstrating full-stack development with modern web technologies.
>
> **Live Deployment:** http://a6edf61779f0b405abccc4bb450b5dd3-1760106026.us-east-1.elb.amazonaws.com/ &nbsp;(landing page) — React app at [/app/](http://a6edf61779f0b405abccc4bb450b5dd3-1760106026.us-east-1.elb.amazonaws.com/app/) _(AWS EKS, us-east-1)_

## Team

- **Donavan Francis** — Full-stack development (API, Database, Frontend)
- **Asma Sadia** — Full-stack development (API, Database, Frontend)

## Project Overview

Project Task Tracker is a web application for managing projects and tasks collaboratively. Users can:
- Register and authenticate with JWT-based login
- Create and manage projects
- Create tasks within projects and assign them to team members
- Add comments to tasks for collaboration
- View dashboard with aggregate statistics
- Filter tasks by status and priority

## Features

### Authentication & Authorization
- User registration and login with email/password
- JWT token-based authentication
- Role-based access control (admin, manager, contributor):
  - **Projects** — create/update require `manager` or `admin`; delete requires `admin`
  - **Tasks** — any authenticated user can create; delete requires `manager` or `admin`
  - **Comments** — any authenticated user can create/edit/delete
- Protected routes for authenticated users

### Project Management
- Create, read, update, delete projects
- Manage project members
- Track project status (planning, active, on-hold, completed)

### Task Management
- Create tasks within projects
- Assign tasks to team members
- Track task status (todo, in-progress, review, done)
- Set priority levels (low, medium, high, urgent)
- Add due dates and tags to tasks

### Collaboration
- Add comments to tasks
- Real-time updates via API
- User-friendly dashboard with statistics

### Dashboard
- View key metrics (users, projects, tasks, comments)
- See tasks grouped by status and priority
- View recent activities across the system

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker & Docker Compose (for containerized development)
- AWS Account (for ECR and EKS deployment)

### Local Development

#### Option 1: Direct Installation
```bash
# Install API dependencies
cd api
npm install
npm run dev

# In another terminal, install Client dependencies
cd client
npm install
npm run dev

# Access:
# - API: http://localhost:4000
# - Client: http://localhost:5173
# - API Health: http://localhost:4000/api/health
```

#### Option 2: Docker Compose
```bash
# Start all services (MongoDB, API, Client)
docker compose up --build

# Access:
# - Landing page: http://localhost:3001
# - React app: http://localhost:3001/app
# - API: http://localhost:4001
```

#### Seeding demo data (optional)

Populate the database with sample users, projects, tasks, and comments:
```bash
cd api
npm run seed        # wipe collections, then insert demo data
npm run seed:clear  # wipe collections only
```

Seeded login accounts (all use password `password123`):

| Email | Role |
|-------|------|
| admin@example.com | admin |
| manager@example.com | manager |
| contributor@example.com | contributor |

**Note:** If you encounter port conflicts (e.g., MongoDB on 27017):
```bash
# Stop local MongoDB
sudo systemctl stop mongod  # Linux
brew services stop mongodb-community  # macOS
Stop-Service MongoDB  # Windows PowerShell (admin)

# Or modify docker-compose.yml to use different ports:
# mongo:
#   ports:
#     - "27018:27017"  # host:container
```

## Project Structure

```
finalCapstone/
├── api/                         # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   ├── models/             # Mongoose schemas (User, Project, Task, Comment)
│   │   ├── middleware/         # Auth, RBAC, validation, error handling
│   │   ├── config/             # Database and environment config
│   │   ├── seed.ts            # Demo data seed / clear utility
│   │   └── app.ts             # Express app setup
│   ├── Dockerfile
│   └── package.json
├── client/                      # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/              # Page components (Dashboard, Login, Projects, ProjectDetail, Tasks)
│   │   ├── components/         # Reusable components (Navbar, ProtectedRoute)
│   │   ├── context/            # AuthContext for state management
│   │   ├── api/                # API client (Axios with interceptors)
│   │   └── App.tsx
│   ├── public/
│   │   └── landing.html        # Static landing page
│   ├── Dockerfile
│   ├── nginx.conf              # Nginx configuration for production
│   └── package.json
├── k8s/                        # Kubernetes manifests
│   ├── namespace.yaml
│   ├── secrets.yaml
│   ├── mongo.yaml             # MongoDB Deployment + Service
│   ├── api.yaml               # API Deployment + Service
│   └── client.yaml            # Client Deployment + LoadBalancer Service
├── docker-compose.yml          # Local development orchestration
├── ARCHITECTURE.md             # System design documentation
└── README.md
```

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Frontend** | React | 18.2 |
| **Frontend Styling** | CSS3 (Custom) | — |
| **Frontend Framework** | Vite | 4.4 |
| **Frontend Routing** | React Router | 6.14 |
| **Frontend Testing** | Vitest + Testing Library | Latest |
| **Backend** | Express.js | 4.x |
| **Language** | TypeScript | 5.1 |
| **Database** | MongoDB | 7 |
| **ODM** | Mongoose | 7.x |
| **Authentication** | JWT | jsonwebtoken 9.x |
| **Password Hashing** | bcrypt | 5.x |
| **HTTP Client** | Axios | 1.4 |
| **Containerization** | Docker | Latest |
| **Orchestration** | Docker Compose & Kubernetes | Latest |
| **Cloud Deployment** | Amazon EKS | Latest |
| **CI/CD** | GitHub Actions | Latest |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get aggregate statistics |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get project by ID |
| POST | `/api/projects` | Create new project (manager/admin) |
| PUT | `/api/projects/:id` | Update project (manager/admin) |
| DELETE | `/api/projects/:id` | Delete project (admin) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create new task (auth required) |
| PUT | `/api/tasks/:id` | Update task (auth required) |
| DELETE | `/api/tasks/:id` | Delete task (manager/admin) |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments` | List all comments |
| GET | `/api/comments/:id` | Get comment by ID |
| POST | `/api/comments` | Create new comment (auth required) |
| PUT | `/api/comments/:id` | Update comment (auth required) |
| DELETE | `/api/comments/:id` | Delete comment (auth required) |

## Testing and Verification

### Automated tests

Run the complete test suite from the repository root:
```bash
npm test
```

Run packages individually if needed:
```bash
cd client
npm run test:run

cd ../api
npm run test:run
```

### Build verification

Confirm both apps compile successfully:
```bash
npm run build
```

### Manual application verification

1. Start the full stack with Docker:
	```bash
	docker compose up --build
	```
2. Open the landing page at http://localhost:3001
3. Open the React SPA at http://localhost:3001/app
4. Confirm the API health endpoint responds at http://localhost:4001/api/health
5. Register or log in, then verify the dashboard loads real API data

### What is covered

- Authentication endpoints (register, login)
- Protected endpoints requiring a valid JWT
- CRUD operations on projects and tasks
- Form inputs and validation
- Navigation elements for authenticated users

## Deployment

### Docker Image Building

```bash
# Build API image
docker build -t capstone-api:latest ./api

# Build Client image  
docker build -t capstone-client:latest ./client

# Test locally
docker compose up --build
```

### AWS ECR Push

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag images
docker build -t <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/capstone-api:latest ./api
docker build -t <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/capstone-client:latest ./client

# Push to ECR
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/capstone-api:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/capstone-client:latest
```

### EKS Deployment

The application is deployed live on AWS EKS (cluster `capstone`, region `us-east-1`):

**http://a6edf61779f0b405abccc4bb450b5dd3-1760106026.us-east-1.elb.amazonaws.com/**

```bash
# Update image references in k8s/*.yaml with your ACCOUNT_ID

# Create EKS cluster (if needed)
eksctl create cluster --name capstone --region us-east-1 --nodes 2 --node-type t3.medium --managed --version 1.33

# Enable dynamic EBS volumes (required for the MongoDB PVC on EKS 1.30+)
eksctl utils associate-iam-oidc-provider --cluster capstone --region us-east-1 --approve
eksctl create iamserviceaccount --name ebs-csi-controller-sa --namespace kube-system \
  --cluster capstone --region us-east-1 --role-name AmazonEKS_EBS_CSI_DriverRole \
  --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy --approve --role-only
eksctl create addon --name aws-ebs-csi-driver --cluster capstone --region us-east-1 \
  --service-account-role-arn arn:aws:iam::<ACCOUNT_ID>:role/AmazonEKS_EBS_CSI_DriverRole --force
kubectl patch storageclass gp2 -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongo.yaml
kubectl apply -f k8s/api.yaml
kubectl apply -f k8s/client.yaml

# Verify deployment
kubectl get pods -n capstone
kubectl get svc -n capstone

# Get LoadBalancer URL
kubectl get svc capstone-client -n capstone -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'

# (Optional) Seed the cluster database via a port-forward
kubectl port-forward -n capstone deploy/mongodb 27019:27017 &
cd api && MONGODB_URI="mongodb://admin:mongoose@localhost:27019/task-tracker?authSource=admin" npm run seed
```

### Tearing down (stop AWS charges)

```bash
eksctl delete cluster --name capstone --region us-east-1
aws ecr delete-repository --repository-name capstone-api --force --region us-east-1
aws ecr delete-repository --repository-name capstone-client --force --region us-east-1
```

## Troubleshooting

### MongoDB Connection Issues
- Check MongoDB is running and accessible at `mongodb://localhost:27017`
- Verify credentials match in environment variables
- Docker: `docker logs task-tracker-mongo`

### API Server Issues
- Ensure MongoDB is running first
- Check port 4000 is available: `lsof -i :4000` (Linux/macOS) or `netstat -ano | findstr :4000` (Windows)
- API logs: `docker logs task-tracker-api`

### React App Issues
- Clear browser cache and local storage
- Check Vite dev server running on port 5173
- Network tab in browser DevTools to verify API requests

### Kubernetes Issues
- Check pod status: `kubectl describe pod <pod-name> -n capstone`
- View logs: `kubectl logs <pod-name> -n capstone`
- Check service DNS: `kubectl get svc -n capstone`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Code style and formatting
- Commit message conventions
- Pull request process
- Testing requirements

## CI/CD Pipeline

GitHub Actions automates:
- TypeScript compilation checks
- Unit and integration tests
- Docker image builds
- Deployment to staging/production

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for details.

## License

This project is created for educational purposes as part of an academic capstone.
