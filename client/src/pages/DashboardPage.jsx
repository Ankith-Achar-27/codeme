import { useEffect, useState } from 'react'
import RecentAttempts from '../components/RecentAttempts.jsx'
import { api } from '../services/api.js'

function DashboardPage({ user, onLibrary, onProblemClick, onRecommendation }) {
  const [attemptData, setAttemptData] = useState({ data: [], summary: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    api.getAttempts(user._id, { limit: 6 })
      .then((result) => active && setAttemptData(result))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [user._id])

  const summary = attemptData.summary
  const totalSolved = summary ? (summary.solved || 0) + (summary.solved_with_hint || 0) : 0
  const totalAttempts = summary?.totalAttempts ?? 0
  const needsRevisit = summary ? (summary.failed || 0) + (summary.viewed_solution || 0) : 0
  const accuracyRate = totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0

  return (
    <section className="page dashboard-page">
      {/* Hero Card */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">Personalized DSA Practice</div>
          <h2>Welcome back, {user.name}</h2>
          <p>
            Build genuine problem-solving intuition. Solve problems, record attempts, and let CodeMe guide your next focus area.
          </p>
          <div className="hero-actions">
            <button className="button primary" onClick={onRecommendation}>
              Get Next Recommendation →
            </button>
            <button className="button secondary-light" onClick={onLibrary}>
              Browse Problem Library
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Attempts</span>
            <span className="stat-icon-wrap icon-blue">📝</span>
          </div>
          <strong className="stat-value">{summary ? totalAttempts : '—'}</strong>
          <span className="stat-subtext">Problems tackled across all sessions</span>
        </article>

        <article className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Problems Solved</span>
            <span className="stat-icon-wrap icon-green">🎯</span>
          </div>
          <strong className="stat-value">{summary ? totalSolved : '—'}</strong>
          <span className="stat-subtext">
            {summary ? `${summary.solved} independent · ${summary.solved_with_hint} with hints` : 'Completed challenges'}
          </span>
        </article>

        <article className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Needs Revisit</span>
            <span className="stat-icon-wrap icon-amber">🔁</span>
          </div>
          <strong className="stat-value">{summary ? needsRevisit : '—'}</strong>
          <span className="stat-subtext">Struggles & solutions to reinforce</span>
        </article>

        <article className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Solve Accuracy</span>
            <span className="stat-icon-wrap icon-purple">⚡</span>
          </div>
          <strong className="stat-value">{summary ? `${accuracyRate}%` : '—'}</strong>
          <span className="stat-subtext">Success rate over attempt history</span>
        </article>
      </div>

      {/* Recommended Next Problem Feature Spotlight */}
      <section className="recommended-spotlight">
        <div className="spotlight-content">
          <div className="spotlight-badge">Next Best Practice</div>
          <h3>Not sure what to solve next?</h3>
          <p>
            CodeMe’s deterministic recommendation engine analyzes your topic weaknesses, recent struggles, and practice recency to pinpoint your optimal next challenge.
          </p>
        </div>
        <div className="spotlight-action">
          <button className="button primary" onClick={onRecommendation}>
            See Recommended Next →
          </button>
        </div>
      </section>

      {/* Recent Practice History */}
      <section className="recent-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Practice Log</p>
            <h2>Recent Attempts</h2>
          </div>
          {attemptData.data.length > 0 && (
            <button className="button text small-text" onClick={onLibrary}>
              View All Problems →
            </button>
          )}
        </div>

        <RecentAttempts
          attempts={attemptData.data}
          loading={loading}
          error={error}
          onProblemClick={onProblemClick}
        />
      </section>
    </section>
  )
}

export default DashboardPage
