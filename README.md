# EcoTrace Frontend

## Overview

EcoTrace is a modern, responsive web application that empowers stakeholders in sustainable supply chains to track, analyze, and optimize environmental impact. Built with React and modern web technologies, the frontend provides an intuitive interface for manufacturers, transporters, lab technicians, and administrators to collaborate on sustainability goals.

### Key Features

- Manufacturer portal for complete product lifecycle management with batch tracking
- Transporter dashboard for real-time shipment monitoring with carbon calculations
- Lab management interface for comprehensive testing workflows and report generation
- Admin control panel for system oversight and user management
- Responsive design for seamless experience across desktop and mobile devices
- Role-based authentication with JWT tokens
- Real-time analytics with sustainability metrics
- QR code integration for batch verification and public access

---

## Technical Architecture

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend Framework | React | 19.x | Component-based UI development |
| Routing | React Router | 7.x | Client-side navigation with protected routes |
| Build Tool | Vite | Latest | Lightning-fast development and optimized production builds |
| Styling | Tailwind CSS | Latest | Utility-first CSS framework |
| HTTP Client | Axios | Latest | API communication with automatic auth handling |
| State Management | React Context | Built-in | Authentication state and global app state |
| QR Code Generation | qrcode.react | Latest | Batch verification and public access |
| Icons | Heroicons | Latest | Consistent iconography throughout the app |

### Design Principles

- User-Centric Design: Intuitive interfaces tailored to each user role
- Mobile-First: Responsive design that works seamlessly on all devices
- Accessibility: WCAG compliant with keyboard navigation and screen reader support
- Performance: Optimized loading with code splitting and lazy loading
- Security: Secure authentication flows with automatic token management
- Real-time Updates: Live data synchronization for critical metrics

---

## Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── auth.js               # Authentication API client
│   │   └── axios.js              # Axios configuration with interceptors
│   ├── auth/
│   │   └── ProtectedRoute.jsx    # Route protection component
│   ├── components/
│   │   ├── Pagination.jsx        # Reusable pagination component
│   │   └── Sidebar.jsx           # Navigation sidebar
│   ├── config/
│   │   └── sidebarRoutes.js      # Route configuration by role
│   ├── layouts/
│   │   └── DashboardLayout.jsx   # Main dashboard wrapper
│   ├── pages/
│   │   ├── Home.jsx              # Landing page
│   │   ├── Login.jsx             # Authentication form
│   │   ├── Register.jsx          # User registration
│   │   ├── PublicBatch.jsx       # QR code public access
│   │   ├── manufacturer/
│   │   │   ├── Dashboard.jsx     # Manufacturer overview
│   │   │   ├── ProductList.jsx   # Product management
│   │   │   ├── CreateProduct.jsx # Product creation form
│   │   │   ├── ProductView.jsx   # Product details with batches
│   │   │   ├── BatchList.jsx     # Batch listing and search
│   │   │   └── CreateBatch.jsx   # Batch creation workflow
│   │   ├── transporter/
│   │   │   ├── Dashboard.jsx     # Transport metrics
│   │   │   ├── TransportList.jsx # Shipment management
│   │   │   ├── CreateTransport.jsx # Transport creation
│   │   │   └── TransportDetail.jsx # Detailed transport view
│   │   ├── lab/
│   │   │   ├── Dashboard.jsx     # Lab technician overview
│   │   │   ├── LabReportList.jsx # Report management
│   │   │   ├── CreateReport.jsx  # Report creation
│   │   │   ├── LabReportDetail.jsx # Report details
│   │   │   └── PendingTests.jsx  # Test queue management
│   │   └── admin/
│   │       ├── AdminReportDetail.jsx # Admin report view
│   │       ├── AdminReportsList.jsx # System reports
│   │       └── Dashboard.jsx     # Admin control panel
│   ├── utils/
│   │   └── useAuth.js            # Authentication hook
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # React application entry point
│   ├── App.css                   # Global component styles
│   └── index.css                 # Global CSS and Tailwind imports
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.js                # Vite build configuration
├── eslint.config.js              # ESLint configuration
├── postcss.config.js             # PostCSS configuration
└── README.md                     # This documentation
```

---

## Quick Start Guide

### Prerequisites

- Node.js: Version 18.0 or higher
- npm: Latest stable version (comes with Node.js)
- Backend API: EcoTrace backend running on http://localhost:8000

### Installation & Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API endpoint (optional):
   - Default: http://localhost:8000
   - For custom backend: Create .env file
   ```env
   VITE_API_URL=http://your-backend-url:port
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Access the application:
   - Local Development: http://localhost:5173
   - Network Access: http://0.0.0.0:5173 (with --host flag)

---

## Role-Based Features

### Manufacturer Experience

**Dashboard Overview:**
- Real-time metrics: Product count, active batches, recent activity
- Sustainability trends and performance indicators
- Notification center for important updates
- Quick actions for common tasks

**Product Management:**
- Create products with detailed specifications
- Edit product information and categories
- View comprehensive product analytics
- Archive obsolete products safely

**Batch Operations:**
- Create production batches with material composition
- Advanced search and filtering capabilities
- Track batch status through the supply chain
- View AI-generated sustainability scores
- QR code generation for batch verification

**Analytics & Insights:**
- Production volume trends
- Sustainability score improvements
- Cost efficiency metrics
- Supply chain performance

### Transporter Experience

**Dashboard Metrics:**
- Total distance covered
- Carbon emissions tracking
- Cost analysis and optimization
- Fleet utilization statistics

**Shipment Management:**
- Create transport records with automatic emission calculations
- Route optimization and validation
- Origin/destination management
- Batch assignment and tracking
- Transport chain validation

**Performance Analytics:**
- Emission reduction progress
- Cost-saving opportunities
- Route efficiency metrics
- Historical performance trends

### Lab Technician Experience

**Testing Workflow:**
- Manage pending test requests
- Conduct comprehensive sustainability tests
- Record detailed test results
- Generate professional lab reports
- Quality assurance and validation

**Report Management:**
- Create structured test reports
- Search and filter report history
- Track testing completion rates
- Certification management

**Quality Control:**
- Standard compliance verification
- Performance metrics tracking
- Continuous improvement monitoring

### Administrator Experience

**System Oversight:**
- Complete user lifecycle management
- System-wide analytics and reporting
- Audit trail monitoring
- Configuration and settings management

**User Management:**
- Onboard new system users
- Update user roles and permissions
- Deactivate accounts when necessary
- User activity monitoring

**System Analytics:**
- Platform usage statistics
- Sustainability impact metrics
- Security and access monitoring
- Performance and scalability metrics

---

## Authentication & Security

### JWT-Based Security Flow

1. User Registration: Role selection and account creation
2. Secure Login: Email/password authentication
3. Token Management: Automatic JWT token handling
4. Session Security: Secure token storage and refresh
5. Logout: Complete session termination

### Security Features

- Encrypted Communication: HTTPS/TLS in production
- XSS Protection: Content Security Policy headers
- CSRF Prevention: Token-based request validation
- Session Management: Automatic token expiration
- Secure Storage: HTTP-only cookies for tokens
- Input Sanitization: Comprehensive data validation

### Axios Integration

**Automatic Authentication:**
```javascript
// src/api/axios.js
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Request interceptor: Add auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on auth failure
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Green | #059669 | Sustainability theme, success states |
| Secondary Blue | #2563eb | Trust, technology, primary actions |
| Accent Orange | #ea580c | Warnings, highlights, calls-to-action |
| Neutral Gray | #6b7280 | Text, backgrounds, subtle elements |

### Typography Scale

- Display: 2.25rem (36px) - Page titles
- Heading 1: 1.875rem (30px) - Section headers
- Heading 2: 1.5rem (24px) - Component titles
- Body Large: 1.125rem (18px) - Primary content
- Body: 1rem (16px) - Standard text
- Body Small: 0.875rem (14px) - Secondary information

### Component Patterns

**Button Variants:**
- Primary: Green background, white text
- Secondary: Blue outline, blue text
- Danger: Red background, white text
- Ghost: Transparent background, colored text

**Form Elements:**
- Consistent spacing and validation states
- Clear error messaging
- Loading states for async operations
- Accessibility-compliant labels

---

## API Integration

### Core Endpoints Integration

| Feature | Endpoint | Method | Purpose |
|---------|----------|--------|---------|
| Authentication | /api/auth/login | POST | User login |
| User Registration | /api/auth/register | POST | Create account |
| Product CRUD | /api/products/ | GET/POST | Product management |
| Batch Operations | /api/batches/ | GET/POST | Batch handling |
| Transport Management | /api/transports/ | GET/POST | Shipment tracking |
| AI Scores | /api/ai/batch/{id}/score | GET | Sustainability metrics |
| Lab Reports | /api/lab/reports | GET/POST | Test documentation |

### Error Handling Strategy

```javascript
// Consistent error handling pattern
const handleApiCall = async (apiCall) => {
  try {
    setLoading(true);
    const response = await apiCall();
    setData(response.data);
  } catch (error) {
    const message = error.response?.data?.detail || 'An error occurred';
    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};
```

---

## Build & Deployment

### Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint

# Auto-fix linting issues
npm run lint --fix
```

### Production Build Configuration

**Vite Configuration:**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['axios', 'qrcode.react']
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
});
```

### Deployment Options

**Recommended Platforms:**
- Vercel: Zero-config deployment with preview URLs
- Netlify: Global CDN with form handling
- AWS S3 + CloudFront: Scalable static hosting
- Firebase Hosting: Google ecosystem integration

**Deployment Steps:**
1. Build the application: npm run build
2. Configure environment variables for API URLs
3. Upload dist/ folder to hosting platform
4. Set up proper redirects for SPA routing

### Environment Variables

```env
# .env.production
VITE_API_URL=https://api.ecotrace.com
VITE_APP_NAME=EcoTrace
VITE_APP_VERSION=1.0.0
```

---

## Testing & Quality Assurance

### Testing Strategy

- Unit Tests: Component logic and utilities
- Integration Tests: API interactions and workflows
- E2E Tests: Critical user journeys
- Accessibility Tests: WCAG compliance verification

### Code Quality Tools

- ESLint: Code linting and style enforcement
- Prettier: Automatic code formatting
- TypeScript: Type safety (planned migration)
- Storybook: Component documentation and testing

---

## Developer Resources

### Key Files Reference

| File | Purpose | Key Functions |
|------|---------|---------------|
| src/api/axios.js | HTTP client configuration | axiosInstance, interceptors |
| src/auth/ProtectedRoute.jsx | Route protection | ProtectedRoute component |
| src/utils/useAuth.js | Auth state management | useAuth hook |
| src/config/sidebarRoutes.js | Navigation config | Route definitions by role |

### Common Patterns

**Authentication Check:**
```jsx
const { user, isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

**API Data Fetching:**
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/endpoint');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

---

## Performance Optimization

### Code Splitting Strategies

- Route-based splitting: Automatic with React Router
- Component lazy loading: For heavy components
- Vendor chunking: Separate third-party libraries

### Image Optimization

- WebP format: Modern image format support
- Responsive images: Different sizes for different screens
- Lazy loading: Images load as they enter viewport

### Caching Strategy

- Service Worker: Offline functionality (planned)
- API response caching: React Query integration (planned)
- Static asset caching: Aggressive caching headers

---

## Troubleshooting

### Common Issues

**Build Errors:**
- Clear node_modules: rm -rf node_modules && npm install
- Check Node.js version compatibility
- Verify environment variables

**API Connection Issues:**
- Confirm backend is running
- Check CORS configuration
- Verify API endpoint URLs

**Authentication Problems:**
- Clear localStorage: localStorage.clear()
- Check token expiration
- Verify user roles and permissions

**Styling Issues:**
- Tailwind classes not applying: Check configuration
- Responsive design problems: Test with browser dev tools

### Development Tips

- Use React DevTools for component debugging
- Enable "Preserve log" in Network tab for API debugging
- Use browser device emulation for responsive testing
- Test with different user roles to verify access control

---

## Future Roadmap

### Planned Enhancements

**Phase 1 (Q2 2026):**
- Real-time notifications with WebSocket
- Advanced analytics dashboard
- Mobile application development
- Multi-language support

**Phase 2 (Q3 2026):**
- Offline functionality with service workers
- Third-party integrations (ERP systems)
- AI-powered recommendations
- Advanced reporting and export features

**Phase 3 (Q4 2026):**
- Progressive Web App (PWA) capabilities
- Advanced data visualization
- Machine learning integration
- API rate limiting and optimization

---

## Support & Contributing

### Getting Help

1. Check this documentation first
2. Review the backend API documentation
3. Check browser console for errors
4. Test with different user roles

### Development Workflow

1. Feature Branch: Create from main
2. Code Standards: Follow ESLint rules
3. Testing: Test across different roles
4. Documentation: Update this README for new features
5. Pull Request: Submit with clear description

### Code Standards

- Component Naming: PascalCase for components
- File Naming: kebab-case for files
- Function Naming: camelCase for functions
- CSS Classes: Tailwind utility classes
- Commits: Clear, descriptive commit messages

---

## License

EcoTrace Frontend is part of the EcoTrace platform and is licensed under the MIT License. See the main project repository for complete license information.