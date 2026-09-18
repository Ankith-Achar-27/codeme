import { useEffect, useState } from 'react'
import RecentAttempts from '../components/RecentAttempts.jsx'
import { api } from '../services/api.js'

function DashboardPage({ user, onLibrary, onProblemClick }) {
  const [attemptData, setAttemptData] = useState({ data: [], summary: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    api.getAttempts(user._id, { limit: 5 })
      .then((result) => active && setAttemptData(result))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [user._id])

  const summary = attemptData.summary
  return (
    <section className="page">
      <div className="hero-card">
        <p className="eyebrow">Welcome back, {user.name}</p>
        <h2>Build a stronger DSA habit.</h2>
        <p>Explore the library, record your results, and let your history shape what comes next.</p>
        <button className="button primary" onClick={onLibrary}>Browse problem library</button>
      </div>
      <div className="stats-grid">
        <article><strong>{summary?.totalAttempts ?? '—'}</strong><span>Total attempts</span></article>
        <article><strong>{summary ? summary.solved + summary.solved_with_hint : '—'}</strong><span>Solved</span></article>
        <article><strong>{summary?.failed ?? '—'}</strong><span>To revisit</span></article>
      </div>
      <section className="section-heading"><div><p className="eyebrow">Practice history</p><h2>Recent attempts</h2></div></section>
      <RecentAttempts attempts={attemptData.data} loading={loading} error={error} onProblemClick={onProblemClick} />
    </section>
  )
}

export default DashboardPage
