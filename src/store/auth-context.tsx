/**
 * Authentication Context & Provider
 * Global state management for user authentication
 */

"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { AuthState } from "@/src/model/user";
import { authApi } from "../api/auth";
import { apiClient } from "../api/client";

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
  ) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    refreshToken: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth on mount - check if token exists
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken"): null;
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken"): null;

      if (accessToken && refreshToken) {

        apiClient.setToken(accessToken, refreshToken);
        const response = await authApi.getMe();

        if (response.success && response.data) {
          setAuthState({
            user: response.data,
            accessToken: accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Token invalid, clear it
          apiClient.clearToken();
          setAuthState({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else if ( !accessToken && refreshToken){
        try {
          const response = await authApi.refreshAccessToken(refreshToken)
          if (response.success && response.data) {
            apiClient.setAccessToken(response.data.accessToken)
            setAuthState({
              error: null,
              isLoading: false,
              isAuthenticated: true,
              user: response.data.user,
              accessToken: response.data.accessToken
            })
          } else {
            apiClient.clearToken()
          }
        } catch (error) {
          apiClient.clearToken()
        } 
        
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    const response = await authApi.login(email, password);

    if (response.success && response.data) {
      setAuthState({
        user: response.data.user,
        accessToken: response.data.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: response.error || "Login failed",
      }));
      throw new Error("Login failed");
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    refreshToken: string
  ) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    const response = await authApi.register(
      email,
      password,
      firstName,
      lastName,
      refreshToken
    );

    if (response && response.data) {
      setAuthState({
        user: response.data.user,
        accessToken: response.data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: response.error || "Registration failed",
      }));
      throw new Error(response.error || "Registration failed");
    }
  };

  const logout = async () => {
    await authApi.logout();
    setAuthState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const resetError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        resetError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
