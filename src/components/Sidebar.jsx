import { NavLink } from "react-router-dom";
import { sidebarRoutes } from "../config/sidebarRoutes";

export default function Sidebar({ role, isOpen, onClose }) {
  const routes = sidebarRoutes[role] || [];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          top-0 left-0 h-full w-64 shrink-0
          bg-white border-r
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="h-16 px-6 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-700">
            EcoTrace 🌱
          </h1>

          <button
            onClick={onClose}
            className="md:hidden text-gray-500 text-xl"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {routes.map(r => (
            <NavLink
              key={r.path}
              to={r.path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-green-100 text-green-800 font-medium"
                    : "text-green-700 hover:bg-green-50"
                }`
              }
            >
              {r.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}