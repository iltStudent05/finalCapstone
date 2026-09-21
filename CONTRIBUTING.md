# Contributing Guidelines

Welcome to the Project Task Tracker team! This document outlines our development workflow, branching strategy, and contribution process.

## Development Workflow

### 1. Branching Strategy

We use a Git flow inspired branching model:

```
main (production)
  ↑
dev (staging)
  ↑
feature/feature-name
feature/another-feature
bugfix/bug-fix-name
```

#### Branch Naming Conventions

- **Feature branches**: `feature/descriptive-name` (e.g., `feature/landing-page`, `feature/user-auth`)
- **Bug fixes**: `bugfix/issue-description` (e.g., `bugfix/login-redirect`)
- **Hotfixes**: `hotfix/critical-fix` (e.g., `hotfix/security-vulnerability`)

### 2. Making Changes

#### For a New Feature:

```bash
# Update dev branch
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Test thoroughly
# Commit with meaningful messages
git add .
git commit -m "feat: implement your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request (dev as base branch)
```

#### For Bug Fixes:

```bash
# Same flow, but use bugfix/ prefix
git checkout -b bugfix/description-of-bug
# Make changes
git commit -m "fix: resolve specific bug description"
git push origin bugfix/description-of-bug
# Create PR to dev branch
```

### 3. Commit Message Format

Follow conventional commits:

```
<type>: <subject>

<body>

<footer>
```

**Types**:
- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code refactor without feature/fix
- `perf` — Performance improvement
- `test` — Test additions or changes
- `docs` — Documentation changes
- `chore` — Build, deps, tooling changes
- `style` — Code style changes (formatting, missing semicolons, etc.)

**Examples**:
```
feat: add user authentication with JWT
fix: resolve landing page mobile layout issue
docs: update API documentation for endpoints
test: add unit tests for Task model
```

### 4. Pull Request Process

1. **Create a Pull Request** from your feature branch to `dev`
2. **PR Title**: Use conventional commit format: `feat: add landing page`
3. **PR Description**: Include
   - Summary of changes
   - Motivation and context
   - Screenshots (for UI changes)
   - Testing steps
   - Checklist:
     ```
     - [ ] I have tested these changes locally
     - [ ] I have updated documentation if needed
     - [ ] My code follows the project style guidelines
     - [ ] I have added tests for new functionality
     ```
4. **Code Review**: At least one team member must review and approve
5. **CI/CD**: All checks must pass (linting, type checking, tests, builds)
6. **Squash & Merge**: Squash commits to keep history clean

### 5. Merging to Main

Only release-ready code (from `dev`) merges to `main`:

```bash
# Create PR from dev to main (usually after version bump)
# After approval and all checks pass, squash and merge
```

## Development Environment

### Prerequisites

- Node.js 18+
- npm 9+ or yarn
- Docker & Docker Compose (for local containerized development)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/project-task-tracker.git
cd project-task-tracker

# Install all dependencies
npm run install:all

# Copy environment files
cp api/.env.example api/.env
cp client/.env.example client/.env (if applicable)
```

### Local Development

#### Option 1: Native Node.js

```bash
# Terminal 1: Start API
cd api
npm run dev
# Runs on http://localhost:4000

# Terminal 2: Start React dev server
cd client
npm run dev
# Runs on http://localhost:5173
```

#### Option 2: Docker Compose

```bash
# From project root
docker-compose up --build

# Verify:
# - Web: http://localhost:3000
# - API: http://localhost:3000/api/health
# - Landing: http://localhost:3000/
```

### Testing

```bash
# Run all tests
npm run test

# Run tests for specific workspace
npm run test -w client
npm run test -w api

# Run with coverage
npm run test -- --coverage
```

### Building

```bash
# Build all workspaces
npm run build

# Build specific workspace
npm run build -w client
npm run build -w api

# Production build output:
# - client/dist/      (React build)
# - api/dist/         (Express build)
```

## Code Style & Quality

### Linting

```bash
# Run linter
npm run lint

# Fix common issues
npm run lint -- --fix
```

### TypeScript Strict Mode

All code must pass strict TypeScript checks:

```bash
npm run type-check
```

### Testing Requirements

- **Components**: Unit tests with Vitest + Testing Library
- **API Routes**: Unit and integration tests
- **Minimum Coverage**: 80% for production code

## Project Structure

```
finalCapstone/
├── .github/workflows/ci.yml         # CI/CD pipeline
├── client/                           # React frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API services
│   │   ├── App.tsx                  # Main App component
│   │   └── main.tsx                 # Entry point
│   ├── public/
│   │   └── landing.html             # Landing page
│   ├── vite.config.ts
│   └── tsconfig.json
├── api/                              # Express API backend
│   ├── src/
│   │   ├── models/                  # Mongoose schemas
│   │   ├── routes/                  # API routes
│   │   ├── middleware/              # Custom middleware
│   │   ├── controllers/             # Request handlers
│   │   ├── utils/                   # Utilities
│   │   └── index.ts                 # Entry point
│   ├── tsconfig.json
│   └── package.json
└── docker-compose.yml               # Local dev orchestration
```

## CI/CD Pipeline

Our GitHub Actions pipeline runs on every push and PR:

1. **Lint & Type Check**: Catches code style and TypeScript errors
2. **Build**: Verifies builds complete successfully
3. **Tests**: Runs unit and integration tests
4. **Docker Build**: Creates container images (on main/dev push)

All checks must pass before merge.

## Deployment

### To Staging (dev branch)

Automatic on merge to `dev`:
```bash
git push origin dev
# → CI/CD triggers → Deploys to staging environment
```

### To Production (main branch)

Automatic on merge to `main`:
```bash
git checkout dev
git tag v1.0.0
git push origin v1.0.0
git checkout main
git merge --no-ff dev
git push origin main
# → CI/CD triggers → Deployes to production EKS
```

## Troubleshooting

### Dependencies Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm run install:all
```

### Port Conflicts

- API uses 4000 (change in `.env`)
- React dev uses 5173 (automatic)
- Docker web uses 3000 (change in docker-compose.yml)

### TypeScript Errors

```bash
npm run type-check
# See full type checking output and fix accordingly
```

### Tests Failing

```bash
npm run test -- --reporter=verbose
# Run with detailed output to identify issues
```

## Getting Help

- **Questions?** Ask in team chat or create GitHub discussion
- **Bug found?** Create an issue with reproduction steps
- **Feature idea?** Discuss in PR or issue first

## Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Docker Documentation](https://docs.docker.com)
- [Kubernetes Documentation](https://kubernetes.io/docs)

## Code of Conduct

- Be respectful and constructive
- Assume good intent
- Help each other learn
- Report issues through proper channels

---

Thank you for contributing! 🎉
