import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string | null;
  email: string | null;
  username: string | null;
  userType: "consumer" | "farmer" | "admin" | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    id: null,
    email: null,
    username: null,
    userType: null,
  },
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      // Store token in localStorage for persistence
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = initialState.user;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {
        id: null,
        email: null,
        username: null,
        userType: null,
      };
      state.token = null;
      state.loading = false;
      state.error = null;
      // Clear localStorage on logout
      localStorage.clear();
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      state.user = { ...state.user, ...action.payload };
      // Update localStorage when user data changes
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = initialState.user;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  signupStart,
  signupSuccess,
  signupFailure,
} = authSlice.actions;

// Add a selector to easily access auth state
export const selectAuth = (state: { auth: AuthState }) => {
  // Get stored auth data from localStorage
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // If there's stored data but state is empty, return merged state
  if (storedToken && storedUser && !state.auth.token) {
    return {
      ...state.auth,
      isAuthenticated: true,
      token: storedToken,
      user: JSON.parse(storedUser),
    };
  }

  return state.auth;
};
export default authSlice.reducer;
