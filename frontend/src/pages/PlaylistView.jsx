import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPlaylistById } from '../api'
import VideoCard from '../components/VideoCard'
import Loader from '../components/Loader'
import { formatDate } from '../utils'

const PlaylistView = () => {
    const { playlistId } = useParams()
    const [playlist, setPlaylist] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPlaylist()
    }, [playlistId])

    const fetchPlaylist = async () => {
        try {
            const res = await getPlaylistById(playlistId)
            setPlaylist(res.data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader />
    if (!playlist) return <div>Playlist not found</div>

    return (
        <div>
            <div style={{ marginBottom: 32, padding: 24, background: 'var(--bg-secondary)', borderRadius: 12 }}>
                <h1 style={{ fontSize: 32, marginBottom: 8 }}>{playlist.name}</h1>
                <div style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                    {playlist.videos?.length || 0} videos • Created on {formatDate(playlist.createdAt)}
                </div>
                <div style={{ fontSize: 14 }}>{playlist.description}</div>
            </div>

            <div className="video-grid">
                {playlist.videos?.map(video => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
        </div>
    )
}

export default PlaylistView
