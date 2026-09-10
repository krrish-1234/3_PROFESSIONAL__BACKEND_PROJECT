import { useNavigate } from 'react-router-dom'
import { formatDuration, formatViews, formatTimeAgo } from '../utils'

const VideoCard = ({ video }) => {
    const navigate = useNavigate()

    const handleVideoClick = () => {
        navigate(`/video/${video._id}`)
    }

    const handleChannelClick = (e) => {
        e.stopPropagation()
        navigate(`/channel/${video.owner?.username}`)
    }

    return (
        <div className="video-card" onClick={handleVideoClick}>
            <div className="video-card-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <div className="video-card-duration">{formatDuration(video.duration)}</div>
            </div>
            <div className="video-card-info">
                <img 
                    src={video.owner?.avatar} 
                    alt={video.owner?.username} 
                    className="video-card-avatar"
                    onClick={handleChannelClick}
                />
                <div className="video-card-details">
                    <h3 className="video-card-title">{video.title}</h3>
                    <div 
                        className="video-card-channel"
                        onClick={handleChannelClick}
                    >
                        {video.owner?.fullName || video.owner?.username}
                    </div>
                    <div className="video-card-meta">
                        {formatViews(video.views)} • {formatTimeAgo(video.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCard
