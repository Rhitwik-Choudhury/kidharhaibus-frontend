// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, handleAPIError } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

/**
 * Extract { user, token } from different backend shapes.
 * Supports: { user }, { school }, { parent }, { driver }, { createdUser }, { newUser }, { data: { user } }
 * Token supports: { token }, { accessToken }, { data: { token } }
 */
const extractUserAndToken = (resp) => {
  const d = resp?.data ?? resp ?? {};
  const user =
    d.user ||
    d.createdUser ||
    d.newUser ||
    d.school ||
    d.parent ||
    d.driver ||
    d.data?.user;

  const token = d.token || d.accessToken || d.data?.token || '';
  return { user, token, raw: d };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('kidharhaibus_user');
      const storedRole = localStorage.getItem('kidharhaibus_role');
      const storedToken = localStorage.getItem('kidharhaibus_token');

      if (storedUser && storedRole && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const normalizedUser = { ...parsedUser, id: parsedUser.id || parsedUser._id };
          setUser(normalizedUser);
          setUserRole(storedRole);
          setToken(storedToken);
          console.log('User in AuthContext:', normalizedUser);
        } catch {
          localStorage.removeItem('kidharhaibus_user');
          localStorage.removeItem('kidharhaibus_role');
          localStorage.removeItem('kidharhaibus_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /** Login keeps requiring a user in the response */
  const login = async (email, password, role) => {
    try {
      const response = await authAPI.signIn(email, password, role);
      const { user: userData, token, raw } = extractUserAndToken(response);

      if (!userData) {
        throw new Error(raw?.message || 'Login failed: server did not return a user.');
      }

      const normalizedUser = { ...userData, id: userData.id || userData._id };

      setUser(normalizedUser);
      setUserRole(role);
      setToken(token || '');
      localStorage.setItem('kidharhaibus_user', JSON.stringify(normalizedUser));
      localStorage.setItem('kidharhaibus_role', role);
      if (token) localStorage.setItem('kidharhaibus_token', token);

      return { success: true, user: normalizedUser };
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  /**
   * Signup:
   * - If backend returns a user, we store it (auto-login path).
   * - If backend returns only a message (e.g., "School registered successfully") with NO user,
   *   we treat it as success (createdOnly) and DO NOT throw.
   */
  const signup = async (userData, role) => {
    try {
      const response = await authAPI.signUp(userData, role);
      const { user: newUser, token, raw } = extractUserAndToken(response);

      // Auto-login path (user present)
      if (newUser) {
        const normalizedUser = { ...newUser, id: newUser.id || newUser._id };

        setUser(normalizedUser);
        setUserRole(role);
        setToken(token || '');
        localStorage.setItem('kidharhaibus_user', JSON.stringify(normalizedUser));
        localStorage.setItem('kidharhaibus_role', role);
        if (token) localStorage.setItem('kidharhaibus_token', token);

        return { success: true, user: normalizedUser, message: raw?.message };
      }

      // Created-only path (no user returned by backend)
      return {
        success: true,
        user: null,
        createdOnly: true,
        message: raw?.message || 'Account created',
      };
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setUserRole(null);
      setToken(null);
      localStorage.removeItem('kidharhaibus_user');
      localStorage.removeItem('kidharhaibus_role');
      localStorage.removeItem('kidharhaibus_token');
    }
  };

  // OTP helpers (use env-aware api client)
  const sendOTP = async (email) => {
    try {
      const { data } = await authAPI.sendOTP(email);
      return data;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const { data } = await authAPI.verifyOTP(email, otp);
      return data?.success ?? true;
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        token,
        loading,
        login,
        signup,
        logout,
        sendOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
