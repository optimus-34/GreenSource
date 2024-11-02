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

const defaultUser: User = {
  id: null,
  email: null,
  username: null,
  userType: null,
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: defaultUser,
  token: null,
  loading: false,
  error: null,
};

// Improved helper function to safely parse JSON with better type checking
const safeJsonParse = (json: string | null): User => {
  if (!json) return defaultUser;
  try {
    const parsed = JSON.parse(json);
    // Validate the parsed object has the expected shape
    if (typeof parsed === "object" && parsed !== null) {
      return {
        id: parsed.id ?? null,
        email: parsed.email ?? null,
        username: parsed.username ?? null,
        userType: parsed.userType ?? null,
      };
    }
    return defaultUser;
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    return defaultUser;
  }
};

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  try {
    const storedToken = localStorage.getItem("token");
    const storedUser = safeJsonParse(localStorage.getItem("user"));

    if (storedToken && storedUser.id) {
      return {
        ...initialState,
        isAuthenticated: true,
        token: storedToken,
        user: storedUser,
      };
    }
  } catch (error) {
    console.error("Error loading initial state:", error);
  }
  return initialState;
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
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

      try {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } catch (error) {
        console.error("Error storing auth data:", error);
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = defaultUser;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = defaultUser;
      state.token = null;
      state.loading = false;
      state.error = null;

      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (error) {
        console.error("Error clearing auth data:", error);
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      state.user = { ...state.user, ...action.payload };
      try {
        localStorage.setItem("user", JSON.stringify(state.user));
      } catch (error) {
        console.error("Error updating user data:", error);
      }
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

      try {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } catch (error) {
        console.error("Error storing signup data:", error);
      }
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = defaultUser;
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

// Simplified selector that just returns the state
export const selectAuth = (state: { auth: AuthState }): AuthState => state.auth;

export default authSlice.reducer;
