import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, AuthState, AuthResponse } from '@/types/user';

// Auth Action Types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

// Auth Context Interface
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    phone: string;
    company?: string;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updateProfile: (userData: Partial<User>) => Promise<AuthResponse>;
  clearError: () => void;
}

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

// Initial State
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false
};

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Convert Firebase User to App User
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        company: userData.company,
        role: userData.role,
        createdAt: userData.createdAt.toDate(),
        updatedAt: userData.updatedAt.toDate(),
        isEmailVerified: userData.isEmailVerified,
        profileImage: userData.profileImage,
        preferences: userData.preferences,
        address: userData.address
      };
    }
    return null;
  } catch (error) {
    console.error('Error converting Firebase user:', error);
    return null;
  }
};

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await convertFirebaseUser(firebaseUser);
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { loginUser } = await import('@/lib/firebase-auth');
      const result = await loginUser(email, password);

      if (result.success && result.userData) {
        const user = await convertFirebaseUser(result.user);
        dispatch({ type: 'SET_USER', payload: user });
        return { success: true, user };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Login failed' });
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Signup function
  const signup = async (email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    phone: string;
    company?: string;
  }): Promise<AuthResponse> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { registerUser } = await import('@/lib/firebase-auth');
      const result = await registerUser(email, password, userData);

      if (result.success && result.userDoc) {
        const user = await convertFirebaseUser(result.user);
        dispatch({ type: 'SET_USER', payload: user });
        return { success: true, user };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Registration failed' });
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      const { logoutUser } = await import('@/lib/firebase-auth');
      await logoutUser();
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('user');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { resetPassword: resetPasswordFn } = await import('@/lib/firebase-auth');
      const result = await resetPasswordFn(email);

      if (result.success) {
        return { success: true, message: 'Password reset email sent' };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Password reset failed' });
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Password reset failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<AuthResponse> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      if (!state.user?.id) {
        throw new Error('No user logged in');
      }

      const { updateUserProfile } = await import('@/lib/firebase-auth');
      const result = await updateUserProfile(state.user.id, userData);

      if (result.success) {
        // Update local user state
        const updatedUser = { ...state.user, ...userData };
        dispatch({ type: 'SET_USER', payload: updatedUser });
        return { success: true, message: 'Profile updated successfully' };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Profile update failed' });
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Profile update failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
