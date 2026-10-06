import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getChannelProfile, getAllVideos, getUserTweets, toggleSubscription, createTweet, deleteTweet } from '../api'
import { useAuth } from '../context/AuthContext'
import VideoCard from '../components/VideoCard'
import Loader from '../components/Loader'
import { MdDelete } from 'react-icons/md'
import toast from 'react-hot-toast'

const Channel = () => {
    const { username } = useParams()
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [tweets, setTweets] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('videos')
    const [newTweet, setNewTweet] = useState('')

    useEffect(() => {
        fetchProfile()
    }, [username])

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const res = await getChannelProfile(username)
            const p = res.data.data
            setProfile(p)
            
            if (p) {
                const [vRes, tRes] = await Promise.all([
                    getAllVideos({ userId: p._id }),
                    getUserTweets(p._id)
                ])
                setVideos(vRes.data.data.docs || [])
                setTweets(tRes.data.data || [])
            }
        } catch (error) {
            toast.error('Error loading profile')
        } finally {
            setLoading(false)
        }
    }

    const handleSubscribe = async () => {
        if (!user) return toast.error('Please login to subscribe')
        try {
            await toggleSubscription(profile._id)
            setProfile(prev => ({
                ...prev,
                isSubscribed: !prev.isSubscribed,
                subscribersCount: prev.isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1
            }))
        } catch (error) {
            toast.error('Error toggling subscription')
        }
    }

    const handleCreateTweet = async (e) => {
        e.preventDefault()
        if (!newTweet.trim()) return
        try {
            const res = await createTweet({ content: newTweet })
            setTweets([res.data.data, ...tweets])
            setNewTweet('')
            toast.success('Tweet posted')
        } catch (error) {
            toast.error('Error posting tweet')
        }
    }

    const handleDeleteTweet = async (tweetId) => {
        try {
            await deleteTweet(tweetId)
            setTweets(tweets.filter(t => t._id !== tweetId))
            toast.success('Tweet deleted')
        } catch (error) {
            toast.error('Error deleting tweet')
        }
    }

    if (loading) return <Loader />
    if (!profile) return <div>Channel not found</div>

    return (
        <div className="profile-page">
            {profile.coverImage && (
                <div className="profile-banner">
                    <img src={profile.coverImage} alt="" />
                </div>
            )}
            
            <div className="profile-header">
                <img src={profile.avatar} alt="" className="profile-avatar" />
                <div className="profile-info">
                    <h1 className="profile-name">{profile.fullName}</h1>
                    <div className="profile-username">@{profile.username}</div>
                    <div className="profile-stats">
                        {profile.subscribersCount} subscribers • {profile.channelsSubscribedToCount} subscribed
                    </div>
                </div>
                {user?._id !== profile._id && (
                    <button 
                        className={`btn-subscribe ${profile.isSubscribed ? 'subscribed' : ''}`}
                        onClick={handleSubscribe}
                    >
                        {profile.isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </button>
                )}
            </div>

            <div className="profile-tabs">
                <button 
                    className={`profile-tab ${activeTab === 'videos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('videos')}
                >
                    VIDEOS
                </button>
                <button 
                    className={`profile-tab ${activeTab === 'tweets' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tweets')}
                >
                    TWEETS
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'videos' && (
                    <div className="video-grid">
                        {videos.map(video => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                )}
                {activeTab === 'tweets' && (
                    <div className="tweets-list">
                        {user?._id === profile._id && (
                            <form className="tweet-card" onSubmit={handleCreateTweet} style={{padding: 16}}>
                                <textarea
                                    placeholder="What's on your mind?"
                                    value={newTweet}
                                    onChange={(e) => setNewTweet(e.target.value)}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        background: 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 8,
                                        padding: 12,
                                        resize: 'vertical',
                                        fontSize: 14
                                    }}
                                />
                                {newTweet.trim() && (
                                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8}}>
                                        <button type="button" className="btn-secondary navbar-btn" onClick={() => setNewTweet('')}>Cancel</button>
                                        <button type="submit" className="btn-primary navbar-btn">Tweet</button>
                                    </div>
                                )}
                            </form>
                        )}
                        {tweets.length === 0 ? (
                            <div style={{textAlign: 'center', padding: 40, color: 'var(--text-secondary)'}}>
                                No tweets yet
                            </div>
                        ) : (
                            tweets.map(tweet => (
                                <div key={tweet._id} className="tweet-card">
                                    <div className="tweet-header">
                                        <img src={profile.avatar} alt="" style={{width: 36, height: 36, borderRadius: '50%'}} />
                                        <div style={{flex: 1}}>
                                            <div style={{fontWeight: 500}}>{profile.fullName}</div>
                                            <div style={{fontSize: 12, color: 'var(--text-secondary)'}}>@{profile.username}</div>
                                        </div>
                                        {user?._id === profile._id && (
                                            <button
                                                className="comment-action-btn"
                                                onClick={() => handleDeleteTweet(tweet._id)}
                                                title="Delete tweet"
                                            >
                                                <MdDelete size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="tweet-content">{tweet.content}</div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Channel
