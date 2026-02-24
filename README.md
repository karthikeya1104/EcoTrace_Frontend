# EcoTrace Frontend

## 📋 Project Overview

**EcoTrace** is a comprehensive platform for tracking environmental impact and sustainability metrics across supply chains. It enables manufacturers to submit product batches with material details, transporters to log shipments with carbon emission calculations, and lab technicians to conduct and report sustainability tests. An AI engine analyzes batches and generates sustainability scores based on environmental, ethical, safety, and cost factors.

The platform serves multiple stakeholders:
- **Manufacturers** create and manage products, batch submissions, and view AI sustainability scores
- **Transporters** log shipments, track emissions, and validate transport chains
- **Lab Technicians** conduct tests and report results
- **Administrators** oversee all operations and manage system data

This repository contains the **frontend web application**—a React interface that provides intuitive dashboards and workflows for all user roles to interact with the EcoTrace platform.

---

## Frontend Architecture

React application built with Vite, React Router, Tailwind CSS, and Axios. Provides role-based
dashboards for manufacturers, transporters, lab technicians, and administrators to manage
products, batches, transport, and sustainability analysis.

---

## 🧱 Structure

```
src/
├── api/                    # axios wrappers and API calls
│   ├── auth.js
│   └── axios.js
├── auth/                   # authentication UI/logic
│   └── ProtectedRoute.jsx
├── components/             # reusable UI components
│   ├── Pagination.jsx
│   └── Sidebar.jsx
├── config/                 # routing and config
│   └── sidebarRoutes.js
├── layouts/                # page layouts
│   └── DashboardLayout.jsx
├── pages/                  # role-based page components
│   ├── Home.jsx           # landing page
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── PublicBatch.jsx    # QR code public view
│   ├── manufacturer/      # manufacturer dashboard
│   ├── transporter/       # transporter dashboard
│   └── lab/               # lab technician dashboard
├── utils/                  # helper functions
│   └── useAuth.js
├── App.jsx                # main router
├── main.jsx               # React entry point
└── index.css              # global styles
```

---

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```

3. Open `http://localhost:5173` in your browser.

---

## 🧠 Features

### 🏭 Manufacturer Dashboard
- Create and manage products
- Create and track batches with material info
- View product stats (total products, batch counts, latest batch)
- Visible batch AI sustainability scores

### 🚚 Transporter Dashboard
- View and create transports with emission calculations
- Track transport statistics (total distance, total emissions, avg per km)
- Search and filter transports
- Validate transport chains (origin → destination validation)

### 🧪 Lab Dashboard
- View pending tests
- Create lab reports for batches
- Review completed reports
- Track report status and history

### 👤 User Authentication
- User registration (choose role: manufacturer, transporter, lab, admin)
- Login with role-based access
- Protected routes based on user role
- Session persistence via JWT tokens

### 📊 Public Features
- Public batch view via QR code (read-only)
- View AI sustainability scores without authentication
- Home page with navigation to login/register

---

## 🛠️ Key Technologies

- **Vite** – lightning-fast build tool and dev server
- **React 19** – UI framework with hooks
- **React Router v7** – client-side routing with protected routes
- **Tailwind CSS** – utility-first CSS styling
- **Axios** – HTTP client with interceptors for auth tokens
- **QR Code** – reading and generating QR codes for batch tracking

---

## 📱 API Integration

All API calls are made through axios wrappers in `src/api/`. The backend URL is configurable
in `src/api/axios.js`. Authentication tokens are automatically included in all requests.

Key endpoints consumed:
- `/api/auth/*` – user registration, login, current user
- `/api/products/*` – product CRUD
- `/api/batches/*` – batch CRUD and listing
- `/api/transports/*` – transport CRUD and stats
- `/api/ai/batch/{id}/*` – AI scores and insights

---

## 🎨 Styling

The project uses **Tailwind CSS** with a custom configuration in `tailwind.config.js`.
Global styles are in `index.css` and component-specific styles in `App.css`.

---

## 🧪 Development

### Scripts

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run lint    # Run ESLint
npm run preview # Preview production build locally
```

### Component Structure

All pages are functional components using React hooks. The `ProtectedRoute` wrapper
enforces role-based access control on each route.

Reusable components like `Pagination.jsx` and `Sidebar.jsx` abstract common UI patterns.

---

## 📦 Production Build

1. Build the project:
   ```bash
   npm run build
   ```

2. The output will be in `dist/`. Deploy this folder to your CDN or static hosting.

3. Configure your backend API URL as an environment variable before building.

---

## 📄 Documentation

See [COMPONENTS_AND_ROUTES.md](./COMPONENTS_AND_ROUTES.md) for a detailed breakdown of all pages,
routes, and role access requirements.
