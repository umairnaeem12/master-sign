// dry-run-image-seeding.js - Test product image seeding without making changes
import { db } from "../src/firebase-config.js";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

// Firebase Storage bucket structure mapping (same as main script)
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

class DryRunImageSeeder {
  constructor() {
    this.storage = getStorage();
    this.imageCache = new Map();
    this.stats = {
      productsToUpdate: 0,
      productsToSkip: 0,
      imagesToAdd: 0,
      categoriesFound: 0,
      categoriesMissing: 0
    };
  }

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

  async dryRunSeeding() {
    console.log('🔍 DRY RUN: Product Image Seeding Analysis');
    console.log('==========================================');
    console.log('This is a dry run - no changes will be made to the database\n');

    try {
      // Get all products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`📦 Found ${products.length} products to analyze`);

      // Group products by category
      const productsByCategory = new Map();
      const categoryAnalysis = new Map();
      
      for (const product of products) {
        let categoryId = product.category;
        
        // Handle orphaned category IDs
        if (ORPHANED_CATEGORY_MAPPING[categoryId]) {
          console.log(`🔄 Would map orphaned category ${categoryId} to ${ORPHANED_CATEGORY_MAPPING[categoryId]} for product: ${product.name}`);
          categoryId = ORPHANED_CATEGORY_MAPPING[categoryId];
        }

        if (!productsByCategory.has(categoryId)) {
          productsByCategory.set(categoryId, []);
          categoryAnalysis.set(categoryId, {
            products: 0,
            hasImages: 0,
            needsImages: 0,
            availableImages: 0
          });
        }
        productsByCategory.get(categoryId).push(product);
        
        const analysis = categoryAnalysis.get(categoryId);
        analysis.products++;
        if (product.images && product.images.length > 0) {
          analysis.hasImages++;
        } else {
          analysis.needsImages++;
        }
      }

      console.log('\n📊 Category Analysis:');
      console.log('====================');

      // Analyze each category
      for (const [categoryId, products] of productsByCategory) {
        console.log(`\n🎯 Category: ${categoryId}`);
        console.log(`   Products: ${products.length}`);
        
        const analysis = categoryAnalysis.get(categoryId);
        console.log(`   Products with images: ${analysis.hasImages}`);
        console.log(`   Products needing images: ${analysis.needsImages}`);

        // Check available images
        const images = await this.getImagesForCategory(categoryId);
        analysis.availableImages = images.length;
        
        if (images.length > 0) {
          this.stats.categoriesFound++;
          console.log(`   ✅ Available images: ${images.length}`);
          console.log(`   📈 Would add ${Math.min(images.length, analysis.needsImages * 3)} images to products`);
          this.stats.imagesToAdd += Math.min(images.length, analysis.needsImages * 3);
          this.stats.productsToUpdate += analysis.needsImages;
        } else {
          this.stats.categoriesMissing++;
          console.log(`   ❌ No images available`);
          this.stats.productsToSkip += analysis.needsImages;
        }
      }

      // Summary
      console.log('\n📋 Summary:');
      console.log('===========');
      console.log(`✅ Categories with images: ${this.stats.categoriesFound}`);
      console.log(`❌ Categories without images: ${this.stats.categoriesMissing}`);
      console.log(`📦 Products to update: ${this.stats.productsToUpdate}`);
      console.log(`⚠️ Products to skip: ${this.stats.productsToSkip}`);
      console.log(`🖼️ Total images to add: ${this.stats.imagesToAdd}`);

      // Show categories with no products
      console.log('\n📋 Categories with no products:');
      const categoriesWithProducts = Array.from(productsByCategory.keys());
      const allCategories = Object.keys(CATEGORY_TO_STORAGE_FOLDER);
      
      for (const category of allCategories) {
        if (!categoriesWithProducts.includes(category)) {
          console.log(`   - ${category}`);
        }
      }

      console.log('\n🔍 DRY RUN COMPLETED - No changes made to database');
      console.log('Run the actual seeding script when ready: node scripts/run-image-seeding.js');

    } catch (error) {
      console.error('❌ Error during dry run:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const seeder = new DryRunImageSeeder();
  
  try {
    await seeder.dryRunSeeding();
  } catch (error) {
    console.error('\n💥 Dry run failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default DryRunImageSeeder;
