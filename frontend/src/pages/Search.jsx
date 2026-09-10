import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllVideos } from '../api'
import VideoCard from '../components/VideoCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { AiOutlineSearch } from 'react-icons/ai'

const Search = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q')
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (query) {
            fetchResults()
        }
    }, [query])

    const fetchResults = async () => {
        try {
            setLoading(true)
            const res = await getAllVideos({ query })
            setVideos(res.data.data.docs || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader />

    return (
        <div>
            <h2 className="page-header">Search results for "{query}"</h2>
            {videos.length === 0 ? (
                <EmptyState 
                    icon={<AiOutlineSearch />}
                    title="No results found"
                    message="Try different keywords or remove search filters"
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

export default Search
