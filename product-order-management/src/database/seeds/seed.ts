import { Product } from '../../products/entities/product.entity';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'product_order_db',
  entities: [Product],
  synchronize: false,
});

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description:
      'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 79.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Headphones',
  },
  {
    name: 'Smart Watch Pro',
    description:
      'Feature-rich smartwatch with fitness tracking, heart rate monitor, GPS, and 7-day battery life.',
    price: 249.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Smart+Watch',
  },
  {
    name: 'USB-C Fast Charger 65W',
    description:
      '65W fast charging adapter with multiple ports for all your devices. Compact and travel-friendly.',
    price: 34.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Charger',
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description:
      'RGB backlit mechanical keyboard with Cherry MX switches and programmable keys. Perfect for gaming and typing.',
    price: 129.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Keyboard',
  },
  {
    name: 'Wireless Mouse',
    description:
      'Ergonomic wireless mouse with precision tracking and long battery life. Comfortable for all-day use.',
    price: 29.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Mouse',
  },
  {
    name: '4K Webcam',
    description:
      'Ultra HD webcam with auto-focus and built-in microphone for video calls. Crystal clear image quality.',
    price: 89.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Webcam',
  },
  {
    name: 'Portable SSD 1TB',
    description:
      'Compact external SSD with 1TB storage and USB 3.2 Gen 2 speeds. Fast and reliable data storage.',
    price: 119.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=SSD',
  },
  {
    name: 'Laptop Stand Aluminum',
    description:
      'Adjustable aluminum laptop stand for better ergonomics and cooling. Fits all laptop sizes.',
    price: 39.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Laptop+Stand',
  },
  {
    name: 'USB Hub 7-Port',
    description:
      'Powered USB 3.0 hub with 7 ports and individual power switches. Expand your connectivity options.',
    price: 24.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=USB+Hub',
  },
  {
    name: 'LED Desk Lamp',
    description:
      'Adjustable LED desk lamp with touch control and multiple brightness levels. Eye-friendly lighting.',
    price: 44.99,
    imageUrl: 'https://via.placeholder.com/300x300?text=Desk+Lamp',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting seed...');

    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const productRepository = AppDataSource.getRepository(Product);

    // Check if products already exist
    const existingCount = await productRepository.count();
    if (existingCount > 0) {
      console.log(
        `⚠️  Database already has ${existingCount} products. Skipping seed.`,
      );
      await AppDataSource.destroy();
      return;
    }

    // Insert products
    await productRepository.save(products);
    console.log(`✅ Successfully seeded ${products.length} products`);

    await AppDataSource.destroy();
    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
