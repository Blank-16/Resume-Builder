import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import {
  setCredentials, setAccessToken, setLoading, logout,
} from "@/store/features/authSlice";
import { authApi } from "@/services/api";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";
import { HomePage }          from "@/features/home/HomePage";
import { LoginPage }         from "@/features/resume/LoginPage";
import { DashboardPage }     from "@/features/resume/DashboardPage";
import { ResumeBuilderPage } from "@/features/resume/ResumeBuilderPage";
import { PublicPreviewPage } from "@/features/resume/PublicPreviewPage";
import { SettingsPage }      from "@/features/resume/SettingsPage";

// How many ms before access token expiry to trigger a silent refresh.
// Access tokens last 15 min (900_000 ms) — refresh 2 min early.
const REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000;
const ACCESS_TOKEN_LIFETIME_MS = 15 * 60 * 1000;

function AppBootstrap() {
  const dispatch     = useAppDispatch();
  const token        = useAppSelector((s) => s.auth.token);
  const refreshToken = useAppSelector((s) => s.auth.refreshToken);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Schedules a silent refresh of the access token
  function scheduleRefresh() {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(async () => {
      const storedRefresh = localStorage.getItem("refreshToken");
      if (!storedRefresh) return;
      try {
        const { data } = await authApi.refresh(storedRefresh);
        if (data.data?.token) {
          dispatch(setAccessToken(data.data.token));
          scheduleRefresh(); // reschedule for the next cycle
        }
      } catch {
        // Refresh token expired — force logout
        dispatch(logout());
      }
    }, ACCESS_TOKEN_LIFETIME_MS - REFRESH_BEFORE_EXPIRY_MS);
  }

  useEffect(() => {
    // No token at all — stop loading immediately
    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    // Verify access token is still valid by calling /me
    authApi
      .me()
      .then(({ data }) => {
        if (data.data) {
          dispatch(setCredentials({ token, user: data.data }));
          scheduleRefresh();
        }
      })
      .catch(async () => {
        // Access token invalid — try silent refresh if we have a refresh token
        const storedRefresh = localStorage.getItem("refreshToken");
        if (storedRefresh) {
          try {
            const { data } = await authApi.refresh(storedRefresh);
            if (data.data?.token) {
              dispatch(setAccessToken(data.data.token));
              // Re-fetch user profile with new access token
              const { data: meData } = await authApi.me();
              if (meData.data) {
                dispatch(setCredentials({ token: data.data.token, user: meData.data }));
                scheduleRefresh();
                return;
              }
            }
          } catch {
            // Refresh also failed — clear everything
          }
        }
        dispatch(logout());
      })
      .finally(() => {
        dispatch(setLoading(false));
      });

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When token changes (e.g. after login), restart the refresh schedule
  useEffect(() => {
    if (token && refreshToken) scheduleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
          style: {
            fontSize:     "13px",
            maxWidth:     "360px",
            borderRadius: "10px",
            background:   "var(--surface-raised)",
            color:        "var(--text-primary)",
            border:       "1px solid var(--border-strong)",
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/"            element={<HomePage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/preview/:id" element={<PublicPreviewPage />} />

        {/* Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/builder/:id" element={
          <ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
