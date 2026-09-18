import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

const topics = ['Arrays', 'Strings', 'HashMap', 'Two Pointers', 'Sliding Window', 'Stack', 'Queue', 'Linked List', 'Binary Search', 'Trees', 'BST', 'Heap / Priority Queue', 'Graphs', 'Greedy', 'Recursion', 'Backtracking', 'Dynamic Programming', 'Prefix Sum']

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
      api.getProblems(filters).then((data) => active && setResult(data)).catch(() => active && setError(true)).finally(() => active && setLoading(false))
    }, 180)
    return () => { active = false; clearTimeout(timer) }
  }, [filters])

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: '1' }))
  const changePage = (page) => setFilters((current) => ({ ...current, page: String(page) }))

  return (
    <section className="page">
      <div className="section-heading"><div><p className="eyebrow">104 curated exercises</p><h2>Problem library</h2><p>Filter by the skills you want to sharpen today.</p></div></div>
      <div className="filters">
        <input aria-label="Search problems" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Search by title" />
        <select aria-label="Filter by difficulty" value={filters.difficulty} onChange={(event) => updateFilter('difficulty', event.target.value)}><option value="">All difficulties</option>{['Easy', 'Medium', 'Hard'].map((value) => <option key={value}>{value}</option>)}</select>
        <select aria-label="Filter by topic" value={filters.topic} onChange={(event) => updateFilter('topic', event.target.value)}><option value="">All topics</option>{topics.map((topic) => <option key={topic}>{topic}</option>)}</select>
      </div>
      {loading && <p className="state">Loading problems…</p>}
      {error && <p className="state error">We could not load the library. Please refresh and try again.</p>}
      {!loading && !error && !result.data.length && <p className="state">No problems match those filters. Try a broader search.</p>}
      <div className="problem-grid">
        {result.data.map((problem) => <button className="problem-card" key={problem._id} onClick={() => onProblemClick(problem._id)}><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><h3>{problem.title}</h3><div className="tag-list">{problem.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></button>)}
      </div>
      {result.pagination?.totalPages > 1 && <nav className="pagination" aria-label="Problem pages"><button disabled={result.pagination.page === 1} onClick={() => changePage(result.pagination.page - 1)}>Previous</button><span>Page {result.pagination.page} of {result.pagination.totalPages}</span><button disabled={result.pagination.page === result.pagination.totalPages} onClick={() => changePage(result.pagination.page + 1)}>Next</button></nav>}
    </section>
  )
}

export default ProblemLibraryPage
