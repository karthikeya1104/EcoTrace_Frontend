import { useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getUser, isAuthenticated, logout } from "../utils/useAuth";

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  const user = getUser();

  return (
    <div className="min-h-screen bg-green-50 flex">

      {/* Sidebar */}
      <Sidebar
        role={user.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile header (same height as sidebar) */}
        <header className="md:hidden h-16 bg-white border-b px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl text-green-700"
            >
              ☰
            </button>

            <div className="flex flex-col leading-tight">
              <span className="font-bold text-green-700">EcoTrace 🌱</span>
              <span className="text-xs text-gray-500">{title}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-lg"
          >
            Logout
          </button>
        </header>

        {/* Desktop header (aligned with sidebar) */}
        <div className="hidden md:flex h-16 items-center justify-between bg-white border-b px-6">
          
          {/* Page Context ONLY (no brand duplication) */}
          <div className="flex flex-col leading-tight">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>

          {/* User */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.name} ({user.role})
            </span>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
