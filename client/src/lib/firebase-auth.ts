// Firebase Authentication Service
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// User registration
export const registerUser = async (email: string, password: string, userData: {
  firstName: string;
  lastName: string;
  phone: string;
  company?: string;
}) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });

    // Create user document in Firestore
    const userDoc = {
      id: user.uid,
      email: user.email,
      fullName: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      company: userData.company || '',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      isEmailVerified: user.emailVerified,
      profileImage: ''
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);

    return { success: true, user, userDoc };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// User login
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    return { 
      success: true, 
      user, 
      userData: userDoc.exists() ? userDoc.data() : null 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// User logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Password reset
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get current user data
export const getCurrentUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, userData: userDoc.data() };
    }
    return { success: false, error: 'User not found' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, userData: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  profileImage?: string;
}) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Get current user data
    const currentUserDoc = await getDoc(userRef);
    if (!currentUserDoc.exists()) {
      return { success: false, error: 'User not found' };
    }

    const currentData = currentUserDoc.data();
    
    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };

    // Update fields if provided
    if (userData.firstName !== undefined) {
      updateData.firstName = userData.firstName;
      updateData.fullName = `${userData.firstName} ${userData.lastName || currentData.lastName}`;
    }
    if (userData.lastName !== undefined) {
      updateData.lastName = userData.lastName;
      updateData.fullName = `${userData.firstName || currentData.firstName} ${userData.lastName}`;
    }
    if (userData.phone !== undefined) {
      updateData.phone = userData.phone;
    }
    if (userData.company !== undefined) {
      updateData.company = userData.company;
    }
    if (userData.profileImage !== undefined) {
      updateData.profileImage = userData.profileImage;
    }

    // Update the document
    await setDoc(userRef, updateData, { merge: true });

    return { success: true, message: 'Profile updated successfully' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
