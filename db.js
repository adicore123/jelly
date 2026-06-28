import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Helper to ensure database is loaded and valid
async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If error, return a default structure
    const defaultDb = { customers: [], recipes: [], agent_logs: [], settings: { geminiApiKey: "", aiProvider: "gemini", openRouterApiKey: "" } };
    await writeDb(defaultDb);
    return defaultDb;
  }
}

async function writeDb(data) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export const db = {
  // Customers CRUD
  async getCustomers() {
    const data = await readDb();
    return data.customers || [];
  },

  async saveCustomers(customers) {
    const data = await readDb();
    data.customers = customers;
    await writeDb(data);
    return customers;
  },

  // Recipes CRUD
  async getRecipes() {
    const data = await readDb();
    return data.recipes || [];
  },

  async saveRecipes(recipes) {
    const data = await readDb();
    data.recipes = recipes;
    await writeDb(data);
    return recipes;
  },

  // Agent Logs
  async getAgentLogs() {
    const data = await readDb();
    return data.agent_logs || [];
  },

  async saveAgentLogs(logs) {
    const data = await readDb();
    data.agent_logs = logs;
    await writeDb(data);
    return logs;
  },

  // Settings
  async getSettings() {
    const data = await readDb();
    return data.settings || { geminiApiKey: "", aiProvider: "gemini", openRouterApiKey: "" };
  },

  async saveSettings(settings) {
    const data = await readDb();
    data.settings = settings;
    await writeDb(data);
    return settings;
  }
};
