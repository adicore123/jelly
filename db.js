import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client = null;
let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables!");
  }
  
  if (!client) {
    client = new MongoClient(uri);
  }
  
  await client.connect();
  dbInstance = client.db('ribamanager');
  return dbInstance;
}

export const db = {
  // Customers CRUD
  async getCustomers() {
    const database = await getDb();
    const customers = await database.collection('customers').find({}).toArray();
    return customers.map(({ _id, ...rest }) => rest);
  },

  async saveCustomers(customers) {
    const database = await getDb();
    const col = database.collection('customers');
    await col.deleteMany({});
    if (customers.length > 0) {
      const cleanCustomers = customers.map(({ _id, ...rest }) => rest);
      await col.insertMany(cleanCustomers);
    }
    return customers;
  },

  // Recipes CRUD
  async getRecipes() {
    const database = await getDb();
    const recipes = await database.collection('recipes').find({}).toArray();
    return recipes.map(({ _id, ...rest }) => rest);
  },

  async saveRecipes(recipes) {
    const database = await getDb();
    const col = database.collection('recipes');
    await col.deleteMany({});
    if (recipes.length > 0) {
      const cleanRecipes = recipes.map(({ _id, ...rest }) => rest);
      await col.insertMany(cleanRecipes);
    }
    return recipes;
  },

  // Agent Logs
  async getAgentLogs() {
    const database = await getDb();
    const logs = await database.collection('agent_logs').find({}).toArray();
    return logs.map(({ _id, ...rest }) => rest);
  },

  async saveAgentLogs(logs) {
    const database = await getDb();
    const col = database.collection('agent_logs');
    await col.deleteMany({});
    if (logs.length > 0) {
      const cleanLogs = logs.map(({ _id, ...rest }) => rest);
      await col.insertMany(cleanLogs);
    }
    return logs;
  },

  // Settings
  async getSettings() {
    const database = await getDb();
    const settings = await database.collection('settings').findOne({});
    if (!settings) {
      return { geminiApiKey: "", aiProvider: "groq", openRouterApiKey: "", groqApiKey: "" };
    }
    const { _id, ...rest } = settings;
    return rest;
  },

  async saveSettings(settings) {
    const database = await getDb();
    const col = database.collection('settings');
    await col.deleteMany({});
    const { _id, ...rest } = settings;
    await col.insertOne(rest);
    return settings;
  }
};
