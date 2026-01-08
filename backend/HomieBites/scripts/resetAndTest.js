// Script to delete all old items and create a test item
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/database.js';
import Menu from '../models/Menu.js';
import Gallery from '../models/Gallery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../../.env') });
dotenv.config();

const resetAndCreateTest = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database');

    // Delete all gallery items
    console.log('\n🗑️  Deleting all gallery items...');
    const galleryDeleteResult = await Gallery.deleteMany({});
    console.log(`✅ Deleted ${galleryDeleteResult.deletedCount} gallery items`);

    // Clear menu data
    console.log('\n🗑️  Clearing all menu items...');
    await Menu.findOneAndUpdate(
      { key: 'default' },
      { data: [], updatedAt: new Date() },
      { upsert: true }
    );
    console.log('✅ Cleared all menu items');

    // Create test menu item
    console.log('\n➕ Creating test menu item...');
    const testMenuData = [
      {
        id: 'test-category-1',
        category: 'Lunch',
        icon: 'fa-utensils',
        tag: 'LUNCH',
        description: 'Delicious lunch options',
        items: [
          {
            id: 'test-item-1',
            name: 'Test Lunch Combo',
            description: 'A test lunch combo with rice, dal, vegetables, and roti',
            price: 150,
            imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
            isAvailable: true,
            category: 'Lunch',
          },
        ],
      },
    ];

    await Menu.findOneAndUpdate(
      { key: 'default' },
      { data: testMenuData, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    console.log('✅ Created test menu item: Test Lunch Combo');

    // Create test gallery item
    console.log('\n➕ Creating test gallery item...');
    const testGalleryItem = new Gallery({
      name: 'Test Lunch Combo',
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      alt: 'Test Lunch Combo',
      caption: 'Test Lunch Combo - ₹150',
      price: 150,
      category: 'Lunch',
      order: 0,
      isActive: true,
    });

    await testGalleryItem.save();
    console.log('✅ Created test gallery item: Test Lunch Combo');

    console.log('\n✨ Reset complete! Test items created:');
    console.log('   - Menu: Test Lunch Combo (₹150)');
    console.log('   - Gallery: Test Lunch Combo (₹150)');
    console.log('\n📝 You can now test the admin dashboard and website gallery.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetAndCreateTest();

