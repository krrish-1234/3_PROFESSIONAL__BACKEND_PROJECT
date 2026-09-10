import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath) // Remove local file after successful upload
        return response;
    } catch (error) {
        try { fs.unlinkSync(localFilePath) } catch(e) {} // Remove local file on error too
        return null;
    }
}

const deleteFromCloudinary = async (publicUrl) => {
    try {
        if (!publicUrl) return null
        // Extract public_id from URL
        const parts = publicUrl.split('/')
        const fileWithExt = parts[parts.length - 1]
        const publicId = fileWithExt.split('.')[0]
        const result = await cloudinary.uploader.destroy(publicId)
        return result
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error)
        return null
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}