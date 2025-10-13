import { createSlice } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

interface LoginPayload {
  user: User;
  token: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};// başlangıç durumu

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: { payload: LoginPayload }) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    checkAuth: (state) => {
      // localStorage'dan token kontrolü
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.isAuthenticated = true;
          state.user = user;
          state.token = token;
        } catch (error) {
          // Invalid JSON, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    },
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
