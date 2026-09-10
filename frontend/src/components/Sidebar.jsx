import { NavLink } from 'react-router-dom'
import { AiOutlineHome, AiOutlineLike } from 'react-icons/ai'
import { MdOutlineHistory, MdOutlineVideoLibrary, MdOutlineSubscriptions, MdOutlinePlaylistPlay } from 'react-icons/md'

const Sidebar = () => {
    return (
        <div className="sidebar">
            <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <AiOutlineHome />
                <span>Home</span>
            </NavLink>
            <div className="sidebar-divider"></div>
            <NavLink to="/liked-videos" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <AiOutlineLike />
                <span>Liked Videos</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <MdOutlineHistory />
                <span>History</span>
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <MdOutlineVideoLibrary />
                <span>My Content</span>
            </NavLink>
            <NavLink to="/subscriptions" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <MdOutlineSubscriptions />
                <span>Subscriptions</span>
            </NavLink>
            <NavLink to="/playlists" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                <MdOutlinePlaylistPlay />
                <span>Playlists</span>
            </NavLink>
        </div>
    )
}

export default Sidebar
