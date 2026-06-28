import { db } from './db.js';

// ============================================================
// 📋 MASTER SITES LIST — 40 curated jam, preserving & culinary sites
// ============================================================
const MASTER_SITES = [
  // 🇮🇱 Israeli Sites (Hebrew recipes)
  { name: "פודי (Foody)", url: "https://foody.co.il", category: "ישראלי", feedUrl: "https://foody.co.il/feed/" },
  { name: "השולחן", url: "https://www.hashulchan.co.il", category: "ישראלי", feedUrl: "https://www.hashulchan.co.il/feed/" },
  { name: "mako אוכל טוב", url: "https://www.mako.co.il/food", category: "ישראלי", feedUrl: null },
  { name: "Ynet אוכל", url: "https://www.ynet.co.il/food", category: "ישראלי", feedUrl: null },
  { name: "וואלה! אוכל", url: "https://food.walla.co.il", category: "ישראלי", feedUrl: null },
  { name: "The Kitchen Coach (עז תלם)", url: "https://www.thekitchencoach.co.il", category: "ישראלי", feedUrl: "https://www.thekitchencoach.co.il/feed/" },
  { name: "עוגיו.נט (נטלי לוין)", url: "https://www.oogio.net", category: "ישראלי", feedUrl: "https://www.oogio.net/feed/" },
  { name: "קרוטית (אפרת ליכטנשטט)", url: "https://www.krutit.co.il", category: "ישראלי", feedUrl: "https://www.krutit.co.il/feed/" },
  { name: "בצק אלים", url: "https://www.bazekalim.com", category: "ישראלי", feedUrl: "https://www.bazekalim.com/feed/" },
  { name: "מתכונים ב-10 דקות", url: "https://www.10dakot.co.il", category: "ישראלי", feedUrl: "https://www.10dakot.co.il/feed/" },
  // 🌍 International leading magazines (English)
  { name: "Serious Eats", url: "https://www.seriouseats.com", category: "בינלאומי", feedUrl: "https://www.seriouseats.com/feed" },
  { name: "Food52", url: "https://food52.com", category: "בינלאומי", feedUrl: "https://food52.com/blog.rss" },
  { name: "Epicurious", url: "https://www.epicurious.com", category: "בינלאומי", feedUrl: "https://www.epicurious.com/feed/recipes/rss" },
  { name: "The Spruce Eats", url: "https://www.thespruceeats.com", category: "בינלאומי", feedUrl: "https://www.thespruceeats.com/rss" },
  { name: "BBC Good Food", url: "https://www.bbcgoodfood.com", category: "בינלאומי", feedUrl: "https://www.bbcgoodfood.com/feed" },
  { name: "NYT Cooking", url: "https://cooking.nytimes.com", category: "בינלאומי", feedUrl: null },
  { name: "Allrecipes", url: "https://www.allrecipes.com", category: "בינלאומי", feedUrl: "https://www.allrecipes.com/feed/" },
  { name: "King Arthur Baking", url: "https://www.kingarthurbaking.com", category: "בינלאומי", feedUrl: "https://www.kingarthurbaking.com/blog/feed" },
  { name: "Bon Appétit", url: "https://www.bonappetit.com", category: "בינלאומי", feedUrl: "https://www.bonappetit.com/feed/rss" },
  // 🔬 Science, safety, technique & preserving manufacturers
  { name: "Ball Mason Jars (Fresh Preserving)", url: "https://www.ballmasonjars.com", category: "מדע ושימור", feedUrl: null },
  { name: "NCHFP", url: "https://nchfp.uga.edu", category: "מדע ושימור", feedUrl: null },
  { name: "Healthy Canning", url: "https://www.healthycanning.com", category: "מדע ושימור", feedUrl: "https://www.healthycanning.com/feed/" },
  { name: "Bernardin", url: "https://www.bernardin.ca", category: "מדע ושימור", feedUrl: null },
  { name: "Simply Canning", url: "https://www.simplycanning.com", category: "מדע ושימור", feedUrl: "https://www.simplycanning.com/feed/" },
  { name: "Le Parfait", url: "https://www.leparfait.com", category: "מדע ושימור", feedUrl: null },
  // 👨‍🍳 Chefs, artisans & creative culinary
  { name: "Food in Jars", url: "https://foodinjars.com", category: "שפים וארטיזנים", feedUrl: "https://foodinjars.com/feed/" },
  { name: "David Lebovitz", url: "https://www.davidlebovitz.com", category: "שפים וארטיזנים", feedUrl: "https://www.davidlebovitz.com/feed/" },
  { name: "The Artisan Kitchen", url: "https://theartisankitchen.co.uk/news/", category: "שפים וארטיזנים", feedUrl: null },
  { name: "Tangerine Zest", url: "https://tangerinezest.com", category: "שפים וארטיזנים", feedUrl: "https://tangerinezest.com/feed/" },
  { name: "Hilda's Kitchen Blog", url: "https://hildaskitchenblog.com", category: "שפים וארטיזנים", feedUrl: "https://hildaskitchenblog.com/feed/" },
  { name: "Fab Food 4 All", url: "https://www.fabfood4all.co.uk", category: "שפים וארטיזנים", feedUrl: "https://www.fabfood4all.co.uk/feed/" },
  // 🌿 Foraging, fermentation, homesteading & aggregators
  { name: "Practical Self Reliance", url: "https://practicalselfreliance.com", category: "ליקוט והתססה", feedUrl: "https://practicalselfreliance.com/feed/" },
  { name: "Grow Forage Cook Ferment", url: "https://www.growforagecookferment.com", category: "ליקוט והתססה", feedUrl: "https://www.growforagecookferment.com/feed/" },
  { name: "The Domestic Wildflower", url: "https://thedomesticwildflower.com", category: "ליקוט והתססה", feedUrl: "https://thedomesticwildflower.com/feed/" },
  { name: "Punk Domestics", url: "https://www.punkdomestics.com", category: "ליקוט והתססה", feedUrl: "https://www.punkdomestics.com/feed" },
  { name: "Which Wendy's Wares", url: "https://www.whichwendyswares.com.au", category: "ליקוט והתססה", feedUrl: null },
  { name: "Attainable Sustainable", url: "https://www.attainable-sustainable.net", category: "ליקוט והתססה", feedUrl: "https://www.attainable-sustainable.net/feed/" },
  { name: "Homestead and Chill", url: "https://homesteadandchill.com", category: "ליקוט והתססה", feedUrl: "https://homesteadandchill.com/feed/" },
  { name: "Rural Sprout", url: "https://www.ruralsprout.com", category: "ליקוט והתססה", feedUrl: "https://www.ruralsprout.com/feed/" },
  { name: "The Prairie Homestead", url: "https://www.theprairiehomestead.com", category: "ליקוט והתססה", feedUrl: "https://www.theprairiehomestead.com/feed/" }
];

// ============================================================
// 🌐 RSS FEED CRAWLER — Fetches live headlines from master sites
// ============================================================
async function fetchSingleFeed(site) {
  if (!site.feedUrl) {
    return { site: site.name, url: site.url, category: site.category, titles: [], status: 'no-feed' };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    const response = await fetch(site.feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'RibaManager-JamBot/1.0 (Artisanal Jam Trend Scanner)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
      }
    });
    clearTimeout(timeout);
    
    if (!response.ok) {
      return { site: site.name, url: site.url, category: site.category, titles: [], status: `http-${response.status}` };
    }
    
    const xmlText = await response.text();
    // Simple XML title extraction (works for RSS and Atom feeds)
    const titles = [];
    const itemMatches = xmlText.match(/<item[\s>][\s\S]*?<\/item>/gi) || xmlText.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
    for (const item of itemMatches.slice(0, 5)) { // max 5 titles per site
      const titleMatch = item.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        const cleanTitle = titleMatch[1].replace(/<[^>]+>/g, '').trim();
        if (cleanTitle) titles.push(cleanTitle);
      }
    }
    
    return { site: site.name, url: site.url, category: site.category, titles, status: 'ok' };
  } catch (error) {
    return { site: site.name, url: site.url, category: site.category, titles: [], status: error.name === 'AbortError' ? 'timeout' : 'error' };
  }
}

async function crawlMasterFeeds() {
  console.log(`[RibaManager Crawler] Starting scan of ${MASTER_SITES.length} master sites...`);
  
  // Run all feed fetches in parallel with concurrency batching
  const batchSize = 10;
  const allResults = [];
  
  for (let i = 0; i < MASTER_SITES.length; i += batchSize) {
    const batch = MASTER_SITES.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(site => fetchSingleFeed(site)));
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        allResults.push(result.value);
      }
    }
    console.log(`[RibaManager Crawler] Batch ${Math.floor(i / batchSize) + 1} done (${Math.min(i + batchSize, MASTER_SITES.length)}/${MASTER_SITES.length} sites)`);
  }
  
  const successfulFeeds = allResults.filter(r => r.status === 'ok' && r.titles.length > 0);
  const totalTitles = successfulFeeds.reduce((sum, f) => sum + f.titles.length, 0);
  
  console.log(`[RibaManager Crawler] Scan complete: ${successfulFeeds.length} feeds returned ${totalTitles} fresh titles`);
  
  return { allResults, successfulFeeds, totalTitles };
}

// Build a context string from crawl results to inject into the AI prompt
function buildCrawlContext(crawlData) {
  if (!crawlData.successfulFeeds || crawlData.successfulFeeds.length === 0) {
    return "לא התקבלו פידים חיים מהאתרים. השתמש בידע המובנה שלך על 40 האתרים ברשימת המאסטר.";
  }
  
  let context = `נסרקו ${crawlData.successfulFeeds.length} אתרים בהצלחה ונמצאו ${crawlData.totalTitles} כותרות טריות:\n\n`;
  
  for (const feed of crawlData.successfulFeeds) {
    context += `📌 ${feed.site} (${feed.category}) — ${feed.url}\n`;
    for (const title of feed.titles) {
      context += `   • ${title}\n`;
    }
    context += '\n';
  }
  
  return context;
}

// ============================================================
// 🧠 SYSTEM PROMPT — Rich instructions for the Groq-powered agent
// ============================================================
const GROQ_SYSTEM_PROMPT = `
You are the RibaManager AI Trend Agent — a world-class gourmet jam maker, food preservation scientist, and global culinary trend analyst.

YOUR MISSION:
You have been asked to analyze the latest trends in artisanal jams, fruit preserves, marmalades, compotes, and gourmet spreads from 40 curated master websites spanning Israel and the international culinary world.

THE 40 MASTER SITES YOU DRAW KNOWLEDGE FROM:
🇮🇱 Israeli: Foody, השולחן, mako אוכל טוב, Ynet אוכל, וואלה! אוכל, The Kitchen Coach (עז תלם), עוגיו.נט, קרוטית, בצק אלים, מתכונים ב-10 דקות
🌍 International: Serious Eats, Food52, Epicurious, The Spruce Eats, BBC Good Food, NYT Cooking, Allrecipes, King Arthur Baking, Bon Appétit
🔬 Science & Preservation: Ball Mason Jars, NCHFP, Healthy Canning, Bernardin, Simply Canning, Le Parfait
👨‍🍳 Chefs & Artisans: Food in Jars, David Lebovitz, The Artisan Kitchen, Tangerine Zest, Hilda's Kitchen Blog, Fab Food 4 All
🌿 Foraging & Homesteading: Practical Self Reliance, Grow Forage Cook Ferment, The Domestic Wildflower, Punk Domestics, Which Wendy's Wares, Attainable Sustainable, Homestead and Chill, Rural Sprout, The Prairie Homestead

RULES:
1. ALL text in your response (names, descriptions, ingredients, instructions, summary, twist) MUST be in Hebrew — warm, professional, culinary-rich tone.
2. Analyze trends across categories: Israeli, international, science-based, artisan, and foraging/homesteading.
3. Generate 2-3 innovative, unique jam recipes — each with a creative gourmet twist (e.g., herbs, exotic spices, vinegar reductions, tea infusions, spirits, floral notes).
4. For each recipe, specify which master site(s) inspired it (e.g., "בהשראת טכניקת השימור של Food in Jars" or "בהשראת שילוב הטעמים של עוגיו.נט").
5. When live feed data is provided, analyze it and weave it into your trend summary.
6. You MUST return ONLY a valid JSON object — no markdown code fences, no prefix/suffix text.
7. Ingredients should be specified for 1 kg of base fruit.
`;

const JSON_SCHEMA_TEXT = `
{
  "summary": "סיכום מגמות בעברית (3-5 משפטים) המסכם את הטרנדים שנמצאו ב-40 אתרי המאסטר, כולל ציון של אתרים ספציפיים שהשפיעו",
  "scannedSites": 40,
  "liveFeedsFound": <number of feeds that returned titles>,
  "suggestions": [
    {
      "name": "שם הריבה בעברית (למשל: ריבת אפרסק, הל וזעפרן)",
      "description": "תיאור קולינרי קצר ומפתה של הריבה בעברית",
      "baseFruit": "פרי הבסיס של הריבה",
      "sweetness": "רמת המתיקות: מתוק מאוד, מתיקות בינונית, או מתיקות מעודנת",
      "twist": "הטוויסט המיוחד והייחודי של המתכון בעברית",
      "inspiration": "שם האתר/האתרים שהיוו השראה מתוך רשימת 40 אתרי המאסטר",
      "ingredients": ["רשימת מצרכים מפורטת כולל כמויות בעברית ל-1 ק\\"ג פרי"],
      "instructions": ["הוראות הכנה שלב אחר שלב בעברית"],
      "cookTime": "זמן בישול משוער"
    }
  ]
}
`;

// ============================================================
// 🚀 GROQ API CALLS
// ============================================================
async function callGroqScan(apiKey, crawlContext) {
  console.log("[RibaManager Agent] Sending data to Groq (Llama 3.3 70B)...");
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const userPrompt = `
הנה הנתונים החיים שנסרקו כרגע מאתרי המאסטר:

${crawlContext}

---

בהתבסס על הנתונים החיים הללו וידע מובנה שלך על כל 40 אתרי המאסטר, נא לבצע:
1. סכם את המגמות העדכניות ביותר בעולם הריבות, השימור והקונפיטורה (2025/2026).
2. צור 2-3 מתכונים ייחודיים לריבות גורמה עם טוויסט קולינרי יצירתי.
3. ציין לכל מתכון מאיזה אתר(ים) מרשימת המאסטר הוא שואב השראה.

You MUST output ONLY a valid JSON object (no markdown, no code fences) matching this schema:
${JSON_SCHEMA_TEXT}
  `;

  const requestBody = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: GROQ_SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4096
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const resJson = await response.json();
  const textResponse = resJson.choices?.[0]?.message?.content;
  if (!textResponse) {
    throw new Error("Empty response from Groq API");
  }

  return robustJsonParse(textResponse);
}

async function callGroqCustomRecipe(apiKey, baseFruit, sweetness, twistType, notes) {
  console.log("[RibaManager Agent] Generating custom recipe via Groq...");
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const schemaText = `
  {
    "name": "שם הריבה בעברית",
    "description": "תיאור קצר ומפתה של הריבה בעברית",
    "baseFruit": "פרי הבסיס",
    "sweetness": "רמת המתיקות (מתוק מאוד, מתיקות בינונית, או מתיקות מעודנת)",
    "twist": "הטוויסט המיוחד והייחודי של המתכון בעברית",
    "inspiration": "שם האתר/ים מרשימת 40 אתרי המאסטר שהשפיע על המתכון",
    "ingredients": ["רשימת מצרכים מפורטת כולל כמויות בעברית"],
    "instructions": ["הוראות הכנה שלב אחר שלב בעברית"],
    "cookTime": "זמן בישול משוער"
  }
  `;

  const prompt = `
    Create a unique, high-quality, artisanal gourmet jam recipe in Hebrew based on these parameters:
    - Base fruit: ${baseFruit}
    - Sweetness level: ${sweetness}
    - Twist category type: ${twistType} (Choose a creative twist of this style, e.g., alcoholic, spicy, floral, herbal, acidic)
    - User notes/special requests: ${notes || "None"}

    The ingredients must be tailored for 1 kg of ${baseFruit}. 
    The sugar amount must match the sweetness level:
    - 'מתוק מאוד' (Very sweet): ~800g sugar
    - 'מתיקות בינונית' (Medium sweetness): ~600g sugar
    - 'מתיקות מעודנת' (Subtle sweetness): ~400g-500g sugar

    You should draw inspiration from one or more of these master sites: Food in Jars, David Lebovitz, Serious Eats, BBC Good Food, Healthy Canning, Practical Self Reliance, עוגיו.נט, פודי, קרוטית.
    Mention the inspiring site(s) in the "inspiration" field.
    
    Ensure the twist is prominent and adds a gourmet character.
    You MUST output ONLY a valid JSON object matching the following schema, and nothing else:
    ${schemaText}
  `;

  const requestBody = {
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a Michelin-star pastry chef, jam expert, and food preservation scientist. You write detailed, beautiful gourmet recipes in Hebrew. You draw your expertise from 40 master culinary websites worldwide."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.8,
    max_tokens: 2048
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const resJson = await response.json();
  const textResponse = resJson.choices?.[0]?.message?.content;
  if (!textResponse) {
    throw new Error("Empty response from Groq API");
  }

  return robustJsonParse(textResponse);
}

// ============================================================
// 🛡️ Robust JSON parser (handles markdown fences, etc.)
// ============================================================
function robustJsonParse(text) {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?\s*```\s*$/i, '');
  cleaned = cleaned.trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to extract JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0].trim());
      } catch (err) {
        throw new Error("Could not parse JSON block from AI response: " + e.message);
      }
    } else {
      throw new Error("No valid JSON structure found in AI response: " + e.message);
    }
  }
}

// ============================================================
// 🔄 OpenRouter fallback (kept for backwards compatibility)
// ============================================================
async function callOpenRouterScan(apiKey) {
  console.log("Starting live agent trend scan using OpenRouter API...");
  const url = "https://openrouter.ai/api/v1/chat/completions";
  
  const schemaText = `
  {
    "summary": "סיכום קצר בעברית (2-3 משפטים) של המגמות והטרנדים בעולם הריבות שמצאת",
    "suggestions": [
      {
        "name": "שם הריבה בעברית",
        "description": "תיאור קולינרי קצר ומפתה",
        "baseFruit": "פרי הבסיס",
        "sweetness": "רמת המתיקות",
        "twist": "הטוויסט המיוחד בעברית",
        "ingredients": ["מצרכים בעברית ל-1 ק\\"ג פרי"],
        "instructions": ["הוראות הכנה בעברית"],
        "cookTime": "זמן בישול"
      }
    ]
  }
  `;

  const prompt = `
    Scan your knowledge and retrieve the latest (2025/2026) artisanal jam and fruit preserves trends.
    Identify what ingredients, flavor pairings, and concepts are popular in gourmet stores and boutique markets.
    Then, generate 2-3 creative recipes in Hebrew with a unique twist.
    You MUST output ONLY a valid JSON object matching this schema, and nothing else:
    ${schemaText}
  `;

  const requestBody = {
    model: "meta-llama/llama-3-8b-instruct:free",
    messages: [
      { role: "system", content: GROQ_SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'RibaManager'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const resJson = await response.json();
  const textResponse = resJson.choices?.[0]?.message?.content;
  if (!textResponse) throw new Error("Empty response from OpenRouter API");

  const parsedResult = robustJsonParse(textResponse);
  
  const agentLog = {
    id: 'l_' + Date.now(),
    timestamp: new Date().toISOString(),
    query: "סריקה חיה של טרנדים (OpenRouter AI)",
    summary: parsedResult.summary,
    suggestions: parsedResult.suggestions,
    sources: [
      { title: "סוכן בינה מלאכותית (OpenRouter)", url: "https://openrouter.ai" }
    ],
    offline: false
  };

  const currentLogs = await db.getAgentLogs();
  currentLogs.unshift(agentLog);
  await db.saveAgentLogs(currentLogs.slice(0, 50));

  return agentLog;
}

async function callOpenRouterCustomRecipe(apiKey, baseFruit, sweetness, twistType, notes) {
  console.log("Generating custom recipe using OpenRouter API...");
  const url = "https://openrouter.ai/api/v1/chat/completions";
  
  const schemaText = `
  {
    "name": "שם הריבה בעברית",
    "description": "תיאור קצר",
    "baseFruit": "פרי הבסיס",
    "sweetness": "רמת המתיקות",
    "twist": "הטוויסט המיוחד",
    "ingredients": ["מצרכים"],
    "instructions": ["הוראות"],
    "cookTime": "זמן בישול"
  }
  `;

  const prompt = `
    Create a unique artisanal gourmet jam recipe in Hebrew:
    - Base fruit: ${baseFruit}, Sweetness: ${sweetness}, Twist: ${twistType}
    - Notes: ${notes || "None"}
    Ingredients for 1 kg of ${baseFruit}. Output ONLY valid JSON:
    ${schemaText}
  `;

  const requestBody = {
    model: "meta-llama/llama-3-8b-instruct:free",
    messages: [
      { role: "system", content: "You are a Michelin-star pastry chef and jam expert. Write detailed gourmet recipes in Hebrew." },
      { role: "user", content: prompt }
    ],
    temperature: 0.8
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'RibaManager'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const resJson = await response.json();
  const textResponse = resJson.choices?.[0]?.message?.content;
  if (!textResponse) throw new Error("Empty response from OpenRouter API");

  return robustJsonParse(textResponse);
}

// ============================================================
// 🔄 Gemini fallback (kept for backwards compatibility)
// ============================================================
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    summary: { type: "STRING", description: "סיכום קצר בעברית של המגמות." },
    suggestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          description: { type: "STRING" },
          baseFruit: { type: "STRING" },
          sweetness: { type: "STRING" },
          twist: { type: "STRING" },
          ingredients: { type: "ARRAY", items: { type: "STRING" } },
          instructions: { type: "ARRAY", items: { type: "STRING" } },
          cookTime: { type: "STRING" }
        },
        required: ["name", "description", "baseFruit", "sweetness", "twist", "ingredients", "instructions", "cookTime"]
      }
    }
  },
  required: ["summary", "suggestions"]
};

const RECIPE_SCHEMA = {
  type: "OBJECT",
  properties: {
    name: { type: "STRING" }, description: { type: "STRING" }, baseFruit: { type: "STRING" },
    sweetness: { type: "STRING" }, twist: { type: "STRING" },
    ingredients: { type: "ARRAY", items: { type: "STRING" } },
    instructions: { type: "ARRAY", items: { type: "STRING" } },
    cookTime: { type: "STRING" }
  },
  required: ["name", "description", "baseFruit", "sweetness", "twist", "ingredients", "instructions", "cookTime"]
};

async function callGeminiScanDirect(apiKey, enableSearch) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
  const prompt = `Scan the web for the latest (2025/2026) artisanal jam trends. Generate 2-3 creative recipes in Hebrew with a unique twist.`;
  const requestBody = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: GROQ_SYSTEM_PROMPT }] },
    generationConfig: { responseMimeType: "application/json", responseSchema: RESPONSE_SCHEMA, temperature: 0.7 }
  };
  if (enableSearch) requestBody.tools = [{ googleSearch: {} }];

  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
  if (!response.ok) { const e = await response.text(); throw new Error(`Gemini API error: ${response.status} - ${e}`); }

  const resJson = await response.json();
  const candidate = resJson.candidates?.[0];
  const textResponse = candidate?.content?.parts?.[0]?.text;
  if (!textResponse) throw new Error("Empty response from Gemini API");

  const parsedResult = robustJsonParse(textResponse);
  const sources = [];
  const gm = candidate?.groundingMetadata;
  if (gm?.groundingChunks) for (const c of gm.groundingChunks) if (c.web) sources.push({ title: c.web.title || "מקור", url: c.web.uri });

  const agentLog = {
    id: 'l_' + Date.now(), timestamp: new Date().toISOString(),
    query: gm?.webSearchQueries?.join(", ") || "סריקה חיה (Gemini)",
    summary: parsedResult.summary, suggestions: parsedResult.suggestions,
    sources, offline: false
  };
  const currentLogs = await db.getAgentLogs();
  currentLogs.unshift(agentLog);
  await db.saveAgentLogs(currentLogs.slice(0, 50));
  return agentLog;
}

async function callGeminiScanWithFallback(apiKey) {
  console.log("Starting live agent trend scan using Gemini API...");
  try { return await callGeminiScanDirect(apiKey, true); } catch (error) {
    console.warn("Gemini Scan with Search Grounding failed, retrying without...", error.message);
    try {
      const result = await callGeminiScanDirect(apiKey, false);
      result.summary = `[ללא חיפוש רשת] ${result.summary}`;
      return result;
    } catch (retryError) {
      throw new Error(`Gemini scan failed: ${retryError.message}`);
    }
  }
}

// ============================================================
// 📦 OFFLINE FALLBACK DATA
// ============================================================
const OFFLINE_TRENDS = {
  summary: "המערכת פועלת במצב אופליין. הטרנדים המוצגים מבוססים על ניתוח היסטורי של 40 אתרי המאסטר, המצביעים על ביקוש לשילובים פרחוניים, עשבוניים, ושימור בסגנון ארטיזנלי.",
  suggestions: [
    {
      name: "ריבת אפרסק, פלפל ורוד ולבנדר",
      description: "ריבת אפרסק מתוקה המאוזנת על ידי חריפות עדינה של גרגרי פלפל ורוד שלמים וניחוח מרגיע של פרחי לבנדר מיובשים.",
      baseFruit: "אפרסק", sweetness: "מתיקות בינונית",
      twist: "פרחי לבנדר ופלפל ורוד",
      inspiration: "Food in Jars, David Lebovitz",
      ingredients: ["1 ק\"ג אפרסקים בשלים", "650 גרם סוכר", "1 כפית פרחי לבנדר מיובשים", "1 כפית גרגרי פלפל ורוד", "מיץ מחצי לימון"],
      instructions: ["מערבבים את האפרסקים, הסוכר ומיץ הלימון בסיר.", "מביאים לרתיחה ומבשלים 30 דקות.", "מוסיפים לבנדר ופלפל ורוד.", "ממשיכים 10-15 דקות עד לסמיכות.", "מעבירים לצנצנות מעוקרות."],
      cookTime: "45 דקות"
    },
    {
      name: "ריבת שזיף שחור, שוקולד מריר וצ'ילי",
      description: "שילוב דרמטי של שזיפים סגולים, שוקולד מריר ונגיעת צ'ילי.",
      baseFruit: "שזיף", sweetness: "מתיקות מעודנת",
      twist: "שוקולד מריר 70% וצ'ילי יבש",
      inspiration: "Serious Eats, עוגיו.נט",
      ingredients: ["1 ק\"ג שזיפים שחורים", "500 גרם סוכר", "50 גרם שוקולד מריר 70%", "חצי כפית צ'ילי יבש", "מיץ מחצי לימון"],
      instructions: ["מבשלים שזיפים, סוכר ולימון 35 דקות.", "מוסיפים צ'ילי ל-5 דקות.", "מכבים, מוסיפים שוקולד ומערבבים.", "יוצקים לצנצנות מעוקרות."],
      cookTime: "40 דקות"
    }
  ],
  sources: [
    { title: "Food in Jars", url: "https://foodinjars.com" },
    { title: "Serious Eats", url: "https://www.seriouseats.com" }
  ]
};

// ============================================================
// 🎯 MAIN EXPORTS — runAgentScan & generateCustomRecipe
// ============================================================
export async function runAgentScan() {
  const settings = await db.getSettings();
  const provider = settings.aiProvider || 'groq';
  
  // ===== GROQ PROVIDER (PRIMARY) =====
  if (provider === 'groq') {
    const groqApiKey = process.env.GROQ_API_KEY || settings.groqApiKey;
    if (!groqApiKey) {
      console.log("No Groq API key configured. Returning offline data.");
      return { ...OFFLINE_TRENDS, query: "מצב אופליין (חסר מפתח Groq)", offline: true, scannedSites: 0 };
    }
    
    try {
      // Step 1: Crawl RSS feeds from 40 master sites
      console.log("[RibaManager] Phase 1: Crawling 40 master sites...");
      const crawlData = await crawlMasterFeeds();
      const crawlContext = buildCrawlContext(crawlData);
      
      // Step 2: Send crawled data to Groq for analysis
      console.log("[RibaManager] Phase 2: Analyzing with Groq AI...");
      const parsedResult = await callGroqScan(groqApiKey, crawlContext);
      
      // Build sources list from successful feeds
      const sources = crawlData.successfulFeeds.slice(0, 8).map(f => ({
        title: f.site,
        url: f.url
      }));
      
      const agentLog = {
        id: 'l_' + Date.now(),
        timestamp: new Date().toISOString(),
        query: `סריקת מאסטר חיה — ${crawlData.successfulFeeds.length} אתרים, ${crawlData.totalTitles} כותרות (Groq Llama 3.3 70B)`,
        summary: parsedResult.summary,
        suggestions: parsedResult.suggestions,
        sources: sources,
        scannedSites: MASTER_SITES.length,
        liveFeedsFound: crawlData.successfulFeeds.length,
        totalTitles: crawlData.totalTitles,
        offline: false
      };
      
      const currentLogs = await db.getAgentLogs();
      currentLogs.unshift(agentLog);
      await db.saveAgentLogs(currentLogs.slice(0, 50));
      
      return agentLog;
    } catch (error) {
      console.error("Groq scan failed:", error);
      return {
        ...OFFLINE_TRENDS,
        id: 'l_err_' + Date.now(),
        timestamp: new Date().toISOString(),
        query: "סריקה נכשלה (מצב אופליין)",
        summary: `חלה שגיאה בחיבור לסוכן Groq AI (${error.message}). מוצגת סריקה היסטורית.`,
        offline: true,
        error: error.message,
        scannedSites: 0
      };
    }
  }
  
  // ===== OPENROUTER PROVIDER =====
  if (provider === 'openrouter') {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY || settings.openRouterApiKey;
    if (!openRouterApiKey) {
      return { ...OFFLINE_TRENDS, query: "מצב אופליין (חסר מפתח OpenRouter)", offline: true };
    }
    try {
      return await callOpenRouterScan(openRouterApiKey);
    } catch (error) {
      console.error("OpenRouter scan failed:", error);
      return { ...OFFLINE_TRENDS, query: "סריקה נכשלה", summary: `שגיאת OpenRouter: ${error.message}`, offline: true, error: error.message };
    }
  }

  // ===== GEMINI PROVIDER =====
  const apiKey = process.env.GEMINI_API_KEY || settings.geminiApiKey;
  if (!apiKey) {
    return { ...OFFLINE_TRENDS, offline: true };
  }
  try {
    return await callGeminiScanWithFallback(apiKey);
  } catch (error) {
    console.error("Gemini scan failed:", error);
    return {
      id: 'l_err_' + Date.now(), timestamp: new Date().toISOString(),
      query: "ניסיון סריקה נכשל",
      summary: `שגיאת Gemini: ${error.message}. מוצגת סריקה היסטורית.`,
      suggestions: OFFLINE_TRENDS.suggestions, sources: OFFLINE_TRENDS.sources,
      offline: true, error: error.message
    };
  }
}

export async function generateCustomRecipe(baseFruit, sweetness, twistType, notes) {
  const settings = await db.getSettings();
  const provider = settings.aiProvider || 'groq';

  // ===== GROQ PROVIDER (PRIMARY) =====
  if (provider === 'groq') {
    const groqApiKey = process.env.GROQ_API_KEY || settings.groqApiKey;
    if (!groqApiKey) {
      return generateOfflineRecipe(baseFruit, sweetness, twistType, notes);
    }
    try {
      return await callGroqCustomRecipe(groqApiKey, baseFruit, sweetness, twistType, notes);
    } catch (error) {
      console.error("Groq custom recipe failed:", error);
      return generateOfflineRecipe(baseFruit, sweetness, twistType, notes);
    }
  }

  // ===== OPENROUTER PROVIDER =====
  if (provider === 'openrouter') {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY || settings.openRouterApiKey;
    if (!openRouterApiKey) return generateOfflineRecipe(baseFruit, sweetness, twistType, notes);
    try {
      return await callOpenRouterCustomRecipe(openRouterApiKey, baseFruit, sweetness, twistType, notes);
    } catch (error) {
      console.error("OpenRouter custom recipe failed:", error);
      return generateOfflineRecipe(baseFruit, sweetness, twistType, notes);
    }
  }

  // ===== GEMINI PROVIDER =====
  const apiKey = process.env.GEMINI_API_KEY || settings.geminiApiKey;
  if (!apiKey) return generateOfflineRecipe(baseFruit, sweetness, twistType, notes);
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const prompt = `Create a unique artisanal gourmet jam recipe in Hebrew:
    - Base fruit: ${baseFruit}, Sweetness: ${sweetness}, Twist type: ${twistType}
    - Notes: ${notes || "None"}
    Ingredients for 1 kg of ${baseFruit}. Return JSON matching the schema.`;

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: "You are a Michelin-star pastry chef and jam expert. Write detailed gourmet recipes in Hebrew." }] },
      generationConfig: { responseMimeType: "application/json", responseSchema: RECIPE_SCHEMA, temperature: 0.8 }
    };

    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
    if (!response.ok) { const e = await response.text(); throw new Error(`Gemini error: ${response.status} - ${e}`); }
    const resJson = await response.json();
    const textResponse = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("Empty Gemini response");
    return robustJsonParse(textResponse);
  } catch (error) {
    console.error("Gemini custom recipe failed:", error);
    return generateOfflineRecipe(baseFruit, sweetness, twistType, notes);
  }
}

// ============================================================
// 📴 OFFLINE RECIPE GENERATOR
// ============================================================
function generateOfflineRecipe(baseFruit, sweetness, twistType, notes) {
  let sugarAmt = "600 גרם סוכר לבן";
  if (sweetness === "מתוק מאוד") sugarAmt = "800 גרם סוכר לבן";
  if (sweetness === "מתיקות מעודנת") sugarAmt = "450 גרם סוכר לבן או סוכר חום";

  const twists = {
    alcoholic: { name: "יין אדום קברנה ותבלינים", extra: ["150 מ\"ל יין אדום יבש", "2 כוכבי אניס", "1 מקל קינמון"] },
    spicy: { name: "ג'ינג'ר טרי ונגיעת צ'ילי", extra: ["1.5 כפות ג'ינג'ר טרי מגורר", "רבע כפית צ'ילי יבש"] },
    herbal: { name: "רוזמרין ותפוז", extra: ["1 גבעול רוזמרין טרי", "גרידה מתפוז שלם"] },
    floral: { name: "מי ורדים ועלי ורדים", extra: ["1 כפית מי ורדים", "1 כף עלי ורדים מיובשים"] },
    acidic: { name: "בלסמי מצומצם ופלפל שחור", extra: ["3 כפות חומץ בלסמי מיושן", "חצי כפית פלפל שחור גרוס"] }
  };

  const tw = twists[twistType] || twists.acidic;
  const customNotesText = notes ? ` (הערה: ${notes})` : "";

  return {
    name: `מרקחת ${baseFruit} מיוחדת עם ${tw.name} (אופליין)`,
    description: `מתכון פרימיום בעבודת יד לריבת ${baseFruit} עשירה בשילוב ${tw.name}.${customNotesText}`,
    baseFruit, sweetness, twist: tw.name,
    inspiration: "Food in Jars, Serious Eats (אופליין)",
    ingredients: [`1 ק"ג ${baseFruit} טרי וחתוך`, sugarAmt, ...tw.extra, "מיץ מחצי לימון"],
    instructions: [
      `מערבבים את ה-${baseFruit}, הסוכר ומיץ הלימון בסיר כבד.`,
      "מביאים לרתיחה על אש בינונית תוך ערבוב.",
      "מנמיכים ומבשלים כ-35-40 דקות עד לסמיכות.",
      `מוסיפים את ה${tw.name} ומבשלים עוד 5-10 דקות.`,
      "מעבירים לצנצנות מעוקרות חמות."
    ],
    cookTime: "45 דקות"
  };
}

// Export the master sites list for use by the UI endpoint
export { MASTER_SITES };
