import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { DashboardPage } from './DashboardPage'

const { getMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
}))

vi.mock('../api/client', () => ({
  default: {
    get: getMock,
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}))

describe('DashboardPage', () => {
  it('renders expected content', async () => {
    getMock.mockResolvedValueOnce({
      data: {
        totals: { users: 2, projects: 3, tasks: 4, comments: 5 },
        tasksByStatus: { todo: 1, 'in-progress': 1, review: 1, done: 1 },
        tasksByPriority: { low: 1, medium: 1, high: 1, urgent: 1 },
        projectsByStatus: { planning: 1, active: 2 },
        recent: { tasks: [], projects: [] },
      },
    })

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    })

    expect(screen.getByText('2', { selector: '.stat-value' })).toBeInTheDocument()
    expect(screen.getByText('3', { selector: '.stat-value' })).toBeInTheDocument()
    expect(screen.getByText('4', { selector: '.stat-value' })).toBeInTheDocument()
    expect(screen.getByText('5', { selector: '.stat-value' })).toBeInTheDocument()
  })
})
