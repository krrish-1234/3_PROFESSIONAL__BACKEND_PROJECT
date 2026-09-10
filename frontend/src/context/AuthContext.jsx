import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, loginUser as loginAPI, logoutUser as logoutAPI, registerUser as registerAPI } from '../api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await getCurrentUser()
            setUser(res.data.data)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (credentials) => {
        const res = await loginAPI(credentials)
        setUser(res.data.data.user)
        return res.data
    }

    const register = async (formData) => {
        const res = await registerAPI(formData)
        return res.data
    }

    const logout = async () => {
        await logoutAPI()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}
