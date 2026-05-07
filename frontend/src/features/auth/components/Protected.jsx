import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading,user } = useAuth()
    const location = useLocation()


    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading...</h1>
            </main>
        )
    }

    if(!user){
        return <Navigate to={'/login'} replace state={{ from: location.pathname }} />
    }
    
    return children
}

export default Protected
