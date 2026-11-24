require('dotenv').config();

import dns from 'node:dns';
import mongoose from 'mongoose';

// Configure DNS with fallback so SRV resolution succeeds across all environments
try {
  const customDns = process.env.MONGODB_DNS_SERVERS?.split(',').map((s) => s.trim()).filter(Boolean);
  if (customDns && customDns.length > 0) {
    dns.setServers(customDns);
  } else {
    // 8.8.8.8 and 1.1.1.1 resolve MongoDB Atlas SRV records reliably
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  }
} catch (e) {
  console.warn('[db] DNS notice (using default system resolver):', (e as any)?.message || e);
}

// Ensure connection points to user's database where their real data lives
let rawUri = process.env.MONGODB_URI?.trim().replace(/["']+$/, '') || '';
if (rawUri && rawUri.includes('cluster1.qdqiok4.mongodb.net/lms')) {
  rawUri = rawUri.replace('cluster1.qdqiok4.mongodb.net/lms', 'cluster1.qdqiok4.mongodb.net/test');
}
const MONGODB_URI = rawUri;

let isConnecting = false;

const connectDB = async (): Promise<void> => {
  if (!MONGODB_URI) {
    console.warn('[db] MONGODB_URI is not defined. Database operations will be mocked or deferred.');
    return;
  }

  if (mongoose.connection.readyState === 1 || isConnecting) {
    return;
  }

  isConnecting = true;

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    isConnecting = false;
    console.log(`[db] MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error: any) {
    isConnecting = false;
    console.error(`[db] MongoDB Connection Error: ${error?.message || error}`);
    // Non-blocking retry: do not crash or throw unhandled rejection
    setTimeout(() => {
      connectDB().catch((err) => console.error('[db] Reconnect failed:', err?.message || err));
    }, 5000);
  }
};

export default connectDB;