import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client = null;
let clientPromise = null;
let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in the environment variables!');

  if (!clientPromise) {
    client = new MongoClient(uri, {
      maxPoolSize: 5,
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    });
    clientPromise = client.connect().then(async () => {
      const database = client.db('ribamanager');
      await Promise.all([
        database.collection('customers').createIndex({ id: 1 }, { unique: true }),
        database.collection('recipes').createIndex({ id: 1 }, { unique: true }),
      ]);
    });
  }

  await clientPromise;
  dbInstance = client.db('ribamanager');
  return dbInstance;
}

export const db = {
  // Customers
  async getCustomers() {
    const database = await getDb();
    const customers = await database.collection('customers').find({}).toArray();
    return customers.map(({ _id, ...rest }) => rest);
  },

  async upsertCustomer(customer) {
    const database = await getDb();
    const { _id, ...clean } = customer;
    await database.collection('customers').replaceOne({ id: clean.id }, clean, { upsert: true });
    return clean;
  },

  async deleteCustomer(id) {
    const database = await getDb();
    await database.collection('customers').deleteOne({ id });
  },

  // Recipes
  async getRecipes() {
    const database = await getDb();
    const recipes = await database.collection('recipes').find({}).toArray();
    return recipes.map(({ _id, ...rest }) => rest);
  },

  async upsertRecipe(recipe) {
    const database = await getDb();
    const { _id, ...clean } = recipe;
    await database.collection('recipes').replaceOne({ id: clean.id }, clean, { upsert: true });
    return clean;
  },

  async deleteRecipe(id) {
    const database = await getDb();
    await database.collection('recipes').deleteOne({ id });
  },

  // Agent Logs
  async getAgentLogs() {
    const database = await getDb();
    const logs = await database.collection('agent_logs').find({}).sort({ _id: -1 }).toArray();
    return logs.map(({ _id, ...rest }) => rest);
  },

  async appendAgentLog(log) {
    const database = await getDb();
    const col = database.collection('agent_logs');
    const { _id, ...clean } = log;
    await col.insertOne(clean);
    // Keep only the 50 most recent logs
    const count = await col.countDocuments();
    if (count > 50) {
      const oldest = await col.find({}).sort({ _id: 1 }).limit(count - 50).project({ _id: 1 }).toArray();
      await col.deleteMany({ _id: { $in: oldest.map(d => d._id) } });
    }
  },

  // Settings
  async getSettings() {
    const database = await getDb();
    const settings = await database.collection('settings').findOne({});
    if (!settings) {
      return { geminiApiKey: '', aiProvider: 'groq', openRouterApiKey: '', groqApiKey: '' };
    }
    const { _id, ...rest } = settings;
    return rest;
  },

  async saveSettings(settings) {
    const database = await getDb();
    const col = database.collection('settings');
    const { _id, ...clean } = settings;
    await col.replaceOne({}, clean, { upsert: true });
    return settings;
  }
};
