import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api.js'

function formatMinutes(minutes) {
  if (!minutes || minutes <= 0) return '0 min'
  if (minutes < 60) return `${Math.round(minutes)} min`
  const hours = Math.floor(minutes / 60)
  const remainingMins = Math.round(minutes % 60)
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`
}

function formatRelativeDate(dateStr) {
  if (!dateStr) return 'Not yet practiced'
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

const statusBadgeLabels = {
  mastered: { label: 'Mastered', className: 'badge-mastered' },
  proficient: { label: 'Proficient', className: 'badge-proficient' },
  practicing: { label: 'Practicing', className: 'badge-practicing' },
  needs_practice: { label: 'Needs Focus', className: 'badge-needs-focus' },
  unattempted: { label: 'Unattempted', className: 'badge-unattempted' },
}

function AnalyticsPage({ user, onLibrary, onRecommendation }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [topicFilter, setTopicFilter] = useState('all')
  const [topicSort, setTopicSort] = useState('attempted')

  useEffect(() => {
    let active = true
    api.getUserAnalytics(user._id)
      .then((res) => {
        if (active) setData(res.data)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [user._id])

  const topicMasteryList = data?.topicMastery

  const filteredTopics = useMemo(() => {
    if (!topicMasteryList) return []
    let list = [...topicMasteryList]

    if (topicFilter === 'weak') {
      list = list.filter((t) => t.status === 'needs_practice' || (t.attempted > 0 && t.masteryScore < 60))
    } else if (topicFilter === 'practiced') {
      list = list.filter((t) => t.attempted > 0)
    } else if (topicFilter === 'mastered') {
      list = list.filter((t) => t.status === 'mastered' || t.status === 'proficient')
    } else if (topicFilter === 'unattempted') {
      list = list.filter((t) => t.attempted === 0)
    }

    if (topicSort === 'attempted') {
      list.sort((a, b) => b.attempted - a.attempted || b.masteryScore - a.masteryScore)
    } else if (topicSort === 'mastery-desc') {
      list.sort((a, b) => b.masteryScore - a.masteryScore || b.attempted - a.attempted)
    } else if (topicSort === 'mastery-asc') {
      list.sort((a, b) => a.masteryScore - b.masteryScore || b.failures - a.failures)
    } else if (topicSort === 'alphabetical') {
      list.sort((a, b) => a.topic.localeCompare(b.topic))
    }

    return list
  }, [topicMasteryList, topicFilter, topicSort])

  if (loading) {
    return (
      <section className="page analytics-page">
        <p className="state">Calculating your learning analytics…</p>
      </section>
    )
  }

  if (error || !data) {
    return (
      <section className="page analytics-page">
        <p className="state error">
          We could not load your analytics. Please make sure the backend and database are running, then try again.
        </p>
      </section>
    )
  }

  const { overview, difficultyProgression, weakAreas, strongAreas, recentActivity, insights } = data
  const hasAttempts = overview.totalAttempts > 0

  return (
    <section className="page analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <p className="eyebrow">Practice Analytics & Learning Progress</p>
          <h2>Your DSA Journey</h2>
          <p>Track your topic mastery, difficulty curve, and areas that need attention.</p>
        </div>
        <div className="analytics-header-actions">
          {onRecommendation && (
            <button className="button primary" onClick={onRecommendation}>
              Next Recommended Problem
            </button>
          )}
          {onLibrary && (
            <button className="button secondary" onClick={onLibrary}>
              Browse Library
            </button>
          )}
        </div>
      </div>

      {/* Actionable Insights Banner */}
      {insights && insights.length > 0 && (
        <div className="insights-container">
          {insights.map((insight, idx) => (
            <div key={idx} className={`insight-card insight-${insight.type}`}>
              <div className="insight-badge">
                {insight.type === 'warning' && '⚠️ Focus Area'}
                {insight.type === 'growth' && '🚀 Milestone'}
                {insight.type === 'streak' && '🔥 Streak'}
                {insight.type === 'strength' && '⭐ Strength'}
                {insight.type === 'info' && '💡 Tip'}
              </div>
              <div className="insight-body">
                <strong>{insight.title}</strong>
                <p>{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Overview KPI Cards */}
      <div className="analytics-kpi-grid">
        <article className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Problems Solved</span>
            <span className="kpi-pill">{overview.completionRate}% of catalog</span>
          </div>
          <strong className="kpi-value">
            {overview.uniqueProblemsSolved} <small>/ {overview.catalogTotal}</small>
          </strong>
          <div className="progress-track">
            <div className="progress-fill primary-fill" style={{ width: `${Math.min(100, overview.completionRate)}%` }} />
          </div>
          <p className="kpi-subtext">
            {overview.uniqueProblemsAttempted} unique attempted ({overview.totalAttempts} total logs)
          </p>
        </article>

        <article className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Overall Accuracy</span>
            <span className="kpi-pill">{overview.overallSuccessRate}% success</span>
          </div>
          <strong className="kpi-value">
            {overview.overallSuccessRate}%
          </strong>
          <div className="progress-track">
            <div className="progress-fill success-fill" style={{ width: `${Math.min(100, overview.overallSuccessRate)}%` }} />
          </div>
          <p className="kpi-subtext">
            {overview.statusDistribution.solved} successful · {overview.statusDistribution.failed} struggled · {overview.statusDistribution.solved_with_hint} with hints
          </p>
        </article>

        <article className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Time Invested</span>
            <span className="kpi-pill">Avg. {overview.averageTimePerAttempt} min/problem</span>
          </div>
          <strong className="kpi-value">
            {formatMinutes(overview.totalTimeSpent)}
          </strong>
          <div className="progress-track">
            <div className="progress-fill time-fill" style={{ width: `${Math.min(100, (overview.totalTimeSpent / 180) * 100)}%` }} />
          </div>
          <p className="kpi-subtext">
            {overview.totalHintsUsed} total hints utilized
          </p>
        </article>

        <article className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Practice Consistency</span>
            <span className="kpi-pill">{overview.streak.currentStreak} {overview.streak.currentStreak === 1 ? 'day' : 'days'} streak</span>
          </div>
          <strong className="kpi-value">
            {overview.streak.currentStreak} <small>{overview.streak.currentStreak === 1 ? 'day active' : 'days active'}</small>
          </strong>
          <div className="progress-track">
            <div className="progress-fill streak-fill" style={{ width: `${Math.min(100, (overview.streak.currentStreak / 7) * 100)}%` }} />
          </div>
          <p className="kpi-subtext">
            Longest streak: {overview.streak.longestStreak} {overview.streak.longestStreak === 1 ? 'day' : 'days'} · {overview.streak.activeDaysCount} {overview.streak.activeDaysCount === 1 ? 'active day' : 'active days'}
          </p>
        </article>
      </div>

      {/* Difficulty Progression Section */}
      <section className="analytics-section">
        <div className="section-title-wrap">
          <div>
            <p className="eyebrow">Difficulty Progression</p>
            <h3>Solved Problems by Tier</h3>
          </div>
        </div>

        <div className="difficulty-grid">
          {['Easy', 'Medium', 'Hard'].map((diff) => {
            const stat = difficultyProgression[diff] || { attempted: 0, solved: 0, total: 0, completionRate: 0, successRate: 0 }
            const diffClass = diff.toLowerCase()
            return (
              <div key={diff} className={`difficulty-card difficulty-card-${diffClass}`}>
                <div className="diff-card-head">
                  <span className={`difficulty ${diffClass}`}>{diff}</span>
                  <span className="diff-rate">{stat.completionRate}% completed</span>
                </div>
                <div className="diff-card-numbers">
                  <span className="diff-solved-count">{stat.solved}</span>
                  <span className="diff-total-count">/ {stat.total} solved</span>
                </div>
                <div className="progress-track">
                  <div className={`progress-fill ${diffClass}-fill`} style={{ width: `${Math.min(100, stat.completionRate)}%` }} />
                </div>
                <div className="diff-card-footer">
                  <span>{stat.attempted} attempted</span>
                  <span>{stat.successRate}% accuracy</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Weak Areas & Focus Diagnostics */}
      {hasAttempts && (
        <div className="diagnostics-grid">
          {/* Areas Needing Focus */}
          <div className="diagnostic-column">
            <div className="diagnostic-header">
              <h3>🎯 Focus & Weak Areas</h3>
              <p>Topics with recent struggles or lower mastery scores</p>
            </div>
            {weakAreas.length === 0 ? (
              <div className="empty-diagnostic">
                <p>No major weak areas detected! Keep challenging yourself with new topics.</p>
              </div>
            ) : (
              <div className="diagnostic-list">
                {weakAreas.map((item) => (
                  <div key={item.topic} className="diagnostic-item item-weak">
                    <div className="diagnostic-item-main">
                      <strong>{item.topic}</strong>
                      <span className="diagnostic-reason">{item.reason}</span>
                    </div>
                    <div className="diagnostic-score">
                      <span className="score-number">{item.masteryScore}%</span>
                      <small>Mastery</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Strong Areas */}
          <div className="diagnostic-column">
            <div className="diagnostic-header">
              <h3>🌟 Proven Strengths</h3>
              <p>Topics where you have demonstrated consistent accuracy</p>
            </div>
            {strongAreas.length === 0 ? (
              <div className="empty-diagnostic">
                <p>Solve more problems consistently to build high topic mastery.</p>
              </div>
            ) : (
              <div className="diagnostic-list">
                {strongAreas.map((item) => (
                  <div key={item.topic} className="diagnostic-item item-strong">
                    <div className="diagnostic-item-main">
                      <strong>{item.topic}</strong>
                      <span className="diagnostic-reason">{item.solved} solved · {item.successRate}% accuracy</span>
                    </div>
                    <div className="diagnostic-score">
                      <span className="score-number">{item.masteryScore}%</span>
                      <small>Mastery</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Timeline Chart */}
      {recentActivity && recentActivity.length > 0 && (
        <section className="analytics-section">
          <div className="section-title-wrap">
            <div>
              <p className="eyebrow">Recent Activity Trend</p>
              <h3>Practice History Timeline</h3>
            </div>
          </div>
          <div className="activity-chart-card">
            <div className="activity-chart">
              {recentActivity.map((day) => {
                const maxAttempts = Math.max(...recentActivity.map((d) => d.attempts), 1)
                const heightPct = Math.max(15, Math.round((day.attempts / maxAttempts) * 100))
                const solvePct = day.attempts > 0 ? (day.solved / day.attempts) * 100 : 0
                return (
                  <div key={day.date} className="chart-bar-group" title={`${day.date}: ${day.attempts} attempts (${day.solved} solved)`}>
                    <div className="chart-bar-wrap">
                      <div
                        className="chart-bar"
                        style={{
                          height: `${heightPct}%`,
                          background: solvePct === 100 ? '#10b981' : (solvePct > 0 ? '#3b82f6' : '#f59e0b'),
                        }}
                      >
                        <span className="chart-bar-count">{day.attempts}</span>
                      </div>
                    </div>
                    <span className="chart-label">{day.date.slice(5)}</span>
                  </div>
                )
              })}
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot green-dot" /> 100% Solved</span>
              <span className="legend-item"><span className="legend-dot blue-dot" /> Mixed Solves</span>
              <span className="legend-item"><span className="legend-dot orange-dot" /> In Progress</span>
            </div>
          </div>
        </section>
      )}

      {/* Topic Mastery Matrix */}
      <section className="analytics-section">
        <div className="section-title-wrap">
          <div>
            <p className="eyebrow">Skill Breakdown</p>
            <h3>Topic Mastery Matrix</h3>
          </div>
        </div>

        {/* Filter and Sort controls */}
        <div className="matrix-controls">
          <div className="filter-pill-group">
            <button className={`filter-pill ${topicFilter === 'all' ? 'active' : ''}`} onClick={() => setTopicFilter('all')}>
              All Topics ({data.topicMastery.length})
            </button>
            <button className={`filter-pill ${topicFilter === 'weak' ? 'active' : ''}`} onClick={() => setTopicFilter('weak')}>
              Needs Focus
            </button>
            <button className={`filter-pill ${topicFilter === 'practiced' ? 'active' : ''}`} onClick={() => setTopicFilter('practiced')}>
              Practiced ({data.topicMastery.filter((t) => t.attempted > 0).length})
            </button>
            <button className={`filter-pill ${topicFilter === 'mastered' ? 'active' : ''}`} onClick={() => setTopicFilter('mastered')}>
              Proficient & Mastered
            </button>
            <button className={`filter-pill ${topicFilter === 'unattempted' ? 'active' : ''}`} onClick={() => setTopicFilter('unattempted')}>
              Unattempted
            </button>
          </div>

          <div className="sort-select-wrap">
            <label htmlFor="topic-sort">Sort by:</label>
            <select id="topic-sort" value={topicSort} onChange={(e) => setTopicSort(e.target.value)}>
              <option value="attempted">Most Practiced</option>
              <option value="mastery-desc">Highest Mastery</option>
              <option value="mastery-asc">Lowest Mastery</option>
              <option value="alphabetical">A–Z Name</option>
            </select>
          </div>
        </div>

        {/* Topic Grid */}
        <div className="topic-grid">
          {filteredTopics.map((item) => {
            const badge = statusBadgeLabels[item.status] || statusBadgeLabels.unattempted
            return (
              <article key={item.topic} className="topic-card">
                <div className="topic-card-header">
                  <h4>{item.topic}</h4>
                  <span className={`status-badge ${badge.className}`}>{badge.label}</span>
                </div>

                <div className="topic-mastery-wrap">
                  <div className="topic-mastery-number">
                    <span>Mastery</span>
                    <strong>{item.masteryScore}%</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.masteryScore}%`,
                        backgroundColor: item.masteryScore >= 80 ? '#10b981' : (item.masteryScore >= 60 ? '#3b82f6' : (item.attempted > 0 ? '#f59e0b' : '#cbd5e1')),
                      }}
                    />
                  </div>
                </div>

                <div className="topic-meta-grid">
                  <div>
                    <span>Solved / Attempted</span>
                    <strong>{item.solved} / {item.attempted}</strong>
                  </div>
                  <div>
                    <span>Success Rate</span>
                    <strong>{item.successRate}%</strong>
                  </div>
                  <div>
                    <span>Catalog Coverage</span>
                    <strong>{item.solved} / {item.catalogCount}</strong>
                  </div>
                  <div>
                    <span>Last Practiced</span>
                    <strong>{formatRelativeDate(item.lastPracticed)}</strong>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Empty State Prompt if no attempts */}
      {!hasAttempts && (
        <div className="empty-prompt-card">
          <h3>Ready to start your DSA tracking?</h3>
          <p>
            CodeMe tracks your attempts, calculates your topic mastery dynamically, and recommends what to practice next.
          </p>
          <div className="empty-prompt-actions">
            {onLibrary && <button className="button primary" onClick={onLibrary}>Explore Problem Library</button>}
            {onRecommendation && <button className="button secondary" onClick={onRecommendation}>Get Recommended Problem</button>}
          </div>
        </div>
      )}
    </section>
  )
}

export default AnalyticsPage
