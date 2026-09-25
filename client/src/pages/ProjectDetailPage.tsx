import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiClient from '../api/client'
import './ListPages.css'

interface Member {
  _id: string
  name: string
  email: string
  role: string
}

interface Project {
  _id: string
  name: string
  description?: string
  status: string
  owner: Member
  members?: Member[]
  createdAt?: string
}

interface Task {
  _id: string
  title: string
  status: string
  priority: string
  assignee?: { name: string }
  dueDate?: string
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) fetchData(id)
  }, [id])

  const fetchData = async (projectId: string) => {
    setLoading(true)
    setError('')
    try {
      const [projectRes, tasksRes] = await Promise.all([
        apiClient.get(`/projects/${projectId}`),
        apiClient.get(`/tasks?project=${projectId}`),
      ])
      setProject(projectRes.data)
      setTasks(tasksRes.data)
    } catch (err) {
      setError('Failed to load project')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container"><p>Loading project...</p></div>

  if (error || !project) {
    return (
      <div className="list-page">
        <div className="container">
          <div className="error-message">{error || 'Project not found'}</div>
          <Link to="/projects" className="btn-primary">&larr; Back to Projects</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="list-page">
      <div className="container">
        <div className="detail-back">
          <Link to="/projects" className="back-link">&larr; Back to Projects</Link>
        </div>

        <div className="page-header">
          <h1>{project.name}</h1>
          <span className={`status-badge status-${project.status}`}>{project.status}</span>
        </div>

        <div className="form-card">
          <p className="card-description">{project.description || 'No description provided.'}</p>
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Owner</dt>
              <dd>{project.owner?.name} ({project.owner?.email})</dd>
            </div>
            <div className="detail-row">
              <dt>Members</dt>
              <dd>
                {project.members && project.members.length > 0
                  ? project.members.map((m) => m.name).join(', ')
                  : 'No additional members'}
              </dd>
            </div>
            {project.createdAt && (
              <div className="detail-row">
                <dt>Created</dt>
                <dd>{new Date(project.createdAt).toLocaleDateString()}</dd>
              </div>
            )}
          </dl>
        </div>

        <h2 className="detail-subheading">Tasks ({tasks.length})</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task._id}>
                    <td className="task-title">{task.title}</td>
                    <td>
                      <span className={`status-badge status-${task.status}`}>{task.status}</span>
                    </td>
                    <td>
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>{task.assignee?.name || '—'}</td>
                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="empty-cell">No tasks for this project yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
