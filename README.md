# Aarya Gourkar - Portfolio Website

A modern, interactive portfolio website showcasing projects, skills, certifications, and contact information. Built with a clean separation between frontend and backend, featuring a retro gaming aesthetic with smooth animations and dark mode support.

## 🎨 Design Philosophy

The website features a **retro gaming aesthetic** with:
- **Pixel-style custom cursor** that changes color on hover
- **Press Start 2P** font for headings (retro gaming feel)
- **VT323** monospace font for body text (readable, game-like)
- **Dancing Script** for the hero title (elegant contrast)
- **Pink (#e83e8c) and Green (#4caf50)** color scheme
- **Smooth GSAP animations** for page transitions
- **Dark mode support** with seamless transitions
- **Splash screen** with game-style START button

## 📁 Project Structure

```
porfolioWebsite/
├── frontend/              # Frontend application
│   ├── index.html        # Main HTML file
│   ├── styles.css        # Custom CSS styles
│   └── app.js           # JavaScript application logic
├── backend/              # Backend API server
│   ├── server.js        # Express.js server
│   └── package.json     # Node.js dependencies
├── data.json            # Portfolio data (skills, projects, certifications)
└── README.md           # This file
```

## 🏗️ Architecture Overview

### Frontend (Client-Side)

The frontend is a **Single Page Application (SPA)** that:

1. **Fetches data from the backend API** (`/api/portfolio`)
2. **Dynamically renders content** (skills, projects, certifications)
3. **Handles client-side routing** using hash-based navigation
4. **Manages state** (current page, dark mode, portfolio data)
5. **Provides smooth animations** using GSAP library

#### Key Technologies:
- **HTML5** - Semantic markup
- **CSS3** - Custom styles with dark mode support
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No framework dependencies
- **GSAP (GreenSock)** - Animation library for smooth transitions

### Backend (Server-Side)

The backend is a **RESTful API** built with Express.js that:

1. **Serves static files** (HTML, CSS, JS) from the frontend directory
2. **Provides API endpoints** for data retrieval
3. **Handles contact form submissions**
4. **Manages CORS** for cross-origin requests

#### Key Technologies:
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-Origin Resource Sharing middleware

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd porfolioWebsite
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📡 API Endpoints

### `GET /api/portfolio`
Returns the complete portfolio data including skills, projects, and certifications.

**Response:**
```json
{
  "skills": {
    "core": ["Python", "React", "JavaScript", ...],
    "ml": ["TensorFlow", "PyTorch", ...],
    "certifications": [...]
  },
  "projects": [...]
}
```

### `POST /api/contact`
Handles contact form submissions.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message received successfully. I'll get back to you soon!"
}
```

### `GET /api/health`
Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Portfolio API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 How It Works

### 1. Initial Load

1. User visits the website
2. **Splash screen** appears with a game-style START button
3. User clicks START
4. Splash screen fades out with GSAP animation
5. Main content fades in

### 2. Data Loading

1. Frontend JavaScript (`app.js`) makes a `fetch()` request to `/api/portfolio`
2. Backend reads `data.json` and returns it as JSON
3. Frontend stores the data in `portfolioData` variable
4. Dynamic rendering functions populate the page:
   - `renderSkills()` - Creates skill tags
   - `renderProjects()` - Creates project cards
   - `renderCertifications()` - Creates certification cards

### 3. Navigation (SPA Routing)

1. User clicks a navigation button (Home, Skills, Projects, etc.)
2. `showPage(pageId)` function is called
3. Current page fades out (opacity animation)
4. New page fades in
5. URL hash updates (e.g., `#about`) for bookmarking
6. Active navigation button is highlighted

### 4. Dark Mode

1. User clicks the dark mode toggle button (top right)
2. `toggleDarkMode()` function adds/removes `dark` class on `<body>`
3. CSS transitions smoothly change colors
4. Icon switches between moon (light mode) and sun (dark mode)

### 5. Custom Cursor

1. `setupCursor()` initializes the pixel cursor on page load
2. Mouse movement events update cursor position using GSAP
3. Hover events on interactive elements change cursor color to pink
4. Cursor hides when focusing on text inputs

### 6. Contact Form

1. User fills out the contact form
2. Form submission is intercepted (prevents default)
3. Data is sent to `/api/contact` endpoint
4. Backend validates and processes the data
5. Success message is displayed
6. If API fails, falls back to `mailto:` link

## 🎨 Customization

### Updating Portfolio Data

Edit `data.json` in the root directory:

```json
{
  "skills": {
    "core": ["Your", "Skills", "Here"],
    "ml": ["ML", "Tools"],
    "certifications": ["Cert 1", "Cert 2"]
  },
  "projects": [
    {
      "title": "Project Title",
      "subtitle": "Project Subtitle",
      "description": "Project description",
      "tags": ["Tag1", "Tag2"],
      "link": "https://github.com/..."
    }
  ]
}
```

### Changing Colors

Edit `frontend/app.js` - Tailwind configuration:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'primary-pink': '#e83e8c',  // Change this
        'accent-green': '#4caf50',  // Change this
        // ... other colors
      }
    }
  }
}
```

### Modifying Styles

Edit `frontend/styles.css` for custom CSS rules.

### Adding New Pages

1. Add a new section in `frontend/index.html`:
   ```html
   <section id="new-page" class="page ...">
     <!-- Content -->
   </section>
   ```

2. Add page ID to `pageIds` array in `frontend/app.js`:
   ```javascript
   const pageIds = ['home', 'about', 'work', 'certs', 'contact', 'new-page'];
   ```

3. Add navigation button in the header

## 🔧 Development

### File Structure Explained

#### `frontend/index.html`
- Main HTML structure
- Links to external CSS and JS files
- Contains all page sections (home, about, work, etc.)
- Semantic HTML5 elements

#### `frontend/styles.css`
- Custom CSS for:
  - Body and typography
  - Dark mode styles
  - Custom cursor
  - Splash screen
  - Scrollbar styling
  - Component-specific styles

#### `frontend/app.js`
- **Configuration**: Tailwind config, API base URL
- **State Management**: Global variables for data, current page, dark mode
- **Data Fetching**: `fetchPortfolioDataAndRender()`
- **Rendering**: `renderSkills()`, `renderProjects()`, `renderCertifications()`
- **Navigation**: `showPage()`, `updateNavigationStyles()`
- **Animations**: `setupCursor()`, `animatePageContent()`, `startPortfolio()`
- **Event Handlers**: Dark mode toggle, form submission

#### `backend/server.js`
- Express.js server setup
- Middleware configuration (CORS, JSON parsing, static files)
- API route handlers
- Error handling
- Server startup

#### `data.json`
- Structured portfolio data
- Skills (core, ML, certifications)
- Projects array with metadata
- Easy to update without code changes

## 🚢 Deployment

### Option 1: Deploy Backend + Frontend Together

1. **Deploy to platforms like:**
   - Heroku
   - Railway
   - Render
   - DigitalOcean App Platform

2. **Set environment variables:**
   ```bash
   PORT=3000  # Or let the platform assign it
   ```

3. **Build command:** (if needed)
   ```bash
   npm install
   ```

4. **Start command:**
   ```bash
   cd backend && npm start
   ```

### Option 2: Deploy Frontend Separately (Static Hosting)

1. **Build static files** (if using a build tool)
2. **Deploy to:**
   - Netlify
   - Vercel
   - GitHub Pages
   - Cloudflare Pages

3. **Update API URL** in `frontend/app.js`:
   ```javascript
   const API_BASE_URL = 'https://your-backend-api.com';
   ```

4. **Deploy backend separately** to handle API requests

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change PORT in backend/server.js or set environment variable
PORT=3001 npm start
```

### CORS Errors
- Ensure CORS middleware is enabled in `backend/server.js`
- Check that frontend and backend URLs match

### Data Not Loading
- Check browser console for errors
- Verify `data.json` exists and is valid JSON
- Check that `/api/portfolio` endpoint returns data

### Animations Not Working
- Ensure GSAP library is loaded (check network tab)
- Verify ScrollTrigger plugin is loaded
- Check browser console for JavaScript errors

## 📝 Future Enhancements

- [ ] Add email service integration (Nodemailer, SendGrid)
- [ ] Implement database for contact form submissions
- [ ] Add blog section
- [ ] Implement search functionality
- [ ] Add analytics tracking
- [ ] Optimize images and assets
- [ ] Add PWA support
- [ ] Implement form validation with better UX
- [ ] Add loading states for API calls
- [ ] Implement error boundaries

## 📄 License

MIT License - feel free to use this project as a template for your own portfolio!

## 👤 Author

**Aarya Gourkar**
- Email: aarya.gourkar05@gmail.com
- LinkedIn: [aarya-gourkar](https://www.linkedin.com/in/aarya-gourkar)
- GitHub: [aarya-gourkar](https://github.com/aarya-gourkar)

---

**Built with ❤️ using modern web technologies**




