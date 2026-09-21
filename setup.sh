#!/bin/bash

# Project Task Tracker - Setup Script
# Automated project initialization and dependency installation

set -e

echo "🚀 Project Task Tracker - Setup Script"
echo "========================================"
echo ""

# Check Node.js version
echo "✓ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "  Found: $NODE_VERSION"

# Check npm version
echo ""
echo "✓ Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "  Found: npm $NPM_VERSION"

# Check Git
echo ""
echo "✓ Checking Git installation..."
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed."
    exit 1
fi

GIT_VERSION=$(git --version)
echo "  Found: $GIT_VERSION"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo ""
    echo "✓ Docker found: $DOCKER_VERSION"
else
    echo ""
    echo "⚠️  Docker not found. Docker Compose setup will not work."
    echo "   Install Docker from https://docker.com"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
echo ""

if [ -f "package-lock.json" ]; then
    echo "  Detected package-lock.json - using npm ci for reproducible install"
    npm ci
else
    echo "  Installing with npm install"
    npm install
fi

echo ""
echo "✓ Installing client dependencies..."
npm install -w client

echo ""
echo "✓ Installing API dependencies..."
npm install -w api

# Setup environment files
echo ""
echo "📝 Setting up environment files..."

if [ ! -f "api/.env" ]; then
    echo "  Creating api/.env from template..."
    cp api/.env.example api/.env
    echo "  ✓ Created api/.env"
    echo "  ⚠️  Remember to update JWT_SECRET and MONGODB_URI"
fi

# Initialize git hooks (optional)
echo ""
echo "🪝 Setting up Git hooks..."
if [ -d ".git" ]; then
    # Create pre-commit hook for linting
    mkdir -p .git/hooks
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."
npm run type-check || exit 1
npm run lint || exit 1
EOF
    chmod +x .git/hooks/pre-commit
    echo "  ✓ Pre-commit hook installed"
else
    echo "  ⚠️  Not a git repository - skipping hooks"
fi

# Summary
echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo ""
echo "1. Review and update environment variables:"
echo "   - api/.env (JWT_SECRET, MONGODB_URI)"
echo ""
echo "2. Start development:"
echo ""
echo "   Option A - Docker Compose (recommended):"
echo "   $ docker-compose up --build"
echo ""
echo "   Option B - Native development:"
echo "   $ npm run dev"
echo ""
echo "3. Open in browser:"
echo "   - http://localhost:3000 (Docker Compose)"
echo "   - http://localhost:5173 (React dev server)"
echo ""
echo "4. Read documentation:"
echo "   - README.md - Project overview"
echo "   - CONTRIBUTING.md - Development workflow"
echo "   - DEPLOYMENT.md - Production deployment"
echo "   - TESTING.md - Testing guide"
echo ""
echo "Happy coding! 🎉"
