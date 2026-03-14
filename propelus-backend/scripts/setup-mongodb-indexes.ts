import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

const localEnv = path.resolve(process.cwd(), '.env');
const parentEnv = path.resolve(__dirname, '../../.env');
if (fs.existsSync(localEnv)) config({ path: localEnv });
else if (fs.existsSync(parentEnv)) config({ path: parentEnv });
else config();

import mongoose from 'mongoose';

// Import all models so Mongoose registers their schemas & indexes
import '../src/db/mongodb/models/ContactSubmission';
import '../src/db/mongodb/models/Testimonial';
import '../src/db/mongodb/models/AffiliateRegistration';
import '../src/db/mongodb/models/NewsletterSubscriber';
import '../src/db/mongodb/models/AdminUser';
import '../src/db/mongodb/models/NewsletterCampaign';
import '../src/db/mongodb/models/ChatConversation';
import '../src/db/mongodb/models/AnalyticsEvent';
import '../src/db/mongodb/models/ActivityLog';
import '../src/db/mongodb/models/Session';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

async function setupIndexes(): Promise<void> {
  console.log('\n🔧 Setting up MongoDB indexes for all collections...');

  try {
    await mongoose.connect(MONGODB_URI!, {
      dbName: process.env.MONGODB_DB_NAME || 'propelus',
    });
    console.log('✅ Connected to MongoDB');

    // Sync all model indexes
    const modelNames = mongoose.modelNames();
    for (const name of modelNames) {
      console.log(`  Creating indexes for ${name}...`);
      await mongoose.model(name).syncIndexes();
    }

    console.log(`\n✅ All indexes synced for ${modelNames.length} collections!\n`);
  } catch (error) {
    console.error('❌ Failed to setup indexes:', error);
  } finally {
    await mongoose.disconnect();
  }
}

setupIndexes();
