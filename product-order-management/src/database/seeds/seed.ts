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
    imageUrl:
      'https://plus.unsplash.com/premium_photo-1679865289918-b21aae5a9559?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    name: 'Smart Watch Pro',
    description:
      'Feature-rich smartwatch with fitness tracking, heart rate monitor, GPS, and 7-day battery life.',
    price: 249.99,
    imageUrl:
      'https://images.unsplash.com/photo-1637160151663-a410315e4e75?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    name: 'MacBook Pro 16-inch',
    description:
      'Powerful laptop with M1 Pro chip, 16GB RAM, and 512GB SSD. Ideal for professionals and creatives.',
    price: 34.99,
    imageUrl:
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974',
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description:
      'RGB backlit mechanical keyboard with Cherry MX switches and programmable keys. Perfect for gaming and typing.',
    price: 129.99,
    imageUrl:
      'https://images.unsplash.com/photo-1660496379804-b408bfacc9cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1051',
  },
  {
    name: 'Wireless Mouse',
    description:
      'Ergonomic wireless mouse with precision tracking and long battery life. Comfortable for all-day use.',
    price: 29.99,
    imageUrl:
      'https://images.unsplash.com/photo-1739742473235-34a7bd9b8f87?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    name: '4K Webcam',
    description:
      'Ultra HD webcam with auto-focus and built-in microphone for video calls. Crystal clear image quality.',
    price: 89.99,
    imageUrl:
      'https://images.unsplash.com/photo-1622750342107-4b60e2704157?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  },
  {
    name: 'Portable SSD 1TB',
    description:
      'Compact external SSD with 1TB storage and USB 3.2 Gen 2 speeds. Fast and reliable data storage.',
    price: 119.99,
    imageUrl:
      'https://images.unsplash.com/photo-1720048170512-d5d4fb0fff88?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    name: 'Laptop Stand Aluminum',
    description:
      'Adjustable aluminum laptop stand for better ergonomics and cooling. Fits all laptop sizes.',
    price: 39.99,
    imageUrl:
      'https://images.unsplash.com/photo-1623251609314-97cc1f84e3ed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    name: 'Iphone 14 Pro Max',
    description:
      'The latest iPhone with A16 Bionic chip, 5G capability, and stunning Super Retina XDR display.',
    price: 1099.99,
    imageUrl:
      'https://images.unsplash.com/photo-1697898706719-bce6e007c817?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    name: 'LED Desk Lamp',
    description:
      'Adjustable LED desk lamp with touch control and multiple brightness levels. Eye-friendly lighting.',
    price: 44.99,
    imageUrl:
      'https://images.unsplash.com/photo-1708513427809-728a7913fc9f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=663',
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
