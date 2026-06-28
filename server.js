import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { runAgentScan, generateCustomRecipe } from './agent.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Customers Endpoints
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db.getCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customer = req.body;
    if (!customer.name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const customers = await db.getCustomers();
    if (customer.id) {
      // Update
      const index = customers.findIndex(c => c.id === customer.id);
      if (index !== -1) {
        customers[index] = customer;
      } else {
        customers.push(customer);
      }
    } else {
      // Create
      customer.id = 'c_' + Date.now();
      customer.purchaseHistory = customer.purchaseHistory || [];
      customers.push(customer);
    }
    
    await db.saveCustomers(customers);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let customers = await db.getCustomers();
    customers = customers.filter(c => c.id !== id);
    await db.saveCustomers(customers);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recipes Endpoints
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await db.getRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/recipes', async (req, res) => {
  try {
    const recipe = req.body;
    if (!recipe.name) {
      return res.status(400).json({ error: 'Recipe name is required' });
    }

    const recipes = await db.getRecipes();
    if (recipe.id) {
      // Update
      const index = recipes.findIndex(r => r.id === recipe.id);
      if (index !== -1) {
        recipes[index] = recipe;
      } else {
        recipes.push(recipe);
      }
    } else {
      // Create
      recipe.id = 'r_' + Date.now();
      recipes.push(recipe);
    }

    await db.saveRecipes(recipes);
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let recipes = await db.getRecipes();
    recipes = recipes.filter(r => r.id !== id);
    await db.saveRecipes(recipes);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Custom AI Recipe Generator Endpoint
app.post('/api/recipes/generate', async (req, res) => {
  try {
    const { baseFruit, sweetness, twistType, notes } = req.body;
    if (!baseFruit) {
      return res.status(400).json({ error: 'Base fruit is required' });
    }
    const recipe = await generateCustomRecipe(baseFruit, sweetness, twistType, notes);
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agent Endpoints
app.get('/api/agent/logs', async (req, res) => {
  try {
    const logs = await db.getAgentLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agent/scan', async (req, res) => {
  try {
    const result = await runAgentScan();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings Endpoints
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.getSettings();
    const hasEnvGeminiKey = !!process.env.GEMINI_API_KEY;
    const hasDbGeminiKey = !!settings.geminiApiKey;
    const hasEnvOpenRouterKey = !!process.env.OPENROUTER_API_KEY;
    const hasDbOpenRouterKey = !!settings.openRouterApiKey;
    
    const aiProvider = settings.aiProvider || 'gemini';
    const hasKey = aiProvider === 'openrouter' 
      ? (hasEnvOpenRouterKey || hasDbOpenRouterKey)
      : (hasEnvGeminiKey || hasDbGeminiKey);

    res.json({
      hasKey,
      aiProvider,
      hasGeminiKey: hasEnvGeminiKey || hasDbGeminiKey,
      hasOpenRouterKey: hasEnvOpenRouterKey || hasDbOpenRouterKey,
      usingEnvGemini: hasEnvGeminiKey,
      usingEnvOpenRouter: hasEnvOpenRouterKey
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { geminiApiKey, aiProvider, openRouterApiKey } = req.body;
    const settings = await db.getSettings();
    
    if (aiProvider !== undefined) settings.aiProvider = aiProvider;
    if (geminiApiKey !== undefined) settings.geminiApiKey = geminiApiKey;
    if (openRouterApiKey !== undefined) settings.openRouterApiKey = openRouterApiKey;
    
    await db.saveSettings(settings);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fallback for HTML5 Routing (serves index.html for any unhandled routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`RibaManager server is running locally on http://localhost:${PORT}`);
});
