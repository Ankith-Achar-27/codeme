import { useEffect, useState } from 'react'
import { api } from '../services/api.js'
import { AiMarkdown } from '../components/AiMarkdown.js'

const resultOptions = [
  { value: 'solved', label: 'Solved independently', desc: 'Solved clean without hints', icon: '✓' },
  { value: 'solved_with_hint', label: 'Solved with hint', desc: 'Used hints to crack the pattern', icon: '💡' },
  { value: 'failed', label: 'Failed / Revisit', desc: 'Could not complete independently', icon: '✕' },
  { value: 'viewed_solution', label: 'Viewed solution', desc: 'Studied the full solution', icon: '👁' },
]

const HINT_TIERS = [
  { level: 1, name: 'Concept', label: 'HINT 1 · CONCEPT' },
  { level: 2, name: 'Strategy', label: 'HINT 2 · STRATEGY' },
  { level: 3, name: 'Implementation', label: 'HINT 3 · IMPLEMENTATION' },
]

function getTutorActionLabel(count) {
  if (count === 0) return 'Get Hint 1 →'
  if (count === 1) return 'Reveal Hint 2 →'
  if (count === 2) return 'Reveal Hint 3 →'
  return 'All hints revealed'
}

function formatAiError(err) {
  const status = err?.status || err?.payload?.status
  const rawMsg = (typeof err === 'string' ? err : err?.message || '').toLowerCase()

  const isRateLimit =
    status === 429 ||
    rawMsg.includes('429') ||
    rawMsg.includes('quota') ||
    rawMsg.includes('rate limit') ||
    rawMsg.includes('rate_limit') ||
    rawMsg.includes('resource has been exhausted') ||
    rawMsg.includes('resource_exhausted') ||
    rawMsg.includes('too many requests')

  if (isRateLimit) {
    return {
      title: 'AI tutor temporarily unavailable',
      message: 'Gemini has reached its current request limit. Please try again shortly.',
      isQuota: true,
    }
  }

  if (status === 503 || rawMsg.includes('ai_not_configured') || rawMsg.includes('not configured')) {
    return {
      title: 'AI tutor not configured',
      message: 'AI assistance is not configured on the server. Please check that AI_API_KEY is set.',
      isQuota: false,
    }
  }

  return {
    title: 'Unable to reach AI tutor',
    message: 'The AI service encountered an issue while generating guidance. Please try again.',
    isQuota: false,
  }
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
  const currentHint = aiHints.length > 0 ? aiHints[aiHints.length - 1] : null

  async function requestAiHint() {
    if (nextHintLevel > 3 || aiHintLoading) return
    setAiHintLoading(true)
    setAiHintError(null)

    try {
      const response = await api.getAiHint(problemId, nextHintLevel)
      setAiHints((prev) => [...prev, response.data])
      setStatus((current) => (current === 'solved' ? 'solved_with_hint' : current))
    } catch (err) {
      setAiHintError(formatAiError(err))
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
      setAiExplanationError(formatAiError(err))
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
      setConfirmation('Practice attempt recorded! Your progress stats and recommendation models are updated.')
      setHasAttempted(true)
    } catch {
      setConfirmation('We could not record that result. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="page details-page">
        <div className="state-box">
          <div className="spinner" />
          <p>Loading problem details…</p>
        </div>
      </section>
    )
  }

  if (error || !problem) {
    return (
      <section className="page details-page">
        <button className="button text back-btn" onClick={onBack}>← Back to Library</button>
        <div className="state-box error-box">
          <p>We could not find that problem. Please return to the problem library.</p>
          <button className="button secondary" onClick={onBack}>Browse Library</button>
        </div>
      </section>
    )
  }

  const diffClass = problem.difficulty.toLowerCase()

  return (
    <section className="page details-page">
      {/* Top Back Navigation */}
      <button className="button text back-btn" onClick={onBack}>
        ← Back to Problem Library
      </button>

      {/* Learning Flow Roadmap Banner */}
      <div className="learning-flow-banner">
        <div className="flow-step active">
          <span className="step-num">1</span>
          <span className="step-text">Understand</span>
        </div>
        <span className="flow-arrow">→</span>
        <div className={`flow-step ${aiHints.length > 0 ? 'active' : ''}`}>
          <span className="step-num">2</span>
          <span className="step-text">Think / Get Hints</span>
        </div>
        <span className="flow-arrow">→</span>
        <div className={`flow-step ${hasAttempted ? 'active' : ''}`}>
          <span className="step-num">3</span>
          <span className="step-text">Submit Result</span>
        </div>
        <span className="flow-arrow">→</span>
        <div className={`flow-step ${aiExplanation ? 'active' : ''}`}>
          <span className="step-num">4</span>
          <span className="step-text">AI Explanation</span>
        </div>
      </div>

      {/* Problem Header */}
      <div className="detail-header-card">
        <div className="detail-badge-row">
          <span className={`difficulty-badge diff-${diffClass}`}>{problem.difficulty}</span>
          <div className="tag-list">
            {problem.topics.map((topic) => (
              <span className="topic-chip" key={topic}>{topic}</span>
            ))}
          </div>
        </div>

        <h2>{problem.title}</h2>

        {problem.concepts?.length > 0 && (
          <div className="concept-row">
            <span className="concept-label">Core Concepts:</span>
            {problem.concepts.map((concept) => (
              <span className="concept-tag" key={concept}>{concept}</span>
            ))}
          </div>
        )}
      </div>

      {/* Problem Description */}
      <div className="detail-section-card">
        <h3>Problem Statement</h3>
        <p className="problem-description-text">{problem.description}</p>
      </div>

      {/* Examples */}
      {problem.examples?.length > 0 && (
        <div className="detail-section-card">
          <h3>Examples</h3>
          <div className="examples-list">
            {problem.examples.map((example, index) => (
              <div className="example-box" key={index}>
                <div className="example-tag">Example {index + 1}</div>
                <div className="example-row">
                  <span className="example-label">Input:</span>
                  <code>{example.input}</code>
                </div>
                <div className="example-row">
                  <span className="example-label">Output:</span>
                  <code>{example.output}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catalog Static Hints */}
      {problem.hints?.length > 0 && (
        <div className="detail-section-card catalog-hints-card">
          <div className="card-header-with-badge">
            <h3>Catalog Hints</h3>
            <span className="counter-badge">{visibleHints} of {problem.hints.length} revealed</span>
          </div>
          {problem.hints.slice(0, visibleHints).map((hint, index) => (
            <div className="catalog-hint-box" key={hint}>
              <strong className="hint-num">Hint {index + 1}:</strong>
              <span>{hint}</span>
            </div>
          ))}
          {visibleHints < problem.hints.length && (
            <button
              className="button secondary-outline reveal-btn"
              onClick={() => {
                setVisibleHints((count) => count + 1)
                setStatus((current) => (current === 'solved' ? 'solved_with_hint' : current))
              }}
            >
              Reveal Catalog Hint {visibleHints + 1}
            </button>
          )}
        </div>
      )}

      {/* AI Tutor Card (Redesigned) */}
      <section className="ai-tutor-card">
        {/* Header */}
        <div className="ai-tutor-header">
          <div className="ai-tutor-title-row">
            <h3 className="ai-tutor-title">✦ AI Tutor</h3>
            <span className={`ai-tutor-status-badge ${aiHintLoading ? 'thinking' : 'ready'}`}>
              <span className="status-dot" />
              {aiHintLoading ? 'Thinking…' : 'Ready'}
            </span>
          </div>
          <p className="ai-tutor-subtitle">
            Stuck? Get a small nudge without revealing the solution.
          </p>
        </div>

        {/* Compact Error State inside Container */}
        {aiHintError && (
          <div className="ai-tutor-compact-error">
            <div className="compact-error-body">
              <strong className="compact-error-title">{aiHintError.title}</strong>
              <p className="compact-error-desc">{aiHintError.message}</p>
            </div>
            <button
              className="button secondary-outline small compact-error-retry-btn"
              onClick={requestAiHint}
              type="button"
            >
              Retry
            </button>
          </div>
        )}

        {/* Previously Revealed Hints (Visually secondary / compact drawer) */}
        {aiHints.length > 1 && (
          <div className="ai-tutor-previous-section">
            <details className="previous-hints-details">
              <summary className="previous-hints-summary">
                <span>View previous hints ({aiHints.length - 1})</span>
              </summary>
              <div className="previous-hints-list">
                {aiHints.slice(0, -1).map((item) => {
                  const tier = HINT_TIERS[item.level - 1]
                  return (
                    <div key={item.level} className="previous-hint-item">
                      <span className="previous-hint-badge">{tier?.label}</span>
                      <div className="previous-hint-text">
                        <AiMarkdown content={item.hint} className="previous-hint-markdown" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </details>
          </div>
        )}

        {/* Current / Active Hint (Main Visual Focus) */}
        {currentHint && (
          <div className="ai-tutor-main-hint">
            <div className="current-hint-header">
              <span className="current-hint-label">
                {HINT_TIERS[currentHint.level - 1]?.label || `HINT ${currentHint.level}`}
              </span>
            </div>
            <div className="current-hint-content">
              <AiMarkdown content={currentHint.hint} className="current-hint-markdown" />
            </div>
          </div>
        )}

        {/* Progression Indicator */}
        <div className="ai-tutor-progression">
          {HINT_TIERS.map((tier) => {
            let marker = '○'
            let statusClass = 'upcoming'

            if (aiHints.length > 0) {
              if (tier.level < aiHints.length) {
                marker = '✓'
                statusClass = 'completed'
              } else if (tier.level === aiHints.length) {
                marker = '●'
                statusClass = 'active'
              }
            }

            return (
              <div key={tier.level} className={`progression-step ${statusClass}`}>
                <span className="progression-marker">{marker}</span>
                <span className="progression-name">{tier.name}</span>
              </div>
            )
          })}
        </div>

        {/* Action Button / Unlocked State */}
        <div className="ai-tutor-actions">
          {nextHintLevel <= 3 ? (
            <button
              className="button primary ai-tutor-cta"
              disabled={aiHintLoading}
              onClick={requestAiHint}
              type="button"
            >
              {aiHintLoading ? (
                <>
                  <span className="spinner small" />
                  <span>Consulting AI Tutor…</span>
                </>
              ) : (
                <span>{getTutorActionLabel(aiHints.length)}</span>
              )}
            </button>
          ) : (
            <div className="ai-tutor-unlocked-card">
              <div className="unlocked-title-row">
                <span className="unlocked-check">✓</span>
                <strong>All three hints unlocked</strong>
              </div>
              <p className="unlocked-text">
                You now have the full set of guidance. Give the problem a try!
              </p>
            </div>
          )}
        </div>

        {/* AI Explanation (Accessible once attempted or during review) */}
        {hasAttempted && (
          <div className="ai-explanation-module">
            <div className="explanation-module-head">
              <div>
                <h4>Solution & Concept Breakdown</h4>
                <p>Learn the core algorithmic principles and complexity rationale.</p>
              </div>
              <button
                className="button secondary"
                disabled={aiExplanationLoading}
                onClick={requestAiExplanation}
              >
                {aiExplanationLoading
                  ? 'Generating Breakdown…'
                  : (aiExplanation ? 'Refresh Explanation' : 'Explain This Problem →')}
              </button>
            </div>

            {aiExplanationError && (
              <div className="ai-error-box">
                <div className="ai-error-content">
                  <div className="ai-error-title-row">
                    <span className="ai-error-icon">⚠️</span>
                    <strong>{aiExplanationError.title}</strong>
                  </div>
                  <p className="ai-error-message">{aiExplanationError.message}</p>
                </div>
                <button className="button secondary-outline small ai-error-retry-btn" onClick={requestAiExplanation}>
                  Retry
                </button>
              </div>
            )}

            {aiExplanation && (
              <div className="ai-explanation-content-card">
                <div className="explanation-content-inner">
                  <AiMarkdown content={aiExplanation} className="explanation-markdown" />
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Record Result Form */}
      <form className="result-form-card" onSubmit={submitAttempt}>
        <div className="form-head">
          <p className="eyebrow">Record Your Outcome</p>
          <h3>How did your practice go?</h3>
          <p>Logging your results updates your mastery scores and shapes future problem recommendations.</p>
        </div>

        <div className="outcome-options-grid">
          {resultOptions.map((opt) => (
            <label
              key={opt.value}
              className={`outcome-card ${status === opt.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="practice-outcome"
                value={opt.value}
                checked={status === opt.value}
                onChange={(e) => setStatus(e.target.value)}
              />
              <div className="outcome-card-body">
                <div className="outcome-icon">{opt.icon}</div>
                <strong>{opt.label}</strong>
                <small>{opt.desc}</small>
              </div>
            </label>
          ))}
        </div>

        <div className="form-time-row">
          <label className="time-input-label">
            <span>Time Taken (minutes, optional):</span>
            <input
              type="number"
              min="0"
              step="1"
              value={timeTaken}
              placeholder="e.g. 20"
              onChange={(e) => setTimeTaken(e.target.value)}
            />
          </label>
        </div>

        <div className="form-submit-row">
          <button className="button primary submit-btn" disabled={submitting}>
            {submitting ? 'Recording Attempt…' : 'Record Result & Update Stats'}
          </button>
        </div>

        {confirmation && (
          <div className={confirmation.startsWith('Practice') ? 'confirmation-banner' : 'error-banner'}>
            <span>{confirmation}</span>
          </div>
        )}
      </form>
    </section>
  )
}

export default ProblemDetailsPage
