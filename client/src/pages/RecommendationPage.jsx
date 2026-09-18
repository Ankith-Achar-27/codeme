import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const factorLabels = {
  topicWeakness: 'Topic opportunity',
  difficultyFit: 'Difficulty fit',
  failureRelevance: 'Recent struggle relevance',
  conceptRelevance: 'Concept relevance',
  recency: 'Practice gap',
}

function RecommendationPage({ user, onProblemClick }) {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    api.getRecommendation(user._id)
      .then((result) => active && setRecommendation(result.data))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [user._id])

  if (loading) return <section className="page"><p className="state">Finding your next problem…</p></section>
  if (error) return <section className="page"><p className="state error">We could not generate a recommendation right now. Please make sure the API and database are available, then try again.</p></section>
  if (!recommendation?.problem) return <section className="page"><p className="state">No recommendation is available yet. Add problems to the catalog and try again.</p></section>

  const { problem, explanation, factors, targetTopic, recommendedDifficulty } = recommendation
  return <section className="page recommendation-page">
    <p className="eyebrow">Personalized practice</p>
    <h2>Your Next Problem</h2>
    <p>Focused on {targetTopic} at a {recommendedDifficulty} level that fits your current history.</p>
    <article className="recommendation-card">
      <div className="recommendation-heading"><div><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><h3>{problem.title}</h3></div></div>
      <div className="tag-list">{problem.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
      {problem.concepts?.length > 0 && <p className="concepts"><strong>Concepts:</strong> {problem.concepts.join(', ')}</p>}
      <section className="why-card"><p className="eyebrow">Why this problem?</p><p>{explanation}</p></section>
      <section><h3>Recommendation factors</h3><div className="factor-list">{Object.entries(factors).map(([factor, value]) => <div key={factor}><span>{factorLabels[factor]}</span><strong>{Math.round(value * 100)}%</strong></div>)}</div></section>
      <button className="button primary" onClick={() => onProblemClick(problem._id)}>Open problem</button>
    </article>
  </section>
}

export default RecommendationPage
