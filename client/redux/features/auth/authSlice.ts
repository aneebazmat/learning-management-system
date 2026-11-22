import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string;
  user: any;
}

const initialState: AuthState = {
  token: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: any }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      if (typeof window !== "undefined") {
        try {
          if (action.payload.accessToken) {
            localStorage.setItem("access_token", action.payload.accessToken);
          }
          if (action.payload.user) {
            localStorage.setItem("user_session", JSON.stringify(action.payload.user));
          }
        } catch (_) {}
      }
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_session");
        } catch (_) {}
      }
    },
    userLoaded: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
      if (typeof window !== "undefined" && action.payload.user) {
        try {
          localStorage.setItem("user_session", JSON.stringify(action.payload.user));
        } catch (_) {}
      }
    },
    syncAuthState: (state) => {
      if (typeof window !== "undefined") {
        try {
          const token = localStorage.getItem("access_token") || "";
          const userStr = localStorage.getItem("user_session");
          if (token && !state.token) {
            state.token = token;
          }
          if (userStr && !state.user) {
            state.user = JSON.parse(userStr);
          }
        } catch (_) {}
      }
    },
  },
});

export const {
  userRegistration,
  userLoggedIn,
  userLoggedOut,
  userLoaded,
  syncAuthState,
} = authSlice.actions;

export default authSlice.reducer;
