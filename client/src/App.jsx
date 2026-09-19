import { useEffect, useState } from 'react'
import logoUrl from './assets/codeme-logo.png'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProblemDetailsPage from './pages/ProblemDetailsPage.jsx'
import ProblemLibraryPage from './pages/ProblemLibraryPage.jsx'
import RecommendationPage from './pages/RecommendationPage.jsx'
import { api } from './services/api.js'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [userError, setUserError] = useState(false)
  const [view, setView] = useState({ page: 'dashboard', problemId: null })

  useEffect(() => {
    api.getDemoUser().then((result) => setUser(result.data)).catch(() => setUserError(true))
  }, [])

  const openLibrary = () => setView({ page: 'library', problemId: null })
  const openDashboard = () => setView({ page: 'dashboard', problemId: null })
  const openRecommendation = () => setView({ page: 'recommendation', problemId: null })
  const openAnalytics = () => setView({ page: 'analytics', problemId: null })
  const openProblem = (problemId) => problemId && setView({ page: 'details', problemId })

  if (userError) {
    return (
      <main className="app-shell">
        <div className="state-card error-card">
          <div className="state-icon">⚠️</div>
          <h3>API Connection Error</h3>
          <p>CodeMe could not connect to the backend server. Make sure MongoDB and the Express API are running, then refresh.</p>
          <button className="button primary" onClick={() => window.location.reload()}>Refresh page</button>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="app-shell">
        <div className="state-card loading-card">
          <div className="spinner" />
          <p>Preparing your personalized practice space…</p>
        </div>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-brand-wrap">
          <button className="brand" onClick={openDashboard} aria-label="CodeMe Home">
            <img src={logoUrl} alt="CodeMe" className="brand-logo" />
          </button>
          <span className="brand-tagline">Your DSA practice, personalized.</span>
        </div>

        <nav className="site-nav" aria-label="Main Navigation">
          <button
            className={`nav-item ${view.page === 'dashboard' ? 'active' : ''}`}
            onClick={openDashboard}
          >
            Dashboard
          </button>
          <button
            className={`nav-item ${view.page === 'recommendation' ? 'active' : ''}`}
            onClick={openRecommendation}
          >
            Recommended
          </button>
          <button
            className={`nav-item ${view.page === 'library' || view.page === 'details' ? 'active' : ''}`}
            onClick={openLibrary}
          >
            Problem Library
          </button>
          <button
            className={`nav-item ${view.page === 'analytics' ? 'active' : ''}`}
            onClick={openAnalytics}
          >
            Analytics
          </button>
        </nav>

        <div className="user-profile-badge" title={`Signed in as ${user.email || user.name}`}>
          <span className="user-status-dot" />
          <span className="user-name">{user.name}</span>
        </div>
      </header>

      <main className="main-content">
        {view.page === 'dashboard' && (
          <DashboardPage
            user={user}
            onLibrary={openLibrary}
            onProblemClick={openProblem}
            onRecommendation={openRecommendation}
          />
        )}
        {view.page === 'library' && (
          <ProblemLibraryPage onProblemClick={openProblem} />
        )}
        {view.page === 'details' && (
          <ProblemDetailsPage
            key={view.problemId}
            user={user}
            problemId={view.problemId}
            onBack={openLibrary}
          />
        )}
        {view.page === 'recommendation' && (
          <RecommendationPage
            user={user}
            onProblemClick={openProblem}
          />
        )}
        {view.page === 'analytics' && (
          <AnalyticsPage
            user={user}
            onProblemClick={openProblem}
            onLibrary={openLibrary}
            onRecommendation={openRecommendation}
          />
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logoUrl} alt="CodeMe" className="footer-logo" />
            <p className="footer-tagline">Your DSA practice, personalized.</p>
          </div>
          <p className="footer-note">
            AI for Learning Hackathon · Personalized DSA Mastery & AI Tutoring
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
