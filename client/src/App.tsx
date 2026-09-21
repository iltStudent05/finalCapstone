import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Placeholder pages - will be implemented in Phase 2
function DashboardPage() {
  return <div className="app-container"><h1>Dashboard (Coming Soon)</h1></div>
}

function LoginPage() {
  return <div className="app-container"><h1>Login (Coming Soon)</h1></div>
}

function RegisterPage() {
  return <div className="app-container"><h1>Register (Coming Soon)</h1></div>
}

function App() {
  return (
    <BrowserRouter basename="/app">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
