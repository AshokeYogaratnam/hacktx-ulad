export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  financialData?: any; // Reference to stored financial data
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
  confirmPassword: string;
}