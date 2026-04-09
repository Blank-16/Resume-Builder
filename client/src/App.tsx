import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { setCredentials, setLoading, logout } from "@/store/features/authSlice";
import { authApi } from "@/services/api";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";
import { HomePage } from "@/features/home/HomePage";
import { LoginPage } from "@/features/resume/LoginPage";
import { DashboardPage } from "@/features/resume/DashboardPage";
import { ResumeBuilderPage } from "@/features/resume/ResumeBuilderPage";
import { PublicPreviewPage } from "@/features/resume/PublicPreviewPage";

function AppBootstrap() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);

  useEffect(() => {
    // No token in localStorage — nothing to verify, stop loading immediately
    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    // Token exists — verify it is still valid with the server
    authApi
      .me()
      .then(({ data }) => {
        if (data.data) dispatch(setCredentials({ token, user: data.data }));
      })
      .catch(() => {
        // Token is invalid or expired — clear it
        dispatch(logout());
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppBootstrap />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "13px", maxWidth: "360px", borderRadius: "10px" },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/preview/:id" element={<PublicPreviewPage />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder/:id"
          element={
            <ProtectedRoute>
              <ResumeBuilderPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
