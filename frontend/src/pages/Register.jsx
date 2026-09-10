import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { AiOutlineCloudUpload } from 'react-icons/ai'

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
    })
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!avatar) {
            return toast.error('Avatar is required')
        }

        setLoading(true)
        try {
            const data = new FormData()
            data.append('fullName', formData.fullName)
            data.append('email', formData.email)
            data.append('username', formData.username)
            data.append('password', formData.password)
            data.append('avatar', avatar)
            if (coverImage) {
                data.append('coverImage', coverImage)
            }
            
            await register(data)
            toast.success('Registration successful! Please log in.')
            navigate('/login')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join VideoTube today</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" required
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" required
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-group file-input-wrapper">
                        <label>Avatar (Required)</label>
                        <label className="file-input-label">
                            <AiOutlineCloudUpload size={24} />
                            <span>{avatar ? avatar.name : 'Choose Avatar Image'}</span>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setAvatar(e.target.files[0])}
                            />
                        </label>
                    </div>

                    <div className="form-group file-input-wrapper">
                        <label>Cover Image (Optional)</label>
                        <label className="file-input-label">
                            <AiOutlineCloudUpload size={24} />
                            <span>{coverImage ? coverImage.name : 'Choose Cover Image'}</span>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setCoverImage(e.target.files[0])}
                            />
                        </label>
                    </div>

                    <button type="submit" className="btn-primary form-submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    )
}

export default Register
