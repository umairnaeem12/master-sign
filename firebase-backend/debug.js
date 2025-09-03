// debug.js - Simple debug script
console.log('🚀 Debug script starting...');

// Test 1: Basic console output
console.log('✅ Console output working');

// Test 2: Import Firebase
console.log('📦 Importing Firebase...');
import('./src/firebase-config.js').then(config => {
  console.log('✅ Firebase config loaded');
  console.log('DB instance:', !!config.db);
  console.log('Storage instance:', !!config.storage);
  
  // Test 3: Try to access Firestore
  console.log('🔥 Testing Firestore...');
  import('firebase/firestore').then(async ({ getDocs, collection }) => {
    try {
      const snapshot = await getDocs(collection(config.db, 'products'));
      console.log('✅ Firestore working, products found:', snapshot.size);
    } catch (error) {
      console.error('❌ Firestore error:', error.message);
    }
  }).catch(error => {
    console.error('❌ Firestore import error:', error.message);
  });
  
  // Test 4: Try to access Storage
  console.log('📁 Testing Storage...');
  import('firebase/storage').then(async ({ getStorage, ref, listAll }) => {
    try {
      const storage = getStorage();
      const rootRef = ref(storage, '');
      const result = await listAll(rootRef);
      console.log('✅ Storage working, root items:', result.items.length);
      console.log('Root prefixes:', result.prefixes.length);
    } catch (error) {
      console.error('❌ Storage error:', error.message);
    }
  }).catch(error => {
    console.error('❌ Storage import error:', error.message);
  });
  
}).catch(error => {
  console.error('❌ Firebase config error:', error.message);
});

console.log('🏁 Debug script finished');
