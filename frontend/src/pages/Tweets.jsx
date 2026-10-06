import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllTweets, createTweet, deleteTweet, toggleTweetLike } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatTimeAgo } from '../utils'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Tweets = () => {
    const { user } = useAuth()
    const [tweets, setTweets] = useState([])
    const [newTweet, setNewTweet] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTweets()
    }, [])

    const fetchTweets = async () => {
        try {
            setLoading(true)
            const res = await getAllTweets()
            setTweets(res.data.data || [])
        } catch (error) {
            toast.error('Error loading tweets')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTweet = async (e) => {
        e.preventDefault()
        if (!newTweet.trim()) return
        try {
            const res = await createTweet({ content: newTweet })
            const created = res.data.data
            // Add owner info for display since backend returns raw tweet
            created.owner = {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                avatar: user.avatar
            }
            created.likesCount = 0
            created.isLiked = false
            setTweets([created, ...tweets])
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

    const handleLikeTweet = async (tweetId) => {
        if (!user) return toast.error('Please login to like')
        try {
            const res = await toggleTweetLike(tweetId)
            const newIsLiked = res.data.data.isLiked
            setTweets(tweets.map(t => {
                if (t._id === tweetId) {
                    return {
                        ...t,
                        isLiked: newIsLiked,
                        likesCount: newIsLiked ? t.likesCount + 1 : Math.max(0, t.likesCount - 1)
                    }
                }
                return t
            }))
        } catch (error) {
            toast.error('Error toggling like')
        }
    }

    if (loading) return <Loader />

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px' }}>
            <h2 style={{ marginBottom: 20 }}>Tweets</h2>

            {user && (
                <form className="tweet-card" onSubmit={handleCreateTweet} style={{ padding: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <img src={user.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                        <textarea
                            placeholder="What's on your mind?"
                            value={newTweet}
                            onChange={(e) => setNewTweet(e.target.value)}
                            rows={3}
                            style={{
                                flex: 1,
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 8,
                                padding: 12,
                                resize: 'vertical',
                                fontSize: 14
                            }}
                        />
                    </div>
                    {newTweet.trim() && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                            <button type="button" className="btn-secondary navbar-btn" onClick={() => setNewTweet('')}>Cancel</button>
                            <button type="submit" className="btn-primary navbar-btn">Tweet</button>
                        </div>
                    )}
                </form>
            )}

            {tweets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
                    No tweets yet. Be the first to post!
                </div>
            ) : (
                tweets.map(tweet => (
                    <div key={tweet._id} className="tweet-card" style={{ marginBottom: 12 }}>
                        <div className="tweet-header">
                            <Link to={`/channel/${tweet.owner?.username}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <img src={tweet.owner?.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                                <div>
                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{tweet.owner?.fullName}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                        @{tweet.owner?.username} • {formatTimeAgo(tweet.createdAt)}
                                    </div>
                                </div>
                            </Link>
                            {user?._id === tweet.owner?._id && (
                                <button
                                    className="comment-action-btn"
                                    onClick={() => handleDeleteTweet(tweet._id)}
                                    title="Delete tweet"
                                    style={{ marginLeft: 'auto' }}
                                >
                                    <MdDelete size={18} />
                                </button>
                            )}
                        </div>
                        <div className="tweet-content">{tweet.content}</div>
                        <div className="tweet-actions">
                            <button
                                className={`comment-action-btn ${tweet.isLiked ? 'active' : ''}`}
                                onClick={() => handleLikeTweet(tweet._id)}
                            >
                                {tweet.isLiked ? <AiFillLike size={16} /> : <AiOutlineLike size={16} />}
                                {tweet.likesCount > 0 && <span>{tweet.likesCount}</span>}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default Tweets
