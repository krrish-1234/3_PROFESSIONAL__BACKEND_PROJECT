import { useState, useEffect } from 'react'
import { getWatchHistory } from '../api'
import VideoCard from '../components/VideoCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { MdOutlineHistory } from 'react-icons/md'

const History = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const res = await getWatchHistory()
            setVideos(res.data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader />

    return (
        <div>
            <h2 className="page-header">Watch History</h2>
            {videos.length === 0 ? (
                <EmptyState 
                    icon={<MdOutlineHistory />}
                    title="No watch history"
                    message="Videos you watch will appear here"
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

export default History
