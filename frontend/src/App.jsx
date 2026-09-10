import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import VideoWatch from './pages/VideoWatch'
import Channel from './pages/Channel'
import Search from './pages/Search'
import LikedVideos from './pages/LikedVideos'
import History from './pages/History'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Playlists from './pages/Playlists'
import PlaylistView from './pages/PlaylistView'
import Subscriptions from './pages/Subscriptions'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster position="top-right" toastOptions={{ className: 'toast-custom' }} />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Layout><Home /></Layout>} />
                    <Route path="/video/:videoId" element={<Layout><VideoWatch /></Layout>} />
                    <Route path="/channel/:username" element={<Layout><Channel /></Layout>} />
                    <Route path="/search" element={<Layout><Search /></Layout>} />
                    <Route path="/liked-videos" element={<Layout><ProtectedRoute><LikedVideos /></ProtectedRoute></Layout>} />
                    <Route path="/history" element={<Layout><ProtectedRoute><History /></ProtectedRoute></Layout>} />
                    <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
                    <Route path="/settings" element={<Layout><ProtectedRoute><Settings /></ProtectedRoute></Layout>} />
                    <Route path="/playlists" element={<Layout><ProtectedRoute><Playlists /></ProtectedRoute></Layout>} />
                    <Route path="/playlist/:playlistId" element={<Layout><PlaylistView /></Layout>} />
                    <Route path="/subscriptions" element={<Layout><ProtectedRoute><Subscriptions /></ProtectedRoute></Layout>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
