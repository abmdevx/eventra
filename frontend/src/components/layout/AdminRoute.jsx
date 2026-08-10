import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EmptyState, ShieldIcon } from "../shared";

export default function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <EmptyState
        icon={<ShieldIcon width={22} height={22} />}
        title="Admins only"
        description="You need an admin account to view this page."
      />
    );
  }

  return <Outlet />;
}
