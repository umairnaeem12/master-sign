// product-image-assigner.ts - Runtime image assignment for products

export interface ProductImage {
  url: string;
  alt?: string;
  caption?: string;
}

// Firebase Storage base URL
const FIREBASE_STORAGE_BASE = 'https://firebasestorage.googleapis.com/v0/b/mastersign-d8396.firebasestorage.app/o/';

// Category to folder mapping based on your bucket structure
const CATEGORY_FOLDER_MAP: Record<string, string> = {
  // Map category IDs to folder names
  'GGmvGqZa8rR4NMmZZWhA': 'Business%20Signage', // Real Estate Signs
  'FehToXBstMepLx4rR8qj': 'Banners', // Marketing Materials
  'NwaIk9qBifCcNbj2TyTw': 'Business%20Signage', // Real Estate subcategory
  'eEycqLH3ZqkiOCxtZVo0': 'Banners', // Marketing subcategory
  
  // Orphaned category mappings from seed script
  'GyE3Vxub7daS6EFzAtqL': 'Tradeshows-Expos', // Display Accessories, Event Signage
  'ToVu7Aml1I2cYkMhJXOg': 'Laser%20Engraving', // Metal Engraving
  'bvDyZ4EUGDVjhfFHrFWX': 'Banners', // Point-of-Purchase Displays, Branding
  'xCEkcBBCpgWLw7OGSSWr': 'Special%20Events', // Event Giveaways, Custom Promotional Products
  'ZKz1JSEllBcqLXGoJWdV': 'Channel%20Letters', // LED Message Boards, Neon Lighting
  
  // Category ID mappings based on firebase-categories-products.js
  // These will be mapped when we get the actual category IDs from Firebase
  // For now, we'll use the fallback system to handle unknown categories
};

// Sample images for each folder (you can expand this)
const FOLDER_IMAGES: Record<string, string[]> = {
  'Business%20Signage': [
    'Dancology.jpg',
    'Performance.jpg',
    '20160921_215751-edited.jpg',
    '20170605_125901-edited.jpg',
    '20170730_160417-edited.jpg',
    '20190501_163912.jpg',
    '20190529_210403-edited.jpg',
    '20190614_201518.jpg',
    '20191007_220944.jpg',
    '20191007_221000.jpg',
    '20191010_113014.jpg',
    '20200123_013022.jpg',
    '20200201_162931.jpg',
    '20200224_145545-edited.jpg',
    '20201223_130521.jpg',
    '20201223_130527.jpg',
    '20201223_131118.jpg',
    '20210401_224553.jpg',
    '20210826_085819.jpg',
    '20210913_192336.jpg',
    '20210913_192638.jpg',
    '20211028_180629.jpg',
    '20211119_162043.jpg',
    '20211119_163155.jpg',
    '20211119_165702.jpg',
    '20211221_133410.jpg',
    '20221013_190255.jpg',
    '20221013_190313.jpg',
    '20221118_171521.jpg',
    '20221118_171536.jpg',
    '20221118_171544.jpg',
    '20221118_184333.jpg',
    '20221223_144241.jpg',
    '20230109_115736.jpg',
    '20230207_105000.jpg',
    '20230211_113609.jpg',
    '20230221_111011.jpg',
    '20230405_190144.jpg',
    '20230419_162132.jpg',
    '20230515_163211.jpg',
    '20230616_154153.jpg',
    '20230616_154436.jpg',
    '20240118_150912.jpg',
    '20240118_151228.jpg',
    '20240118_151230.jpg',
    '20240120_091335.jpg',
    '20240120_091420.jpg',
    '20240201_091753.jpg',
    '20240201_091823.jpg',
    '20240308_182215.jpg',
    '20240308_183140.jpg',
    '20240308_183142.jpg',
    '20240308_183225.jpg',
    '20240308_183254.jpg',
    '20240308_183259.jpg',
    '20240308_183306.jpg',
    '20240520_150534.jpg',
    '20240531_133436.jpg',
    '20240605_123349.jpg',
    '20240605_144517.jpg',
    '20240731_175048.jpg',
    'Dancology.jpg',
    'Day%20Violins.JPG',
    'Direct_Source1.JPG',
    'Flex.jpg',
    'Hectors_Building.jpg',
    'Hectors_Pole.jpg',
    'Horse_Crazy.jpg',
    'image000001.jpg',
    'IMG_4739.jpg',
    'Liberty.JPG'
  ],
  'Banners': [
    'MAIN%20-%20Banner.jpg',
    'Banner%20(1)%20copy.jpg',
    'Banner%20(3).jpg',
    'Banner%20(4)%20copy.jpg',
    'Banner%20(6)%20copy.jpg',
    'Banner-Canyon%20Hills.jpg',
    'Banner%20(1).jpg',
    'Banner%20(2).jpg',
    'Banner%20(4).jpg',
    'Banner%20(5).jpg',
    'Banner%20(6).jpg'
  ],
  'Channel%20Letters': [
    '20241112_194813.jpg'
  ],
  'Indoor-Outdoor%20Displays': [
    'IMG_20230621_000909.jpg',
    'Plant_Jungle2.JPG'
  ],
  'Vehicle%20Graphics': [
    '20240309_133150.jpg'
  ],
  'Office%20Signage': [
    '20230120_165654.jpg'
  ],
  'Tradeshows-Expos': [
    'popup1.jpg'
  ],
  'Laser%20Engraving': [
    'fish.jpg'
  ],
  'Special%20Events': [
    'popup1.jpg'
  ],
  'Step%20%26%20Repeat': [
    'popup1.jpg'
  ],
  'Vinyl': [
    'MAIN%20-%20Banner.jpg'
  ],
  'Fabricated%20Signs': [
    'Performance.jpg',
    'Dancology.jpg'
  ],
  'Monument%20Signs': [
    'Performance.jpg',
    'Dancology.jpg'
  ],
  'Rigid%20Signs': [
    'Performance.jpg',
    'Dancology.jpg'
  ],
  'Directories%20%26%20Plaques': [
    'IMG_20230621_000909.jpg',
    'Plant_Jungle2.JPG'
  ],
  'Office%20Decor': [
    'IMG_20230621_000909.jpg',
    'Plant_Jungle2.JPG'
  ],
  'Window%20Tint%20%26%20Frost': [
    'IMG_20230621_000909.jpg',
    'Plant_Jungle2.JPG'
  ],
  'Clothes': [
    'MAIN%20-%20Banner.jpg'
  ],
  'Accessories': [
    'category-accessories.jpg'
  ]
};

/**
 * Generate Firebase Storage URL for an image
 */
function generateFirebaseUrl(folder: string, imageName: string): string {
  const encodedPath = `Master%2520Sign%2Fassets%2F${folder}%2F${imageName}`;
  return `${FIREBASE_STORAGE_BASE}${encodedPath}?alt=media`;
}

/**
 * Get random images from a folder with fallback to other folders
 */
function getRandomImagesFromFolder(folder: string, count: number = 2): ProductImage[] {
  const images = FOLDER_IMAGES[folder] || [];
  
  if (images.length === 0) {
    // Try fallback folders in order of preference
    const fallbackFolders = ['Banners', 'Business%20Signage', 'Tradeshows-Expos'];
    
    for (const fallbackFolder of fallbackFolders) {
      const fallbackImages = FOLDER_IMAGES[fallbackFolder] || [];
      if (fallbackImages.length > 0) {
        console.log(`🔄 Using fallback folder: ${fallbackFolder} for ${folder}`);
        const shuffled = [...fallbackImages].sort(() => 0.5 - Math.random());
        const selectedImages = shuffled.slice(0, Math.min(count, fallbackImages.length));
        
        return selectedImages.map(imageName => ({
          url: generateFirebaseUrl(fallbackFolder, imageName),
          alt: imageName.replace(/\.(jpg|jpeg|png|gif)$/i, '').replace(/%20/g, ' '),
          caption: imageName.replace(/\.(jpg|jpeg|png|gif)$/i, '').replace(/%20/g, ' ')
        }));
      }
    }
    
    // Ultimate fallback - use the main banner
    return [
      {
        url: generateFirebaseUrl('Banners', 'MAIN%20-%20Banner.jpg'),
        alt: 'Default Product Image',
        caption: 'Default Product Image'
      }
    ];
  }

  // Shuffle and pick random images
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  const selectedImages = shuffled.slice(0, Math.min(count, images.length));

  return selectedImages.map(imageName => ({
    url: generateFirebaseUrl(folder, imageName),
    alt: imageName.replace(/\.(jpg|jpeg|png|gif)$/i, '').replace(/%20/g, ' '),
    caption: imageName.replace(/\.(jpg|jpeg|png|gif)$/i, '').replace(/%20/g, ' ')
  }));
}

/**
 * Assign images to a product based on its category
 */
export function assignProductImages(product: any): any {
  // Clear existing images array
  const updatedProduct = {
    ...product,
    images: []
  };

  // Get folder based on category ID
  let folder = CATEGORY_FOLDER_MAP[product.category];
  
  // If no folder found by ID, try to use category name if available
  if (!folder && product.categoryName) {
    folder = mapCategoryNameToFolder(product.categoryName);
    console.log(`🔄 Mapped category name "${product.categoryName}" to folder: ${folder}`);
  }
  
  // If still no folder, try to infer from product name or tags
  if (!folder) {
    const productName = product.name?.toLowerCase() || '';
    const tags = product.tags?.join(' ').toLowerCase() || '';
    const searchText = `${productName} ${tags}`;
    
    if (searchText.includes('banner') || searchText.includes('flag')) {
      folder = 'Banners';
    } else if (searchText.includes('real estate') || searchText.includes('business')) {
      folder = 'Business%20Signage';
    } else if (searchText.includes('vehicle') || searchText.includes('car') || searchText.includes('truck')) {
      folder = 'Vehicle%20Graphics';
    } else if (searchText.includes('laser') || searchText.includes('engraving')) {
      folder = 'Laser%20Engraving';
    } else if (searchText.includes('channel') || searchText.includes('letter')) {
      folder = 'Channel%20Letters';
    } else if (searchText.includes('office') || searchText.includes('indoor')) {
      folder = 'Office%20Signage';
    } else if (searchText.includes('trade') || searchText.includes('expo') || searchText.includes('event')) {
      folder = 'Tradeshows-Expos';
    }
    
    if (folder) {
      console.log(`🔄 Inferred folder "${folder}" from product: ${product.name}`);
    }
  }
  
  if (folder) {
    // Assign 2 random images from the folder
    const images = getRandomImagesFromFolder(folder, 2);
    updatedProduct.images = images;
  } else {
    // Fallback for unknown categories - use images from Banners folder
    const fallbackImages = getRandomImagesFromFolder('Banners', 2);
    updatedProduct.images = fallbackImages;
    console.log(`🔄 Using fallback images for product: ${product.name}`);
  }

  return updatedProduct;
}

/**
 * Assign images to multiple products
 */
export function assignImagesToProducts(products: any[]): any[] {
  console.log(`🖼️ Starting image assignment for ${products.length} products`);
  
  const productsWithImages = products.map(product => {
    const productWithImages = assignProductImages(product);
    console.log(`✅ ${product.name}: ${productWithImages.images.length} images assigned`);
    return productWithImages;
  });
  
  console.log(`🖼️ Completed image assignment for ${productsWithImages.length} products`);
  return productsWithImages;
}

/**
 * Get category folder name for debugging
 */
export function getCategoryFolder(categoryId: string): string {
  return CATEGORY_FOLDER_MAP[categoryId] || 'Unknown';
}

/**
 * Map category name to folder (for when we have category names instead of IDs)
 */
export function mapCategoryNameToFolder(categoryName: string): string {
  const categoryNameMap: Record<string, string> = {
    'EXPO_DISPLAY': 'Tradeshows-Expos',
    'LASER_ENGRAVING': 'Laser%20Engraving',
    'DECALS_STICKERS': 'Vinyl',
    'BANNERS_FLAGS': 'Banners',
    'SIGNS': 'Business%20Signage',
    'PRIVACY_SECURITY': 'Window%20Tint%20%26%20Frost',
    'MARKETING': 'Banners',
    'PROMO': 'Special%20Events',
    'ELECTRIC_SIGNS': 'Channel%20Letters',
    'VEHICLE_TRAILER': 'Vehicle%20Graphics',
    'INDOOR_SIGNS': 'Office%20Signage',
    'OUTDOOR_SIGNS': 'Business%20Signage',
    'ACCESSORIES': 'Banners'
  };
  
  return categoryNameMap[categoryName] || 'Banners'; // Default to Banners
}

/**
 * Debug function to analyze product categories
 */
export function analyzeProductCategories(products: any[]): void {
  console.log('🔍 Analyzing product categories...');
  
  const categoryCounts: Record<string, number> = {};
  const unknownCategories: string[] = [];
  
  products.forEach(product => {
    const categoryId = product.category;
    if (categoryId) {
      categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
      
      if (!CATEGORY_FOLDER_MAP[categoryId]) {
        unknownCategories.push(categoryId);
      }
    }
  });
  
  console.log('📊 Category distribution:');
  Object.entries(categoryCounts).forEach(([categoryId, count]) => {
    const folder = CATEGORY_FOLDER_MAP[categoryId] || 'Unknown';
    console.log(`  ${categoryId}: ${count} products → ${folder}`);
  });
  
  if (unknownCategories.length > 0) {
    console.log('❓ Unknown categories:', [...new Set(unknownCategories)]);
  }
}
