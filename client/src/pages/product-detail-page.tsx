import React, { useEffect, useState } from "react";
import { useRoute } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ProductDetailComponent from "@/components/product-detail";
import { ProductDetail, Product } from "@/types/products";
import { Button } from "@/components/ui/button";
import { useProductContext } from "@/contexts/ProductContext";
import { useFirebaseProducts } from "@/hooks/useFirebaseData";
import { assignProductImages } from "@/lib/product-image-assigner";

// Helper function to safely convert Firestore timestamps or dates
const safeDateConversion = (dateField: any): Date => {
  if (!dateField) return new Date();
  
  // If it's already a Date object
  if (dateField instanceof Date) {
    return dateField;
  }
  
  // If it's a Firestore timestamp with toDate method
  if (dateField && typeof dateField.toDate === 'function') {
    return dateField.toDate();
  }
  
  // If it's a timestamp object with _seconds
  if (dateField && typeof dateField === 'object' && dateField._seconds) {
    return new Date(dateField._seconds * 1000);
  }
  
  // If it's a number (timestamp)
  if (typeof dateField === 'number') {
    return new Date(dateField);
  }
  
  // If it's a string, try to parse it
  if (typeof dateField === 'string') {
    const parsed = new Date(dateField);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  // Default fallback
  return new Date();
};

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get selected product from context for instant navigation
  const { selectedProduct, clearSelectedProduct } = useProductContext();
  
  // Use Firebase products hook to get products with assigned images
  const { products: firebaseProducts, fetchProductById } = useFirebaseProducts();

  useEffect(() => {
    if (productId) {
      // Check if we have the selected product in context (instant navigation)
      if (selectedProduct && selectedProduct.id === productId) {
        console.log('🚀 Using selected product from context for instant navigation:', selectedProduct.name);
        // Convert Product to ProductDetail format with assigned images
        const productWithImages = assignProductImages(selectedProduct);
        const productDetail: ProductDetail = {
          ...productWithImages,
          // Add any additional ProductDetail specific fields here
        };
        setProduct(productDetail);
        setLoading(false);
        // Clear the selected product from context after using it
        clearSelectedProduct();
      } else {
        // Try to find product in Firebase products list first
        const existingProduct = firebaseProducts.find(p => p.id === productId);
        if (existingProduct) {
          console.log('📦 Found product in Firebase products list:', existingProduct.name);
          // Convert Product to ProductDetail format with assigned images
          const productWithImages = assignProductImages(existingProduct);
          const productDetail: ProductDetail = {
            ...productWithImages,
            // Add any additional ProductDetail specific fields here
          };
          setProduct(productDetail);
          setLoading(false);
        } else {
          // Fallback to loading from Firebase/API
          console.log('📡 Loading product from Firebase/API:', productId);
          loadProduct();
        }
      }
    }
  }, [productId, selectedProduct, clearSelectedProduct, firebaseProducts]);

  // Cleanup effect to clear selected product when component unmounts
  useEffect(() => {
    return () => {
      clearSelectedProduct();
    };
  }, [clearSelectedProduct]);

  const loadProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      
      // Use Firebase data hook to fetch product with assigned images
      console.log('📡 Fetching product from Firebase with image assignment:', productId);
      const productData = await fetchProductById(productId);
      
      if (productData) {
        console.log('📦 Fetched product from Firebase with images:', productData);
        console.log('📅 Date fields:', {
          createdAt: productData.createdAt,
          updatedAt: productData.updatedAt,
          createdAtType: typeof productData.createdAt,
          updatedAtType: typeof productData.updatedAt
        });
        
        // Convert Firebase data to ProductDetail format
        try {
          const productDetail: ProductDetail = {
          id: productId,
          name: productData.name || 'Unknown Product',
          category: productData.category || 'Unknown',
          subcategory: productData.subcategory || '',
          description: productData.description || '',
          longDescription: productData.longDescription || productData.description || '',
          price: productData.pricing?.basePrice || 99.99,
          image: productData.images?.[0]?.url || '',
          thumbnail: productData.images?.[0]?.url || '',
          images: productData.images || [],
          sizes: [],
          shapes: [],
          materials: [],
          features: productData.features || [],
          specifications: [],
          inStock: productData.inStock || false,
          rating: productData.rating || 0,
          reviewCount: productData.reviewCount || 0,
          questionCount: productData.questionCount || 0,
          tags: productData.tags || [],
          featured: productData.featured || false,
          createdAt: safeDateConversion(productData.createdAt),
          updatedAt: safeDateConversion(productData.updatedAt),
          pricing: {
            basePrice: productData.pricing?.basePrice || 99.99,
            pricingModel: productData.pricing?.pricingModel || 'fixed',
            currency: productData.pricing?.currency || 'USD'
          },
          sizeConstraints: productData.sizeConstraints || {
            allowCustomSize: false,
            minWidth: 12,
            maxWidth: 120,
            minHeight: 12,
            maxHeight: 120,
            defaultWidth: 24,
            defaultHeight: 36,
            unit: 'inch'
          },
          customizableOptions: [],
          quantityDiscounts: [],
          shippingOptions: [],
          turnaroundTime: {
            estimatedDays: 7,
            rushAvailable: true,
            rushTurnaroundDays: 3,
            rushFeePercentage: 25,
            rushFeeMultiplier: 1.25,
            orderCutoffTime: '17:00',
            businessDaysOnly: true
          },
          personalizationOptions: {
            artworkUpload: true,
            designNow: true,
            designHelp: true,
            maxFileSize: 10,
            supportedFormats: ['jpg', 'png', 'pdf', 'ai', 'eps']
          },
          inventory: {
            stockQuantity: productData.inventory?.stockQuantity || 0,
            inStock: productData.inStock || false,
            lowStockThreshold: 5,
            backorderAvailable: false,
            supplierLeadTime: 7
          },
          reviews: [],
          relatedProducts: [],
          frequentlyBoughtWith: []
        };
        
        setProduct(productDetail);
        } catch (conversionError) {
          console.error('Error converting product data:', conversionError);
          setError('Failed to process product data');
          return;
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
            <p className="text-gray-600 mb-4">Unable to load the requested product.</p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-gray-600 text-xl mb-4">Product not found</div>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ProductDetailComponent product={product} />
      <Footer />
    </div>
  );
} 