import { useState } from 'react'

const roles = [
  ['student', 'Student'],
  ['teacher', 'Teacher'],
  ['institute', 'Institute'],
]

export function AuthPage({ role, setRole, onBack, onContinue }) {
  const [signup, setSignup] = useState(false)

  function submit(event) {
    event.preventDefault()
    onContinue(role)
  }

  return (
    <div className="auth">
      <header>
        <button className="brand" onClick={onBack}><b>C</b> CogniBridge</button>
        <button className="text" onClick={onBack}>← Back to home</button>
      </header>
      <div className="auth-grid">
        <aside>
          <label>{signup ? 'LET’S GET STARTED' : 'WELCOME BACK'}</label>
          <h1>Learning works better when it works for you.</h1>
          <p>One connected place for classrooms, personalised learning and meaningful progress.</p>
        </aside>
        <form onSubmit={submit}>
          <div className="tabs">
            <button type="button" className={!signup ? 'active' : ''} onClick={() => setSignup(false)}>Log in</button>
            <button type="button" className={signup ? 'active' : ''} onClick={() => setSignup(true)}>Create account</button>
          </div>
          <h2>{signup ? 'Create your space' : 'Welcome back'}</h2>
          <p>Choose the workspace that fits you.</p>
          <div className="role-picker">
            {roles.map(([id, name]) => (
              <button type="button" className={role === id ? 'chosen' : ''} onClick={() => setRole(id)} key={id}>{name}</button>
            ))}
          </div>
          {signup && <input required placeholder="Full name" />}
          <input required type="email" placeholder="Email address" />
          <input required type="password" placeholder="Password" />
          <button className="primary wide">{signup ? 'Create' : 'Enter'} {roles.find((item) => item[0] === role)[1]} workspace →</button>
          <small>Demo mode: any details will open the workspace.</small>
        </form>
      </div>
    </div>
  )
}
