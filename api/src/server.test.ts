import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from './app.js'

/**
 * These tests exercise the Express app in isolation via supertest.
 * They intentionally cover only paths that do NOT require a live MongoDB
 * connection (health, validation, auth guards, 404), so they run in CI
 * without a database. Database-backed integration tests live in section 1.6.
 */
describe('API app', () => {
  it('GET /api/health returns a healthy status', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('healthy')
    expect(typeof res.body.timestamp).toBe('string')
  })

  it('GET /api returns service info', async () => {
    const res = await request(app).get('/api')
    expect(res.status).toBe(200)
    expect(res.body.message).toContain('Project Task Tracker')
  })

  it('unknown routes return 404 with an error message', async () => {
    const res = await request(app).get('/api/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body.error).toBeTruthy()
  })

  it('POST /api/auth/register rejects an invalid body with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: '123' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation failed')
    expect(res.body.details).toHaveProperty('name')
    expect(res.body.details).toHaveProperty('password')
  })

  it('protected write routes require authentication (401)', async () => {
    const res = await request(app).post('/api/projects').send({ name: 'Blocked' })
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Authentication required')
  })
})
