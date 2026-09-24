import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import './DashboardPage.css'

interface DashboardStats {
  totals: {
    users: number
    projects: number
    tasks: number
    comments: number
  }
  tasksByStatus: Record<string, number>
  tasksByPriority: Record<string, number>
  projectsByStatus: Record<string, number>
  recent: {
    tasks: Array<{
      _id: string
      title: string
      status: string
      priority: string
      project: { name: string }
    }>
    projects: Array<{
      _id: string
      name: string
      owner: { name: string }
    }>
  }
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/dashboard')
        setStats(response.data)
      } catch (err) {
        setError('Failed to load dashboard stats')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>
  if (error) return <div className="container error-message">{error}</div>
  if (!stats) return <div className="container"><p>No data available</p></div>

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totals.users}</div>
              <div className="stat-label">Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totals.projects}</div>
              <div className="stat-label">Projects</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totals.tasks}</div>
              <div className="stat-label">Tasks</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totals.comments}</div>
              <div className="stat-label">Comments</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>Tasks by Status</h3>
            <div className="status-breakdown">
              {Object.entries(stats.tasksByStatus).map(([status, count]) => (
                <div key={status} className="status-item">
                  <span className={`status-badge status-${status}`}>{status}</span>
                  <span className="status-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>Tasks by Priority</h3>
            <div className="priority-breakdown">
              {Object.entries(stats.tasksByPriority).map(([priority, count]) => (
                <div key={priority} className="priority-item">
                  <span className={`priority-badge priority-${priority}`}>{priority}</span>
                  <span className="priority-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>Projects by Status</h3>
            <div className="status-breakdown">
              {Object.entries(stats.projectsByStatus).map(([status, count]) => (
                <div key={status} className="status-item">
                  <span className={`status-badge status-${status}`}>{status}</span>
                  <span className="status-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-section">
          <div className="recent-card">
            <h3>Recent Tasks</h3>
            {stats.recent.tasks.length > 0 ? (
              <div className="recent-list">
                {stats.recent.tasks.map((task) => (
                  <div key={task._id} className="recent-item">
                    <div className="recent-title">{task.title}</div>
                    <div className="recent-meta">
                      <span className="project-name">{task.project.name}</span>
                      <span className={`status-badge status-${task.status}`}>{task.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent tasks</p>
            )}
          </div>

          <div className="recent-card">
            <h3>Recent Projects</h3>
            {stats.recent.projects.length > 0 ? (
              <div className="recent-list">
                {stats.recent.projects.map((project) => (
                  <div key={project._id} className="recent-item">
                    <div className="recent-title">{project.name}</div>
                    <div className="recent-meta">
                      <span className="owner-name">by {project.owner.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent projects</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
