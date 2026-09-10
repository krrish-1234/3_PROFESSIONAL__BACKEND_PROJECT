import { useState, useEffect } from 'react'
import { getAllVideos } from '../api'
import VideoCard from '../components/VideoCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { MdOutlineVideoLibrary } from 'react-icons/md'

const Home = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        try {
            const res = await getAllVideos()
            setVideos(res.data.data.docs || [])
        } catch (error) {
            console.error('Error fetching videos:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader />

    if (videos.length === 0) {
        return (
            <EmptyState 
                icon={<MdOutlineVideoLibrary />}
                title="No videos found"
                message="There are no videos available at the moment."
            />
        )
    }

    return (
        <div className="video-grid">
            {videos.map(video => (
                <VideoCard key={video._id} video={video} />
            ))}
        </div>
    )
}

export default Home
