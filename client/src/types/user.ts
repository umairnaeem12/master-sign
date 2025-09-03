// User Types for SignFlow Application
export interface User {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string;
  company?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  profileImage?: string;
  preferences?: UserPreferences;
  address?: UserAddress;
}

export type UserRole = 'user' | 'admin' | 'designer' | 'manager';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  notifications?: NotificationSettings;
  defaultCurrency?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Auth State Interface
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Login Form Interface
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Signup Form Interface
export interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  company?: string;
  acceptTerms: boolean;
}

// Auth Response Interface
export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

// Password Reset Interface
export interface PasswordResetForm {
  email: string;
}

// Profile Update Interface
export interface ProfileUpdateForm {
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  address?: UserAddress;
  preferences?: UserPreferences;
}
