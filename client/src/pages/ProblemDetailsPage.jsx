import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const results = [
  ['solved', 'Solved independently'],
  ['solved_with_hint', 'Solved with hint'],
  ['failed', 'Failed'],
  ['viewed_solution', 'Viewed solution'],
]

function ProblemDetailsPage({ problemId, user, onBack }) {
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [visibleHints, setVisibleHints] = useState(0)
  const [status, setStatus] = useState('solved')
  const [timeTaken, setTimeTaken] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState('')

  useEffect(() => {
    let active = true
    api.getProblem(problemId).then((result) => active && setProblem(result.data)).catch(() => active && setError(true)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [problemId])

  async function submitAttempt(event) {
    event.preventDefault()
    setSubmitting(true); setConfirmation('')
    try {
      await api.createAttempt({ userId: user._id, problemId, status, attemptCount: 1, hintsUsed: visibleHints, ...(timeTaken ? { timeTaken: Number(timeTaken) } : {}) })
      setConfirmation('Result recorded. Your practice history is updated.')
    } catch {
      setConfirmation('We could not record that result. Please try again.')
    } finally { setSubmitting(false) }
  }

  if (loading) return <section className="page"><p className="state">Loading problem…</p></section>
  if (error || !problem) return <section className="page"><button className="button text" onClick={onBack}>← Back to library</button><p className="state error">We could not find that problem. Please return to the library.</p></section>

  return <section className="page details-page">
    <button className="button text" onClick={onBack}>← Back to library</button>
    <div className="detail-header"><div><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><h2>{problem.title}</h2><div className="tag-list">{problem.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></div></div>
    <p className="description">{problem.description}</p>
    <section><h3>Example</h3>{problem.examples.map((example, index) => <pre key={index}><strong>Input:</strong> {example.input}{'\n'}<strong>Output:</strong> {example.output}</pre>)}</section>
    <section><h3>Hints</h3>{problem.hints.slice(0, visibleHints).map((hint, index) => <p className="hint" key={hint}>Hint {index + 1}: {hint}</p>)}{visibleHints < problem.hints.length && <button className="button secondary" onClick={() => setVisibleHints((count) => count + 1)}>Reveal hint {visibleHints + 1}</button>}</section>
    <form className="result-form" onSubmit={submitAttempt}><h3>Record result</h3><div className="result-options">{results.map(([value, label]) => <label key={value}><input type="radio" value={value} checked={status === value} onChange={(event) => setStatus(event.target.value)} />{label}</label>)}</div><label className="time-field">Time taken (minutes, optional)<input type="number" min="0" step="1" value={timeTaken} onChange={(event) => setTimeTaken(event.target.value)} /></label><button className="button primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save result'}</button>{confirmation && <p className={confirmation.startsWith('Result') ? 'confirmation' : 'state error'}>{confirmation}</p>}</form>
  </section>
}

export default ProblemDetailsPage
