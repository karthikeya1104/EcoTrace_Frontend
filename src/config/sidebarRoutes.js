export const sidebarRoutes = {
  manufacturer: [
    { label: "Dashboard", path: "/manufacturer/dashboard" },
    { label: "Create Product", path: "/manufacturer/products/create" },
    { label: "Products", path: "/manufacturer/products" },
    { label: "Batches", path: "/manufacturer/batches" }
  ],

  transporter: [
    { label: "Dashboard", path: "/transporter/dashboard" },
    { label: "My Transports", path: "/transporter/transports" },
    { label: "Create Transport", path: "/transporter/create" }
  ],

  lab: [
    { label: "Dashboard", path: "/lab/dashboard" },
    { label: "My Reports", path: "/lab/reports" },
    { label: "Pending Tests", path: "/lab/pending-tests" }
  ],
  consumer: []
};
