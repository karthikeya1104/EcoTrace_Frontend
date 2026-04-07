# EcoTrace Frontend

## Overview

EcoTrace is a production-grade web application for tracking and optimizing environmental impact across sustainable supply chains. Built with React, it provides role-specific dashboards for manufacturers, transporters, lab technicians, and administrators to collaborate on sustainability initiatives.

### Platform Status: Live & Production Ready
- **Live Application**: https://ecotrace-gcet.vercel.app/
- **Deployment**: Vercel (Global CDN)

### Key Features

- Role-based dashboards for manufacturers, transporters, lab technicians, and admins
- Real-time product and batch lifecycle management
- Automatic carbon emission calculations for shipments
- Lab testing workflow management with report generation
- AI-powered sustainability scoring for products and batches
- QR code batch verification for supply chain transparency
- Responsive design for desktop and mobile users
- JWT-based secure authentication

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 19.x | Component-based UI |
| Routing | React Router 7.x | Client-side navigation |
| Build | Vite | Fast development & production builds |
| Styling | Tailwind CSS | Utility-first CSS |
| HTTP | Axios | API communication with auto-auth |
| State | React Context | Authentication management |
| QR Code | qrcode | Batch verification |

---

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── auth.js             # Authentication API client
│   │   └── axios.js            # Axios config with interceptors
│   ├── auth/
│   │   └── ProtectedRoute.jsx  # Role-based route protection
│   ├── components/
│   │   ├── Pagination.jsx      # Reusable pagination
│   │   └── Sidebar.jsx         # Navigation menu
│   ├── config/
│   │   └── sidebarRoutes.js    # Route definitions by role
│   ├── layouts/
│   │   └── DashboardLayout.jsx # Main app wrapper
│   ├── pages/
│   │   ├── Home.jsx            # Public landing page
│   │   ├── Login.jsx           # Authentication
│   │   ├── Register.jsx        # User registration
│   │   ├── PublicBatch.jsx     # QR code public access
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx   # Admin overview
│   │   │   ├── AdminReportsList.jsx
│   │   │   └── AdminReportDetail.jsx
│   │   ├── manufacturer/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── CreateProduct.jsx
│   │   │   ├── ProductView.jsx
│   │   │   ├── BatchList.jsx
│   │   │   └── CreateBatch.jsx
│   │   ├── transporter/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TransportList.jsx
│   │   │   ├── CreateTransport.jsx
│   │   │   └── TransportDetail.jsx
│   │   ├── lab/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LabReportList.jsx
│   │   │   ├── CreateReport.jsx
│   │   │   ├── LabReportDetail.jsx
│   │   │   └── PendingTests.jsx
│   │   └── consumer/
│   │       ├── Dashboard.jsx
│   │       ├── BatchReviews.jsx
│   │       ├── MyReviews.jsx
│   │       └── ReviewCard.jsx
│   ├── utils/
│   │   └── useAuth.js          # Authentication hook
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # React entry point
│   ├── App.css                 # Component styles
│   └── index.css               # Global CSS & Tailwind
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Backend API running on http://localhost:8000

### Installation

1. Navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API (optional):
   Create `.env` file for custom backend URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open application:
   - Local: http://localhost:5173
   - Network: http://0.0.0.0:5173

---

## Authentication & Security

### JWT Flow
1. **Registration** - Select role and create account
2. **Login** - Email/password authentication returns JWT
3. **Token Storage** - Secure localStorage management
4. **Authorization** - Bearer token in request headers
5. **Auto-Refresh** - Token refresh before expiration
6. **Session** - Automatic logout on token expiration

### Axios Interceptors

- **Request**: Automatically adds Bearer token to headers
- **Response**: Handles 401 errors with logout redirect
- **CORS**: Properly configured for API access

### User Roles

| Role | Access | Primary Functions |
|------|--------|------------------|
| **manufacturer** | /manufacturer/* | Product/batch management, AI scores |
| **transporter** | /transporter/* | Shipment tracking, emission reports |
| **lab** | /lab/* | Test management, report generation |
| **admin** | /admin/* | User management, system analytics |
| **consumer** | /consumer/* | Batch reviews, sustainability viewing |

---

## Route Structure

### Public Routes
- `/` - Landing page
- `/login` - Login form
- `/register` - Registration with role selection
- `/public/batch/:id` - QR code batch view (read-only)

### Manufacturer Routes (`/manufacturer/*`)
- `/dashboard` - Overview with metrics and recent activity
- `/products` - Product catalog with search/filter
- `/products/create` - New product creation
- `/products/:id` - Product details and batch history
- `/batches` - Batch management with status tracking
- `/batch/create/:productId` - Batch creation with materials

### Transporter Routes (`/transporter/*`)
- `/dashboard` - Metrics (distance, emissions, costs)
- `/transports` - Shipment management
- `/transports/:id` - Transport details  
- `/transport/create` - New shipment with auto-calculations

### Lab Routes (`/lab/*`)
- `/dashboard` - Overview with pending tests
- `/reports` - Lab reports list
- `/reports/:id` - Report details
- `/pending-tests` - Test queue management
- `/report/create/:batchId` - New report creation

### Admin Routes (`/admin/*`)
- `/dashboard` - System overview and metrics
- `/reports` - Global reports and analytics
- `/reports/:id` - Detailed admin report view

### Consumer Routes (`/consumer/*`)
- `/dashboard` - Consumer overview
- `/batch-reviews` - Batch reviews
- `/my-reviews` - User's submitted reviews

---

## Core Components

### ProtectedRoute
Wraps authenticated pages with role-based access control:
```jsx
<ProtectedRoute role="manufacturer">
  <ManufacturerDashboard />
</ProtectedRoute>
```

### Sidebar
Role-specific navigation menu with logout:
```jsx
<Sidebar 
  links={sidebarRoutes[userRole]}
  activeLink={currentPath}
  onLogout={handleLogout}
/>
```

### DashboardLayout
Main application wrapper:
```jsx
<DashboardLayout role={userRole}>
  {/* Page content */}
</DashboardLayout>
```

### Pagination
Reusable list pagination:
```jsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onNext={() => setPage(p => p + 1)}
  onPrevious={() => setPage(p => p - 1)}
/>
```

---

## API Integration

### Axios Configuration
- Base URL: `VITE_API_URL` environment variable
- Default timeout: 30 seconds
- Auto-retry on network failure
- Automatic token injection
- Token refresh on expiration
- Logout on 401 responses

### Authentication API

```javascript
// Login
POST /api/auth/login
{ email: string, password: string }

// Register
POST /api/auth/register
{ email: string, password: string, role: string, company_name: string }

// Get Current User
GET /api/auth/me

// Refresh Token
POST /api/auth/refresh
{ refresh_token: string }
```

### Core Endpoints Integration

| Feature | Endpoint | Method |
|---------|----------|--------|
| Products | `/api/products` | GET/POST |
| Batches | `/api/batches` | GET/POST |
| Transports | `/api/transports` | GET/POST |
| Lab Reports | `/api/lab/reports` | GET/POST |
| AI Scores | `/api/ai/batch/{id}/score` | GET |
| Reviews | `/api/reviews` | GET/POST |

---

## Design System

### Color Palette
- **Primary Green** (#059669) - Sustainability, success
- **Secondary Blue** (#2563eb) - Trust, primary actions
- **Accent Orange** (#ea580c) - Warnings, alerts
- **Neutral Gray** (#6b7280) - Text, backgrounds

### Responsive Breakpoints
- **sm**: 640px - Small tablets
- **md**: 768px - Tablets, laptops  
- **lg**: 1024px - Desktops
- **xl**: 1280px - Large desktops

### Typography
- **Display**: 36px - Page titles
- **H1**: 30px - Section headers
- **H2**: 24px - Component titles
- **Body**: 16px - Standard text
- **Small**: 14px - Secondary info

---

## Development Scripts

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint --fix
```

---

## Production Deployment

### Build Process
```bash
npm run build
# Creates optimized dist/ folder with:
# - Minified JavaScript and CSS
# - Code splitting by route
# - Asset optimization
# - Source maps on demand
```

### Vercel Deployment (Current)
- **URL**: https://ecotrace-gcet.vercel.app/
- **Build command**: `npm run build`
- **Output directory**: `dist/`
- **Node version**: 18+
- **Environment variables**:
  - `VITE_API_URL`: Backend API URL

### Alternative Deployments
- **Netlify**: Drag & drop dist/ folder
- **AWS S3 + CloudFront**: Static hosting with CDN
- **Firebase**: Google ecosystem with fast deployment

### Environment for Production
```env
VITE_API_URL=https://api.ecotrace.com
NODE_ENV=production
```

---

## useAuth Hook

Custom hook for authentication state management:

```javascript
const {
  user,              // Current user object
  isAuthenticated,   // Boolean auth status
  login,             // Login function
  register,          // Register function
  logout,            // Logout function
  loading            // Loading state
} = useAuth();
```

**User Object Structure**:
```javascript
{
  id: number,
  email: string,
  name: string,
  role: 'manufacturer' | 'transporter' | 'lab' | 'admin',
  company_name: string,
  created_at: string
}
```

---

## Error Handling

Standard error handling pattern:
```javascript
try {
  setLoading(true);
  const response = await axios.get('/api/endpoint');
  setData(response.data);
} catch (error) {
  const message = error.response?.data?.detail || 'An error occurred';
  setError(message);
  toast.error(message);
} finally {
  setLoading(false);
}
```

---

## Performance Optimizations

### Code Splitting
- Route-based splitting via React Router
- Lazy loading of heavy components
- Separate vendor chunks

### Image Optimization
- WebP format support
- Responsive image sizes
- Lazy loading on scroll

### Data Fetching
- Debounced search (300ms)
- Request caching in localStorage
- Pagination for large lists

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Responsive Design

### Desktop Layout
- Fixed sidebar navigation
- Full-width content area
- Multi-column grids

### Tablet Layout
- Collapsible sidebar
- Adjusted content widths
- Touch-optimized buttons

### Mobile Layout
- Hamburger menu navigation
- Full-screen overlay
- Single column layouts
- Simplified forms

---

## Building Features

### Adding a New Role Dashboard

1. Create page component in `src/pages/[role]/Dashboard.jsx`
2. Add navigation routes in `config/sidebarRoutes.js`
3. Create API integration in component
4. Wrap in `ProtectedRoute` with role
5. Import in `App.jsx`

### Adding API Endpoints

1. Define request in component
2. Use axios instance from `api/axios.js`
3. Handle loading/error states
4. Update error messages

### Styling Patterns

All components use Tailwind CSS:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>

<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md">
  Action
</button>

<input
  type="text"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
  placeholder="Enter text"
/>
```

---

## Troubleshooting

**API Connection Issues**
- Verify backend is running  
- Check VITE_API_URL environment variable
- Review browser Network tab
- Check CORS configuration

**Authentication Problems**
- Clear localStorage: `localStorage.clear()`
- Check token in DevTools > Application
- Verify user role permissions
- Try re-login

**Build Errors**
- Clear cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node -v` (need 18+)

**Styling Issues**
- Verify Tailwind imports in `index.css`
- Check `tailwind.config.js` configuration
- Clear browser cache
- Test in incognito mode

---

## Contributing

### Code Standards
- Component files: PascalCase
- Helper files: camelCase
- CSS: Tailwind utility classes
- Commits: Clear, descriptive messages

### Before Submitting PR
- Run `npm run lint`
- Test all user roles
- Verify responsive design
- Check error handling
- Update documentation

---

## License

EcoTrace is licensed under the MIT License. See main project repository for details.