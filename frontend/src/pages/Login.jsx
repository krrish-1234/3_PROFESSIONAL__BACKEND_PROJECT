import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: ''
    })
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = {
                password: formData.password
            }
            if (formData.usernameOrEmail.includes('@')) {
                data.email = formData.usernameOrEmail
            } else {
                data.username = formData.usernameOrEmail
            }
            
            await login(data)
            toast.success('Logged in successfully')
            navigate('/')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to continue to VideoTube</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email or Username</label>
                        <input 
                            type="text"
                            required
                            value={formData.usernameOrEmail}
                            onChange={(e) => setFormData({...formData, usernameOrEmail: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="btn-primary form-submit">
                        Sign In
                    </button>
                </form>
                
                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
