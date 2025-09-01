// Firebase configuration for SignFlow Frontend
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDQk6eD1PWv5UxwWzjHivW4l4EapSpxO2Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mastersign-d8396.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mastersign-d8396",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mastersign-d8396.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "688784364899",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:688784364899:web:b27c29f9d3a4e1f398ef56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const functions = getFunctions(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Hybrid setup: Local functions + Production Firestore
if (import.meta.env.DEV) {
  try {
    console.log('🔧 Connecting to LOCAL Firebase emulator for functions...');
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    console.log('✅ Connected to LOCAL functions emulator');
    console.log('🌐 Using PRODUCTION Firestore database');
  } catch (error) {
    console.warn('⚠️ Failed to connect to local emulator:', error);
    console.log('ℹ️ Falling back to production Firebase functions');
  }
} else {
  console.log('🚀 Using production Firebase functions and Firestore');
}

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    const testFunction = httpsCallable(functions, 'getProductsFunction');
    const result = await testFunction({});
    console.log('✅ Firebase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};

// Product Functions
export const getProductsFunction = httpsCallable(functions, 'getProductsFunction');
export const getProductByIdFunction = httpsCallable(functions, 'getProductByIdFunction');
export const searchProductsFunction = httpsCallable(functions, 'searchProductsFunction');
export const getProductsByCategoryFunction = httpsCallable(functions, 'getProductsByCategoryFunction');

// Category Functions
export const getCategoriesFunction = httpsCallable(functions, 'getCategoriesFunction');
export const getCategoryByIdFunction = httpsCallable(functions, 'getCategoryByIdFunction');
export const getSubCategoriesFunction = httpsCallable(functions, 'getSubCategoriesFunction');
export const getCategoryWithSubCategoriesFunction = httpsCallable(functions, 'getCategoryWithSubCategoriesFunction');
export const getAllCategoriesWithSubCategoriesFunction = httpsCallable(functions, 'getAllCategoriesWithSubCategoriesFunction');

// Pricing Functions
export const calculatePriceFunction = httpsCallable(functions, 'calculatePrice');
export const calculateShippingFunction = httpsCallable(functions, 'calculateShipping');
export const calculateTurnaroundFunction = httpsCallable(functions, 'calculateTurnaround');

// Order Functions
export const processOrderFunction = httpsCallable(functions, 'processOrderFunction');

export { app, functions, auth, db };
