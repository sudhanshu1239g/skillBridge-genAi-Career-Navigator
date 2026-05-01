import React from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import '../style/fullList.scss'
import child from '../../../assets/child.png'

const FullList = () => {
  const navigate = useNavigate()
  const { loading, reports } = useInterview()

  if (loading) {
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
        {reports.length === 0 && <p className='empty-state'>No generated reports yet.</p>}

        
          
        </div>

        {reports.length > 0 && (
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
