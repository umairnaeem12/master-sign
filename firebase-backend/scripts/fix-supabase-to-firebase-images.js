// fix-supabase-to-firebase-images.js - Fix products with Supabase URLs to use Firebase Storage URLs
import { db } from "../src/firebase-config.js";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

// Firebase Storage bucket structure mapping
const STORAGE_FOLDER_TO_CATEGORY_MAPPING = {
  "Banners": "BANNERS_FLAGS",
  "Business Signage": "OUTDOOR_SIGNS", 
  "Business%20Signage": "OUTDOOR_SIGNS",
  "Channel Letters": "ELECTRIC_SIGNS",
  "Clothes": "PROMO",
  "Directories & Plaques": "INDOOR_SIGNS",
  "Directories%20%26%20Plaques": "INDOOR_SIGNS",
  "Fabricated Signs": "OUTDOOR_SIGNS",
  "Indoor-Outdoor Displays": "INDOOR_SIGNS",
  "Laser Engraving": "LASER_ENGRAVING",
  "Monument Signs": "OUTDOOR_SIGNS",
  "Office Decor": "INDOOR_SIGNS",
  "Office Signage": "INDOOR_SIGNS",
  "Rigid Signs": "OUTDOOR_SIGNS",
  "Special Events": "EXPO_DISPLAY",
  "Step & Repeat": "EXPO_DISPLAY",
  "Step%20%26%20Repeat": "EXPO_DISPLAY",
  "Tradeshows-Expos": "EXPO_DISPLAY",
  "Tradeshows%20-%20Expos": "EXPO_DISPLAY",
  "Vehicle Graphics": "VEHICLE_TRAILER",
  "Vinyl": "DECALS_STICKERS",
  "Window Tint & Frost": "PRIVACY_SECURITY",
  "Window%20Tint%20%26%20Frost": "PRIVACY_SECURITY"
};

const CATEGORY_TO_STORAGE_FOLDER = {
  "EXPO_DISPLAY": ["Special Events", "Step & Repeat", "Tradeshows-Expos"],
  "LASER_ENGRAVING": ["Laser Engraving"],
  "DECALS_STICKERS": ["Vinyl"],
  "BANNERS_FLAGS": ["Banners"],
  "SIGNS": ["Business Signage", "Fabricated Signs", "Monument Signs", "Office Signage", "Rigid Signs"],
  "PRIVACY_SECURITY": ["Window Tint & Frost"],
  "MARKETING": ["Banners", "Special Events"],
  "PROMO": ["Clothes", "Special Events"],
  "ELECTRIC_SIGNS": ["Channel Letters"],
  "VEHICLE_TRAILER": ["Vehicle Graphics"],
  "INDOOR_SIGNS": ["Directories & Plaques", "Indoor-Outdoor Displays", "Office Decor", "Office Signage"],
  "OUTDOOR_SIGNS": ["Business Signage", "Fabricated Signs", "Monument Signs", "Rigid Signs"],
  "ACCESSORIES": ["Banners", "Special Events"]
};

const ORPHANED_CATEGORY_MAPPING = {
  "GyE3Vxub7daS6EFzAtqL": "EXPO_DISPLAY",
  "ToVu7Aml1I2cYkMhJXOg": "LASER_ENGRAVING",
  "FehToXBstMepLx4rR8qj": "MARKETING",
  "bvDyZ4EUGDVjhfFHrFWX": "MARKETING",
  "xCEkcBBCpgWLw7OGSSWr": "PROMO",
  "ZKz1JSEllBcqLXGoJWdV": "ELECTRIC_SIGNS"
};

class SupabaseToFirebaseImageFixer {
  constructor() {
    this.storage = getStorage();
    this.imageCache = new Map();
    this.stats = {
      productsWithSupabase: 0,
      productsFixed: 0,
      productsSkipped: 0,
      errors: 0
    };
  }

  // Check if a URL is from Supabase
  isSupabaseUrl(url) {
    return url && (
      url.includes('supabase.co') ||
      url.includes('supabase.com') ||
      url.includes('storage.googleapis.com') && url.includes('supabase')
    );
  }

  // Get all images from a specific storage folder
  async getImagesFromFolder(folderName) {
    if (this.imageCache.has(folderName)) {
      return this.imageCache.get(folderName);
    }

    try {
      const folderRef = ref(this.storage, `Master Sign/assets/${folderName}`);
      const result = await listAll(folderRef);
      
      const imageUrls = [];
      for (const itemRef of result.items) {
        try {
          const url = await getDownloadURL(itemRef);
          imageUrls.push({
            url,
            name: itemRef.name,
            path: itemRef.fullPath
          });
        } catch (error) {
          console.warn(`⚠️ Failed to get download URL for ${itemRef.fullPath}:`, error.message);
        }
      }

      this.imageCache.set(folderName, imageUrls);
      console.log(`📁 Found ${imageUrls.length} images in folder: ${folderName}`);
      return imageUrls;
    } catch (error) {
      console.error(`❌ Error accessing folder ${folderName}:`, error.message);
      return [];
    }
  }

  // Get images for a category
  async getImagesForCategory(categoryId) {
    const folders = CATEGORY_TO_STORAGE_FOLDER[categoryId] || [];
    let allImages = [];

    for (const folder of folders) {
      const images = await this.getImagesFromFolder(folder);
      allImages = allImages.concat(images);
    }

    if (allImages.length === 0) {
      console.log(`⚠️ No images found for category ${categoryId}, trying fallbacks...`);
      const fallbackFolders = ["Banners", "Special Events", "Business Signage"];
      for (const folder of fallbackFolders) {
        const images = await this.getImagesFromFolder(folder);
        allImages = allImages.concat(images);
      }
    }

    return allImages;
  }

  // Fix product images
  async fixProductImages(product, images) {
    if (images.length === 0) {
      console.log(`⚠️ No Firebase images available for product: ${product.name}`);
      this.stats.productsSkipped++;
      return false;
    }

    try {
      // Select up to 3 images for the product
      const selectedImages = images.slice(0, 3).map((img, index) => ({
        id: `img_${product.id}_${index}`,
        url: img.url,
        alt: `${product.name} - Image ${index + 1}`,
        order: index,
        isPrimary: index === 0
      }));

      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        images: selectedImages,
        updatedAt: new Date()
      });

      console.log(`✅ Fixed product "${product.name}" with ${selectedImages.length} Firebase images`);
      this.stats.productsFixed++;
      return true;
    } catch (error) {
      console.error(`❌ Error fixing product ${product.name}:`, error.message);
      this.stats.errors++;
      return false;
    }
  }

  // Main fixing function
  async fixSupabaseImages() {
    console.log('🔧 Starting Supabase to Firebase image fix...');
    console.log('This will replace Supabase image URLs with Firebase Storage URLs\n');

    try {
      // Get all products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`📦 Found ${products.length} products to check`);

      // Find products with Supabase images
      const productsWithSupabase = [];
      
      for (const product of products) {
        if (product.images && Array.isArray(product.images)) {
          const hasSupabaseImages = product.images.some(img => this.isSupabaseUrl(img.url));
          if (hasSupabaseImages) {
            productsWithSupabase.push(product);
            this.stats.productsWithSupabase++;
          }
        }
      }

      console.log(`\n🔍 Found ${productsWithSupabase.length} products with Supabase images`);

      if (productsWithSupabase.length === 0) {
        console.log('✅ No products with Supabase images found!');
        return;
      }

      // Group products by category
      const productsByCategory = new Map();
      
      for (const product of productsWithSupabase) {
        let categoryId = product.category;
        
        // Handle orphaned category IDs
        if (ORPHANED_CATEGORY_MAPPING[categoryId]) {
          console.log(`🔄 Mapping orphaned category ${categoryId} to ${ORPHANED_CATEGORY_MAPPING[categoryId]} for product: ${product.name}`);
          categoryId = ORPHANED_CATEGORY_MAPPING[categoryId];
        }

        if (!productsByCategory.has(categoryId)) {
          productsByCategory.set(categoryId, []);
        }
        productsByCategory.get(categoryId).push(product);
      }

      // Process each category
      for (const [categoryId, products] of productsByCategory) {
        console.log(`\n🎯 Processing category: ${categoryId} (${products.length} products)`);
        
        // Get Firebase images for this category
        const images = await this.getImagesForCategory(categoryId);
        
        if (images.length === 0) {
          console.log(`⚠️ No Firebase images found for category: ${categoryId}`);
          this.stats.productsSkipped += products.length;
          continue;
        }

        // Fix each product in this category
        for (const product of products) {
          await this.fixProductImages(product, images);
        }
      }

      // Print final statistics
      console.log('\n📊 Fix Statistics:');
      console.log(`🔍 Products with Supabase images: ${this.stats.productsWithSupabase}`);
      console.log(`✅ Products Fixed: ${this.stats.productsFixed}`);
      console.log(`⚠️ Products Skipped: ${this.stats.productsSkipped}`);
      console.log(`❌ Errors: ${this.stats.errors}`);

    } catch (error) {
      console.error('❌ Fatal error during fixing:', error);
      throw error;
    }
  }

  // Verify the fixing results
  async verifyFixing() {
    console.log('\n🔍 Verifying fixing results...');
    
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      let productsWithSupabase = 0;
      let productsWithFirebase = 0;
      let productsWithoutImages = 0;

      for (const product of products) {
        if (product.images && product.images.length > 0) {
          const hasSupabaseImages = product.images.some(img => this.isSupabaseUrl(img.url));
          if (hasSupabaseImages) {
            productsWithSupabase++;
            console.log(`⚠️ Product still has Supabase images: ${product.name}`);
          } else {
            productsWithFirebase++;
          }
        } else {
          productsWithoutImages++;
        }
      }

      console.log(`\n📊 Verification Results:`);
      console.log(`✅ Products with Firebase images: ${productsWithFirebase}`);
      console.log(`⚠️ Products still with Supabase images: ${productsWithSupabase}`);
      console.log(`❌ Products without images: ${productsWithoutImages}`);

    } catch (error) {
      console.error('❌ Error during verification:', error);
    }
  }
}

// Main execution
async function main() {
  const fixer = new SupabaseToFirebaseImageFixer();
  
  try {
    await fixer.fixSupabaseImages();
    await fixer.verifyFixing();
    console.log('\n🎉 Supabase to Firebase image fixing completed!');
  } catch (error) {
    console.error('\n💥 Fixing failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default SupabaseToFirebaseImageFixer;
