import { useState } from 'react'
import './App.css'
import { demoUsers } from './demo/mockData'
import { InstituteDashboard, ParentDashboard, StudentDashboard, TeacherDashboard } from './demo/RoleDashboards'

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('cognibridge-demo-user') || 'null'))
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('student@cognibridge.demo')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')

  function login(event) {
    event.preventDefault()
    const found = demoUsers.find((candidate) => candidate.role === role && candidate.email === email && candidate.password === password)
    if (!found) return setError('Use the demo email and password shown below.')
    localStorage.setItem('cognibridge-demo-user', JSON.stringify(found))
    setUser(found)
    setError('')
  }

  function logout() { localStorage.removeItem('cognibridge-demo-user'); setUser(null) }

  if (!user) return <Login {...{ role, setRole, email, setEmail, password, setPassword, error, onLogin: login }} />
  const Dashboard = { institute: InstituteDashboard, teacher: TeacherDashboard, student: StudentDashboard, parent: ParentDashboard }[user.role]
  return <Dashboard user={user} onLogout={logout} />
}

function Login({ role, setRole, email, setEmail, password, setPassword, error, onLogin }) {
  const selected = demoUsers.find((user) => user.role === role)
  function chooseRole(nextRole) { setRole(nextRole); setEmail(demoUsers.find((user) => user.role === nextRole).email); setPassword('demo123') }
  return <main className="login-page"><section className="login-card"><h1>CogniBridge</h1><p>Inclusive learning demo</p><h2>Sign in to a demo workspace</h2><div className="role-tabs">{demoUsers.map((user) => <button key={user.role} className={role === user.role ? 'selected' : ''} onClick={() => chooseRole(user.role)}>{user.role}</button>)}</div><form onSubmit={onLogin}><label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className="primary-action">Enter {role} workspace</button></form>{error && <p className="error">{error}</p>}<small>Demo credentials: {selected.email} / demo123</small></section></main>
}

export default App
