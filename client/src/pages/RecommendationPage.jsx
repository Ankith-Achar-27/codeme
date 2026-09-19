import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const factorLabels = {
  topicWeakness: { label: 'Topic opportunity', hint: 'Focuses on areas with room for mastery growth' },
  difficultyFit: { label: 'Difficulty fit', hint: 'Tailored to your current demonstrated solve tier' },
  failureRelevance: { label: 'Struggle relevance', hint: 'Reinforces patterns from recent failed attempts' },
  conceptRelevance: { label: 'Concept continuity', hint: 'Connects with concepts from past problems' },
  recency: { label: 'Spaced repetition', hint: 'Revisits skills that have not been practiced recently' },
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

  if (loading) {
    return (
      <section className="page recommendation-page">
        <div className="state-box">
          <div className="spinner" />
          <p>Analyzing your attempt history & generating personalized recommendation…</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page recommendation-page">
        <div className="state-box error-box">
          <h3>Recommendation Service Unavailable</h3>
          <p>We could not compute a recommendation right now. Please ensure MongoDB and the API are running.</p>
        </div>
      </section>
    )
  }

  if (!recommendation?.problem) {
    return (
      <section className="page recommendation-page">
        <div className="empty-state-card">
          <div className="empty-state-icon">🎯</div>
          <h3>No problems available</h3>
          <p>No recommendation could be generated. Please make sure the DSA catalog has been seeded.</p>
        </div>
      </section>
    )
  }

  const { problem, explanation, factors, targetTopic, recommendedDifficulty, score } = recommendation
  const diffClass = problem.difficulty.toLowerCase()
  const matchPercentage = Math.round((score || 0.75) * 100)

  return (
    <section className="page recommendation-page">
      <div className="section-heading recommendation-header">
        <div>
          <p className="eyebrow">Algorithmic Recommendation</p>
          <h2>Your Next Practice Challenge</h2>
          <p>
            Targeting <strong>{targetTopic}</strong> at the recommended <strong>{recommendedDifficulty}</strong> tier based on your solving history.
          </p>
        </div>
      </div>

      <article className="spotlight-problem-card">
        <div className="spotlight-card-top">
          <div className="spotlight-badges">
            <span className={`difficulty-badge diff-${diffClass}`}>{problem.difficulty}</span>
            <span className="target-topic-pill">Target: {targetTopic}</span>
          </div>
          <div className="match-score-pill">
            <span>Algorithm Match:</span>
            <strong>{matchPercentage}%</strong>
          </div>
        </div>

        <h3 className="spotlight-title">{problem.title}</h3>

        <div className="tag-list spotlight-tags">
          {problem.topics.map((topic) => (
            <span className="topic-chip" key={topic}>{topic}</span>
          ))}
        </div>

        {problem.concepts?.length > 0 && (
          <p className="spotlight-concepts">
            <strong>Key concepts:</strong> {problem.concepts.join(', ')}
          </p>
        )}

        {/* Why this problem? */}
        <div className="why-callout-card">
          <div className="why-callout-head">
            <span className="why-icon" aria-hidden="true">💡</span>
            <h4>Why this problem?</h4>
          </div>
          <p className="why-explanation-text">{explanation}</p>
        </div>

        {/* Factor Breakdown */}
        <div className="factors-section">
          <h4>Scoring Factor Weights</h4>
          <div className="factors-grid">
            {Object.entries(factors).map(([factor, value]) => {
              const info = factorLabels[factor] || { label: factor, hint: '' }
              const pct = Math.round(value * 100)
              return (
                <div key={factor} className="factor-tile">
                  <div className="factor-tile-top">
                    <span className="factor-name">{info.label}</span>
                    <strong className="factor-pct">{pct}%</strong>
                  </div>
                  <div className="factor-bar-track">
                    <div className="factor-bar-fill" style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                  <span className="factor-hint">{info.hint}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="spotlight-cta-bar">
          <button
            className="button primary large-cta"
            onClick={() => onProblemClick(problem._id)}
          >
            Start Solving Problem →
          </button>
        </div>
      </article>
    </section>
  )
}

export default RecommendationPage
