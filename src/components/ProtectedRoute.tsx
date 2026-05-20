import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#0D1117" }}>
        <div className="text-[12px]" style={{ color: "#8892a0" }}>Chargement…</div>
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};

export default ProtectedRoute;
