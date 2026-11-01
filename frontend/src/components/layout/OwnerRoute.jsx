import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EmptyState, ShieldIcon } from "../shared";

export default function OwnerRoute() {
  const { isAuthenticated, isOwner } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOwner) {
    return (
      <EmptyState
        icon={<ShieldIcon width={22} height={22} />}
        title="Owners only"
        description="Only the account owner can manage administrators and audit activity."
      />
    );
  }

  return <Outlet />;
}
