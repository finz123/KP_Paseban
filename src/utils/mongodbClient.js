import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // Load MONGO_URI dari .env.local

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

export async function connectDB() {
    if (!database) {
        try {
            await client.connect();
            console.log('Connected to MongoDB');
            database = client.db(); // Nama database dari URI
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }
    return database;
}

export async function getCollection(collectionName) {
    const db = await connectDB();
    return db.collection(collectionName);
}
