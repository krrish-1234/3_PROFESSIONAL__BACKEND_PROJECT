import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AiOutlineSearch, AiOutlineMenu, AiOutlineUser, AiOutlineSetting } from 'react-icons/ai'
import { BiVideoPlus, BiLogOut } from 'react-icons/bi'
import { MdOutlineVideoLibrary } from 'react-icons/md'

const Navbar = () => {
    const { user, logout } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    const handleLogout = async () => {
        await logout()
        setShowDropdown(false)
        navigate('/')
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <BiVideoPlus className="logo-icon" />
                <span>VideoTube</span>
            </Link>

            <form className="navbar-search" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                    <AiOutlineSearch />
                </button>
            </form>

            <div className="navbar-actions">
                {user ? (
                    <>
                        <button className="navbar-btn btn-outline" onClick={() => navigate('/dashboard')}>
                            <BiVideoPlus size={20} />
                            <span>Upload</span>
                        </button>
                        <div style={{ position: 'relative' }}>
                            <img 
                                src={user.avatar} 
                                alt={user.username} 
                                className="navbar-avatar"
                                onClick={() => setShowDropdown(!showDropdown)}
                            />
                            {showDropdown && (
                                <div className="user-dropdown">
                                    <div className="dropdown-item" style={{ cursor: 'default', pointerEvents: 'none' }}>
                                        <div style={{ fontWeight: 500 }}>{user.fullName}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>@{user.username}</div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item" onClick={() => { navigate(`/channel/${user.username}`); setShowDropdown(false); }}>
                                        <AiOutlineUser size={20} /> Your Channel
                                    </button>
                                    <button className="dropdown-item" onClick={() => { navigate('/dashboard'); setShowDropdown(false); }}>
                                        <MdOutlineVideoLibrary size={20} /> Dashboard
                                    </button>
                                    <button className="dropdown-item" onClick={() => { navigate('/settings'); setShowDropdown(false); }}>
                                        <AiOutlineSetting size={20} /> Settings
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        <BiLogOut size={20} /> Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="navbar-btn btn-outline">
                        <AiOutlineUser size={20} />
                        <span>Sign in</span>
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar
