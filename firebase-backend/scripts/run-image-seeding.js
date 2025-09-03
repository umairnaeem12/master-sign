// run-image-seeding.js - Execute product image seeding
import ProductImageSeeder from './seed-product-images.js';

console.log('🎯 SignFlow Product Image Seeding');
console.log('=====================================');
console.log('This script will add images from Firebase Storage to existing products');
console.log('based on their categories and handle mismatched category mappings.\n');

async function runSeeding() {
  const startTime = Date.now();
  
  try {
    const seeder = new ProductImageSeeder();
    
    console.log('🚀 Starting seeding process...\n');
    
    // Run the main seeding
    await seeder.seedProductImages();
    
    // Verify results
    await seeder.verifySeeding();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`\n⏱️ Total execution time: ${duration} seconds`);
    console.log('🎉 Product image seeding completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Seeding failed with error:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the seeding
runSeeding();
