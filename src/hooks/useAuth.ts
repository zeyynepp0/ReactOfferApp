import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from '../redux/store';
import { login, logout, checkAuth } from '../redux/authSlice';

// Custom hook for authentication management
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const loginUser = useCallback((credentials: { user: any; token: string }) => {
    dispatch(login(credentials));
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const checkAuthentication = useCallback(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    token,
    loginUser,
    logoutUser,
    checkAuthentication,
  };
};
