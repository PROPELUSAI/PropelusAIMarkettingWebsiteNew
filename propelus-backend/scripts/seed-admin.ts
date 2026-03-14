import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

const localEnv = path.resolve(process.cwd(), '.env');
const parentEnv = path.resolve(__dirname, '../../.env');
if (fs.existsSync(localEnv)) config({ path: localEnv });
else if (fs.existsSync(parentEnv)) config({ path: parentEnv });
else config();

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { AdminUser } from '../src/db/mongodb/models/AdminUser';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

async function seedAdmin(): Promise<void> {
  await mongoose.connect(MONGODB_URI!, { dbName: process.env.MONGODB_DB_NAME || 'propelus' });

  const email = process.argv[2] || 'admin@propelus.ai';
  const password = process.argv[3] || 'Admin@123456';
  const fullName = process.argv[4] || 'Super Admin';

  console.log(`\n🌱 Seeding admin user: ${email}`);

  try {
    const existing = await AdminUser.findOne({ email });

    if (existing) {
      console.log('⚠️  Admin user already exists. Updating password...');
      existing.passwordHash = await bcrypt.hash(password, 12);
      await existing.save();
      console.log('✅ Password updated.');
    } else {
      const passwordHash = await bcrypt.hash(password, 12);
      await AdminUser.create({
        email,
        passwordHash,
        fullName,
        role: 'super_admin',
        isActive: true,
      });
      console.log('✅ Admin user created successfully!');
    }

    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: super_admin`);
    console.log('\n⚠️  Change the password after first login!\n');
  } catch (error) {
    console.error('❌ Failed to seed admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
