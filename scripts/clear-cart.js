// Simple script to clear cart data if needed
// Run this in browser console if cart issues persist

console.log('Clearing cart data...');

try {
  localStorage.removeItem('cart');
  console.log('Cart data cleared successfully');
} catch (error) {
  console.error('Error clearing cart:', error);
  try {
    localStorage.clear();
    console.log('All localStorage cleared');
  } catch (clearError) {
    console.error('Failed to clear localStorage:', clearError);
  }
}

console.log('Please refresh the page');