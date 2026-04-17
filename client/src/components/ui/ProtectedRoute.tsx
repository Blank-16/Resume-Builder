import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppStore";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { token, loading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  // Auth bootstrap is still running — don't redirect yet
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-sm"
        style={{ background: "var(--bg)", color: "var(--text-muted)" }}
      >
        <span className="spinner mr-2" />
        Loading…
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
