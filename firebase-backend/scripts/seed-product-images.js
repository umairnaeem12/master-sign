// seed-product-images.js - Add images from Firebase Storage to existing products
import { db } from "../src/firebase-config.js";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

// Firebase Storage bucket structure mapping
const STORAGE_FOLDER_TO_CATEGORY_MAPPING = {
  // Direct matches
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

// Category ID to Firebase Storage folder mapping (reverse)
const CATEGORY_TO_STORAGE_FOLDER = {
  "EXPO_DISPLAY": ["Special Events", "Step & Repeat", "Tradeshows-Expos"],
  "LASER_ENGRAVING": ["Laser Engraving"],
  "DECALS_STICKERS": ["Vinyl"],
  "BANNERS_FLAGS": ["Banners"],
  "SIGNS": ["Business Signage", "Fabricated Signs", "Monument Signs", "Office Signage", "Rigid Signs"],
  "PRIVACY_SECURITY": ["Window Tint & Frost"],
  "MARKETING": ["Banners", "Special Events"], // Fallback categories
  "PROMO": ["Clothes", "Special Events"],
  "ELECTRIC_SIGNS": ["Channel Letters"],
  "VEHICLE_TRAILER": ["Vehicle Graphics"],
  "INDOOR_SIGNS": ["Directories & Plaques", "Indoor-Outdoor Displays", "Office Decor", "Office Signage"],
  "OUTDOOR_SIGNS": ["Business Signage", "Fabricated Signs", "Monument Signs", "Rigid Signs"],
  "ACCESSORIES": ["Banners", "Special Events"] // Fallback categories
};

// Handle mismatched categories - map orphaned category IDs to valid ones
const ORPHANED_CATEGORY_MAPPING = {
  "GyE3Vxub7daS6EFzAtqL": "EXPO_DISPLAY", // Display Accessories, Event Signage, etc.
  "ToVu7Aml1I2cYkMhJXOg": "LASER_ENGRAVING", // Metal Engraving
  "FehToXBstMepLx4rR8qj": "MARKETING", // Marketing Materials
  "bvDyZ4EUGDVjhfFHrFWX": "MARKETING", // Point-of-Purchase Displays, Branding
  "xCEkcBBCpgWLw7OGSSWr": "PROMO", // Event Giveaways, Custom Promotional Products
  "ZKz1JSEllBcqLXGoJWdV": "ELECTRIC_SIGNS" // LED Message Boards, Neon Lighting, etc.
};

class ProductImageSeeder {
  constructor() {
    this.storage = getStorage();
    this.imageCache = new Map(); // Cache storage images by folder
    this.stats = {
      productsUpdated: 0,
      productsSkipped: 0,
      imagesAdded: 0,
      errors: 0
    };
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
          console.warn(`Failed to get download URL for ${itemRef.fullPath}:`, error.message);
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

  // Get images for a category by trying multiple folder mappings
  async getImagesForCategory(categoryId) {
    const folders = CATEGORY_TO_STORAGE_FOLDER[categoryId] || [];
    let allImages = [];

    for (const folder of folders) {
      const images = await this.getImagesFromFolder(folder);
      allImages = allImages.concat(images);
    }

    // If no images found, try fallback categories
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

  // Update product with images
  async updateProductWithImages(product, images) {
    if (images.length === 0) {
      console.log(`⚠️ No images available for product: ${product.name}`);
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

      console.log(`✅ Updated product "${product.name}" with ${selectedImages.length} images`);
      this.stats.productsUpdated++;
      this.stats.imagesAdded += selectedImages.length;
      return true;
    } catch (error) {
      console.error(`❌ Error updating product ${product.name}:`, error.message);
      this.stats.errors++;
      return false;
    }
  }

  // Main seeding function
  async seedProductImages() {
    console.log('🚀 Starting product image seeding...');
    console.log('📊 Storage folder to category mapping:', STORAGE_FOLDER_TO_CATEGORY_MAPPING);

    try {
      // Get all products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`📦 Found ${products.length} products to process`);

      // Group products by category
      const productsByCategory = new Map();
      
      for (const product of products) {
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
        
        // Get images for this category
        const images = await this.getImagesForCategory(categoryId);
        
        if (images.length === 0) {
          console.log(`⚠️ No images found for category: ${categoryId}`);
          this.stats.productsSkipped += products.length;
          continue;
        }

        // Update each product in this category
        for (const product of products) {
          await this.updateProductWithImages(product, images);
        }
      }

      // Print final statistics
      console.log('\n📊 Seeding Statistics:');
      console.log(`✅ Products Updated: ${this.stats.productsUpdated}`);
      console.log(`⚠️ Products Skipped: ${this.stats.productsSkipped}`);
      console.log(`🖼️ Total Images Added: ${this.stats.imagesAdded}`);
      console.log(`❌ Errors: ${this.stats.errors}`);

      // Handle categories with no products
      console.log('\n📋 Categories with no products (need attention):');
      const categoriesWithProducts = Array.from(productsByCategory.keys());
      const allCategories = Object.keys(CATEGORY_TO_STORAGE_FOLDER);
      
      for (const category of allCategories) {
        if (!categoriesWithProducts.includes(category)) {
          console.log(`   - ${category}`);
        }
      }

    } catch (error) {
      console.error('❌ Fatal error during seeding:', error);
      throw error;
    }
  }

  // Verify the seeding results
  async verifySeeding() {
    console.log('\n🔍 Verifying seeding results...');
    
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      let productsWithImages = 0;
      let productsWithoutImages = 0;
      let totalImages = 0;

      for (const product of products) {
        if (product.images && product.images.length > 0) {
          productsWithImages++;
          totalImages += product.images.length;
        } else {
          productsWithoutImages++;
          console.log(`⚠️ Product without images: ${product.name} (Category: ${product.category})`);
        }
      }

      console.log(`\n📊 Verification Results:`);
      console.log(`✅ Products with images: ${productsWithImages}`);
      console.log(`⚠️ Products without images: ${productsWithoutImages}`);
      console.log(`🖼️ Total images across all products: ${totalImages}`);
      console.log(`📈 Average images per product: ${(totalImages / productsWithImages).toFixed(2)}`);

    } catch (error) {
      console.error('❌ Error during verification:', error);
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting product image seeding script...');
  
  try {
    const seeder = new ProductImageSeeder();
    console.log('✅ Seeder initialized');
    
    await seeder.seedProductImages();
    console.log('✅ Seeding completed');
    
    await seeder.verifySeeding();
    console.log('✅ Verification completed');
    
    console.log('\n🎉 Product image seeding completed successfully!');
  } catch (error) {
    console.error('\n💥 Seeding failed:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default ProductImageSeeder;
