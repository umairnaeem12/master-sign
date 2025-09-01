import React, { useMemo, useState, useEffect, useCallback } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ProductCategory, Product, CategoryData } from "@/types/products";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Eye, RefreshCw, Filter, Search, Grid, List } from "lucide-react";
import { useFirebaseProducts, useFirebaseCategories } from "@/hooks/useFirebaseData";
import { useProductContext } from "@/contexts/ProductContext";

// Types for better type safety
interface FilterState {
  category: ProductCategory | null;
  subcategory: string;
  searchTerm: string;
  sortBy: 'name' | 'price' | 'rating' | 'newest';
  viewMode: 'grid' | 'list';
}

interface ProductWithCategory extends Product {
  categoryData?: CategoryData;
}

// Enhanced product card component
const ProductCard: React.FC<{ 
  product: ProductWithCategory; 
  onProductClick: (product: ProductWithCategory) => void;
  viewMode: 'grid' | 'list';
  categories: CategoryData[];
}> = ({ product, onProductClick, viewMode, categories }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    setIsNavigating(true);
    onProductClick(product);
  };
  // Category mapping for orphaned product category IDs
  const categoryMappings: Record<string, ProductCategory> = {
    'GyE3Vxub7daS6EFzAtqL': ProductCategory.EXPO_DISPLAY,
    'ToVu7Aml1I2cYkMhJXOg': ProductCategory.LASER_ENGRAVING, 
    'FehToXBstMepLx4rR8qj': ProductCategory.MARKETING,
    'bvDyZ4EUGDVjhfFHrFWX': ProductCategory.MARKETING,
    'xCEkcBBCpgWLw7OGSSWr': ProductCategory.PROMO,
    'ZKz1JSEllBcqLXGoJWdV': ProductCategory.ELECTRIC_SIGNS
  };

  // Get category name by matching document IDs with mapping fallback
  const getCategoryName = useCallback(() => {
    // Try exact match first
    const categoryData = categories.find(cat => cat.id === product.category);
    if (categoryData) {
      return categoryData.name;
    }
    
    // Fallback to mapping
    const mappedCategory = categoryMappings[product.category];
    if (mappedCategory) {
      return mappedCategory.replace('_', ' ').toUpperCase();
    }
    
    return 'Unknown Category';
  }, [product.category, categories]);

  const getCategoryImage = useCallback(() => {
    // Try exact match first
    const categoryData = categories.find(cat => cat.id === product.category);
    if (categoryData?.image) {
      return categoryData.image;
    }
    
    // Fallback to mapping - use default category images
    const mappedCategory = categoryMappings[product.category];
    if (mappedCategory) {
      const defaultImages: Record<ProductCategory, string> = {
        [ProductCategory.EXPO_DISPLAY]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FTradeshows-Expos%2Fpopup1.jpg?alt=media',
        [ProductCategory.LASER_ENGRAVING]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FLaser%2520Engraving%2Ffish.jpg?alt=media',
        [ProductCategory.MARKETING]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FBusiness%2520Signage%2FDancology.jpg?alt=media',
        [ProductCategory.PROMO]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FBanners%2FMAIN%2520-%2520Banner.jpg?alt=media',
        [ProductCategory.ELECTRIC_SIGNS]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FChannel%2520Letters%2F20241112_194813.jpg?alt=media',
        [ProductCategory.DECALS_STICKERS]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FBanners%2FMAIN%2520-%2520Banner.jpg?alt=media',
        [ProductCategory.BANNERS_FLAGS]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FBanners%2FMAIN%2520-%2520Banner.jpg?alt=media',
        [ProductCategory.SIGNS]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FBusiness%2520Signage%2FPerformance.jpg?alt=media',
        [ProductCategory.PRIVACY_SECURITY]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FIndoor-Outdoor%2520Displays%2FIMG_20230621_000909.jpg?alt=media',
        [ProductCategory.VEHICLE_TRAILER]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FVehicle%2520Graphics%2F20240309_133150.jpg?alt=media',
        [ProductCategory.INDOOR_SIGNS]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FOffice%2520Signage%2F20230120_165654.jpg?alt=media',
        [ProductCategory.OUTDOOR_SIGNS]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FIndoor-Outdoor%2520Displays%2FPlant_Jungle2.JPG?alt=media&token=34a50687-e6c0-4aa8-a98c-7b3d484c1550',
        [ProductCategory.ACCESSORIES]: 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FAccessories%2Fcategory-accessories.jpg?alt=media'
      };
      return defaultImages[mappedCategory] || 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FBanners%2FMAIN%2520-%2520Banner.jpg?alt=media';
    }
    
    return 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/Master%2520Sign%2Fassets%2FBanners%2FMAIN%2520-%2520Banner.jpg?alt=media';
  }, [product.category, categories]);
  const getProductImage = useCallback(() => {
    if (product.images && product.images.length > 0) {
      return (product.images[0] as any)?.url || product.images[0];
    }
    
    // Use category image
    return getCategoryImage();
  }, [product, getCategoryImage]);

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`group cursor-pointer ${isNavigating ? 'opacity-75' : ''}`}
        onClick={handleClick}
      >
        <Card className="flex overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="relative w-48 h-32 flex-shrink-0">
            <img 
              src={getProductImage()} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            {isNavigating && (
              <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{getCategoryName()}</Badge>
                <Badge variant="outline">{product.subcategory}</Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating || 4.5}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-blue-600">
                ${product.pricing?.basePrice || 99.99}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group cursor-pointer ${isNavigating ? 'opacity-75' : ''}`}
      onClick={handleClick}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative overflow-hidden">
          <img 
            src={getProductImage()} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          {isNavigating && (
            <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">{getCategoryName()}</Badge>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{product.rating || 4.5}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              ${product.pricing?.basePrice || 99.99}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Enhanced category selector component
const CategorySelector: React.FC<{
  categories: CategoryData[];
  selectedCategory: ProductCategory | null;
  onCategoryChange: (category: ProductCategory | null) => void;
}> = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Browse Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <button
          onClick={() => onCategoryChange(null)}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            selectedCategory === null
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-sm font-medium">All Products</div>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.categoryId as ProductCategory)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedCategory === category.categoryId
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-sm font-medium">{category.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced filters component
const ProductFilters: React.FC<{
  filterState: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  subcategories: string[];
}> = ({ filterState, onFilterChange, subcategories }) => {
  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={filterState.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>
        
        {/* Subcategory Filter */}
        <Select 
          value={filterState.subcategory || "all"} 
          onValueChange={(value) => onFilterChange({ subcategory: value === "all" ? "" : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Sub-categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sub-categories</SelectItem>
            {subcategories.map((subCategory) => (
              <SelectItem key={subCategory} value={subCategory}>
                {subCategory}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Sort By */}
        <Select 
          value={filterState.sortBy} 
          onValueChange={(value) => onFilterChange({ sortBy: value as FilterState['sortBy'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="price">Price Low-High</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
        
        {/* View Mode */}
        <div className="flex gap-2">
          <Button
            variant={filterState.viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange({ viewMode: 'grid' })}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={filterState.viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange({ viewMode: 'list' })}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ProductsBrowsePage() {
  // Enhanced state management
  const [filterState, setFilterState] = useState<FilterState>({
    category: null,
    subcategory: '',
    searchTerm: '',
    sortBy: 'newest',
    viewMode: 'grid'
  });

  // Fetch data
  const { products, loading, error, fetchProducts } = useFirebaseProducts();
  const { categories: firebaseCategories, loading: categoriesLoading, error: categoriesError } = useFirebaseCategories();
  
  // Product context for instant navigation
  const { setSelectedProduct } = useProductContext();

  // Enhanced product processing with category data
  const processedProducts = useMemo(() => {
    if (!products.length || !firebaseCategories.length) return [];

    return products.map(product => {
      const categoryData = firebaseCategories.find(cat => cat.id === product.category);
      return {
        ...product,
        categoryData
      } as ProductWithCategory;
    });
  }, [products, firebaseCategories]);

  // Category mapping for orphaned product category IDs
  const categoryMappings: Record<string, ProductCategory> = {
    'GyE3Vxub7daS6EFzAtqL': ProductCategory.EXPO_DISPLAY,
    'ToVu7Aml1I2cYkMhJXOg': ProductCategory.LASER_ENGRAVING, 
    'FehToXBstMepLx4rR8qj': ProductCategory.MARKETING,
    'bvDyZ4EUGDVjhfFHrFWX': ProductCategory.MARKETING,
    'xCEkcBBCpgWLw7OGSSWr': ProductCategory.PROMO,
    'ZKz1JSEllBcqLXGoJWdV': ProductCategory.ELECTRIC_SIGNS
  };

  // Enhanced filtering logic with category mapping fallback
  const filteredProducts = useMemo(() => {
    let filtered = processedProducts;

    // Category filter with mapping fallback
    if (filterState.category) {
      // Try exact match first
      const categoryDoc = firebaseCategories.find(cat => cat.categoryId === filterState.category);
      if (categoryDoc) {
        filtered = filtered.filter(p => p.category === categoryDoc.id);
      }
      
      // Fallback: Use mapping table for orphaned category IDs
      if (filtered.length === 0) {
        const mappedCategoryIds = Object.keys(categoryMappings).filter(
          id => categoryMappings[id] === filterState.category
        );
        
        if (mappedCategoryIds.length > 0) {
          filtered = processedProducts.filter(p => 
            mappedCategoryIds.includes(p.category)
          );
        }
      }
    }

    // Subcategory filter (keep as document ID for now)
    if (filterState.subcategory) {
      filtered = filtered.filter(p => p.subcategory === filterState.subcategory);
    }

    // Search filter
    if (filterState.searchTerm) {
      const searchTerm = filterState.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filterState.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return (a.pricing?.basePrice || 0) - (b.pricing?.basePrice || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          // Handle different date formats safely
          const getDateSeconds = (dateField: any): number => {
            if (!dateField) return 0;
            if (dateField instanceof Date) return dateField.getTime() / 1000;
            if (dateField && typeof dateField.toDate === 'function') return dateField.toDate().getTime() / 1000;
            if (dateField && typeof dateField === 'object' && dateField._seconds) return dateField._seconds;
            if (typeof dateField === 'number') return dateField / 1000;
            return 0;
          };
          return getDateSeconds(b.createdAt) - getDateSeconds(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [processedProducts, filterState, firebaseCategories]);

  // Get subcategories for selected category
  const availableSubcategories = useMemo(() => {
    if (!filterState.category) return [];
    
    const categoryDoc = firebaseCategories.find(cat => cat.categoryId === filterState.category);
    if (!categoryDoc) return [];
    
    return [...new Set(
      processedProducts
        .filter(p => (p.category as string) === categoryDoc.id)
        .map(p => p.subcategory)
    )];
  }, [filterState.category, processedProducts, firebaseCategories]);

  // Event handlers
  const handleCategoryChange = useCallback((category: ProductCategory | null) => {
    setFilterState(prev => ({ ...prev, category, subcategory: '' }));
  }, []);

  const handleFilterChange = useCallback((changes: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...changes }));
  }, []);

  const handleProductClick = useCallback((product: ProductWithCategory) => {
    // Set the selected product in context for instant navigation
    setSelectedProduct(product);
    // Navigate to product detail page
    window.location.href = `/product/${product.id}`;
  }, [setSelectedProduct]);

  const handleRetry = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Loading state
  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">
              {loading ? 'Loading products...' : 'Loading categories...'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || categoriesError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
              <p className="font-bold mb-2">Error loading data</p>
              <p className="text-sm mb-4">{error || categoriesError}</p>
              <Button onClick={handleRetry} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry Loading
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Product Catalog
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover our comprehensive range of professional signage solutions, 
            from custom banners to illuminated signs and everything in between.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Selector */}
        <CategorySelector
          categories={firebaseCategories}
          selectedCategory={filterState.category}
          onCategoryChange={handleCategoryChange}
        />

        {/* Filters */}
        <ProductFilters
          filterState={filterState}
          onFilterChange={handleFilterChange}
          subcategories={availableSubcategories}
        />

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {filterState.category && (
              <>
                {' '}in{' '}
                <span className="font-medium">
                  {firebaseCategories.find(cat => cat.categoryId === filterState.category)?.name || 
                   filterState.category.replace('_', ' ').toUpperCase()}
                </span>
              </>
            )}
          </p>
          
          <div className="flex gap-2">
            {filterState.searchTerm && (
              <Badge variant="secondary">
                Search: "{filterState.searchTerm}"
              </Badge>
            )}
            {filterState.category && (
              <Badge variant="outline">
                {filteredProducts.length > 0 ? '✅ Products Found' : '⚠️ No Products'}
              </Badge>
            )}
          </div>
        </div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
          <motion.div 
              key={filterState.viewMode}
              className={filterState.viewMode === 'list' 
                ? "space-y-4" 
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              }
            initial="initial"
            animate="animate"
              variants={{
                initial: { opacity: 0 },
                animate: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
                            {filteredProducts.map((product) => (
                <ProductCard
                key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                  viewMode={filterState.viewMode}
                  categories={firebaseCategories}
                />
            ))}
          </motion.div>
        ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or category selection.
            </p>
              <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Products
              </Button>
            </motion.div>
        )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
