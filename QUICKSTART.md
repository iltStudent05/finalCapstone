# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+
- npm 9+
- (Optional) Docker & Docker Compose

### Option 1: Quick Start with Docker (Recommended)

```bash
# 1. Clone and navigate
cd finalCapstone

# 2. Start everything with one command
docker-compose up --build

# 3. Open in browser
# Landing Page:  http://localhost:3000/
# React App:     http://localhost:3000/app/
# API Health:    http://localhost:3000/api/health
```

Stop with: `docker-compose down`

### Option 2: Native Node.js Development

```bash
# 1. Install dependencies
npm run install:all

# 2. Terminal 1 - Start API
cd api && npm run dev
# → http://localhost:4000

# 3. Terminal 2 - Start React
cd client && npm run dev
# → http://localhost:5173
```

### 3. Verify It Works ✅

- [ ] Landing page loads at http://localhost:3000/
- [ ] Click "Launch the App →" navigates to React app
- [ ] React app shows placeholder pages
- [ ] API responds at /api/health

### 4. Make Changes

**React App**: Edit `client/src/App.tsx` → Auto-reload
**Landing Page**: Edit `client/public/landing.html` → Refresh browser
**API**: Edit `api/src/index.ts` → Auto-restart

### 5. Run Tests

```bash
npm run test              # All tests
npm run test -w client    # React tests only
npm run test -w api       # API tests only
```

## 📁 Project Layout

```
finalCapstone/
├── client/            ← React + Landing Page (Phase 1/2)
│   ├── public/        ← Static assets (landing.html here)
│   └── src/           ← React components
├── api/               ← Express Backend (Phase 3)
│   └── src/           ← API routes and models
├── .github/           ← CI/CD Pipeline
└── docker-compose.yml ← Local dev orchestration
```

## 🔗 Important Links

- **Landing Page**: `client/public/landing.html` (pure HTML/CSS)
- **React App**: `client/src/App.tsx` (placeholder pages)
- **API Server**: `api/src/index.ts` (Express entry point)
- **Nginx Config**: `client/nginx.conf` (routing configuration)

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview & tech stack |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development workflow & branching |
| [PHASE_1_CHECKLIST.md](PHASE_1_CHECKLIST.md) | Phase 1 completion status |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Docker, Kubernetes, AWS EKS |
| [TESTING.md](TESTING.md) | Testing strategy & examples |
| [LANDING_PAGE_TEST_REPORT.md](LANDING_PAGE_TEST_REPORT.md) | Responsive design verification |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml or api/.env
# OR kill process
lsof -ti :3000 | xargs kill -9
```

### Modules Not Found
```bash
rm -rf node_modules package-lock.json
npm run install:all
```

### Docker Not Working
Make sure Docker daemon is running:
```bash
docker ps  # Should show running containers
```

### Tests Failing
```bash
npm run test -- --reporter=verbose
# See detailed test output
```

## ✅ What's Done

- [x] Semantic HTML5 landing page with pure CSS3
- [x] Responsive design (mobile + desktop)
- [x] React app scaffold with React Router
- [x] Express API scaffold with health check
- [x] Docker Compose for local development
- [x] Nginx routing (/, /app/, /api/)
- [x] GitHub Actions CI/CD pipeline
- [x] TypeScript strict mode throughout
- [x] Testing frameworks configured
- [x] Comprehensive documentation

## 🚦 Next Steps (Phase 2)

1. Implement dashboard pages
2. Add login/register forms
3. Build React components
4. Add component tests
5. Implement state management

## 📞 Need Help?

See [CONTRIBUTING.md](CONTRIBUTING.md#troubleshooting) for detailed troubleshooting.

---

**Happy coding!** 🎉
