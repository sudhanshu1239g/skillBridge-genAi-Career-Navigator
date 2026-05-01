import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { useLocation } from "react-router";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading, hasCheckedAuth, setHasCheckedAuth } = context
    const location = useLocation()


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return data
        } catch (err) {
            return null
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return data
        } catch (err) {
            return null
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const publicRoutes = ["/login", "/register"]
        if (hasCheckedAuth) {
            if (loading) setLoading(false)
            return
        }

        if (publicRoutes.includes(location.pathname)) {
            setHasCheckedAuth(true)
            setLoading(false)
            return
        }

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                // 401 on first load without a session is expected.
                setUser(null)
            } finally {
                setHasCheckedAuth(true)
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [hasCheckedAuth, loading, location.pathname, setHasCheckedAuth, setLoading, setUser])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}
