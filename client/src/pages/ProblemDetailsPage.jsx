import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const results = [
  ['solved', 'Solved independently'],
  ['solved_with_hint', 'Solved with hint'],
  ['failed', 'Failed'],
  ['viewed_solution', 'Viewed solution'],
]

const hintLevelDescriptions = {
  1: 'Level 1: Conceptual Direction',
  2: 'Level 2: Strategy Guidance',
  3: 'Level 3: Implementation Guidance',
}

function ProblemDetailsPage({ problemId, user, onBack }) {
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [visibleHints, setVisibleHints] = useState(0)
  const [status, setStatus] = useState('solved')
  const [timeTaken, setTimeTaken] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState('')

  // AI Learning Assistant state
  const [aiHints, setAiHints] = useState([])
  const [aiHintLoading, setAiHintLoading] = useState(false)
  const [aiHintError, setAiHintError] = useState(null)
  const [aiExplanation, setAiExplanation] = useState(null)
  const [aiExplanationLoading, setAiExplanationLoading] = useState(false)
  const [aiExplanationError, setAiExplanationError] = useState(null)
  const [hasAttempted, setHasAttempted] = useState(false)

  useEffect(() => {
    let active = true
    api.getProblem(problemId)
      .then((result) => active && setProblem(result.data))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [problemId])

  const nextHintLevel = aiHints.length + 1

  async function requestAiHint() {
    if (nextHintLevel > 3 || aiHintLoading) return
    setAiHintLoading(true)
    setAiHintError(null)

    try {
      const response = await api.getAiHint(problemId, nextHintLevel)
      setAiHints((prev) => [...prev, response.data])
      // If user is currently on 'solved' (independent), suggest 'solved_with_hint'
      setStatus((current) => (current === 'solved' ? 'solved_with_hint' : current))
    } catch (err) {
      setAiHintError(err.message || 'Unable to load AI hint. Please check if AI_API_KEY is configured.')
    } finally {
      setAiHintLoading(false)
    }
  }

  async function requestAiExplanation() {
    if (aiExplanationLoading) return
    setAiExplanationLoading(true)
    setAiExplanationError(null)

    try {
      const response = await api.getAiExplanation(problemId)
      setAiExplanation(response.data.explanation)
    } catch (err) {
      setAiExplanationError(err.message || 'Unable to generate explanation. Please try again.')
    } finally {
      setAiExplanationLoading(false)
    }
  }

  async function submitAttempt(event) {
    event.preventDefault()
    setSubmitting(true)
    setConfirmation('')
    try {
      const totalHintsUsed = Math.max(visibleHints, aiHints.length)
      await api.createAttempt({
        userId: user._id,
        problemId,
        status,
        attemptCount: 1,
        hintsUsed: totalHintsUsed,
        ...(timeTaken ? { timeTaken: Number(timeTaken) } : {}),
      })
      setConfirmation('Result recorded. Your practice history is updated.')
      setHasAttempted(true)
    } catch {
      setConfirmation('We could not record that result. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <section className="page"><p className="state">Loading problem…</p></section>
  if (error || !problem) return <section className="page"><button className="button text" onClick={onBack}>← Back to library</button><p className="state error">We could not find that problem. Please return to the library.</p></section>

  return (
    <section className="page details-page">
      <button className="button text" onClick={onBack}>← Back to library</button>
      <div className="detail-header">
        <div>
          <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <h2>{problem.title}</h2>
          <div className="tag-list">{problem.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
        </div>
      </div>
      <p className="description">{problem.description}</p>

      <section>
        <h3>Example</h3>
        {problem.examples.map((example, index) => (
          <pre key={index}>
            <strong>Input:</strong> {example.input}{'\n'}
            <strong>Output:</strong> {example.output}
          </pre>
        ))}
      </section>

      {/* Catalog Static Hints */}
      {problem.hints?.length > 0 && (
        <section>
          <h3>Catalog Hints</h3>
          {problem.hints.slice(0, visibleHints).map((hint, index) => (
            <p className="hint" key={hint}>Hint {index + 1}: {hint}</p>
          ))}
          {visibleHints < problem.hints.length && (
            <button
              className="button secondary"
              onClick={() => {
                setVisibleHints((count) => count + 1)
                setStatus((current) => (current === 'solved' ? 'solved_with_hint' : current))
              }}
            >
              Reveal catalog hint {visibleHints + 1}
            </button>
          )}
        </section>
      )}

      {/* AI Learning Assistant Section */}
      <section className="ai-assistant-section">
        <div className="ai-assistant-header">
          <p className="eyebrow">Interactive Tutor</p>
          <h3>AI Learning Assistant</h3>
          <p className="ai-assistant-subtext">
            Get progressive hints without giving away the full answer, or request a beginner-friendly explanation after attempting.
          </p>
        </div>

        {/* Display Generated Progressive AI Hints */}
        {aiHints.length > 0 && (
          <div className="ai-hints-list">
            {aiHints.map((item) => (
              <div key={item.level} className={`ai-hint-card ai-hint-level-${item.level}`}>
                <div className="ai-hint-badge-row">
                  <span className="ai-hint-level-badge">Hint {item.level}</span>
                  <span className="ai-hint-level-desc">{hintLevelDescriptions[item.level]}</span>
                </div>
                <p className="ai-hint-content">{item.hint}</p>
              </div>
            ))}
          </div>
        )}

        {/* AI Hint Error Banner with Retry */}
        {aiHintError && (
          <div className="ai-error-banner">
            <p>{aiHintError}</p>
            <button className="button secondary small" onClick={requestAiHint}>Retry</button>
          </div>
        )}

        {/* AI Hint Actions */}
        <div className="ai-hint-actions">
          {nextHintLevel <= 3 ? (
            <button
              className="button primary"
              disabled={aiHintLoading}
              onClick={requestAiHint}
            >
              {aiHintLoading
                ? 'Thinking…'
                : (aiHints.length === 0 ? 'Get Hint' : 'Get Stronger Hint')}
            </button>
          ) : (
            <p className="ai-max-hints-note">All 3 progressive hint levels revealed.</p>
          )}
        </div>

        {/* AI Concept Explanation Section (Available after attempt) */}
        {hasAttempted && (
          <div className="ai-explanation-container">
            <div className="ai-explanation-header">
              <h4>Review & Understand</h4>
              <p>Ready to break down the complete approach and complexity?</p>
              <button
                className="button secondary"
                disabled={aiExplanationLoading}
                onClick={requestAiExplanation}
              >
                {aiExplanationLoading ? 'Explaining problem…' : (aiExplanation ? 'Refresh Explanation' : 'Explain This Problem')}
              </button>
            </div>

            {aiExplanationError && (
              <div className="ai-error-banner">
                <p>{aiExplanationError}</p>
                <button className="button secondary small" onClick={requestAiExplanation}>Retry</button>
              </div>
            )}

            {aiExplanation && (
              <div className="ai-explanation-card">
                <div className="ai-explanation-badge">Beginner-Friendly DSA Breakdown</div>
                <div className="ai-explanation-content">
                  {aiExplanation}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Record Result Form */}
      <form className="result-form" onSubmit={submitAttempt}>
        <h3>Record result</h3>
        <div className="result-options">
          {results.map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                value={value}
                checked={status === value}
                onChange={(event) => setStatus(event.target.value)}
              />
              {label}
            </label>
          ))}
        </div>
        <label className="time-field">
          Time taken (minutes, optional)
          <input
            type="number"
            min="0"
            step="1"
            value={timeTaken}
            onChange={(event) => setTimeTaken(event.target.value)}
          />
        </label>
        <button className="button primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save result'}
        </button>
        {confirmation && (
          <p className={confirmation.startsWith('Result') ? 'confirmation' : 'state error'}>
            {confirmation}
          </p>
        )}
      </form>
    </section>
  )
}

export default ProblemDetailsPage
