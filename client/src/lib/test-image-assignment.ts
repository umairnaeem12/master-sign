// test-image-assignment.ts - Test the image assignment functionality

import { assignProductImages, assignImagesToProducts, getCategoryFolder } from './product-image-assigner';

// Test data
const testProducts = [
  {
    id: "0TRSnSWl2aeOobjGciTJ",
    name: "Real Estate Signs - 2",
    description: "Professional real estate signs with high-quality materials",
    category: "GGmvGqZa8rR4NMmZZWhA",
    subcategory: "NwaIk9qBifCcNbj2TyTw",
    images: [],
    features: ["Professional Quality", "Durable Materials", "Custom Sizing"],
    rating: 4.5,
    reviewCount: 3,
    questionCount: 7,
    inStock: true,
    isActive: true,
    tags: ["outdoor_signs", "real estate signs"],
    featured: true,
    pricing: {
      basePrice: 241.99,
      pricingModel: "fixed",
      currency: "USD"
    }
  },
  {
    id: "1NSDIWvs77cTuST6lmIM",
    name: "Marketing Materials - 1",
    description: "Professional marketing materials with high-quality materials",
    category: "FehToXBstMepLx4rR8qj",
    subcategory: "eEycqLH3ZqkiOCxtZVo0",
    images: [],
    features: ["Professional Quality", "Durable Materials", "Custom Sizing"],
    rating: 4.5,
    reviewCount: 44,
    questionCount: 1,
    inStock: true,
    isActive: true,
    tags: ["marketing", "marketing materials"],
    featured: true,
    pricing: {
      basePrice: 222.99,
      pricingModel: "fixed",
      currency: "USD"
    }
  }
];

// Test function
export function testImageAssignment() {
  console.log('🧪 Testing image assignment...');
  
  // Test individual product
  const testProduct = testProducts[0];
  console.log('📦 Original product:', testProduct.name);
  console.log('📁 Category folder:', getCategoryFolder(testProduct.category));
  console.log('🖼️ Original images:', testProduct.images);
  
  const productWithImages = assignProductImages(testProduct);
  console.log('🖼️ Product with images:', productWithImages.name);
  console.log('🖼️ Assigned images:', productWithImages.images);
  
  // Test multiple products
  console.log('\n🧪 Testing multiple products...');
  const productsWithImages = assignImagesToProducts(testProducts);
  
  productsWithImages.forEach(product => {
    console.log(`📦 ${product.name}: ${product.images.length} images assigned`);
    product.images.forEach((img, index) => {
      console.log(`  ${index + 1}. ${img.url.substring(0, 80)}...`);
    });
  });
  
  return productsWithImages;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testImageAssignment = testImageAssignment;
}
