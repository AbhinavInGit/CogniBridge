import './App.css'
import { useState } from 'react'
import { LandingPage } from './components/LandingPage'
import { AuthPage } from './components/AuthPage'
import { StudentDashboard, TeacherDashboard, InstituteDashboard } from './components/Dashboards'

function App() { const [view,setView]=useState('home'); const [role,setRole]=useState('student'); const [notice,setNotice]=useState(''); const auth=(r='student')=>{setRole(r);setView('auth')}; const props={onHome:()=>setView('home'),onNotice:setNotice}; return <main>{view==='home'&&<LandingPage onAuth={auth}/>} {view==='auth'&&<AuthPage role={role} setRole={setRole} onBack={()=>setView('home')} onContinue={setView}/>} {view==='student'&&<StudentDashboard {...props}/>} {view==='teacher'&&<TeacherDashboard {...props}/>} {view==='institute'&&<InstituteDashboard {...props}/>} {notice&&<div className="toast">{notice}<button onClick={()=>setNotice('')}>×</button></div>}</main> }

export default App
