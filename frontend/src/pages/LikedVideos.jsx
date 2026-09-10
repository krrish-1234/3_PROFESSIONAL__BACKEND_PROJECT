import { useState, useEffect } from 'react'
import { getLikedVideos } from '../api'
import VideoCard from '../components/VideoCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { AiOutlineLike } from 'react-icons/ai'

const LikedVideos = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLiked()
    }, [])

    const fetchLiked = async () => {
        try {
            const res = await getLikedVideos()
            setVideos(res.data.data.map(item => item.video))
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader />

    return (
        <div>
            <h2 className="page-header">Liked Videos</h2>
            {videos.length === 0 ? (
                <EmptyState 
                    icon={<AiOutlineLike />}
                    title="No liked videos yet"
                    message="Videos you like will appear here"
                />
            ) : (
                <div className="video-grid">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default LikedVideos
