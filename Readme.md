# 🎬 VideoTube - Full-Stack Video Sharing Platform

A complete YouTube-inspired video sharing platform built with **React**, **Node.js**, **Express.js**, and **MongoDB**. Users can upload videos, create tweets (community posts), subscribe to channels, create playlists, like content, comment on videos, and manage their channel through a creator dashboard.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react)
![Tech Stack](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Tech Stack](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)
![Tech Stack](https://img.shields.io/badge/JWT-Authentication-orange?logo=jsonwebtokens)
![Tech Stack](https://img.shields.io/badge/Cloudinary-Media_Storage-blue?logo=cloudinary)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [MongoDB Models](#-mongodb-models)
- [API Documentation](#-api-documentation)
- [Authentication Flow](#-authentication-flow)
- [Environment Variables](#-environment-variables)
- [Installation](#-installation)
- [Running Locally](#-running-locally)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)

---

## 🎯 Problem Statement

Build a full-stack video sharing platform where users can:
- Upload and share videos with the community
- Interact through likes, comments, and community posts (tweets)
- Subscribe to channels and build a following
- Organize content with playlists
- Track their viewing history
- Manage their channel through a dedicated dashboard

---

## ✨ Features

### User Management
- ✅ User registration with avatar and cover image
- ✅ Login with email or username
- ✅ JWT-based authentication (access + refresh tokens)
- ✅ Profile management (update details, avatar, cover image)
- ✅ Password change
- ✅ Channel profiles with subscriber counts

### Video Platform
- ✅ Video upload with thumbnail to Cloudinary
- ✅ Video playback with view tracking
- ✅ Search videos by title/description
- ✅ Sort and filter videos
- ✅ Edit video details and thumbnail
- ✅ Toggle publish/unpublish
- ✅ Delete videos (with Cloudinary cleanup)

### Social Features
- ✅ Like/unlike videos, comments, and tweets
- ✅ Comment on videos (add, edit, delete)
- ✅ Subscribe/unsubscribe to channels
- ✅ Community posts (tweets) - create, edit, delete
- ✅ View liked videos

### Content Organization
- ✅ Create and manage playlists
- ✅ Add/remove videos from playlists
- ✅ Watch history tracking
- ✅ Bookmarked/liked videos page

### Creator Dashboard
- ✅ Channel statistics (views, subscribers, likes, videos)
- ✅ Video management table
- ✅ Toggle publish status
- ✅ Upload new videos

### Frontend
- ✅ Modern dark theme (YouTube-inspired)
- ✅ Responsive design
- ✅ Protected routes
- ✅ Loading states, error handling, empty states
- ✅ Form validation
- ✅ Toast notifications

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios, React Icons, React Hot Toast |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB Atlas, Mongoose 9 |
| **Authentication** | JWT (Access + Refresh Tokens), bcrypt |
| **File Storage** | Cloudinary (media), Multer (local staging) |
| **Dev Tools** | Nodemon, Prettier |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  (Vite + React Router + Axios + Context API)            │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST API
                         │ (JSON + FormData)
                         │ Cookies (httpOnly)
┌────────────────────────▼────────────────────────────────┐
│                   Express.js Backend                     │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────────┐│
│  │  Routes   │→│ Middleware  │→│    Controllers        ││
│  │          │  │ (Auth/JWT)  │  │ (Business Logic)     ││
│  │          │  │ (Multer)    │  │                      ││
│  └──────────┘  └────────────┘  └──────────┬───────────┘│
│                                            │            │
│  ┌──────────────────┐  ┌──────────────────▼───────────┐│
│  │  Utils            │  │     Mongoose Models          ││
│  │ (ApiError,        │  │  (User, Video, Tweet,        ││
│  │  ApiResponse,     │  │   Comment, Like, Playlist,   ││
│  │  asyncHandler,    │  │   Subscription)              ││
│  │  Cloudinary)      │  └──────────────────┬───────────┘│
│  └──────────────────┘                      │            │
└────────────────────────────────────────────┼────────────┘
                                             │
┌────────────────────────────────────────────▼────────────┐
│                    MongoDB Atlas                         │
│                  (Database: videotube)                   │
└─────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                     Cloudinary CDN                       │
│              (Videos, Thumbnails, Avatars)               │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
VideoTube/
├── public/
│   └── temp/                    # Temporary file uploads (multer staging)
├── src/
│   ├── controllers/
│   │   ├── user.controller.js      # Auth, profile, channel, watch history
│   │   ├── video.controller.js     # CRUD, search, pagination, publish toggle
│   │   ├── tweet.controller.js     # Community posts CRUD
│   │   ├── comment.controller.js   # Video comments CRUD + pagination
│   │   ├── like.controller.js      # Toggle likes for video/comment/tweet
│   │   ├── playlist.controller.js  # Playlist CRUD, add/remove videos
│   │   ├── subscription.controller.js  # Subscribe/unsubscribe, lists
│   │   ├── dashboard.controller.js # Channel stats, video management
│   │   └── healthcheck.controller.js
│   ├── db/
│   │   └── index.js                # MongoDB connection with Mongoose
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification middleware
│   │   └── multer.middleware.js     # File upload configuration
│   ├── models/
│   │   ├── user.model.js           # User schema with JWT & bcrypt methods
│   │   ├── video.model.js          # Video schema with aggregate pagination
│   │   ├── tweet.model.js          # Tweet/community post schema
│   │   ├── comment.model.js        # Comment schema with pagination
│   │   ├── like.model.js           # Polymorphic like (video/comment/tweet)
│   │   ├── playlist.model.js       # Playlist with video array
│   │   └── subscription.model.js   # Subscriber-channel relationship
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   ├── tweet.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── dashboard.routes.js
│   │   └── healthcheck.routes.js
│   ├── utils/
│   │   ├── ApiError.js             # Custom error class
│   │   ├── ApiResponse.js          # Standard response wrapper
│   │   ├── asyncHandler.js         # Async error catcher
│   │   └── cloudinary.js           # Upload & delete from Cloudinary
│   ├── app.js                      # Express app configuration
│   ├── constants.js                # App constants (DB_NAME)
│   └── index.js                    # Server entry point
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js            # Axios API service layer
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top navigation with search
│   │   │   ├── Sidebar.jsx          # Left sidebar navigation
│   │   │   ├── Layout.jsx           # Page layout wrapper
│   │   │   ├── VideoCard.jsx        # Video thumbnail card
│   │   │   ├── Loader.jsx           # Loading spinner
│   │   │   ├── EmptyState.jsx       # Empty state display
│   │   │   └── ProtectedRoute.jsx   # Auth guard component
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Video feed
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── Register.jsx         # Registration form
│   │   │   ├── VideoWatch.jsx       # Video player + comments
│   │   │   ├── Channel.jsx          # Channel profile page
│   │   │   ├── Search.jsx           # Search results
│   │   │   ├── Dashboard.jsx        # Creator dashboard
│   │   │   ├── Settings.jsx         # Profile settings
│   │   │   ├── LikedVideos.jsx      # Liked videos list
│   │   │   ├── History.jsx          # Watch history
│   │   │   ├── Playlists.jsx        # User playlists
│   │   │   ├── PlaylistView.jsx     # Single playlist view
│   │   │   └── Subscriptions.jsx    # Subscribed channels
│   │   ├── utils/
│   │   │   └── index.js            # Format helpers
│   │   ├── App.jsx                  # Router configuration
│   │   ├── main.jsx                 # App entry point
│   │   └── index.css                # Global styles (dark theme)
│   ├── index.html
│   ├── vite.config.js               # Vite + API proxy config
│   └── package.json
├── .env.sample                      # Environment variable template
├── .env                             # Actual environment variables (gitignored)
├── .gitignore
├── package.json
└── Readme.md
```

---

## 🗃 MongoDB Models

### Entity Relationship Diagram

```
User ──────────┬──────── Video
  │            │           │
  │ watchHistory│    owner  │
  │            │           │
  ├── Subscription         ├── Comment
  │  (subscriber ↔ channel)│  (video + owner)
  │                        │
  ├── Tweet                ├── Like
  │  (owner)               │  (video/comment/tweet + likedBy)
  │                        │
  └── Playlist             │
     (owner + videos[])    │
```

### Model Details

| Model | Key Fields | Relationships |
|-------|-----------|---------------|
| **User** | username, email, fullName, avatar, coverImage, password, refreshToken, watchHistory[] | Has many Videos, Tweets, Playlists, Comments, Likes |
| **Video** | title, description, videoFile, thumbnail, duration, views, isPublished, owner | Belongs to User, Has many Comments, Likes |
| **Tweet** | content, owner | Belongs to User, Has many Likes |
| **Comment** | content, video, owner | Belongs to Video & User, Has many Likes |
| **Like** | video/comment/tweet (polymorphic), likedBy | Belongs to User + target entity |
| **Playlist** | name, description, videos[], owner | Belongs to User, Has many Videos |
| **Subscription** | subscriber, channel | Many-to-many between Users |

---

## 📡 API Documentation

### Base URL: `/api/v1`

### User Routes (`/users`)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/register` | No | Register new user (multipart: avatar, coverImage) |
| POST | `/login` | No | Login with email/username + password |
| POST | `/logout` | Yes | Logout and clear tokens |
| POST | `/refresh-token` | No | Refresh access token |
| POST | `/change-password` | Yes | Change password |
| GET | `/current-user` | Yes | Get current user details |
| PATCH | `/update-account` | Yes | Update fullName and email |
| PATCH | `/avatar` | Yes | Update avatar image |
| PATCH | `/cover-image` | Yes | Update cover image |
| GET | `/c/:username` | Yes | Get channel profile |
| GET | `/history` | Yes | Get watch history |

### Video Routes (`/videos`)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/` | Yes | Get all videos (query, sort, paginate) |
| POST | `/` | Yes | Upload video (multipart: videoFile, thumbnail) |
| GET | `/:videoId` | Yes | Get video by ID (increments views) |
| PATCH | `/:videoId` | Yes | Update video details/thumbnail |
| DELETE | `/:videoId` | Yes | Delete video + Cloudinary assets |
| PATCH | `/toggle/publish/:videoId` | Yes | Toggle publish status |

### Tweet Routes (`/tweets`)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/` | Yes | Create tweet |
| GET | `/user/:userId` | Yes | Get user's tweets |
| PATCH | `/:tweetId` | Yes | Update tweet |
| DELETE | `/:tweetId` | Yes | Delete tweet |

### Comment Routes (`/comments`)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/:videoId` | Yes | Get video comments (paginated) |
| POST | `/:videoId` | Yes | Add comment to video |
| PATCH | `/c/:commentId` | Yes | Update comment |
| DELETE | `/c/:commentId` | Yes | Delete comment |

### Like Routes (`/likes`)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/toggle/v/:videoId` | Yes | Toggle video like |
| POST | `/toggle/c/:commentId` | Yes | Toggle comment like |
| POST | `/toggle/t/:tweetId` | Yes | Toggle tweet like |
| GET | `/videos` | Yes | Get liked videos |

### Playlist Routes (`/playlist`)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/` | Yes | Create playlist |
| GET | `/:playlistId` | Yes | Get playlist by ID |
| PATCH | `/:playlistId` | Yes | Update playlist |
| DELETE | `/:playlistId` | Yes | Delete playlist |
| PATCH | `/add/:videoId/:playlistId` | Yes | Add video to playlist |
| PATCH | `/remove/:videoId/:playlistId` | Yes | Remove video from playlist |
| GET | `/user/:userId` | Yes | Get user's playlists |

### Subscription Routes (`/subscriptions`)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/c/:channelId` | Yes | Toggle subscription |
| GET | `/c/:channelId` | Yes | Get channel subscribers |
| GET | `/u/:subscriberId` | Yes | Get subscribed channels |

### Dashboard Routes (`/dashboard`)
| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET | `/stats` | Yes | Get channel statistics |
| GET | `/videos` | Yes | Get channel videos |

---

## 🔐 Authentication Flow

```
Registration:
  Client → POST /users/register (FormData) → Express → Validate → Hash Password → MongoDB → Response

Login:
  Client → POST /users/login → Express → Find User → Verify Password (bcrypt)
    → Generate Access Token (JWT, 1 day)
    → Generate Refresh Token (JWT, 10 days)
    → Save Refresh Token in DB
    → Set httpOnly Cookies
    → Response (user + tokens)

Protected Request:
  Client → Request with Cookie → Auth Middleware
    → Extract Token → jwt.verify()
    → Find User in DB → Attach to req.user → Controller

Token Refresh:
  Client → POST /users/refresh-token → Verify Refresh Token
    → Match with DB → Generate New Tokens → Update Cookie → Response

Logout:
  Client → POST /users/logout → Auth Middleware
    → Remove Refresh Token from DB → Clear Cookies → Response
```

---

## ⚙ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your-access-token-secret-here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 📦 Installation

### Prerequisites
- Node.js v18+ 
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Git

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/krrish-1234/3_PROFESSIONAL__BACKEND_PROJECT.git
cd 3_PROFESSIONAL__BACKEND_PROJECT

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Create .env file
cp .env.sample .env
# Edit .env with your actual credentials
```

---

## 🚀 Running Locally

### Start Backend (Terminal 1)
```bash
npm run dev
# Server runs at http://localhost:8000
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# Frontend runs at http://localhost:5173
```

### Access the Application
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

### Manual Test Flow
1. **Register** a new user at `/register` (with avatar image)
2. **Login** with your credentials
3. **Upload** a video from the Dashboard
4. **Watch** the video on the home page
5. **Like** the video and add a **comment**
6. **Create** a community post (tweet)
7. **Subscribe** to your own channel (via another account)
8. **Create** a playlist and add videos
9. Check **Dashboard** for stats
10. Update **Settings** (profile details, avatar)

### API Testing
Use Postman or similar tool to test individual endpoints at `http://localhost:8000/api/v1/`.

### Health Check
```bash
curl http://localhost:8000/api/v1/healthcheck
```

---

## 🌐 Deployment

### Backend Deployment (e.g., Render, Railway)
1. Set all environment variables
2. Build command: `npm install`
3. Start command: `npm start`

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set `VITE_API_URL` environment variable to your backend URL

### Docker (Optional)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

---

## 🔮 Future Improvements

- [ ] Video transcoding and adaptive streaming (HLS)
- [ ] Real-time notifications with WebSockets
- [ ] Password reset via email
- [ ] Video categories and tags
- [ ] Advanced search with filters
- [ ] User-to-user messaging
- [ ] Video analytics (watch time, retention)
- [ ] Content moderation/reporting
- [ ] Infinite scroll pagination
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)
- [ ] Video recommendations engine
- [ ] Rate limiting and DDoS protection
- [ ] Automated testing (Jest + React Testing Library)

---

## 👨‍💻 Author

**Krrish** - [GitHub](https://github.com/krrish-1234)

---

## 📄 License

ISC License

---

*Built with ❤️ using the MERN-adjacent stack (MongoDB, Express.js, React, Node.js)*
