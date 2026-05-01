import React from 'react'
import '../style/aboutUs.scss'

const AboutUs = () => {
  return (
    <div className='about-page'>
      <section className='about-card'>
        <h1>About Us</h1>
        
        <p className="intro-text">
          Skill-Bridge Career Navigator transforms unstructured profile data into a 
          <strong> personalized career action plan</strong>. Instead of generic guidance, 
          we provide role-specific insights to bridge the gap between your current 
          profile and your dream job.
        </p>

        <div className="features-grid">
          <h3>What You Get</h3>
          <ul>
            <li><span>Match Score</span> Profile-to-role fit analysis</li>
            <li><span>Skill Gap Analysis</span> Prioritized by severity</li>
            <li><span>Mock Interviews</span> Tailored technical & behavioral questions</li>
            <li><span>Roadmap</span> Day-wise preparation strategy</li>
            <li><span>ATS Optimizer</span> Downloadable, role-tailored resumes</li>
          </ul>
        </div>

        <p className="footer-note">
          Designed for practical impact and demo-ready clarity.
        </p>
      </section>
    </div>
  )
}

export default AboutUs
