# AI Image Upscaler

A modern, full-stack web application that leverages AI-powered image enhancement to upscale images by 2x, 3x, or 4x while preserving quality. Built with a focus on user experience, performance, and scalability.

##  Project Approach

### Architecture Overview
The application follows a **client-server architecture** with clear separation of concerns:

**Frontend (React + Vite)**
- Single-page application with component-based architecture
- Real-time preview and before/after comparison
- Responsive design with glassmorphism UI
- Client-side validation and error handling
- LocalStorage for guest user tracking and history persistence

**Backend (Node.js + Express)**
- RESTful API architecture
- Cloudinary integration for AI-powered image processing
- Google OAuth 2.0 for authentication
- MongoDB for user data and usage tracking
- Session-based authentication with cookies

### Core Technical Decisions

**1. AI Processing Strategy**
- **Cloudinary's `gen_restore` transformation**: Chose this over custom models for reliability, scalability, and professional-grade results
- **Server-side processing**: All AI operations happen on the backend to protect API keys and manage resources efficiently
- **Progressive enhancement**: Graceful fallback to mock mode when server is unavailable

**2. User Experience Flow**
```
Upload → Validate → Preview → Select Scale → Process (AI) → Compare → Download/History
```
- Drag-and-drop + file picker for flexibility
- Real-time validation (file type, size)
- Visual feedback at every step (loading states, toast notifications)
- Before/after slider for quality comparison

**3. Authentication & Usage Management**
- **Guest users**: 2 uploads/day with localStorage tracking and daily reset
- **Authenticated users**: Unlimited uploads with server-side tracking
- **Google OAuth**: Industry-standard authentication for security and convenience
- **User-specific history**: Separate localStorage keys per user ID to prevent data mixing

**4. Performance Optimizations**
- Lazy loading and code splitting
- Image optimization with Cloudinary transformations
- Client-side caching for history images
- Debounced API calls
- Framer Motion for smooth animations

**5. Error Handling Strategy**
- **Client-side validation**: Pre-flight checks before API calls
- **Specific error messages**: HTTP status-based user-friendly error messages (429, 413, 415, 401, 500)
- **Network resilience**: Automatic fallback to mock mode when server is unreachable
- **Visual feedback**: Toast notifications for all user actions

### Security Considerations
- Environment variables for sensitive credentials
- CORS configuration for API protection
- Secure session cookies with httpOnly flag
- Input validation on both client and server
- File type and size restrictions
- Rate limiting via usage tracking

---

##  Tech Stack

### Frontend
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React 19** | UI Framework | Component reusability, virtual DOM for performance, massive ecosystem |
| **Vite** | Build Tool | Lightning-fast HMR, optimized production builds, modern ES modules |
| **Framer Motion** | Animations | Smooth, performant animations with declarative API |
| **Lucide React** | Icons | Modern, customizable icon library with tree-shaking |
| **Sonner** | Toast Notifications | Beautiful, accessible toast notifications out of the box |

### Backend
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Node.js** | Runtime | JavaScript full-stack, non-blocking I/O for performance |
| **Express.js** | Web Framework | Minimal, flexible, industry-standard for Node.js APIs |
| **Passport.js** | Authentication | Robust OAuth strategies, session management |
| **Cloudinary** | Image Processing | AI-powered transformations, CDN delivery, scalable infrastructure |

### Development Tools
- **ESLint** - Code quality and consistency
- **Git** - Version control
- **Postman** - API testing (development)

### Why This Stack?

**Modern JavaScript Everywhere**
- Single language (JavaScript/JSX) across frontend and backend reduces context switching

**Performance First**
- Vite's instant HMR improves developer experience
- React's virtual DOM and Framer Motion's hardware acceleration ensure smooth UX
- Cloudinary CDN for fast global image delivery

**Scalability**
- Cloudinary handles AI processing load
- Express.js can easily scale with clustering

**Developer Experience**
- Hot module replacement for instant feedback
- Rich ecosystem and documentation

---

##  Setup Instructions

### Prerequisites
- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **Cloudinary Account** - [Sign up free](https://cloudinary.com/)
- **Google Cloud Console** - For OAuth credentials

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/AI_Image_Scale.git
cd AI_Image_Scale
```

### 2. Install Dependencies

**Install root dependencies:**
```bash
npm install
```

**Install client dependencies:**
```bash
cd client
npm install
cd ..
```

**Install server dependencies:**
```bash
cd server
npm install
cd ..
```

### 3. Environment Configuration

#### Server Environment Variables
Create `server/.env` file:
```env

# Cloudinary (get from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server
PORT=3002
CLIENT_URL=http://localhost:5173

# Session (generate a random string)
SESSION_SECRET=your_super_secret_session_key_here
```

#### Client Environment Variables (Optional)
Create `client/.env` file if needed:
```env
RENDER_API_URL= YOUR RENDER API URL
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Authorized redirect URIs**:
   ```
   http://localhost:3002/auth/google/callback
   ```
6. Copy **Client ID** and **Client Secret** to your `.env` file


**Windows:**
```bash
mongod
```

### 6. Run the Application

**Option 1: Run both with one command (from root)**
```bash
npm run dev
```

**Option 2: Run separately (recommended for debugging)**

**Terminal 1 - Start Backend:**
```bash
cd server
npm run start
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3002

### 8. Test the Setup

1. Upload an image (should work in mock mode if Cloudinary isn't configured)
2. Try Google login (requires OAuth setup)
3. Check browser console for any errors

---

### Common Setup Issues

**Google OAuth Not Working**
- Verify callback URL matches exactly
- Check CLIENT_URL in server `.env`
- Clear browser cookies and try again

**Cloudinary Upload Fails**
- Verify credentials in `.env`
- Check Cloudinary dashboard for API limits
- Application falls back to mock mode if Cloudinary unavailable

**Port Already in Use**
- Change `PORT` in server `.env`
- Update `VITE_API_URL` in client accordingly
- Kill process using port: `npx kill-port 3002`

---

##  Challenges & Solutions

### 1. **Image URL Persistence Across Sessions**
**Challenge**: Initially used blob URLs for preview images, which became invalid after page refresh, causing history images to fail loading.

**Solution**: 
- Switched to storing permanent Cloudinary URLs in localStorage instead of blob URLs
- Stored original filename instead of temporary blob URL for reference
- Implemented robust error handling in ComparisonSlider to catch and display failed image loads

**Learning**: Blob URLs are session-scoped. Always use permanent URLs for data persistence.

---

### 2. **User-Specific History Management**
**Challenge**: All users on the same browser shared the same localStorage history, causing privacy issues and data confusion.

**Solution**:
- Implemented user-specific localStorage keys: `image_upscale_history_user_{userId}`
- Separate key for guests: `image_upscale_history_guest`
- Updated `useImageHistory` hook to accept `userId` and automatically reload when user changes

**Learning**: LocalStorage is browser-specific, not user-specific. Always namespace data by user ID.

---

### 3. **Guest Usage Tracking Without Database**
**Challenge**: Needed to limit guest uploads (2/day) without requiring authentication or server-side storage.

**Solution**:
- Implemented localStorage-based daily counter with automatic midnight reset
- Store both `daily_usage_count` and `usage_date`
- Compare dates on each load to determine if reset is needed
- Smart fallback: logged-in users use server data, guests use localStorage

**Learning**: Client-side state management can effectively handle simple rate limiting for non-critical features.

---

### 4. **Graceful Error Handling & Fallbacks**
**Challenge**: App should work even when Cloudinary/server is unavailable, but still provide good UX.

**Solution**:
- Implemented specific HTTP status code handlers (429, 413, 415, 401, 500)
- Created user-friendly error messages for each scenario
- Automatic fallback to mock mode when server unreachable
- Toast notifications for all states (loading, success, error)

**Learning**: Progressive enhancement and graceful degradation are key for production apps.

---

### 5. **Property Name Mismatches Between Services**
**Challenge**: Backend returned `resultWidth`/`resultHeight`, but frontend was expecting `width`/`height`, causing display bugs.

**Solution**:
- Carefully mapped API response properties in `upscaleService.js`
- Updated all components to use consistent property names
- Added TypeScript-style JSDoc comments for better autocomplete (future improvement)

**Learning**: Establishing clear API contracts and using TypeScript prevents these issues.

---

### 6. **Toast Notifications Overlapping Navbar**
**Challenge**: Toast messages appeared behind the fixed navbar, making them hard to read.

**Solution**:
- Added `offset="80px"` to Toaster component configuration
- Adjusted positioning to account for navbar height
- Tested across different viewport sizes

**Learning**: Fixed/sticky elements require careful z-index and positioning management.

---

##  Time Spent

**Total Time**: ~17 ~ 20 hours

**Breakdown**:
- **Initial Setup & Architecture** (3 hours)
  - Project scaffolding with Vite
  - Backend Express setup
  
- **Core Features Implementation** (8 hours)
  - File upload with drag-and-drop
  - Cloudinary integration
  - Before/after comparison slider
  - Settings panel with scale options
  - Download functionality

- **Authentication & User Management** (2 hours)
  - Google OAuth integration
  - Session management
  - Usage tracking (server + localStorage)

- **UI/UX Polish** (4 hours)
  - Glassmorphism design system
  - Framer Motion animations
  - Toast notifications
  - Error states and loading indicators
  - Responsive design

- **Bug Fixes & Refinements** (2 hours)
  - Image persistence issues
  - User-specific history
  - Error handling improvements
  - Property name corrections

---

##  Future Improvements

### High Priority
1. **TypeScript Migration**
   - Add type safety across entire codebase
   - Prevent property mismatch issues
   - Better developer experience with autocomplete

2. **Image Processing Queue**
   - Implement job queue (Bull/BullMQ) for async processing
   - Handle multiple concurrent uploads
   - Better error recovery

3. **Progressive Web App (PWA)**
   - Add service worker for offline support
   - Install prompt for mobile users
   - Cache processed images locally

### Medium Priority
4. **Advanced Features**
   - Batch upload processing
   - Image format conversion (PNG → JPG, etc.)
   - Custom enhancement presets (sharpen, denoise, etc.)
   - Image cropping before upscaling

5. **Performance Optimizations**
   - Implement lazy loading for history images
   - Add image compression before upload
   - WebP format support for better compression
   - CDN caching strategies

6. **Social Features**
   - Public gallery of upscaled images
   - Share results on social media
   - Before/after comparison embeds

### Nice to Have
7. **Admin Dashboard**
   - Usage statistics and analytics
   - User management
   - API usage monitoring
   - Error tracking (Sentry integration)

8. **Testing**
   - Unit tests for critical functions
   - Integration tests for API endpoints
   - E2E tests with Playwright/Cypress
   - Visual regression testing

9. **Enhanced UX**
    - Keyboard shortcuts
    - Drag-to-reorder history items
    - Comparison mode (side-by-side multiple images)
    - Export as PDF with before/after comparisons

---

## License

MIT License - feel free to use this project for learning and development.

---

## Author

**Sumanth Shetty**
- GitHub: [@HelloSumanthShetty](https://github.com/HelloSumanthShetty)
- LinkedIn: [sumanth-shetty-dev](https://www.linkedin.com/in/sumanth-shetty-dev/)
- Twitter: [@sumShetty_dev](https://x.com/sumShetty_dev)
- LeetCode: [SumanthShetty7](https://leetcode.com/u/SumanthShetty7/)

---

**Built with ❤️ for developers who love beautiful, functional web applications.**
