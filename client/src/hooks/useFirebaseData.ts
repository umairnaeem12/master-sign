import { useState, useCallback } from 'react';
import { staticProductsService } from '@/data/static-products-service';
import { ProductCategory, Product, CategoryData } from '@/types/products';

/**
 * NOTE: Despite the "Firebase" naming, these hooks are now backed by the
 * bundled static product/category data (see `static-products-service.ts`).
 *
 * This was done deliberately for performance: the previous implementation made
 * Firebase Cloud Function calls on mount, which incurred a network round-trip
 * (and cold-start latency) and forced every page to render a loading spinner
 * while waiting. All product/category data is shipped with the app, so we serve
 * it synchronously instead — data is available on the first render, `loading`
 * is always `false`, and no loading icon is ever shown.
 *
 * The hook signatures are kept identical to the old Firebase versions so no
 * consumer code needed to change.
 */

// Products hook
export function useFirebaseProducts() {
  // Seed synchronously so data is present on the very first render (no spinner).
  const [products, setProducts] = useState<Product[]>(() => staticProductsService.getAllProducts());
  const [error] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setProducts(staticProductsService.getAllProducts());
  }, []);

  const fetchProductsByCategory = useCallback(async (category: ProductCategory) => {
    setProducts(staticProductsService.getProductsByCategory(category));
  }, []);

  const fetchProductById = useCallback(async (id: string) => {
    return staticProductsService.getProductById(id) ?? null;
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    setProducts(staticProductsService.searchProducts(query));
  }, []);

  return {
    products,
    loading: false,
    error,
    fetchProducts,
    fetchProductsByCategory,
    fetchProductById,
    searchProducts,
    refetch: fetchProducts,
  };
}

// Categories hook
export function useFirebaseCategories() {
  const [categories, setCategories] = useState<CategoryData[]>(() => staticProductsService.getCategories());
  const [error] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setCategories(staticProductsService.getCategories());
  }, []);

  const fetchCategoryById = useCallback(async (categoryId: string) => {
    return staticProductsService.getCategoryById(categoryId as ProductCategory) ?? null;
  }, []);

  const fetchSubCategories = useCallback(async (categoryId?: string) => {
    if (categoryId) {
      const category = staticProductsService.getCategoryById(categoryId as ProductCategory);
      return category?.featuredSubCategories ?? [];
    }
    return staticProductsService.getCategories().flatMap((c) => c.featuredSubCategories ?? []);
  }, []);

  const fetchCategoryWithSubCategories = useCallback(async (categoryId: string) => {
    return staticProductsService.getCategoryById(categoryId as ProductCategory) ?? null;
  }, []);

  const fetchAllCategoriesWithSubCategories = useCallback(async () => {
    setCategories(staticProductsService.getCategories());
  }, []);

  return {
    categories,
    loading: false,
    error,
    fetchCategories,
    fetchCategoryById,
    fetchSubCategories,
    fetchCategoryWithSubCategories,
    fetchAllCategoriesWithSubCategories,
  };
}

// Main page hook - only exposes categories
export function useFirebaseMainPage() {
  const [categories] = useState<CategoryData[]>(() => staticProductsService.getCategories());

  return {
    categories,
    loading: false,
    error: null as string | null,
  };
}

// Individual product hook
export function useFirebaseProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(
    () => (productId ? staticProductsService.getProductById(productId) ?? null : null)
  );
  const [error] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!productId) return;
    setProduct(staticProductsService.getProductById(productId) ?? null);
  }, [productId]);

  return {
    product,
    loading: false,
    error,
    refetch,
  };
}
