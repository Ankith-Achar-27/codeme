const labels = {
  solved: 'Solved independently',
  solved_with_hint: 'Solved with hint',
  failed: 'Failed',
  viewed_solution: 'Viewed solution',
}

function RecentAttempts({ attempts, loading, error, onProblemClick }) {
  if (loading) return <p className="state">Loading attempts…</p>
  if (error) return <p className="state error">We could not load your attempts. Please try again later.</p>
  if (!attempts.length) return <p className="state">No attempts yet. Pick a problem to begin your practice.</p>

  return (
    <div className="attempt-list">
      {attempts.map((attempt) => (
        <button className="attempt-row" key={attempt._id} onClick={() => onProblemClick(attempt.problemId?._id)}>
          <span>
            <strong>{attempt.problemId?.title || 'Problem unavailable'}</strong>
            <small>{labels[attempt.status]} · {new Date(attempt.createdAt).toLocaleString()}</small>
          </span>
          <span className={`difficulty ${attempt.problemId?.difficulty?.toLowerCase()}`}>{attempt.problemId?.difficulty}</span>
        </button>
      ))}
    </div>
  )
}

export default RecentAttempts
