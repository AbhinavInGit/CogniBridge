import { useEffect, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { quizQuestions, students } from './mockData'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

function Layout({ title, user, onLogout, children }) {
  return <div className="demo-layout"><aside><b>CogniBridge</b><span>{user.role.toUpperCase()} WORKSPACE</span><button className="nav-current">Overview</button><button>Progress</button><button>Roadmap</button><button onClick={onLogout}>Log out</button></aside><section><header><div><p>Welcome back, {user.name}</p><h1>{title}</h1></div><span className="demo-badge">Demo mode</span></header>{children}</section></div>
}

export function InstituteDashboard({ user, onLogout }) {
  const chart = { labels: ['Standard', 'Pacing support', 'Simplified content'], datasets: [{ label: 'Students', data: [72, 18, 10], backgroundColor: ['#5a9890', '#8aabd0', '#d6ad6d'] }] }
  return <Layout title="Institute overview" user={user} onLogout={onLogout}><div className="metric-row"><Metric value="42" label="Teachers" /><Metric value="1,248" label="Students" /><Metric value="91%" label="Attendance" /></div><section className="card chart-card"><h2>Learning-profile distribution</h2><Bar data={chart} options={{ responsive: true, plugins: { legend: { display: false } } }} /></section><Roadmap /></Layout>
}

export function TeacherDashboard({ user, onLogout }) {
  return <Layout title="Teacher dashboard" user={user} onLogout={onLogout}><section className="card"><div className="card-heading"><div><h2>Students</h2><p>Recent Biology 101 quiz results</p></div><button disabled className="planned">Host Live Class · Planned</button></div><div className="table-wrap"><table><thead><tr><th>Student</th><th>Learning profile</th><th>Recent quiz</th></tr></thead><tbody>{students.map((student) => <tr key={student.name}><td>{student.name}</td><td><span className={`profile ${student.profile === 'ND-Support' ? 'support' : ''}`}>{student.profile}</span></td><td>{student.quiz}%</td></tr>)}</tbody></table></div></section><Roadmap /></Layout>
}

export function ParentDashboard({ user, onLogout }) {
  return <Layout title="Parent overview" user={user} onLogout={onLogout}><div className="notice">Read-only view. This page does not change student records.</div><div className="metric-row"><Metric value="92%" label="Attendance" /><Metric value="B+" label="Current grade" /><Metric value="ND-Support" label="Learning profile" /></div><section className="card"><h2>Grade history</h2><p>Biology 101 — B+ &nbsp; | &nbsp; Mathematics — A- &nbsp; | &nbsp; English — B</p></section><Roadmap /></Layout>
}

export function StudentDashboard({ user, onLogout }) {
  const [answers, setAnswers] = useState([])
  const [startedAt, setStartedAt] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const aiUrl = import.meta.env.VITE_AI_URL || 'http://127.0.0.1:8000'
  const score = answers.filter((answer, index) => answer === quizQuestions[index].answer).length
  const complete = answers.length === quizQuestions.length
  const progress = { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], datasets: [{ label: 'Quiz progress', data: [54, 63, 67, 74], borderColor: '#397b76', backgroundColor: '#397b76' }] }

  async function submitQuiz() {
    const seconds = Math.max(1, (Date.now() - startedAt) / 1000)
    const payload = { avg_score: (score / quizQuestions.length) * 100, score_trend: 8, avg_time_per_question: seconds / quizQuestions.length, retry_count: 0, score_variance: 10, completion_rate: 100 }
    try {
      const response = await fetch(`${aiUrl}/classify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error('Classification failed')
      const classification = await response.json()
      let adaptation = null
      if (classification.mode === 'nd') {
        const adaptResponse = await fetch(`${aiUrl}/adapt`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: 'An ecosystem is made of living and non-living things. Producers make food using sunlight. Consumers eat plants or animals. Decomposers break down dead material and return nutrients to the soil.', mode: 'nd' }) })
        adaptation = adaptResponse.ok ? await adaptResponse.json() : null
      }
      setResult({ ...classification, adaptation })
      setError('')
    } catch {
      setError('AI service is unavailable. Showing the standard lesson instead.')
      setResult({ profile: 'standard', confidence: null, mode: 'standard' })
    }
  }

  return <Layout title="My learning" user={user} onLogout={onLogout}><div className="student-grid"><section className="card"><h2>Quick quiz: ecosystems</h2>{!startedAt && <button className="primary-action" onClick={() => setStartedAt(Date.now())}>Start 5-question quiz</button>}{startedAt && quizQuestions.map((item, index) => <fieldset key={item.question}><legend>{index + 1}. {item.question}</legend>{item.choices.map((choice, choiceIndex) => <label key={choice}><input type="radio" name={`q${index}`} checked={answers[index] === choiceIndex} onChange={() => { const next = [...answers]; next[index] = choiceIndex; setAnswers(next) }} /> {choice}</label>)}</fieldset>)}{complete && !result && <button className="primary-action" onClick={submitQuiz}>Get my learning profile</button>}{result && <ProfileResult result={result} />}{error && <p className="error">{error}</p>}</section><section className="card"><h2>Progress</h2><Line data={progress} options={{ plugins: { legend: { display: false } } }} /></section></div><Lesson result={result} /><Roadmap /></Layout>
}

function ProfileResult({ result }) { return <div className="profile-result"><b>Learning profile: {result.profile.replaceAll('_', ' ')}</b>{result.confidence && <span>Confidence: {Math.round(result.confidence * 100)}%</span>}<span>Mode: {result.mode === 'nd' ? 'Adapted support' : 'Standard lesson'}</span></div> }
function Lesson({ result }) { const adapted = result?.mode === 'nd' && result.adaptation; return <section className={`card lesson ${adapted ? 'adapted' : ''}`}><h2>{adapted ? 'Your 3–5 minute micro-lesson' : 'Ecosystems lesson'}</h2>{adapted ? <><ul>{adapted.summary.map((item) => <li key={item}>{item}</li>)}</ul><p><b>Key terms:</b> {adapted.key_terms.join(', ')}</p></> : <p>Explore how producers, consumers and decomposers work together. Complete the quiz to receive an adapted lesson when it is useful.</p>}</section> }
function Metric({ value, label }) { return <div className="metric"><strong>{value}</strong><span>{label}</span></div> }
function Roadmap() { return <section className="card roadmap"><h2>Planned features</h2><ul><li>WebRTC live classes <span>Planned</span></li><li>Collaborative learning rooms <span>Planned</span></li><li>Plagiarism detection <span>Planned</span></li><li>Whisper lecture transcription <span>Planned</span></li></ul></section> }
