# Testing Guide

Comprehensive testing guide for the Project Task Tracker.

## Testing Stack

- **Framework**: Vitest (Vite-native testing)
- **React Testing**: Testing Library + Happy DOM
- **API Testing**: Vitest + axios
- **Coverage**: istanbul (built into Vitest)

## Unit Testing

### Write Tests

Create `.test.ts` or `.test.tsx` files alongside source:

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx      ← Test file
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts
├── services/
│   ├── api.ts
│   └── api.test.ts
```

### Example: React Component Test

```typescript
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### Example: API Service Test

```typescript
// api/src/services/user.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import UserService from './user.service'

describe('UserService', () => {
  let service: UserService

  beforeEach(() => {
    service = new UserService()
  })

  it('should fetch user by ID', async () => {
    const mockUser = { id: '1', name: 'John', email: 'john@example.com' }
    vi.spyOn(service, 'getUserById').mockResolvedValue(mockUser)

    const user = await service.getUserById('1')
    expect(user).toEqual(mockUser)
  })
})
```

## Running Tests

### Client Tests

```bash
# Run all tests
npm run test -w client

# Run in watch mode (auto-rerun on changes)
npm run test -w client -- --watch

# Run specific test file
npm run test -w client -- Button.test

# Generate coverage report
npm run test -w client -- --coverage
```

### API Tests

```bash
# Run all tests
npm run test -w api

# Run with verbose output
npm run test -w api -- --reporter=verbose

# Run with coverage
npm run test -w api -- --coverage
```

### All Tests

```bash
npm run test
```

## Coverage Goals

- **Statements**: ≥ 80%
- **Branches**: ≥ 75%
- **Functions**: ≥ 80%
- **Lines**: ≥ 80%

### View Coverage

```bash
npm run test -- --coverage

# Output: coverage/
#   ├── index.html     ← Interactive report
#   ├── lcov.info
#   └── ...
```

Open `coverage/index.html` in browser for detailed coverage visualization.

## Integration Testing

### API Integration Tests

Test full request/response cycle:

```typescript
// api/src/routes/users.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('User Routes', () => {
  it('POST /api/users creates a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'john@example.com', password: 'secure123' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('John')
  })

  it('GET /api/users retrieves all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
```

## TDD Workflow

Test-Driven Development approach:

1. **Red** — Write failing test
   ```bash
   npm run test
   # ✗ Component renders
   ```

2. **Green** — Implement to pass test
   ```typescript
   export function Component() {
     return <div>Hello</div>
   }
   ```
   ```bash
   npm run test
   # ✓ Component renders
   ```

3. **Refactor** — Improve without breaking tests
   ```bash
   npm run test -- --watch
   # Makes changes safely
   ```

## Mocking & Stubbing

### Mock Functions

```typescript
import { vi } from 'vitest'

const mockFn = vi.fn()
mockFn.mockReturnValue(42)
mockFn.mockResolvedValue({ data: 'test' })
mockFn.mockRejectedValue(new Error('fail'))

// Assertions
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith(arg1, arg2)
expect(mockFn).toHaveBeenCalledTimes(3)
```

### Mock Modules

```typescript
vi.mock('@/services/api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test' })
}))
```

## Debugging Tests

### Run Single Test

```bash
npm run test -- --reporter=verbose Button.test.tsx
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test", "--", "--inspect-brk"],
  "console": "integratedTerminal"
}
```

Then press F5 to start debugging.

## CI/CD Integration

Tests run automatically on:
- Push to any branch
- Pull requests to `dev` or `main`
- Before build artifacts are created

Check `.github/workflows/ci.yml` for details.

### Test Failure Handling

- GitHub displays test failures on PR
- Pipeline blocks merge until tests pass
- Developers must fix and push again

## Best Practices

### ✅ Do

- Write tests alongside features
- Test user behavior, not implementation
- Use meaningful test descriptions
- Mock external dependencies
- Keep tests isolated and independent
- Aim for high coverage on critical paths

```typescript
// Good test
it('should disable submit button when form has errors', () => {
  render(<LoginForm />)
  // User perspective
  expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
})
```

### ❌ Don't

- Test implementation details
- Skip testing error cases
- Use `await` without `async`
- Create interdependent tests
- Mock everything (use real instances when possible)

```typescript
// Avoid
it('should set state', () => {
  // Testing internal implementation
  expect(component.state.value).toBe(true)
})
```

## Snapshot Testing

Use sparingly for UI changes:

```typescript
it('renders correctly', () => {
  const { container } = render(<Component />)
  expect(container).toMatchSnapshot()
})
```

Update snapshots when changes are intentional:

```bash
npm run test -- --update
```

## Performance Testing

Monitor test speed:

```bash
npm run test -- --reporter=verbose --reporter=html
# Outputs: analysis of slow tests
```

Keep tests under 100ms average.

## Accessibility Testing

```typescript
it('button is keyboard accessible', () => {
  render(<Button>Click me</Button>)
  const btn = screen.getByRole('button')
  
  // Button inherently has role, support keyboard
  expect(btn).toHaveProperty('type', 'button')
})
```

Use [jest-axe](https://github.com/nickcolley/jest-axe) for a11y audits:

```typescript
import { axe } from 'jest-axe'

it('has no accessibility violations', async () => {
  const { container } = render(<Component />)
  expect(await axe(container)).toHaveNoViolations()
})
```

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Library Best Practices](https://testing-library.com/docs)
- [Testing JavaScript](https://testingjavascript.com/)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

For more examples, see the feature branch test files.
