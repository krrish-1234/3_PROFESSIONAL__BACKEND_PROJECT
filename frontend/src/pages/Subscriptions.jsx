import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSubscribedChannels } from '../api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { MdOutlineSubscriptions } from 'react-icons/md'

const Subscriptions = () => {
    const { user } = useAuth()
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) fetchSubs()
    }, [user])

    const fetchSubs = async () => {
        try {
            const res = await getSubscribedChannels(user._id)
            setChannels(res.data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader />

    return (
        <div>
            <h2 className="page-header">Subscriptions</h2>
            {channels.length === 0 ? (
                <EmptyState 
                    icon={<MdOutlineSubscriptions />}
                    title="No subscriptions"
                    message="Channels you subscribe to will appear here"
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {channels.map(sub => {
                        const channel = sub.channel
                        return (
                            <div key={channel._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg-secondary)', borderRadius: 12 }}>
                                <Link to={`/channel/${channel.username}`}>
                                    <img src={channel.avatar} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                                </Link>
                                <div style={{ flex: 1 }}>
                                    <Link to={`/channel/${channel.username}`}>
                                        <h3 style={{ fontSize: 18, fontWeight: 500 }}>{channel.fullName}</h3>
                                    </Link>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>@{channel.username}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Subscriptions
