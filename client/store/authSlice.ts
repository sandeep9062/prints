import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    image?: string;
    role: string;
    wishlist: any[];
    addresses: any[];
  } | null;
  token: string | null;
}

const initialState: AuthState = (() => {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }
  try {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    if (token && userString) {
      return {
        isAuthenticated: true,
        user: JSON.parse(userString),
        token,
      };
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
  }
  return {
    isAuthenticated: false,
    user: null,
    token: null,
  };
})();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        user: {
          _id: string;
          name: string;
          email: string;
          phone: string;
          image?: string;
          role: string;
          wishlist: any[];
          addresses: any[];
        };
        token: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setUser(
      state,
      action: PayloadAction<{
        user: {
          _id: string;
          name: string;
          email: string;
          phone: string;
          image?: string;
          role: string;
          wishlist: any[];
          addresses: any[];
        };
        token: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      } catch (e) {
        // ignore storage errors
      }
    },
  },
});

export const { loginSuccess, logoutSuccess, setUser } = authSlice.actions;

export default authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
