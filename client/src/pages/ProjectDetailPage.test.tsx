import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProjectDetailPage } from './ProjectDetailPage'

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

function renderAt(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/projects/${id}`]}>
      <Routes>
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProjectDetailPage', () => {
  it('renders the project details and its tasks', async () => {
    getMock
      .mockResolvedValueOnce({
        data: {
          _id: 'p1',
          name: 'Apollo',
          description: 'Launch project',
          status: 'active',
          owner: { _id: 'u1', name: 'Ada Admin', email: 'admin@example.com', role: 'admin' },
          members: [{ _id: 'u2', name: 'Cody Contributor', email: 'c@example.com', role: 'contributor' }],
        },
      })
      .mockResolvedValueOnce({
        data: [
          { _id: 't1', title: 'Design spec', status: 'todo', priority: 'high' },
        ],
      })

    renderAt('p1')

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Apollo' })).toBeInTheDocument()
    })

    expect(screen.getByText('Launch project')).toBeInTheDocument()
    expect(screen.getByText(/Ada Admin/)).toBeInTheDocument()
    expect(screen.getByText('Design spec')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Tasks \(1\)/ })).toBeInTheDocument()
  })

  it('shows an error message when the project fails to load', async () => {
    getMock.mockRejectedValue(new Error('boom'))

    renderAt('missing')

    await waitFor(() => {
      expect(screen.getByText(/Failed to load project/)).toBeInTheDocument()
    })
  })
})
