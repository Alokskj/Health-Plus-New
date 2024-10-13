import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePic: string;
  } | null;
}

// Utility function to check if the stored date is more than 29 days ago
const isExpired = (storedDate: string): boolean => {
  const stored = new Date(storedDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - stored.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 9;
};

// Load the initial state from localStorage if available
const loadAuthState = (): AuthState => {
  const storedAuthData = localStorage.getItem("authData");
  if (storedAuthData) {
    const parsedAuthData = JSON.parse(storedAuthData);
    if (isExpired(parsedAuthData.date)) {
      localStorage.removeItem("authData");
      return {
        isAuthenticated: false,
        token: "",
        user: null,
      };
    }
    return {
      isAuthenticated: parsedAuthData.isAuthenticated,
      token: parsedAuthData.token,
      user: parsedAuthData.user,
    };
  }
  return {
    isAuthenticated: false,
    token: "",
    user: null,
  };
};

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        isAuthenticated: boolean;
        token: string;
        user: {
          _id: string;
          name: string;
          email: string;
          role: string;
          profilePic: string;
        };
      }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem(
        "authData",
        JSON.stringify({ ...state, date: new Date().toISOString() })
      );
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = "";
      state.user = null;
      localStorage.removeItem("authData");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
