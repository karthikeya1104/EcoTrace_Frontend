# Frontend Components & Routes Documentation

## Overview

This document provides comprehensive documentation of all React components, routing structure, and role-based access control in the EcoTrace frontend application. The application follows a modular architecture with clear separation of concerns and role-specific user experiences.

---

## Complete Route Structure

### Public Routes (No Authentication Required)

| Path | Component | Purpose | Features |
|------|-----------|---------|----------|
| / | Home.jsx | Landing page with platform overview | Hero section, feature highlights, navigation to auth |
| /login | Login.jsx | User authentication form | Email/password login, remember me, error handling |
| /register | Register.jsx | New user registration | Role selection, company details, validation |
| /public/batch/:id | PublicBatch.jsx | QR code public access | Read-only batch info, sustainability score display |

### Manufacturer Routes (/manufacturer/*)

| Route | Component | Purpose | Key Features |
|-------|-----------|---------|--------------|
| /dashboard | manufacturer/Dashboard.jsx | Manufacturer control center | Stats cards, recent activity, quick actions |
| /products | manufacturer/ProductList.jsx | Product catalog management | Paginated list, search, create button |
| /products/create | manufacturer/CreateProduct.jsx | New product creation | Form validation, category selection |
| /products/:id | manufacturer/ProductView.jsx | Product details with batches | Batch history, edit options, analytics |
| /batches | manufacturer/BatchList.jsx | Batch management overview | Advanced filtering, status tracking |
| /batch/create/:productId | manufacturer/CreateBatch.jsx | Batch creation workflow | Material composition, quantity tracking |

### Transporter Routes (/transporter/*)

| Route | Component | Purpose | Key Features |
|-------|-----------|---------|--------------|
| /dashboard | transporter/Dashboard.jsx | Transport metrics dashboard | Emission stats, distance tracking, cost analysis |
| /transports | transporter/TransportList.jsx | Shipment management | Search by origin/destination, status filtering |
| /transports/:id | transporter/TransportDetail.jsx | Detailed transport view | Route map, emission breakdown, edit options |
| /transport/create | transporter/CreateTransport.jsx | New shipment creation | Batch selection, route validation, auto-calculations |

### Lab Routes (/lab/*)

| Route | Component | Purpose | Key Features |
|-------|-----------|---------|--------------|
| /dashboard | lab/Dashboard.jsx | Lab technician overview | Pending tests, recent reports, performance metrics |
| /reports | lab/LabReportList.jsx | Report management | Filter by status, search functionality |
| /reports/:id | lab/LabReportDetail.jsx | Comprehensive report view | Test results, certifications, edit capabilities |
| /pending-tests | lab/PendingTests.jsx | Test queue management | Priority sorting, assignment workflow |
| /report/create/:batchId | lab/CreateReport.jsx | Report creation interface | Structured data entry, methodology selection |

### Admin Routes (/admin/*)

| Route | Component | Purpose | Key Features |
|-------|-----------|---------|--------------|
| /dashboard | admin/Dashboard.jsx | Administrative control panel | System metrics, user management overview |
| /reports | admin/AdminReportsList.jsx | System-wide reports | Audit logs, analytics, compliance reports |
| /reports/:id | admin/AdminReportDetail.jsx | Detailed admin report view | Full system visibility, action capabilities |

---

## Reusable Component Library

### Core Components

| Component | Location | Props | Purpose | Usage |
|-----------|----------|-------|---------|-------|
| ProtectedRoute | auth/ProtectedRoute.jsx | role, children | Role-based route protection | Wraps all authenticated routes |
| Pagination | components/Pagination.jsx | currentPage, totalPages, onPrevious, onNext | List navigation | Product lists, batch lists, reports |
| Sidebar | components/Sidebar.jsx | links, activeLink, onLogout | Navigation menu | Dashboard layouts |
| DashboardLayout | layouts/DashboardLayout.jsx | role, children | Main app wrapper | All authenticated pages |

### Component API Reference

#### ProtectedRoute
```jsx
<ProtectedRoute role="manufacturer">
  <ManufacturerDashboard />
</ProtectedRoute>
```
**Behavior:**
- Checks authentication status
- Validates user role permissions
- Redirects to login if unauthorized
- Shows loading state during auth check

#### Pagination
```jsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPrevious={() => setPage(p => p - 1)}
  onNext={() => setPage(p => p + 1)}
/>
```
**Features:**
- Previous/Next navigation
- Page number display
- Disabled states for boundaries
- Consistent styling with Tailwind

#### Sidebar
```jsx
<Sidebar
  links={sidebarRoutes[userRole]}
  activeLink={location.pathname}
  onLogout={handleLogout}
/>
```
**Features:**
- Role-specific navigation links
- Active link highlighting
- Logout functionality
- Responsive collapse on mobile

---

## Authentication & Authorization System

### useAuth Hook (src/utils/useAuth.js)

**Core Functionality:**
```javascript
const {
  user,           // Current user object
  isAuthenticated, // Boolean auth status
  login,          // Login function
  logout,         // Logout function
  loading         // Auth check loading state
} = useAuth();
```

**User Object Structure:**
```javascript
{
  id: 1,
  email: "manufacturer@company.com",
  role: "manufacturer",
  company_name: "Green Manufacturing Inc",
  created_at: "2026-04-05T10:30:00Z"
}
```

### Route Protection Flow

1. App load: useAuth checks for stored JWT token
2. Token validation: API call to /api/auth/me for user info
3. Role verification: Compare user role with required role
4. Access grant: Render component or redirect to login

### Authentication State Management

**Login Process:**
```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.loginUser(email, password);
    const { user, token } = response.data;

    localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);

    navigate(`/${user.role}/dashboard`);
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

---

## API Integration Layer

### Axios Configuration (src/api/axios.js)

**Base Configuration:**
```javascript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Request Interceptor:**
```javascript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor:**
```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Authentication API (src/api/auth.js)

| Function | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| registerUser(data) | /api/auth/register | POST | Create new account |
| loginUser(email, password) | /api/auth/login | POST | Authenticate user |
| getCurrentUser() | /api/auth/me | GET | Get user profile |

---

## Layout Architecture

### DashboardLayout Structure

```jsx
<DashboardLayout role={userRole}>
  <div className="flex h-screen bg-gray-50">
    <Sidebar links={routes} activeLink={pathname} onLogout={logout} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {pageTitle}
          </h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  </div>
</DashboardLayout>
```

### Responsive Design Patterns

**Mobile Navigation:**
- Sidebar collapses to hamburger menu
- Full-screen overlay navigation
- Touch-friendly button sizes

**Tablet/Desktop Layout:**
- Persistent sidebar navigation
- Flexible content area
- Optimized for productivity workflows

---

## Styling & Design System

### Tailwind CSS Configuration

**Custom Color Palette:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#059669',
          600: '#047857',
          900: '#14532d'
        },
        secondary: {
          500: '#2563eb',
          600: '#1d4ed8'
        }
      }
    }
  }
}
```

### Component Styling Patterns

**Button Variants:**
```jsx
// Primary button
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium">
  Action
</button>

// Secondary button
<button className="border border-secondary-500 text-secondary-500 hover:bg-secondary-50 px-4 py-2 rounded-md font-medium">
  Cancel
</button>
```

**Form Elements:**
```jsx
// Input field
<input
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  placeholder="Enter value"
/>

// Error state
<input
  type="text"
  className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
  // ...
/>
```

---

## Data Flow Patterns

### Page Component Structure

```jsx
export default function ProductList() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products/my-products/all', {
        params: { page, search, limit: 10 }
      });
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <DashboardLayout role={user.role}>
      {/* Page content */}
    </DashboardLayout>
  );
}
```

### State Management Strategy

**Local Component State:**
- Form inputs and validation
- Loading and error states
- Pagination and filtering
- Modal and dropdown states

**Global Auth State:**
- User information and authentication status
- Centralized via useAuth hook

---

## Common Development Patterns

### Error Handling

```jsx
const handleSubmit = async (formData) => {
  try {
    setSubmitting(true);
    await axios.post('/api/products/', formData);
    toast.success('Product created successfully');
    navigate('/manufacturer/products');
  } catch (error) {
    const message = error.response?.data?.detail || 'An error occurred';
    toast.error(message);
    setErrors(error.response?.data?.errors || {});
  } finally {
    setSubmitting(false);
  }
};
```

### Form Validation

```jsx
const [formData, setFormData] = useState({
  name: '',
  category: '',
  sku: ''
});

const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  if (!formData.name.trim()) newErrors.name = 'Name is required';
  if (!formData.category) newErrors.category = 'Category is required';
  if (!formData.sku.trim()) newErrors.sku = 'SKU is required';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    // Submit form
  }
};
```

### Search and Filter Implementation

```jsx
const [filters, setFilters] = useState({
  search: '',
  category: '',
  status: '',
  dateFrom: '',
  dateTo: ''
});

const handleFilterChange = (key, value) => {
  setFilters(prev => ({ ...prev, [key]: value }));
  setPage(1); // Reset to first page when filtering
};

useEffect(() => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  params.append('page', page);

  fetchData(`/api/batches/my?${params}`);
}, [filters, page]);
```

---

## Mobile Responsiveness

### Breakpoint Strategy

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| sm | 640px | Small tablets, large phones |
| md | 768px | Tablets, small laptops |
| lg | 1024px | Laptops, small desktops |
| xl | 1280px | Large desktops |

### Responsive Component Patterns

**Responsive Grid:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

**Responsive Navigation:**
```jsx
<div className="flex flex-col md:flex-row md:items-center md:justify-between">
  {/* Navigation items */}
</div>
```

**Mobile-First Forms:**
```jsx
<input
  type="text"
  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 md:text-sm"
/>
```

---

## Performance Optimization

### Code Splitting

**Route-Based Splitting:**
```jsx
const ManufacturerDashboard = lazy(() => import('./pages/manufacturer/Dashboard'));
const TransporterDashboard = lazy(() => import('./pages/transporter/Dashboard'));

// In router
<Route
  path="/manufacturer/dashboard"
  element={
    <Suspense fallback={<div>Loading...</div>}>
      <ManufacturerDashboard />
    </Suspense>
  }
/>
```

### Image Optimization

**Responsive Images:**
```jsx
<img
  srcSet="
    /image-small.jpg 640w,
    /image-medium.jpg 1024w,
    /image-large.jpg 1280w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  src="/image-large.jpg"
  alt="Description"
  loading="lazy"
/>
```

### API Optimization

**Debounced Search:**
```jsx
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 300);

  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  if (debouncedSearchTerm) {
    fetchResults(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

---

## Testing Patterns

### Component Testing Structure

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductList from './ProductList';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductList', () => {
  it('renders loading state initially', () => {
    renderWithRouter(<ProductList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays products after loading', async () => {
    // Mock API call
    renderWithRouter(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Product Name')).toBeInTheDocument();
    });
  });
});
```

---

## Development Tools & Configuration

### Vite Configuration (vite.config.js)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'axios'],
          ui: ['qrcode.react', 'react-router-dom']
        }
      }
    }
  }
});
```

### ESLint Configuration (eslint.config.js)

```javascript
export default [
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'warn',
      'no-unused-vars': 'warn'
    }
  }
];
```

---

## Additional Resources

### Key Files Reference

| File | Purpose | Key Exports |
|------|---------|-------------|
| src/App.jsx | Main router setup | App component, route definitions |
| src/main.jsx | React app entry | ReactDOM.render call |
| src/index.css | Global styles | Tailwind imports, base styles |
| tailwind.config.js | Tailwind config | Custom colors, breakpoints |
| package.json | Dependencies | Scripts, package metadata |

### Development Workflow

1. Component Creation: Create in appropriate role folder
2. API Integration: Add API calls in component useEffect
3. State Management: Use local state for component data
4. Error Handling: Implement try/catch with user feedback
5. Testing: Add unit tests for critical functionality
6. Documentation: Update this file for new components

---

## Deployment Checklist

### Pre-Deployment

- Environment variables configured
- API endpoints updated for production
- Build process tested locally
- All routes protected appropriately
- Error boundaries implemented
- Loading states added
- Mobile responsiveness verified

### Production Optimizations

- Code splitting implemented
- Images optimized
- Bundle size analyzed
- CDN configured for assets
- Service worker for caching (future)
- Analytics and monitoring setup

---

## Support & Troubleshooting

### Common Issues

**Authentication Problems:**
- Check token storage in localStorage
- Verify API endpoint configuration
- Test with different user roles

**Routing Issues:**
- Ensure correct role-based route protection
- Check component import paths
- Verify ProtectedRoute wrapper usage

**API Connection Issues:**
- Confirm backend is running
- Check CORS configuration
- Verify request/response formats

**Styling Problems:**
- Clear Tailwind cache: npm run build
- Check custom CSS imports
- Verify responsive breakpoints

### Getting Help

1. Check browser developer tools console
2. Review network tab for API calls
3. Test authentication flow
4. Verify component props and state
5. Check this documentation for patterns

---

## License & Attribution

This component documentation is part of the EcoTrace frontend application. All components are designed to work with the EcoTrace backend API and follow the established design system and coding standards.