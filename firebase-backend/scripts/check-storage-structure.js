// check-storage-structure.js - Diagnostic script to check Firebase Storage structure
import { getStorage, ref, listAll } from "firebase/storage";

class StorageStructureChecker {
  constructor() {
    this.storage = getStorage();
  }

  async checkStorageStructure() {
    console.log('🔍 Checking Firebase Storage Structure');
    console.log('=====================================\n');

    try {
      // Check the root level
      console.log('📁 Checking root level...');
      const rootRef = ref(this.storage, '');
      const rootResult = await listAll(rootRef);
      
      console.log(`Root level items: ${rootResult.items.length}`);
      console.log(`Root level prefixes: ${rootResult.prefixes.length}`);
      
      for (const prefix of rootResult.prefixes) {
        console.log(`  📂 Prefix: ${prefix.name}`);
      }

      // Check Master Sign folder
      console.log('\n📁 Checking Master Sign folder...');
      const masterSignRef = ref(this.storage, 'Master Sign');
      const masterSignResult = await listAll(masterSignRef);
      
      console.log(`Master Sign items: ${masterSignResult.items.length}`);
      console.log(`Master Sign prefixes: ${masterSignResult.prefixes.length}`);
      
      for (const prefix of masterSignResult.prefixes) {
        console.log(`  📂 Prefix: ${prefix.name}`);
      }

      // Check Master Sign/assets folder
      console.log('\n📁 Checking Master Sign/assets folder...');
      const assetsRef = ref(this.storage, 'Master Sign/assets');
      const assetsResult = await listAll(assetsRef);
      
      console.log(`Assets items: ${assetsResult.items.length}`);
      console.log(`Assets prefixes: ${assetsResult.prefixes.length}`);
      
      for (const prefix of assetsResult.prefixes) {
        console.log(`  📂 Folder: ${prefix.name}`);
        
        // Check each folder
        try {
          const folderRef = ref(this.storage, `Master Sign/assets/${prefix.name}`);
          const folderResult = await listAll(folderRef);
          console.log(`    📄 Files in ${prefix.name}: ${folderResult.items.length}`);
          
          if (folderResult.items.length > 0) {
            console.log(`    📋 Sample files:`);
            for (let i = 0; i < Math.min(3, folderResult.items.length); i++) {
              console.log(`      - ${folderResult.items[i].name}`);
            }
            if (folderResult.items.length > 3) {
              console.log(`      ... and ${folderResult.items.length - 3} more`);
            }
          }
        } catch (error) {
          console.log(`    ❌ Error accessing ${prefix.name}: ${error.message}`);
        }
      }

      // Check if there are any files directly in assets
      if (assetsResult.items.length > 0) {
        console.log('\n📄 Files directly in assets folder:');
        for (const item of assetsResult.items) {
          console.log(`  📄 ${item.name}`);
        }
      }

      // Try alternative paths
      console.log('\n🔍 Checking alternative paths...');
      
      const alternativePaths = [
        'assets',
        'Master%20Sign',
        'Master%20Sign/assets',
        'Master Sign',
        'master-sign',
        'mastersign'
      ];

      for (const path of alternativePaths) {
        try {
          const altRef = ref(this.storage, path);
          const altResult = await listAll(altRef);
          console.log(`✅ Path "${path}": ${altResult.items.length} items, ${altResult.prefixes.length} prefixes`);
          
          if (altResult.prefixes.length > 0) {
            console.log(`  📂 Prefixes in "${path}":`);
            for (const prefix of altResult.prefixes) {
              console.log(`    - ${prefix.name}`);
            }
          }
        } catch (error) {
          console.log(`❌ Path "${path}": ${error.message}`);
        }
      }

    } catch (error) {
      console.error('❌ Error checking storage structure:', error);
    }
  }

  async checkSpecificFolders() {
    console.log('\n🎯 Checking specific folders from your list...');
    
    const foldersToCheck = [
      'Banners',
      'Business Signage',
      'Channel Letters',
      'Clothes',
      'Directories & Plaques',
      'Fabricated Signs',
      'Indoor-Outdoor Displays',
      'Laser Engraving',
      'Monument Signs',
      'Office Decor',
      'Office Signage',
      'Rigid Signs',
      'Special Events',
      'Step & Repeat',
      'Tradeshows-Expos',
      'Vehicle Graphics',
      'Vinyl',
      'Window Tint & Frost'
    ];

    for (const folder of foldersToCheck) {
      try {
        const folderRef = ref(this.storage, `Master Sign/assets/${folder}`);
        const result = await listAll(folderRef);
        console.log(`📁 ${folder}: ${result.items.length} files`);
        
        if (result.items.length > 0) {
          console.log(`  📋 Sample files:`);
          for (let i = 0; i < Math.min(2, result.items.length); i++) {
            console.log(`    - ${result.items[i].name}`);
          }
        }
      } catch (error) {
        console.log(`❌ ${folder}: ${error.message}`);
      }
    }
  }
}

// Main execution
async function main() {
  const checker = new StorageStructureChecker();
  
  try {
    await checker.checkStorageStructure();
    await checker.checkSpecificFolders();
    console.log('\n✅ Storage structure check completed!');
  } catch (error) {
    console.error('\n💥 Check failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default StorageStructureChecker;
