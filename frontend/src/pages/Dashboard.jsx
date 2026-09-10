import { useState, useEffect } from 'react'
import { getChannelStats, getChannelVideos, publishVideo, deleteVideo, togglePublishStatus } from '../api'
import Loader from '../components/Loader'
import { formatDate } from '../utils'
import { BiTrash, BiEdit, BiCloudUpload } from 'react-icons/bi'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const [stats, setStats] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const [uploadData, setUploadData] = useState({ title: '', description: '' })
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [statsRes, videosRes] = await Promise.all([
                getChannelStats(),
                getChannelVideos()
            ])
            setStats(statsRes.data.data)
            setVideos(videosRes.data.data)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load dashboard')
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!videoFile || !thumbnail) return toast.error('Video and thumbnail required')
        
        try {
            setUploading(true)
            const formData = new FormData()
            formData.append('title', uploadData.title)
            formData.append('description', uploadData.description)
            formData.append('videoFile', videoFile)
            formData.append('thumbnail', thumbnail)
            
            await publishVideo(formData)
            toast.success('Video uploaded successfully')
            setShowUpload(false)
            fetchData()
        } catch (error) {
            toast.error('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return
        try {
            await deleteVideo(id)
            setVideos(videos.filter(v => v._id !== id))
            toast.success('Video deleted')
        } catch (error) {
            toast.error('Delete failed')
        }
    }

    const handleTogglePublish = async (id) => {
        try {
            await togglePublishStatus(id)
            setVideos(videos.map(v => v._id === id ? { ...v, isPublished: !v.isPublished } : v))
            toast.success('Publish status updated')
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    if (loading) return <Loader />

    return (
        <div className="dashboard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 className="page-header" style={{ marginBottom: 0 }}>Channel Dashboard</h2>
                <button className="btn-primary navbar-btn" onClick={() => setShowUpload(true)}>
                    <BiCloudUpload size={20} /> Upload Video
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats?.totalViews || 0}</div>
                    <div className="stat-label">Total Views</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats?.totalSubscribers || 0}</div>
                    <div className="stat-label">Subscribers</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats?.totalLikes || 0}</div>
                    <div className="stat-label">Total Likes</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats?.totalVideos || 0}</div>
                    <div className="stat-label">Total Videos</div>
                </div>
            </div>

            <table className="videos-table">
                <thead>
                    <tr>
                        <th>Video</th>
                        <th>Visibility</th>
                        <th>Date</th>
                        <th>Views</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map(video => (
                        <tr key={video._id}>
                            <td>
                                <div className="table-video-info">
                                    <img src={video.thumbnail} alt="" className="table-thumbnail" />
                                    <div>{video.title}</div>
                                </div>
                            </td>
                            <td>
                                <div 
                                    className={`toggle-switch ${video.isPublished ? 'active' : ''}`}
                                    onClick={() => handleTogglePublish(video._id)}
                                ></div>
                            </td>
                            <td>{formatDate(video.createdAt)}</td>
                            <td>{video.views}</td>
                            <td>
                                <div className="table-actions">
                                    <button className="btn-danger navbar-btn" onClick={() => handleDelete(video._id)}>
                                        <BiTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showUpload && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">Upload Video</h3>
                            <button className="modal-close" onClick={() => setShowUpload(false)}>×</button>
                        </div>
                        <form onSubmit={handleUpload}>
                            <div className="form-group file-input-wrapper">
                                <label>Video File</label>
                                <label className="file-input-label">
                                    <BiCloudUpload size={24} />
                                    <span>{videoFile ? videoFile.name : 'Select Video'}</span>
                                    <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                                </label>
                            </div>
                            <div className="form-group file-input-wrapper">
                                <label>Thumbnail</label>
                                <label className="file-input-label">
                                    <BiCloudUpload size={24} />
                                    <span>{thumbnail ? thumbnail.name : 'Select Thumbnail'}</span>
                                    <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
                                </label>
                            </div>
                            <div className="form-group">
                                <label>Title</label>
                                <input required type="text" value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea required value={uploadData.description} onChange={e => setUploadData({...uploadData, description: e.target.value})}></textarea>
                            </div>
                            <button type="submit" className="btn-primary form-submit" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
