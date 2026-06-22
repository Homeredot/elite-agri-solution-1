import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="screen-center">Loading admin panel...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
