const statusConfig = {
  solved: { label: 'Solved clean', className: 'status-solved', icon: '✓' },
  solved_with_hint: { label: 'Solved with hint', className: 'status-hint', icon: '💡' },
  failed: { label: 'Struggled', className: 'status-failed', icon: '✕' },
  viewed_solution: { label: 'Viewed solution', className: 'status-solution', icon: '👁' },
}

function formatRelativeTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function RecentAttempts({ attempts, loading, error, onProblemClick }) {
  if (loading) {
    return (
      <div className="state-box">
        <div className="spinner small" />
        <p>Loading recent attempts…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-box error-box">
        <p>We could not load your attempts history right now. Please try again later.</p>
      </div>
    )
  }

  if (!attempts || !attempts.length) {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon">📋</div>
        <h4>No attempts recorded yet</h4>
        <p>Practice problems to build your personal history and unlock accurate recommendations.</p>
      </div>
    )
  }

  return (
    <div className="attempt-list" role="list">
      {attempts.map((attempt) => {
        const problem = attempt.problemId
        const status = statusConfig[attempt.status] || { label: attempt.status, className: '', icon: '•' }
        const difficulty = problem?.difficulty || 'Medium'
        const difficultyClass = difficulty.toLowerCase()

        return (
          <button
            className="attempt-row"
            key={attempt._id}
            onClick={() => onProblemClick(problem?._id)}
            title="Open problem details"
          >
            <div className="attempt-main">
              <div className="attempt-title-row">
                <strong>{problem?.title || 'Unknown Problem'}</strong>
                <span className={`difficulty-badge diff-${difficultyClass}`}>{difficulty}</span>
              </div>
              <div className="attempt-meta">
                <span className={`attempt-status-pill ${status.className}`}>
                  <span className="status-icon">{status.icon}</span>
                  <span>{status.label}</span>
                </span>
                {attempt.timeTaken ? (
                  <span className="attempt-time-tag">⏱ {attempt.timeTaken} min</span>
                ) : null}
                {attempt.hintsUsed ? (
                  <span className="attempt-hints-tag">💡 {attempt.hintsUsed} hint{attempt.hintsUsed > 1 ? 's' : ''}</span>
                ) : null}
                <span className="attempt-date-tag">{formatRelativeTime(attempt.createdAt)}</span>
              </div>
            </div>

            <div className="attempt-arrow" aria-hidden="true">
              →
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default RecentAttempts
