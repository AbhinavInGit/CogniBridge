import './App.css'
import { useState } from 'react'
import { LandingPage } from './components/LandingPage'
import { AuthPage } from './components/AuthPage'
import { StudentDashboard, TeacherDashboard, InstituteDashboard } from './components/Dashboards'

function App() {
  const [view, setView] = useState('home')
  const [role, setRole] = useState('student')
  const [notice, setNotice] = useState('')

  function openAuth(selectedRole = 'student') {
    setRole(selectedRole)
    setView('auth')
  }

  const dashboardProps = {
    onHome: () => setView('home'),
    onNotice: setNotice,
  }

  return (
    <main>
      {view === 'home' && <LandingPage onAuth={openAuth} />}
      {view === 'auth' && <AuthPage role={role} setRole={setRole} onBack={() => setView('home')} onContinue={setView} />}
      {view === 'student' && <StudentDashboard {...dashboardProps} />}
      {view === 'teacher' && <TeacherDashboard {...dashboardProps} />}
      {view === 'institute' && <InstituteDashboard {...dashboardProps} />}
      {notice && <div className="toast">{notice}<button onClick={() => setNotice('')}>×</button></div>}
    </main>
  )
}

export default App
