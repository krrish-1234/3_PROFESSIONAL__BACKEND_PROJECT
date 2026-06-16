import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
/*
What is app.use()?
app.use(...)
means:
👉 “Use this middleware for all requests.”
Middleware = code that runs before request reaches route.
*/

/* credentials: true
Means:
Allow ,cookies ,login sessions ,authentication tokens
to be sent between frontend and backend.
*/

app.use(express.json({limit : "16kb"}))
// “Accept JSON data up to 16kb from frontend requests.”

app.use(express.urlencoded({extended: true, limit: "16kb"}))
// “Allow backend to read form data up to 16kb, including complex objects.”

app.use(express.static("public"))
// Makes files inside public folder accessible directly from browser.
app.use(cookieParser())
// Allows backend to read browser cookies


//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

export { app }