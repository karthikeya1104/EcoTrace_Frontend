# Frontend Components & Routes

Detailed breakdown of all pages, routes, and role-based access control.

---

## 🛣️ Route Structure

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home.jsx` | Landing page with navigation to login/register |
| `/login` | `Login.jsx` | User login form |
| `/register` | `Register.jsx` | User registration (choose role) |
| `/public/batch/:id` | `PublicBatch.jsx` | QR code public batch view (read-only) |

---

## 🏭 Manufacturer Routes

**Base path:** `/manufacturer`

| Route | Component | Purpose |
|-------|-----------|---------|
| `/dashboard` | `manufacturer/Dashboard.jsx` | Stats overview (products, batches, latest batches) |
| `/products` | `manufacturer/ProductList.jsx` | List all your products with create button |
| `/products/create` | `manufacturer/CreateProduct.jsx` | Create a new product |
| `/products/:id` | `manufacturer/ProductView.jsx` | View product details with its batches |
| `/batches` | `manufacturer/BatchList.jsx` | List all your batches (paginated, searchable) |
| `/batch/create/:productId` | `manufacturer/CreateBatch.jsx` | Create a batch for a specific product |

**Key Features:**
- Dashboard fetches stats from `/api/products/my-products/stats`
- Product creation validates name uniqueness
- Batch creation includes material info and triggers AI validation
- All lists are paginated and searchable

---

## 🚚 Transporter Routes

**Base path:** `/transporter`

| Route | Component | Purpose |
|-------|-----------|---------|
| `/dashboard` | `transporter/Dashboard.jsx` | Stats overview (total transports, distance, emissions) |
| `/transports` | `transporter/TransportList.jsx` | List your transports (paginated, search by origin/destination/product) |
| `/transports/:id` | `transporter/TransportDetail.jsx` | View a single transport with details |
| `/transport/create` | `transporter/CreateTransport.jsx` | Create a new transport for a batch |

**Key Features:**
- Dashboard fetches stats from `/api/transports/my/stats`
- Transport creation validates transport chains (origin → destination)
- Emission calculations are automatic (computed on backend)
- Search filters across origin, destination, product name, and batch code

---

## 🧪 Lab Routes

**Base path:** `/lab`

| Route | Component | Purpose |
|-------|-----------|---------|
| `/dashboard` | `lab/Dashboard.jsx` | Stats overview and quick navigation |
| `/reports` | `lab/LabReportList.jsx` | List all lab reports (paginated, filterable) |
| `/reports/:id` | `lab/LabReportDetail.jsx` | View full report details and history |
| `/pending-tests` | `lab/PendingTests.jsx` | Queue of batches awaiting testing |
| `/report/create/:batchId` | `lab/CreateReport.jsx` | Create a new lab report for a batch |

**Key Features:**
- Pending tests pulled from batch status
- Reports tied to batch ID with test results
- Report status tracking (pending, in-progress, completed)

---

## 📦 Reusable Components

| Component | Location | Props | Purpose |
|-----------|----------|-------|---------|
| `ProtectedRoute` | `auth/ProtectedRoute.jsx` | `role`, `children` | Wrapper for role-restricted pages |
| `Pagination` | `components/Pagination.jsx` | `currentPage`, `totalPages`, `onPrevious`, `onNext` | Navigation for paginated lists |
| `Sidebar` | `components/Sidebar.jsx` | `links`, `activeLink`, `onLogout` | Role-specific navigation menu |
| `DashboardLayout` | `layouts/DashboardLayout.jsx` | `role`, `children` | Wraps pages with sidebar and header |

---

## 🔐 Authentication & Hooks

### `useAuth.js`
Custom hook that provides:
- Current user info (id, email, role)
- Login/logout functions
- Token management
- Role-based redirection

### `ProtectedRoute.jsx`
Wrapper component that:
- Checks user authentication
- Verifies role matches required role
- Redirects to login if not authenticated
- Redirects to unauthorized if wrong role

---

## 🌐 API Integration

### Axios Wrapper (`src/api/axios.js`)

- Base URL: `http://localhost:8000` (override via environment variables)
- Auto-includes `Authorization: Bearer {token}` header
- Handles response/error interceptors
- Stores JWT token in localStorage

### Auth Endpoints (`src/api/auth.js`)

- `registerUser(data)` – POST `/api/auth/register`
- `loginUser(email, password)` – POST `/api/auth/login`
- `getCurrentUser()` – GET `/api/auth/me`

### Other API Calls

Made directly via `axios.get()`, `axios.post()`, etc. with full URLs.

---

## 📐 Layout Structure

Every authenticated page uses `DashboardLayout`:

```jsx
<DashboardLayout role={userRole}>
  <div className="p-6">
    {/* page content */}
  </div>
</DashboardLayout>
```

This provides:
- Sidebar with role-specific menu
- Top navbar with user info and logout
- Responsive design (sidebar collapses on mobile)

---

## 🎨 Styling Notes

- Tailwind CSS utilities for all styling
- Custom colors defined in `tailwind.config.js`
- Global styles in `index.css`
- Component-specific overrides in `App.css`
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`

---

## 🧪 Common Patterns

### Page Structure
```jsx
export default function MyPage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    axios.get('/api/endpoint').then(res => setData(res.data));
  }, []);
  
  return (
    <DashboardLayout role={user?.role}>
      {/* content */}
    </DashboardLayout>
  );
}
```

### Error Handling
```jsx
try {
  const res = await axios.post('/api/endpoint', payload);
  // success
} catch (error) {
  alert(error.response?.data?.detail || 'An error occurred');
}
```

### Pagination
```jsx
const [page, setPage] = useState(1);
const { total_pages } = response;

<Pagination 
  currentPage={page} 
  totalPages={total_pages} 
  onPrevious={() => setPage(p => p - 1)}
  onNext={() => setPage(p => p + 1)}
/>
```

---

## 🚀 Development Tips

1. **Hot reload:** Vite auto-reloads on file changes
2. **React DevTools:** Install React DevTools browser extension for debugging
3. **Network inspection:** Use browser DevTools to inspect API calls
4. **Role testing:** Create test accounts with different roles to test protected routes
5. **Environment variables:** Create `.env` file for custom API URL (`VITE_API_URL`)
