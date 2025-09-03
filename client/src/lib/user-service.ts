import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, ProfileUpdateForm, UserPreferences, UserAddress } from '@/types/user';

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
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
    console.error('Error getting user:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, userData: ProfileUpdateForm): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };

    if (userData.firstName) {
      updateData.firstName = userData.firstName;
      updateData.fullName = `${userData.firstName} ${userData.lastName || ''}`.trim();
    }
    
    if (userData.lastName) {
      updateData.lastName = userData.lastName;
      updateData.fullName = `${userData.firstName || ''} ${userData.lastName}`.trim();
    }
    
    if (userData.phone) updateData.phone = userData.phone;
    if (userData.company !== undefined) updateData.company = userData.company;
    if (userData.address) updateData.address = userData.address;
    if (userData.preferences) updateData.preferences = userData.preferences;

    await updateDoc(userRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Update user preferences
export const updateUserPreferences = async (userId: string, preferences: UserPreferences): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      preferences,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return false;
  }
};

// Update user address
export const updateUserAddress = async (userId: string, address: UserAddress): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      address,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating user address:', error);
    return false;
  }
};

// Delete user account
export const deleteUserAccount = async (userId: string): Promise<boolean> => {
  try {
    // Delete user document
    await deleteDoc(doc(db, 'users', userId));
    
    // Note: Firebase Auth user deletion should be handled separately
    // This only deletes the Firestore document
    return true;
  } catch (error) {
    console.error('Error deleting user account:', error);
    return false;
  }
};

// Get users by role
export const getUsersByRole = async (role: string): Promise<User[]> => {
  try {
    const usersQuery = query(collection(db, 'users'), where('role', '==', role));
    const querySnapshot = await getDocs(usersQuery);
    
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
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
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users by role:', error);
    return [];
  }
};

// Search users by name or email
export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  try {
    const usersQuery = query(collection(db, 'users'));
    const querySnapshot = await getDocs(usersQuery);
    
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const fullName = userData.fullName?.toLowerCase() || '';
      const email = userData.email?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      
      if (fullName.includes(searchLower) || email.includes(searchLower)) {
        users.push({
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
        });
      }
    });
    
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

// Check if email exists
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const usersQuery = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(usersQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
};
