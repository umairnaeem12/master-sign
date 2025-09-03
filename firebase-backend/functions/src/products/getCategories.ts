import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin for production
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const getCategories = functions.https.onCall(async (data, context) => {
  try {
    // Simplified query without composite index
    const query = db.collection('categories')
      .where('isActive', '==', true);
    
    const snapshot = await query.get();
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Remove duplicates based on categoryId (keep the first occurrence)
    const uniqueCategories = categories.reduce((acc: any[], category: any) => {
      const existingIndex = acc.findIndex(cat => cat.categoryId === category.categoryId);
      if (existingIndex === -1) {
        acc.push(category);
      }
      return acc;
    }, []);
    
    // Sort on client side
    const sortedCategories = uniqueCategories.sort((a: any, b: any) => {
      if (a.sortOrder !== b.sortOrder) {
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      }
      return (a.name || '').localeCompare(b.name || '');
    });
    
    return {
      success: true,
      data: sortedCategories,
      count: sortedCategories.length
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch categories');
  }
});

export const getCategoryById = functions.https.onCall(async (data, context) => {
  try {
    const { categoryId } = data;
    
    if (!categoryId) {
      throw new functions.https.HttpsError('invalid-argument', 'Category ID is required');
    }
    
    const doc = await db.collection('categories').doc(categoryId).get();
    
    if (!doc.exists) {
      throw new functions.https.HttpsError('not-found', 'Category not found');
    }
    
    const category = {
      id: doc.id,
      ...doc.data()
    };
    
    return {
      success: true,
      data: category
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch category');
  }
});

export const getSubCategories = functions.https.onCall(async (data, context) => {
  try {
    const { categoryId } = data;
    
    let query = db.collection('subCategories').where('isActive', '==', true);
    
    // Filter by category if provided
    if (categoryId) {
      query = query.where('categoryId', '==', categoryId);
    }
    
    query = query.orderBy('sortOrder', 'asc').orderBy('name', 'asc');
    
    const snapshot = await query.get();
    const subCategories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      success: true,
      data: subCategories,
      count: subCategories.length
    };
  } catch (error) {
    console.error('Error fetching sub-categories:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch sub-categories');
  }
});

export const getCategoryWithSubCategories = functions.https.onCall(async (data, context) => {
  try {
    const { categoryId } = data;
    
    if (!categoryId) {
      throw new functions.https.HttpsError('invalid-argument', 'Category ID is required');
    }
    
    // Get category
    const categoryDoc = await db.collection('categories').doc(categoryId).get();
    
    if (!categoryDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Category not found');
    }
    
    const category = {
      id: categoryDoc.id,
      ...categoryDoc.data()
    };
    
    // Get sub-categories for this category
    const subCategoriesQuery = db.collection('subCategories')
      .where('categoryId', '==', categoryId)
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')
      .orderBy('name', 'asc');
    
    const subCategoriesSnapshot = await subCategoriesQuery.get();
    const subCategories = subCategoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      success: true,
      data: {
        ...category,
        subCategories
      }
    };
  } catch (error) {
    console.error('Error fetching category with sub-categories:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch category with sub-categories');
  }
});

export const getAllCategoriesWithSubCategories = functions.https.onCall(async (data, context) => {
  try {
    // Get all active categories
    const categoriesQuery = db.collection('categories')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')
      .orderBy('name', 'asc');
    
    const categoriesSnapshot = await categoriesQuery.get();
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get all active sub-categories
    const subCategoriesQuery = db.collection('subCategories')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')
      .orderBy('name', 'asc');
    
    const subCategoriesSnapshot = await subCategoriesQuery.get();
    const allSubCategories = subCategoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Group sub-categories by category
    const categoriesWithSubs = categories.map((category: any) => ({
      ...category,
      subCategories: allSubCategories.filter((sub: any) => sub.categoryId === category.id)
    }));
    
    return {
      success: true,
      data: categoriesWithSubs,
      count: categoriesWithSubs.length
    };
  } catch (error) {
    console.error('Error fetching all categories with sub-categories:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch categories with sub-categories');
  }
});
