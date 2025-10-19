"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { User, AuthState, LoginCredentials, RegisterCredentials } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateFinancialData: (data: any) => void;
  getFinancialData: () => any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "REGISTER_FAILURE"; payload: string };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return { user: action.payload, isLoading: false, error: null };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "LOGOUT":
      return { user: null, isLoading: false, error: null };
    default:
      return state;
  }
};

const STORAGE_KEY = "toyota_auth_user";
const FINANCIAL_DATA_KEY = "toyota_financial_data";
const USERS_STORAGE_KEY = "toyota_users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    error: null,
  });

  // Load saved user on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        dispatch({ type: "LOGIN_SUCCESS", payload: JSON.parse(savedUser) });
      }
    } catch (e) {
      console.error("Failed to load saved auth state:", e);
    } finally {
      // Even if loading fails, we're no longer loading
      if (state.isLoading) {
        dispatch({ type: "LOGIN_FAILURE", payload: "" });
      }
    }
  }, []);

  // Helper function to get stored users
  const getStoredUsers = () => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : {};
    } catch (e) {
      console.error("Failed to load users:", e);
      return {};
    }
  };

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getStoredUsers();
      const user = Object.values(users).find(
        (u: any) => u.username === credentials.username
      ) as User & { password: string };

      if (!user || user.password !== credentials.password) {
        throw new Error("Invalid username or password");
      }

      // Don't store password in session
      const { password, ...userWithoutPassword } = user;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      dispatch({ type: "LOGIN_SUCCESS", payload: userWithoutPassword });
    } catch (error) {
      dispatch({ 
        type: "LOGIN_FAILURE", 
        payload: error instanceof Error ? error.message : "Login failed" 
      });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: "REGISTER_START" });
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const users = getStoredUsers();
      
      // Check if username already exists
      if (Object.values(users).some((u: any) => u.username === credentials.username)) {
        throw new Error("Username already exists");
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        username: credentials.username,
        email: credentials.email,
        password: credentials.password, // In a real app, this would be hashed
        createdAt: new Date().toISOString(),
      };

      // Store user in users storage
      users[newUser.id] = newUser;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Don't store password in session
      const { password, ...userWithoutPassword } = newUser;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      dispatch({ type: "REGISTER_SUCCESS", payload: userWithoutPassword });
    } catch (error) {
      dispatch({ 
        type: "REGISTER_FAILURE", 
        payload: error instanceof Error ? error.message : "Registration failed" 
      });
      throw error;
    }
  };

  const logout = () => {
    // Only remove the current session and financial data, keep the users data
    localStorage.removeItem(STORAGE_KEY);
    if (state.user) {
      // Only remove financial data for the current user
      const financialStorage = localStorage.getItem(FINANCIAL_DATA_KEY);
      if (financialStorage) {
        const { userId } = JSON.parse(financialStorage);
        if (userId === state.user.id) {
          localStorage.removeItem(FINANCIAL_DATA_KEY);
        }
      }
    }
    dispatch({ type: "LOGOUT" });
  };

  const updateFinancialData = (data: any) => {
    if (!state.user) return;
    
    try {
      // Store financial data with user ID
      const financialStorage = {
        userId: state.user.id,
        data: data
      };
      localStorage.setItem(FINANCIAL_DATA_KEY, JSON.stringify(financialStorage));
      
      // Update user state with financial data
      const updatedUser = {
        ...state.user,
        financialData: data
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
    } catch (e) {
      console.error("Failed to save financial data:", e);
    }
  };

  const getFinancialData = () => {
    if (!state.user) return null;
    
    try {
      const financialStorage = localStorage.getItem(FINANCIAL_DATA_KEY);
      if (financialStorage) {
        const { userId, data } = JSON.parse(financialStorage);
        // Only return data if it belongs to the current user
        if (userId === state.user.id) {
          return data;
        }
      }
    } catch (e) {
      console.error("Failed to load financial data:", e);
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      register, 
      logout,
      updateFinancialData,
      getFinancialData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}