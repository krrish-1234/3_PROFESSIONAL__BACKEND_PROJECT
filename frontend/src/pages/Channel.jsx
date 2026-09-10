import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getChannelProfile, getAllVideos, getUserTweets, toggleSubscription } from '../api'
import { useAuth } from '../context/AuthContext'
import VideoCard from '../components/VideoCard'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Channel = () => {
    const { username } = useParams()
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [tweets, setTweets] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('videos')

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
                        {tweets.map(tweet => (
                            <div key={tweet._id} className="tweet-card">
                                <div className="tweet-header">
                                    <img src={profile.avatar} alt="" style={{width: 36, height: 36, borderRadius: '50%'}} />
                                    <div>
                                        <div style={{fontWeight: 500}}>{profile.fullName}</div>
                                        <div style={{fontSize: 12, color: 'var(--text-secondary)'}}>@{profile.username}</div>
                                    </div>
                                </div>
                                <div className="tweet-content">{tweet.content}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Channel
