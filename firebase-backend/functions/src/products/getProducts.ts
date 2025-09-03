import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin for production
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Type definitions
interface Product {
  id: string;
  category?: string;
  [key: string]: any;
}

interface Category {
  id: string;
  name?: string;
  categoryId?: string;
  icon?: string;
  image?: string;
  description?: string;
  [key: string]: any;
}

export const getProducts = functions.https.onCall(async (data, context) => {
  try {
    const { category, subcategory, limit = 50 } = data || {};
    
    let query = db.collection('products').where('isActive', '==', true);
    
    // Filter by category if provided
    if (category) {
      query = query.where('category', '==', category);
    }
    
    // Filter by subcategory if provided
    if (subcategory) {
      query = query.where('subcategory', '==', subcategory);
    }
    
    // Add limit but avoid orderBy to prevent index issues
    query = query.limit(limit);
    
    const snapshot = await query.get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    // Fetch all categories to enrich product data
    const categoriesSnapshot = await db.collection('categories').where('isActive', '==', true).get();
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
    
    // Create a map for quick category lookup
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.id, cat);
    });
    
    // Enrich products with category information
    const enrichedProducts = products.map((product: Product) => {
      const categoryData = categoryMap.get(product.category);
      return {
        ...product,
        categoryName: categoryData?.name || 'Unknown Category',
        categoryId: categoryData?.categoryId || 'UNKNOWN',
        categoryIcon: categoryData?.icon || '🎯',
        categoryImage: categoryData?.image || '',
        categoryDescription: categoryData?.description || ''
      };
    });
    
    // Sort on client side to avoid index requirements
    enrichedProducts.sort((a: any, b: any) => {
      const aTime = a.createdAt?._seconds || 0;
      const bTime = b.createdAt?._seconds || 0;
      return bTime - aTime; // Descending order
    });
    
    return {
      success: true,
      data: enrichedProducts,
      count: enrichedProducts.length
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch products');
  }
});

export const getProductById = functions.https.onCall(async (data, context) => {
  try {
    const { productId } = data;
    
    if (!productId) {
      throw new functions.https.HttpsError('invalid-argument', 'Product ID is required');
    }
    
    const doc = await db.collection('products').doc(productId).get();
    
    if (!doc.exists) {
      throw new functions.https.HttpsError('not-found', 'Product not found');
    }
    
    const product = {
      id: doc.id,
      ...doc.data()
    } as Product;
    
    // Fetch category information for this product
    if (product.category) {
      try {
        const categoryDoc = await db.collection('categories').doc(product.category).get();
        if (categoryDoc.exists) {
          const categoryData = categoryDoc.data();
          product.categoryName = categoryData?.name || 'Unknown Category';
          product.categoryId = categoryData?.categoryId || 'UNKNOWN';
          product.categoryIcon = categoryData?.icon || '🎯';
          product.categoryImage = categoryData?.image || '';
          product.categoryDescription = categoryData?.description || '';
        }
      } catch (categoryError) {
        console.warn('Could not fetch category data for product:', productId, categoryError);
        product.categoryName = 'Unknown Category';
        product.categoryId = 'UNKNOWN';
      }
    }
    
    return {
      success: true,
      data: product
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch product');
  }
});

export const searchProducts = functions.https.onCall(async (data, context) => {
  try {
    const { query, category, limit = 20 } = data;
    
    if (!query || query.trim().length < 2) {
      throw new functions.https.HttpsError('invalid-argument', 'Search query must be at least 2 characters');
    }
    
    let productsQuery = db.collection('products').where('isActive', '==', true);
    
    // Filter by category if provided
    if (category) {
      productsQuery = productsQuery.where('category', '==', category);
    }
    
    const snapshot = await productsQuery.get();
    const allProducts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Perform text search on client side since Firestore doesn't support full-text search
    const searchTerm = query.toLowerCase();
    const filteredProducts = allProducts.filter((product: any) => {
      return (
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.subcategory?.toLowerCase().includes(searchTerm) ||
        product.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
        product.features?.some((feature: string) => feature.toLowerCase().includes(searchTerm))
      );
    });
    
    // Sort by relevance (exact matches first)
    const sortedProducts = filteredProducts.sort((a: any, b: any) => {
      const aNameMatch = a.name?.toLowerCase().includes(searchTerm) ? 1 : 0;
      const bNameMatch = b.name?.toLowerCase().includes(searchTerm) ? 1 : 0;
      return bNameMatch - aNameMatch;
    });
    
    return {
      success: true,
      data: sortedProducts.slice(0, limit),
      count: sortedProducts.length
    };
  } catch (error) {
    console.error('Error searching products:', error);
    throw new functions.https.HttpsError('internal', 'Failed to search products');
  }
});



export const getProductsByCategory = functions.https.onCall(async (data, context) => {
  try {
    const { category, limit = 50 } = data;
    
    if (!category) {
      throw new functions.https.HttpsError('invalid-argument', 'Category is required');
    }
    
    const query = db.collection('products')
      .where('isActive', '==', true)
      .where('category', '==', category)
      .limit(limit);
    
    const snapshot = await query.get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort on client side to avoid index requirements
    products.sort((a: any, b: any) => {
      const aTime = a.createdAt?._seconds || 0;
      const bTime = b.createdAt?._seconds || 0;
      return bTime - aTime; // Descending order
    });
    
    return {
      success: true,
      data: products,
      count: products.length
    };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch products by category');
  }
});
