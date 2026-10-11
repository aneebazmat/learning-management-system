require('dotenv').config();

import dns from 'node:dns';
import mongoose from 'mongoose';

const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean);
dns.setServers(dnsServers?.length ? dnsServers : ['1.1.1.1', '8.8.8.8']);

const MONGODB_URI = process.env.MONGODB_URI?.trim().replace(/["']+$/, '');

const connectDB = async () => {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }

    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error}`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return connectDB();
    }
};

export default connectDB;