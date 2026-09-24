import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../api/client'
import './ListPages.css'

interface Project {
  _id: string
  name: string
  description?: string
  status: string
  owner: { name: string }
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/projects')
      setProjects(response.data)
    } catch (err) {
      setError('Failed to load projects')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.post('/projects', formData)
      setFormData({ name: '', description: '' })
      setShowForm(false)
      fetchProjects()
    } catch (err) {
      setError('Failed to create project')
      console.error(err)
    }
  }

  if (loading) return <div className="container"><p>Loading projects...</p></div>

  return (
    <div className="list-page">
      <div className="container">
        <div className="page-header">
          <h1>Projects</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="form-card">
            <h3>Create New Project</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Project Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Project name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Project description"
                  rows={3}
                />
              </div>
              <button type="submit" className="btn-primary">Create Project</button>
            </form>
          </div>
        )}

        <div className="list-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`} className="card-link">
                <div className="card">
                  <div className="card-header">
                    <h3>{project.name}</h3>
                    <span className={`status-badge status-${project.status}`}>{project.status}</span>
                  </div>
                  <p className="card-description">{project.description || 'No description'}</p>
                  <div className="card-footer">
                    <small>Owner: {project.owner.name}</small>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="empty-state">No projects yet. Create one to get started!</p>
          )}
        </div>
      </div>
    </div>
  )
}
