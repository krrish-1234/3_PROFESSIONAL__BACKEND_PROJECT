import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI
        // Handle Atlas URIs with query params
        let connectionString
        if (uri.includes('?')) {
            const [base, params] = uri.split('?')
            const cleanBase = base.replace(/\/+$/, '') // remove trailing slashes
            connectionString = `${cleanBase}/${DB_NAME}?${params}`
        } else {
            const cleanUri = uri.replace(/\/+$/, '')
            connectionString = `${cleanUri}/${DB_NAME}`
        }
        const connectionInstance = await mongoose.connect(connectionString)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB