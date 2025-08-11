// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, handleAPIError } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
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
          // Normalize _id to id if needed
          const normalizedUser = {
            ...parsedUser,
            id: parsedUser.id || parsedUser._id,
          };

          setUser(normalizedUser);
          setUserRole(storedRole);
          setToken(storedToken);
          console.log("User in AuthContext:", normalizedUser);
        } catch (error) {
          localStorage.removeItem('kidharhaibus_user');
          localStorage.removeItem('kidharhaibus_role');
          localStorage.removeItem('kidharhaibus_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await authAPI.signIn(email, password, role);
      const { user: userData, token } = response.data;

      const normalizedUser = {
        ...userData,
        id: userData.id || userData._id,
      };

      setUser(normalizedUser);
      setUserRole(role);
      setToken(token);
      localStorage.setItem('kidharhaibus_user', JSON.stringify(normalizedUser));
      localStorage.setItem('kidharhaibus_role', role);
      localStorage.setItem('kidharhaibus_token', token);
      return { success: true, user: normalizedUser };
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  const signup = async (userData, role) => {
    try {
      const response = await authAPI.signUp(userData, role);
      const { user: newUser, token } = response.data;

      const normalizedUser = {
        ...newUser,
        id: newUser.id || newUser._id,
      };

      setUser(normalizedUser);
      setUserRole(role);
      setToken(token);
      localStorage.setItem('kidharhaibus_user', JSON.stringify(normalizedUser));
      localStorage.setItem('kidharhaibus_role', role);
      localStorage.setItem('kidharhaibus_token', token);
      return { success: true, user: normalizedUser };
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      setUserRole(null);
      setToken(null);
      localStorage.removeItem('kidharhaibus_user');
      localStorage.removeItem('kidharhaibus_role');
      localStorage.removeItem('kidharhaibus_token');
    }
  };

  // --- FIXED: use env-aware API client instead of hardcoded localhost ---
  const sendOTP = async (email) => {
    try {
      const { data } = await authAPI.sendOTP(email);
      return data; // { message, ... }
    } catch (error) {
      throw new Error(handleAPIError(error));
    }
  };

  // --- FIXED: use env-aware API client instead of hardcoded localhost ---
  const verifyOTP = async (email, otp) => {
    try {
      const { data } = await authAPI.verifyOTP(email, otp);
      // your backend likely returns { success: true } or similar
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
