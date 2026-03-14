import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'propelus';

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    console.log(`✅ Connected to MongoDB (database: ${MONGODB_DB_NAME})`);

    // Check if admin user already exists
    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('ℹ️  Admin user already exists. Updating password...');
      const hash = await bcrypt.hash('admin123', 10);
      await User.updateOne({ username: 'admin' }, { password_hash: hash });
      console.log('✅ Admin user password updated.');
    } else {
      const hash = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password_hash: hash,
        email: 'admin@example.com',
      });
      console.log('✅ Admin user created successfully.');
    }

    console.log('\n📋 Admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
