# Architecture

## System Overview

```text
User
  -> Nginx (landing page at /)
  -> Nginx (React SPA at /app)
  -> Express API (/api)
  -> MongoDB
```

## Technology Stack

- Frontend: React 18, TypeScript, Vite, React Router, Axios
- Backend: Express, TypeScript, Mongoose, JWT, bcrypt
- Database: MongoDB 7
- Testing: Vitest, Testing Library
- Containerization: Docker, Docker Compose
- Deployment: Amazon EKS, Kubernetes, ECR, Nginx

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api | API info |
| POST | /api/auth/register | Register user and return JWT |
| POST | /api/auth/login | Login user and return JWT |
| GET | /api/dashboard | Aggregated dashboard stats |
| GET | /api/projects | List projects |
| POST | /api/projects | Create project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/tasks | List tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/comments | List comments |
| POST | /api/comments | Create comment |

## Deployment Architecture

- Local development uses Docker Compose with MongoDB, API, and client containers.
- Production images are built separately and pushed to Amazon ECR.
- Kubernetes manifests deploy MongoDB, the API service, and the client service.
- The client Nginx container serves the landing page at / and the React SPA at /app.
- API requests are proxied from Nginx to the Express service.

## Data Relationships

- A user owns projects.
- Projects contain tasks.
- Tasks can be assigned to users.
- Comments belong to tasks and are authored by users.

## Notes

- JWTs are stored in localStorage on the client.
- Authenticated requests include the token via Axios interceptors.
- Protected write operations require a valid bearer token.
