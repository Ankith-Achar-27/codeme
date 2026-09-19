import { useEffect, useState } from 'react'
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

  if (userError) return <main className="app-shell"><p className="state error">CodeMe could not connect to the API. Start the backend and refresh this page.</p></main>
  if (!user) return <main className="app-shell"><p className="state">Preparing your practice space…</p></main>

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={openDashboard}><span>Code</span>Me</button>
        <nav>
          <button className={view.page === 'dashboard' ? 'active' : ''} onClick={openDashboard}>Dashboard</button>
          <button className={view.page === 'recommendation' ? 'active' : ''} onClick={openRecommendation}>Recommended</button>
          <button className={view.page === 'library' || view.page === 'details' ? 'active' : ''} onClick={openLibrary}>Library</button>
          <button className={view.page === 'analytics' ? 'active' : ''} onClick={openAnalytics}>Analytics</button>
        </nav>
      </header>
      {view.page === 'dashboard' && <DashboardPage user={user} onLibrary={openLibrary} onProblemClick={openProblem} onRecommendation={openRecommendation} />}
      {view.page === 'library' && <ProblemLibraryPage onProblemClick={openProblem} />}
      {view.page === 'details' && <ProblemDetailsPage key={view.problemId} user={user} problemId={view.problemId} onBack={openLibrary} />}
      {view.page === 'recommendation' && <RecommendationPage user={user} onProblemClick={openProblem} />}
      {view.page === 'analytics' && <AnalyticsPage user={user} onProblemClick={openProblem} onLibrary={openLibrary} onRecommendation={openRecommendation} />}
    </div>
  )
}


export default App
