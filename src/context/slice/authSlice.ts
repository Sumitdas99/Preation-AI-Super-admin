import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  brandId?: string;
  brand_id?: string;
  brandName?: string;
  brand_name?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
    logout() {
      return initialState;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    updateUserProfile(state, action: PayloadAction<{ firstName: string; lastName: string }>) {
      if (state.user) {
        state.user.firstName = action.payload.firstName;
        state.user.lastName = action.payload.lastName;
        state.user.name = `${action.payload.firstName} ${action.payload.lastName}`.trim();
      }
    },
  },
});

export const { loginSuccess, logout, setLoading, updateUserProfile } = authSlice.actions;
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserRole = (state: { auth: AuthState }): UserRole | null =>
  state.auth.user?.role || null;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export default authSlice.reducer;
