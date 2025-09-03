# SignFlow Authentication System

## Overview

SignFlow uses Firebase Authentication with Firestore for user management. The system provides comprehensive user registration, login, profile management, and role-based access control.

## 🏗️ Architecture

### Frontend Components
- **AuthContext**: Centralized authentication state management
- **ProtectedRoute**: Route protection with role-based access control
- **UserProfile**: Comprehensive user profile display
- **Login/Signup Pages**: Modern, responsive authentication forms

### Backend Services
- **Firebase Auth**: User authentication (email/password)
- **Firestore**: User data storage and management
- **User Service**: Additional user management functions

## 📋 User Data Structure

```typescript
interface User {
  id: string;                    // Firebase Auth UID
  email: string;                // User email
  fullName: string;             // First + Last name
  firstName: string;            // First name
  lastName: string;             // Last name
  phone: string;                // Phone number
  company?: string;             // Company name (optional)
  role: UserRole;               // 'user' | 'admin' | 'designer' | 'manager'
  createdAt: Date;              // Account creation date
  updatedAt: Date;              // Last update date
  isEmailVerified: boolean;     // Email verification status
  profileImage?: string;        // Profile image URL
  preferences?: UserPreferences; // User preferences
  address?: UserAddress;        // Shipping address
}
```

## 🔐 Authentication Features

### ✅ Implemented Features
- [x] User registration with email/password
- [x] User login with email/password
- [x] User logout
- [x] Password reset functionality
- [x] Email verification status tracking
- [x] Remember me functionality
- [x] Form validation with error handling
- [x] Password strength indicator
- [x] Social login buttons (UI ready)
- [x] Role-based access control
- [x] Protected routes
- [x] User profile management
- [x] Centralized auth state management

### 🚧 Frontend Fields Available

#### Login Form (`/login`)
- Email address (with validation)
- Password (with show/hide toggle)
- Remember me checkbox
- Forgot password link
- Demo credentials
- Social login buttons (Google, Twitter)

#### Signup Form (`/signup`)
- First Name (required, min 2 chars)
- Last Name (required, min 2 chars)
- Email Address (required, email validation)
- Phone Number (required, phone validation)
- Password (required, strength indicator)
- Confirm Password (required, must match)
- Company (optional)
- Terms of Service agreement

## 🛠️ Usage Examples

### Using the Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading, isAuthenticated, login, signup, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <button onClick={() => login('email@example.com', 'password')}>
        Sign In
      </button>
    );
  }

  return (
    <div>
      <p>Welcome, {user?.fullName}!</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

### Protected Routes

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* Basic protection */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>

      {/* Role-based protection */}
      <Route path="/admin">
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      </Route>
    </Router>
  );
}
```

### User Profile Management

```tsx
import { updateUserProfile } from '@/lib/user-service';

const handleProfileUpdate = async (userData) => {
  const success = await updateUserProfile(userId, userData);
  if (success) {
    // Profile updated successfully
  }
};
```

## 🔧 Setup Instructions

### 1. Firebase Configuration
Ensure your Firebase configuration is set up in `client/src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};
```

### 2. Firestore Rules
Update your Firestore security rules in `firebase-backend/firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
  }
}
```

### 3. Environment Variables
Set up your environment variables in `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 🎨 UI Components

### Login Page Features
- Modern glassmorphism design
- Responsive layout (mobile/desktop)
- Animated transitions with Framer Motion
- Form validation with real-time feedback
- Password visibility toggle
- Demo credentials for testing
- Social login integration ready

### Signup Page Features
- Comprehensive form validation
- Password strength indicator
- Real-time field validation
- Terms of service agreement
- Professional design with animations
- Responsive layout

### User Profile Features
- Comprehensive user information display
- Role-based badges
- Account statistics
- Edit profile functionality
- Address management
- Preferences settings

## 🔒 Security Features

- Firebase Authentication for secure user management
- Firestore security rules for data protection
- Role-based access control
- Email verification tracking
- Password strength requirements
- Secure password reset flow
- Protected route implementation

## 📊 Database Schema

### Users Collection
```javascript
users/{userId} {
  id: string,
  email: string,
  fullName: string,
  firstName: string,
  lastName: string,
  phone: string,
  company: string,
  role: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  isEmailVerified: boolean,
  profileImage: string,
  preferences: {
    theme: string,
    language: string,
    notifications: object,
    defaultCurrency: string
  },
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  }
}
```

## 🚀 Next Steps

### Potential Enhancements
1. **Social Authentication**: Implement Google, Facebook, Twitter login
2. **Two-Factor Authentication**: Add 2FA support
3. **Email Verification**: Implement email verification flow
4. **Profile Image Upload**: Add profile picture upload functionality
5. **User Preferences**: Implement theme and notification preferences
6. **Admin Panel**: Create admin user management interface
7. **User Analytics**: Track user activity and engagement
8. **Multi-language Support**: Add internationalization

### Integration Points
- Connect with order management system
- Integrate with design editor for user projects
- Link with customer support system
- Connect with analytics and reporting

## 🐛 Troubleshooting

### Common Issues
1. **Firebase Connection**: Ensure Firebase config is correct
2. **Firestore Rules**: Check security rules for proper access
3. **Environment Variables**: Verify all required env vars are set
4. **CORS Issues**: Configure Firebase hosting for proper CORS

### Debug Mode
Enable debug logging by setting `console.log` statements in development mode.

---

This authentication system provides a solid foundation for user management in the SignFlow application with modern UI/UX, comprehensive security, and extensible architecture.
