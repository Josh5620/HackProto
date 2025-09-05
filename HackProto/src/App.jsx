import { useState } from 'react'
import HomePage from './pages/HomePage'
import MatchingPage from './pages/MatchingPage'
import MatchedUsersPage from './pages/MatchedUsersPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [navigationData, setNavigationData] = useState({})

  const handleNavigate = (page, data = {}) => {
    setCurrentPage(page)
    setNavigationData(data)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />
      case 'matching':
        return <MatchingPage onNavigate={handleNavigate} />
      case 'matched-users':
        return <MatchedUsersPage 
          onNavigate={handleNavigate} 
          navigationData={navigationData}
        />
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="app">
      {renderCurrentPage()}
    </div>
  )
}

export default App
