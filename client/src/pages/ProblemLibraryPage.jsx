import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const topics = [
  'Arrays', 'Strings', 'HashMap', 'Two Pointers', 'Sliding Window',
  'Stack', 'Queue', 'Linked List', 'Binary Search', 'Trees',
  'BST', 'Heap / Priority Queue', 'Graphs', 'Greedy', 'Recursion',
  'Backtracking', 'Dynamic Programming', 'Prefix Sum',
]

function ProblemLibraryPage({ onProblemClick }) {
  const [filters, setFilters] = useState({ search: '', difficulty: '', topic: '', page: '1', limit: '12' })
  const [result, setResult] = useState({ data: [], pagination: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      setLoading(true)
      setError(false)
      api.getProblems(filters)
        .then((data) => active && setResult(data))
        .catch(() => active && setError(true))
        .finally(() => active && setLoading(false))
    }, 180)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [filters])

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: '1' }))
  const clearFilters = () => setFilters({ search: '', difficulty: '', topic: '', page: '1', limit: '12' })
  const changePage = (page) => setFilters((current) => ({ ...current, page: String(page) }))

  const hasActiveFilters = Boolean(filters.search || filters.difficulty || filters.topic)

  return (
    <section className="page library-page">
      <div className="section-heading library-header">
        <div>
          <p className="eyebrow">Curated DSA Catalog</p>
          <h2>Problem Library</h2>
          <p>Sharpen your core coding patterns across 104 handpicked problems.</p>
        </div>
        {result.pagination && (
          <span className="catalog-count-pill">
            Showing {result.data.length} of {result.pagination.total} problems
          </span>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="filters-bar">
        <div className="search-input-wrap">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            aria-label="Search problems by title"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Search problems by title or concept…"
          />
          {filters.search && (
            <button
              className="clear-search-btn"
              onClick={() => updateFilter('search', '')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="select-wrap">
          <select
            aria-label="Filter by difficulty"
            value={filters.difficulty}
            onChange={(event) => updateFilter('difficulty', event.target.value)}
          >
            <option value="">All Difficulties</option>
            {['Easy', 'Medium', 'Hard'].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div className="select-wrap">
          <select
            aria-label="Filter by topic"
            value={filters.topic}
            onChange={(event) => updateFilter('topic', event.target.value)}
          >
            <option value="">All Topics (18)</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button className="button text clear-all-btn" onClick={clearFilters}>
            Reset filters
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p>Filtering problems…</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="state-box error-box">
          <p>We could not load the library right now. Please check your backend connection and try again.</p>
          <button className="button secondary" onClick={() => updateFilter('page', '1')}>Retry</button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !result.data.length && (
        <div className="empty-state-card">
          <div className="empty-state-icon">🔎</div>
          <h3>No matching problems found</h3>
          <p>We couldn't find any problems matching your current search and filters.</p>
          <button className="button primary" onClick={clearFilters}>Clear All Filters</button>
        </div>
      )}

      {/* Problems Grid */}
      {!loading && !error && result.data.length > 0 && (
        <div className="problem-grid">
          {result.data.map((problem) => {
            const diffClass = problem.difficulty.toLowerCase()
            return (
              <button
                className="problem-card"
                key={problem._id}
                onClick={() => onProblemClick(problem._id)}
                title={`Open ${problem.title}`}
              >
                <div className="problem-card-top">
                  <span className={`difficulty-badge diff-${diffClass}`}>{problem.difficulty}</span>
                  <span className="card-action-icon" aria-hidden="true">→</span>
                </div>
                <h3>{problem.title}</h3>
                <div className="tag-list">
                  {problem.topics.map((topic) => (
                    <span className="topic-chip" key={topic}>{topic}</span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {result.pagination?.totalPages > 1 && (
        <nav className="pagination-bar" aria-label="Problem Catalog Pagination">
          <button
            className="button secondary-outline pagination-btn"
            disabled={result.pagination.page === 1}
            onClick={() => changePage(result.pagination.page - 1)}
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page <strong>{result.pagination.page}</strong> of <strong>{result.pagination.totalPages}</strong>
          </span>
          <button
            className="button secondary-outline pagination-btn"
            disabled={result.pagination.page === result.pagination.totalPages}
            onClick={() => changePage(result.pagination.page + 1)}
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  )
}

export default ProblemLibraryPage
