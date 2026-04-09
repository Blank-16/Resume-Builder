import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false; // always unblock protected routes after login
      localStorage.setItem("token", action.payload.token);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.loading = false; // reset so ProtectedRoute doesn't freeze after logout
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
