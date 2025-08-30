import { useState, useEffect, useCallback } from 'react';
import { 
  getProductsFunction,
  getProductByIdFunction,
  searchProductsFunction,
  getProductsByCategoryFunction,
  getCategoriesFunction,
  getCategoryByIdFunction,
  getSubCategoriesFunction,
  getCategoryWithSubCategoriesFunction,
  getAllCategoriesWithSubCategoriesFunction
} from '@/lib/firebase';
import { ProductCategory, Product, CategoryData } from '@/types/products';

// Products hook
export function useFirebaseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (hasFetched) {
      console.log('🔄 Products already fetched, skipping...');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setHasFetched(true);
      
      console.log('🔄 Fetching products from Firebase...');
      const result = await getProductsFunction({});
      const response = result.data as any;
      
      if (response.success) {
        console.log(`✅ Successfully fetched ${response.data?.length || 0} products`);
        setProducts(response.data || []);
      } else {
        console.error('❌ Failed to fetch products:', response);
        setError('Failed to fetch products from server');
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);

  // Auto-fetch products on mount
  useEffect(() => {
    console.log('🔄 useFirebaseProducts: Auto-fetching products on mount');
    fetchProducts();
  }, [fetchProducts]);

  const fetchProductsByCategory = useCallback(async (category: ProductCategory) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProductsByCategoryFunction({ category });
      const response = result.data as any;
      
      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError('Failed to fetch products by category');
      }
    } catch (err) {
      console.error('Error fetching products by category:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products by category');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProductByIdFunction({ productId: id });
      const response = result.data as any;
      
      if (response.success) {
        return response.data;
      } else {
        setError('Failed to fetch product');
        return null;
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await searchProductsFunction({ query });
      const response = result.data as any;
      
      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError('Failed to search products');
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to search products');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductsByCategory,
    fetchProductById,
    searchProducts,
    refetch: fetchProducts
  };
}

// Categories hook
export function useFirebaseCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchCategories = useCallback(async () => {
    if (hasFetched) {
      console.log('🔄 Categories already fetched, skipping...');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setHasFetched(true);
      
      console.log('🔄 Fetching categories from Firebase...');
      const result = await getCategoriesFunction({});
      const response = result.data as any;
      
      if (response.success) {
        console.log(`✅ Successfully fetched ${response.data?.length || 0} categories`);
        setCategories(response.data || []);
      } else {
        console.error('❌ Failed to fetch categories:', response);
        setError('Failed to fetch categories from server');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);

  // Auto-fetch categories on mount
  useEffect(() => {
    console.log('🔄 useFirebaseCategories: Auto-fetching categories on mount');
    fetchCategories();
  }, [fetchCategories]);

  const fetchCategoryById = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getCategoryByIdFunction({ categoryId });
      const response = result.data as any;
      
      if (response.success) {
        return response.data;
      } else {
        setError('Failed to fetch category');
        return null;
      }
    } catch (err) {
      console.error('Error fetching category:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch category');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubCategories = useCallback(async (categoryId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getSubCategoriesFunction({ categoryId });
      const response = result.data as any;
      
      if (response.success) {
        return response.data || [];
      } else {
        setError('Failed to fetch sub-categories');
        return [];
      }
    } catch (err) {
      console.error('Error fetching sub-categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sub-categories');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoryWithSubCategories = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getCategoryWithSubCategoriesFunction({ categoryId });
      const response = result.data as any;
      
      if (response.success) {
        return response.data;
      } else {
        setError('Failed to fetch category with sub-categories');
        return null;
      }
    } catch (err) {
      console.error('Error fetching category with sub-categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch category with sub-categories');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllCategoriesWithSubCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getAllCategoriesWithSubCategoriesFunction({});
      const response = result.data as any;
      
      if (response.success) {
        setCategories(response.data || []);
      } else {
        setError('Failed to fetch categories with sub-categories');
      }
    } catch (err) {
      console.error('Error fetching categories with sub-categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories with sub-categories');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategoryById,
    fetchSubCategories,
    fetchCategoryWithSubCategories,
    fetchAllCategoriesWithSubCategories
  };
}

// Main page hook - only fetches categories, no products
// This hook should ONLY be used on the home page (/)
// For other pages that need both products and categories, use useFirebaseProducts and useFirebaseCategories separately
export function useFirebaseMainPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchCategories = useCallback(async () => {
    if (hasFetched) {
      console.log('🔄 Main page: Categories already fetched, skipping...');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setHasFetched(true);
      
      console.log('🔄 Main page: Fetching categories from Firebase...');
      const result = await getCategoriesFunction({});
      const response = result.data as any;
      
      if (response.success) {
        console.log(`✅ Main page: Successfully fetched ${response.data?.length || 0} categories`);
        setCategories(response.data || []);
      } else {
        console.error('❌ Main page: Failed to fetch categories:', response);
        setError('Failed to fetch categories from server');
      }
    } catch (err) {
      console.error('Main page: Error fetching categories:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);

  // Auto-fetch categories on mount
  useEffect(() => {
    console.log('🔄 useFirebaseMainPage: Auto-fetching categories on mount');
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error
  };
}

// Individual product hook
export function useFirebaseProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProductByIdFunction({ productId });
      const response = result.data as any;
      
      if (response.success) {
        setProduct(response.data);
      } else {
        setError('Failed to fetch product');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
}
