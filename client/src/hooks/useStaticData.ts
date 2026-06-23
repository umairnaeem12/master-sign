import { useState, useEffect, useCallback } from 'react';
import { staticProductsService } from '../data/static-products-service';
import { Product, ProductCategory, CategoryData } from '@/types/products';
import { 
  STATIC_TESTIMONIALS, 
  getFeaturedTestimonials, 
  StaticTestimonial 
} from '../data/static-testimonials';
import {
  createStaticQuoteRequest,
  getAllStaticQuoteRequests,
  getStaticQuoteRequest,
  updateStaticQuoteRequestStatus,
  deleteStaticQuoteRequest,
  StaticQuoteRequest,
  InsertQuoteRequest
} from '../data/static-quote-requests';
import {
  createStaticSiteVisit,
  getAllStaticSiteVisits,
  StaticSiteVisit,
  InsertSiteVisit
} from '../data/static-site-visits';

// Products hook
export function useStaticProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = staticProductsService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (category: ProductCategory) => {
    try {
      setLoading(true);
      const data = staticProductsService.getProductsByCategory(category);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const data = staticProductsService.getProductById(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const data = staticProductsService.searchProducts(query);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = staticProductsService.getFeaturedProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured products');
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
    getFeaturedProducts,
    refetch: fetchProducts
  };
}

// Categories hook
export function useStaticCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = staticProductsService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    fetchCategories
  };
}

// Testimonials hook
export function useStaticTestimonials() {
  const [testimonials, setTestimonials] = useState<StaticTestimonial[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setTestimonials(STATIC_TESTIMONIALS);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeaturedTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const data = getFeaturedTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Error fetching featured testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return {
    testimonials,
    loading,
    fetchTestimonials,
    fetchFeaturedTestimonials
  };
}

// Quote Requests hook
export function useStaticQuoteRequests() {
  const [quoteRequests, setQuoteRequests] = useState<StaticQuoteRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuoteRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllStaticQuoteRequests();
      setQuoteRequests(data);
    } catch (err) {
      console.error('Error fetching quote requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuoteRequest = useCallback(async (quoteData: InsertQuoteRequest) => {
    try {
      const newRequest = await createStaticQuoteRequest(quoteData);
      setQuoteRequests(prev => [newRequest, ...prev]);
      return { data: newRequest, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create quote request';
      return { data: null, error };
    }
  }, []);

  const updateQuoteRequest = useCallback(async (id: string, updates: Partial<StaticQuoteRequest>) => {
    try {
      if (updates.status) {
        const updatedRequest = await updateStaticQuoteRequestStatus(id, updates.status);
        if (updatedRequest) {
          setQuoteRequests(prev => prev.map(qr => qr.id === id ? updatedRequest : qr));
          return { data: updatedRequest, error: null };
        }
      }
      return { data: null, error: 'Failed to update quote request' };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update quote request';
      return { data: null, error };
    }
  }, []);

  const deleteQuoteRequest = useCallback(async (id: string) => {
    try {
      const success = await deleteStaticQuoteRequest(id);
      if (success) {
        setQuoteRequests(prev => prev.filter(qr => qr.id !== id));
        return { error: null };
      }
      return { error: 'Failed to delete quote request' };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete quote request';
      return { error };
    }
  }, []);

  useEffect(() => {
    fetchQuoteRequests();
  }, [fetchQuoteRequests]);

  return {
    quoteRequests,
    loading,
    fetchQuoteRequests,
    createQuoteRequest,
    updateQuoteRequest,
    deleteQuoteRequest
  };
}

// Site Visit hook
export function useStaticSiteVisits() {
  const [siteVisits, setSiteVisits] = useState<StaticSiteVisit[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSiteVisits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllStaticSiteVisits();
      setSiteVisits(data);
    } catch (err) {
      console.error('Error fetching site visits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSiteVisit = useCallback(async (visitData: InsertSiteVisit) => {
    try {
      const newVisit = await createStaticSiteVisit(visitData);
      setSiteVisits(prev => [newVisit, ...prev]);
      return { data: newVisit, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to schedule site visit';
      return { data: null, error };
    }
  }, []);

  return {
    siteVisits,
    loading,
    fetchSiteVisits,
    createSiteVisit
  };
}
