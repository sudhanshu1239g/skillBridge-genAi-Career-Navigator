import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import { useAuth } from '../../auth/hooks/useAuth'
import '../style/fullList.scss'
import child from '../../../assets/child.png'

const FullList = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { loading, reports, getReports } = useInterview()

  useEffect(() => {
    if (user) {
      getReports()
    }
  }, [getReports, user])

  if (loading || authLoading) {
    return (
      <main className='loading-screen'>
        <h1>Loading your interview plan...</h1>
      </main>
    )
  }

  return (
    <div className='full-list-page'>
      <section className='full-list-content'>
        <div className="child-image-container">
          <img src={child} alt="Child" />
        <h1>All Generated Resumes & Plans</h1>
        {!user && <p className='empty-state'>Please login to see your generated reports.</p>}
        {user && reports.length === 0 && <p className='empty-state'>No generated reports yet.</p>}

        
          
        </div>

        {!user && (
          <div className='login-required'>
            <h2>Please login</h2>
            <p>Your generated interview strategies are saved to your account.</p>
            <button className='button primary-button' onClick={() => navigate('/login', { state: { from: '/full-list' } })}>
              Login
            </button>
          </div>
        )}

        {user && reports.length > 0 && (
          <ul className='reports-list'>
            {reports.map((report) => (
              <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                <h3>{report.title || 'Untitled Position'}</h3>
                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default FullList
