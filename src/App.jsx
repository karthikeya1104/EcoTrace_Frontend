import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicBatch from "./pages/PublicBatch";
import ProtectedRoute from "./auth/ProtectedRoute";

// Manufacturer pages
import Dashboard from "./pages/manufacturer/Dashboard";
import CreateProduct from "./pages/manufacturer/CreateProduct";
import ProductList from "./pages/manufacturer/ProductList";
import CreateBatch from "./pages/manufacturer/CreateBatch";
import BatchList from "./pages/manufacturer/BatchList";
import ProductView from "./pages/manufacturer/ProductView";

// Transporter pages
import TransporterDashboard from "./pages/transporter/Dashboard";
import CreateTransport from "./pages/transporter/CreateTransport";
import TransportList from "./pages/transporter/TransportList";
import TransportDetail from "./pages/transporter/TransportDetail";

// Lab pages
import LabDashboard from "./pages/lab/Dashboard";
import LabReportList from "./pages/lab/LabReportList";
import PendingTests from "./pages/lab/PendingTests";
import CreateReport from "./pages/lab/CreateReport";
import LabReportDetail from "./pages/lab/LabReportDetail";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminReportsList from "./pages/admin/AdminReportsList";
import AdminReportDetail from "./pages/admin/AdminReportDetail";

// Consumer pages
import BatchReviews from "./pages/consumer/BatchReviews";
import ConsumerDashboard from "./pages/consumer/Dashboard";
import MyReviews from "./pages/consumer/MyReviews";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* QR public page */} 
        <Route path="/public/batch/:id" element={<PublicBatch />} />
        
        {/* Manufacturer pages */}
        <Route path="/manufacturer/dashboard" element={<ProtectedRoute role="manufacturer"><Dashboard /></ProtectedRoute>} />
        <Route path="/manufacturer/products" element={ <ProtectedRoute role="manufacturer"> <ProductList /> </ProtectedRoute> } />
        <Route path="/manufacturer/products/create" element={ <ProtectedRoute role="manufacturer"> <CreateProduct /> </ProtectedRoute> } />
        <Route path="/manufacturer/batch/create/:productId" element={ <ProtectedRoute role="manufacturer"> <CreateBatch /> </ProtectedRoute> } />
        <Route path="/manufacturer/batches" element={ <ProtectedRoute role="manufacturer"> <BatchList /> </ProtectedRoute> } />
        <Route path="/manufacturer/products/:id" element={ <ProtectedRoute role="manufacturer"> <ProductView /> </ProtectedRoute> } />
        
        {/* Transporter pages */}
        <Route path="/transporter/dashboard" element={<ProtectedRoute role="transporter"><TransporterDashboard /></ProtectedRoute>} />
        <Route path="/transporter/create" element={<ProtectedRoute role="transporter"><CreateTransport /></ProtectedRoute>} />
        <Route path="/transporter/transports" element={<ProtectedRoute role="transporter"><TransportList /></ProtectedRoute>} />
        <Route path="/transporter/transports/:id" element={<ProtectedRoute role="transporter"><TransportDetail /></ProtectedRoute>} />
        
        {/* Lab pages */}
        <Route path="/lab/dashboard" element={<ProtectedRoute role="lab"><LabDashboard /></ProtectedRoute>} />
        <Route path="/lab/reports" element={<ProtectedRoute role="lab"><LabReportList /></ProtectedRoute>} />
        <Route path="/lab/pending-tests" element={<ProtectedRoute role="lab"><PendingTests /></ProtectedRoute>} />
        <Route path="/lab/create-report/:batchId" element={<ProtectedRoute role="lab"><CreateReport /></ProtectedRoute>} />
        <Route path="/lab/reports/:reportId" element={<ProtectedRoute role="lab"><LabReportDetail /></ProtectedRoute>} />

        {/* Admin pages */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReportsList /></ProtectedRoute>} />
        <Route path="/admin/reports/:id" element={<ProtectedRoute role="admin"><AdminReportDetail /></ProtectedRoute>} />

        {/* Consumer pages */}
        <Route path="/consumer/batches/:id/reviews" element={<ProtectedRoute role="consumer"><BatchReviews /></ProtectedRoute>} />
        <Route path="/consumer/dashboard" element={<ProtectedRoute role="consumer"><ConsumerDashboard /></ProtectedRoute>} />
        <Route path="/consumer/my-reviews" element={<ProtectedRoute role="consumer"><MyReviews /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Page not found
    </div>
  );
}
