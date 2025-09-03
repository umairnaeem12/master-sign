import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Import product functions
import {
  getProducts,
  getProductById,
  searchProducts,
  getProductsByCategory
} from './products/getProducts';

// Import category functions
import { 
  getCategories, 
  getCategoryById, 
  getSubCategories, 
  getCategoryWithSubCategories, 
  getAllCategoriesWithSubCategories 
} from './products/getCategories';

// Import pricing functions
import { calculateProductPrice } from './pricing/calculatePrice';

// Import shipping functions
import { calculateShippingCost } from './shipping/calculateShipping';

// Import turnaround functions
import { calculateTurnaroundTime } from './turnaround/calculateTurnaround';

// Import order functions
import { processOrder } from './orders/processOrder';

// Export product functions
export const getProductsFunction = getProducts;
export const getProductByIdFunction = getProductById;
export const searchProductsFunction = searchProducts;
export const getProductsByCategoryFunction = getProductsByCategory;

// Export category functions
export const getCategoriesFunction = getCategories;
export const getCategoryByIdFunction = getCategoryById;
export const getSubCategoriesFunction = getSubCategories;
export const getCategoryWithSubCategoriesFunction = getCategoryWithSubCategories;
export const getAllCategoriesWithSubCategoriesFunction = getAllCategoriesWithSubCategories;

// Export pricing functions
export const calculatePrice = calculateProductPrice;

// Export shipping functions
export const calculateShipping = calculateShippingCost;

// Export turnaround functions
export const calculateTurnaround = calculateTurnaroundTime;

// Export order functions
export const processOrderFunction = processOrder;

