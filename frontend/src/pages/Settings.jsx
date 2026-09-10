import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateAccount, updateAvatar, updateCoverImage, changePassword } from '../api'
import toast from 'react-hot-toast'
import { AiOutlineCloudUpload } from 'react-icons/ai'

const Settings = () => {
    const { user, checkAuth } = useAuth()
    const [accountData, setAccountData] = useState({ fullName: user?.fullName || '', email: user?.email || '' })
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' })

    const handleUpdateAccount = async (e) => {
        e.preventDefault()
        try {
            await updateAccount(accountData)
            await checkAuth()
            toast.success('Account updated')
        } catch (error) {
            toast.error('Failed to update account')
        }
    }

    const handleAvatar = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const fd = new FormData()
        fd.append('avatar', file)
        try {
            await updateAvatar(fd)
            await checkAuth()
            toast.success('Avatar updated')
        } catch (error) {
            toast.error('Update failed')
        }
    }

    const handleCover = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const fd = new FormData()
        fd.append('coverImage', file)
        try {
            await updateCoverImage(fd)
            await checkAuth()
            toast.success('Cover updated')
        } catch (error) {
            toast.error('Update failed')
        }
    }

    const handlePassword = async (e) => {
        e.preventDefault()
        try {
            await changePassword(passData)
            setPassData({ oldPassword: '', newPassword: '' })
            toast.success('Password changed')
        } catch (error) {
            toast.error('Failed to change password')
        }
    }

    return (
        <div className="settings-page">
            <h2 className="page-header">Settings</h2>

            <div className="settings-section">
                <h3 className="settings-title">Profile Images</h3>
                <div className="settings-avatar-section">
                    <img src={user?.avatar} alt="" className="settings-avatar" />
                    <div className="file-input-wrapper">
                        <label className="btn-outline navbar-btn" style={{ cursor: 'pointer' }}>
                            <AiOutlineCloudUpload size={20} /> Update Avatar
                            <input type="file" accept="image/*" onChange={handleAvatar} />
                        </label>
                    </div>
                </div>
                <div>
                    {user?.coverImage && <img src={user.coverImage} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />}
                    <div className="file-input-wrapper">
                        <label className="btn-outline navbar-btn" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                            <AiOutlineCloudUpload size={20} /> Update Cover
                            <input type="file" accept="image/*" onChange={handleCover} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h3 className="settings-title">Account Details</h3>
                <form onSubmit={handleUpdateAccount}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input required type="text" value={accountData.fullName} onChange={e => setAccountData({...accountData, fullName: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input required type="email" value={accountData.email} onChange={e => setAccountData({...accountData, email: e.target.value})} />
                    </div>
                    <button type="submit" className="btn-primary navbar-btn">Update Account</button>
                </form>
            </div>

            <div className="settings-section">
                <h3 className="settings-title">Change Password</h3>
                <form onSubmit={handlePassword}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input required type="password" value={passData.oldPassword} onChange={e => setPassData({...passData, oldPassword: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input required type="password" value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} />
                    </div>
                    <button type="submit" className="btn-primary navbar-btn">Change Password</button>
                </form>
            </div>
        </div>
    )
}

export default Settings
