import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/useAuth";

export default function ProtectedRoute({ children, role }) {
  const auth = getAuth();

  if (!auth) return <Navigate to="/login" replace />;

  // Redirect to correct dashboard if wrong role
  if (role && auth.role !== role) {
    return <Navigate to={`/${auth.role}/dashboard`} replace />;
  }

  return children;
}
