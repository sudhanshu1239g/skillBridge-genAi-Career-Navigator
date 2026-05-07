import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import TopNavbar from '../../interview/components/TopNavbar'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = await handleLogin({ email, password })
        if (data?.user) {
            navigate(location.state?.from || '/', { replace: true })
        }
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading...</h1>
            </main>
        )
    }


    return (
        <>
            <TopNavbar />
            <main className="auth-layout">
                <div className="glow-orb"></div>
                <div className="brand-section">
                    <h1>SkillBridge</h1>
                    <p>Ai career navigation</p>
                </div>
                <div className="form-section">
                <div className="form-container">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email" id="email" name='email' placeholder='Enter email address' />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password" id="password" name='password' placeholder='Enter password' />
                        </div>
                        <button className='button primary-button' >Login</button>
                    </form>
                    <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
                </div>
                </div>
            </main>
        </>
    )
}

export default Login
