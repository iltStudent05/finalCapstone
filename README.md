# Project Task Tracker

> A collaborative project management application demonstrating full-stack development with modern web technologies.

## Team Workflow

### Branching Strategy

We follow a trunk-based development workflow with feature branches:

- **main** — Production-ready code only (protected branch)
- **dev** — Integration branch for feature work
- **feature/*** — Feature branches (e.g., feature/landing-page, feature/api-auth)

### Branch Protection Rules

- All PRs to `main` and `dev` require code review
- CI/CD pipeline must pass before merging
- Squash commits on merge to keep history clean

## Project Structure

```
finalCapstone/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   │   └── landing.html   # Static landing page
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── api/                    # Express + TypeScript backend
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions pipeline
├── docker-compose.yml      # Local development orchestration
└── README.md
```

## Technologies

### Phase 1: Frontend Foundations
- HTML5 & CSS3 – Semantic markup, responsive design
- Git & GitHub – Branching, PRs, code review
- GitHub Actions – CI/CD automation

### Phase 2: React Application
- React 18 + TypeScript
- React Router for navigation
- Component-based architecture
- Vitest + Testing Library for tests

### Phase 3: Full Stack
- Express.js + TypeScript REST API
- MongoDB + Mongoose for data persistence
- JWT-based authentication
- Docker & Docker Compose
- Kubernetes (EKS deployment)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker & Docker Compose (for containerized development)

### Installation

```bash
# Install dependencies
npm run install:all

# Start development servers
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Local Development

```bash
# Terminal 1: Start API server
cd api && npm run dev

# Terminal 2: Start React dev server
cd client && npm run dev

# Open http://localhost:5173 for React app
```

## Application Domain

**Project Task Tracker** – A collaborative project management tool

### Data Models
- **User** — Authentication, roles (admin, manager, contributor)
- **Project** — Team projects with metadata
- **Task** — Individual tasks within projects with status tracking
- **Comment** — Discussion on tasks

### Features
- Create and manage projects
- Track tasks with status, priority, and assignment
- Collaborate via comments
- Dashboard with project/task statistics
- Role-based access control

## CI/CD Pipeline

GitHub Actions automates:
- TypeScript compilation checks
- Unit and integration tests
- Docker image builds
- Deployment to staging/production

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for details.

## Team Members

> Add your team member names and roles here

## License

MIT
