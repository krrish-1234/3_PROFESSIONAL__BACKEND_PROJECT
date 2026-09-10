import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getVideoById, toggleVideoLike, toggleSubscription, addComment, getVideoComments, getAllVideos } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatTimeAgo, formatViews } from '../utils'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import { MdOutlineVideoLibrary } from 'react-icons/md'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const VideoWatch = () => {
    const { videoId } = useParams()
    const { user } = useAuth()
    const [video, setVideo] = useState(null)
    const [suggestedVideos, setSuggestedVideos] = useState([])
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subsCount, setSubsCount] = useState(0)
    const [showFullDesc, setShowFullDesc] = useState(false)

    useEffect(() => {
        fetchVideoData()
        fetchSuggested()
    }, [videoId])

    const fetchVideoData = async () => {
        try {
            setLoading(true)
            const [videoRes, commentsRes] = await Promise.all([
                getVideoById(videoId),
                getVideoComments(videoId)
            ])
            
            const vData = videoRes.data.data
            setVideo(vData)
            setIsLiked(vData.isLiked)
            setLikesCount(vData.likesCount || 0)
            setIsSubscribed(vData.owner.isSubscribed)
            setSubsCount(vData.owner.subscribersCount || 0)
            
            setComments(commentsRes.data.data.docs || [])
        } catch (error) {
            toast.error('Error loading video')
        } finally {
            setLoading(false)
        }
    }

    const fetchSuggested = async () => {
        try {
            const res = await getAllVideos({ limit: 10 })
            setSuggestedVideos(res.data.data.docs.filter(v => v._id !== videoId))
        } catch (error) {
            console.error(error)
        }
    }

    const handleLike = async () => {
        if (!user) return toast.error('Please login to like')
        try {
            await toggleVideoLike(videoId)
            setIsLiked(!isLiked)
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
        } catch (error) {
            toast.error('Error toggling like')
        }
    }

    const handleSubscribe = async () => {
        if (!user) return toast.error('Please login to subscribe')
        if (user._id === video.owner._id) return toast.error('Cannot subscribe to yourself')
        try {
            await toggleSubscription(video.owner._id)
            setIsSubscribed(!isSubscribed)
            setSubsCount(prev => isSubscribed ? prev - 1 : prev + 1)
        } catch (error) {
            toast.error('Error toggling subscription')
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!user) return toast.error('Please login to comment')
        if (!newComment.trim()) return
        
        try {
            const res = await addComment(videoId, { content: newComment })
            setComments([res.data.data, ...comments])
            setNewComment('')
            toast.success('Comment added')
        } catch (error) {
            toast.error('Error adding comment')
        }
    }

    if (loading) return <Loader />
    if (!video) return <div>Video not found</div>

    return (
        <div className="video-page">
            <div className="video-primary">
                <div className="video-player-container">
                    <video src={video.videoFile} controls autoPlay></video>
                </div>
                
                <div className="video-info">
                    <h1 className="video-title">{video.title}</h1>
                    <div className="video-actions">
                        <div className="channel-info" style={{ border: 'none', padding: 0 }}>
                            <Link to={`/channel/${video.owner.username}`}>
                                <img src={video.owner.avatar} alt="" className="channel-avatar" />
                            </Link>
                            <div className="channel-details">
                                <Link to={`/channel/${video.owner.username}`} className="channel-name">
                                    {video.owner.fullName || video.owner.username}
                                </Link>
                                <div className="channel-subs">{subsCount} subscribers</div>
                            </div>
                            <button 
                                className={`btn-subscribe ${isSubscribed ? 'subscribed' : ''}`}
                                onClick={handleSubscribe}
                            >
                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                        </div>
                        
                        <div className="video-action-buttons">
                            <button className={`action-btn ${isLiked ? 'active' : ''}`} onClick={handleLike}>
                                {isLiked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
                                {likesCount}
                            </button>
                        </div>
                    </div>
                    
                    <div 
                        className="video-description" 
                        onClick={() => setShowFullDesc(!showFullDesc)}
                        style={{ maxHeight: showFullDesc ? 'none' : '100px', overflow: 'hidden' }}
                    >
                        <div style={{ fontWeight: 500, marginBottom: 8 }}>
                            {formatViews(video.views)} • {formatTimeAgo(video.createdAt)}
                        </div>
                        {video.description}
                    </div>
                </div>

                <div className="comments-section">
                    <h3 className="comments-header">{comments.length} Comments</h3>
                    {user && (
                        <form className="comment-form" onSubmit={handleAddComment}>
                            <img src={user.avatar} alt="" />
                            <div className="comment-form-input">
                                <input 
                                    type="text" 
                                    placeholder="Add a comment..." 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                {newComment && (
                                    <div className="comment-form-actions">
                                        <button type="button" className="btn-secondary navbar-btn" onClick={() => setNewComment('')}>Cancel</button>
                                        <button type="submit" className="btn-primary navbar-btn">Comment</button>
                                    </div>
                                )}
                            </div>
                        </form>
                    )}
                    
                    <div className="comments-list">
                        {comments.map(comment => (
                            <div key={comment._id} className="comment">
                                <img src={comment.owner.avatar} alt="" className="comment-avatar" />
                                <div className="comment-body">
                                    <div className="comment-author">
                                        @{comment.owner.username} <span>{formatTimeAgo(comment.createdAt)}</span>
                                    </div>
                                    <div className="comment-text">{comment.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="video-secondary">
                {suggestedVideos.map(sv => (
                    <Link to={`/video/${sv._id}`} key={sv._id} className="suggestion-card">
                        <div className="suggestion-thumbnail">
                            <img src={sv.thumbnail} alt="" />
                        </div>
                        <div className="suggestion-info">
                            <h4 className="suggestion-title">{sv.title}</h4>
                            <div className="suggestion-channel">{sv.owner.fullName || sv.owner.username}</div>
                            <div className="suggestion-meta">{formatViews(sv.views)} • {formatTimeAgo(sv.createdAt)}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default VideoWatch
