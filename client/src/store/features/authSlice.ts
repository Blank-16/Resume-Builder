import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

interface AuthState {
  token:        string | null;
  refreshToken: string | null;
  user:         User | null;
  loading:      boolean;
}

const initialState: AuthState = {
  token:        localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  user:         null,
  loading:      true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; refreshToken?: string; user: User }>
    ) {
      state.token = action.payload.token;
      state.user  = action.payload.user;
      state.loading = false;
      localStorage.setItem("token", action.payload.token);
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },
    // Called after a silent refresh — only updates the access token
    setAccessToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    logout(state) {
      state.token        = null;
      state.refreshToken = null;
      state.user         = null;
      state.loading      = false;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const {
  setCredentials, setAccessToken, setUser, setLoading, logout,
} = authSlice.actions;

export default authSlice.reducer;
