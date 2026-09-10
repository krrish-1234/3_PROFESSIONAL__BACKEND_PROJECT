import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserPlaylists, createPlaylist } from '../api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { MdOutlinePlaylistPlay } from 'react-icons/md'
import toast from 'react-hot-toast'

const Playlists = () => {
    const { user } = useAuth()
    const [playlists, setPlaylists] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' })

    useEffect(() => {
        if (user) fetchPlaylists()
    }, [user])

    const fetchPlaylists = async () => {
        try {
            const res = await getUserPlaylists(user._id)
            setPlaylists(res.data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await createPlaylist(newPlaylist)
            toast.success('Playlist created')
            setShowCreate(false)
            setNewPlaylist({ name: '', description: '' })
            fetchPlaylists()
        } catch (error) {
            toast.error('Failed to create')
        }
    }

    if (loading) return <Loader />

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 className="page-header" style={{ marginBottom: 0 }}>My Playlists</h2>
                <button className="btn-primary navbar-btn" onClick={() => setShowCreate(true)}>Create Playlist</button>
            </div>

            {playlists.length === 0 ? (
                <EmptyState 
                    icon={<MdOutlinePlaylistPlay />}
                    title="No playlists created"
                    message="Create a playlist to organize your videos"
                />
            ) : (
                <div className="video-grid">
                    {playlists.map(pl => (
                        <Link to={`/playlist/${pl._id}`} key={pl._id} className="playlist-card" style={{ flexDirection: 'column' }}>
                            <div className="playlist-thumbnail" style={{ width: '100%' }}>
                                <div className="playlist-overlay">
                                    <MdOutlinePlaylistPlay size={40} />
                                    <span>{pl.videos?.length || 0} videos</span>
                                </div>
                            </div>
                            <div className="playlist-info">
                                <h3 className="playlist-title">{pl.name}</h3>
                                <div className="playlist-meta">{pl.description}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {showCreate && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">Create Playlist</h3>
                            <button className="modal-close" onClick={() => setShowCreate(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Name</label>
                                <input required type="text" value={newPlaylist.name} onChange={e => setNewPlaylist({...newPlaylist, name: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea required value={newPlaylist.description} onChange={e => setNewPlaylist({...newPlaylist, description: e.target.value})}></textarea>
                            </div>
                            <button type="submit" className="btn-primary form-submit">Create</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Playlists
