import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { useLocation } from "react-router";

const PUBLIC_ROUTES = ["/", "/full-list", "/about-us", "/login", "/register"];


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
        } catch {
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
        } catch {
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
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (hasCheckedAuth) {
            if (!PUBLIC_ROUTES.includes(location.pathname) && !user) {
                setHasCheckedAuth(false)
                return
            }
            return
        }

        if (PUBLIC_ROUTES.includes(location.pathname)) {
            setHasCheckedAuth(true)
            setLoading(false)
            return
        }

        if (user) {
            setHasCheckedAuth(true)
            setLoading(false)
            return
        }

        setLoading(true)

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch {
                setUser(null)
            } finally {
                setHasCheckedAuth(true)
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [hasCheckedAuth, location.pathname, setHasCheckedAuth, setLoading, setUser])

    return { user, loading, hasCheckedAuth, handleRegister, handleLogin, handleLogout }
}
