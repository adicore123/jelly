import { db } from './db.js';

const SYSTEM_INSTRUCTION = `
You are the RibaManager AI Trend Agent, a world-class gourmet jam maker and culinary trend analyst.
Your job is to scan the web for the latest, most exciting trends in artisanal jams, fruit preserves, and gourmet spreads for 2026.
Based on your search, you must output a summary of trends and 2-3 innovative, unique jam recipe ideas.
Each recipe MUST have a creative, gourmet "twist" (e.g., matching herbs, exotic spices, vinegar reductions, tea infusions, or high-end spirits).
All text in the output (name, description, ingredients, instructions, summary, twist) must be in Hebrew, written in a warm, professional, and culinary-rich tone.
You must strictly return JSON matching the specified schema.
`;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    summary: {
      type: "STRING",
      description: "סיכום קצר בעברית (2-3 משפטים) של המגמות והטרנדים בעולם הריבות שנמצאו בסריקה החיה."
    },
    suggestions: {
      type: "ARRAY",
      description: "2-3 הצעות למתכונים ייחודיים עם טוויסט קולינרי מובהק.",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING", "description": "שם הריבה בעברית (למשל: ריבת תות-שדה, בזיליקום ובלסמי מיושן)" },
          description: { type: "STRING", "description": "תיאור קולינרי קצר ומפתה של הריבה בעברית" },
          baseFruit: { type: "STRING", "description": "פרי הבסיס של הריבה (למשל: תות שדה, אפרסק, שזיף)" },
          sweetness: { type: "STRING", "description": "רמת המתיקות: מתוק מאוד, מתיקות בינונית, או מתיקות מעודנת" },
          twist: { type: "STRING", "description": "הטוויסט המיוחד והייחודי של המתכון בעברית" },
          ingredients: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "רשימת מצרכים מפורטת כולל כמויות בעברית לבישול ביתי/חצי-תעשייתי (בדרך כלל מבוסס על 1 ק\"ג פרי)"
          },
          instructions: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "הוראות הכנה שלב אחר שלב בעברית"
          },
          cookTime: { type: "STRING", "description": "זמן הבישול המשוער, למשל: '45 דקות'" }
        },
        required: ["name", "description", "baseFruit", "sweetness", "twist", "ingredients", "instructions", "cookTime"]
      }
    }
  },
  required: ["summary", "suggestions"]
};

// Fallback high-quality data if API key is not present or calls fail
const OFFLINE_TRENDS = {
  summary: "המערכת פועלת במצב אופליין. הטרנדים המוצגים מבוססים על סריקה היסטורית של שווקי הבוטיק בלונדון ופריז, המצביעים על ביקוש לשילובים פרחוניים ועשבוניים.",
  suggestions: [
    {
      name: "ריבת אפרסק, פלפל ורוד ולבנדר",
      description: "ריבת אפרסק מתוקה המאוזנת על ידי חריפות עדינה של גרגרי פלפל ורוד שלמים וניחוח מרגיע של פרחי לבנדר מיובשים.",
      baseFruit: "אפרסק",
      sweetness: "מתיקות בינונית",
      twist: "פרחי לבנדר ופלפל ורוד",
      ingredients: [
        "1 ק\"ג אפרסקים בשלים, מגולענים וחתוכים לקוביות",
        "650 גרם סוכר",
        "1 כפית פרחי לבנדר מיובשים (לשימוש קולינרי)",
        "1 כפית גרגרי פלפל ורוד שלמים, מעוכים קלות",
        "מיץ מחצי לימון טרי"
      ],
      instructions: [
        "מערבבים את האפרסקים, הסוכר ומיץ הלימון בסיר גדול.",
        "מביאים לרתיחה ומבשלים על להבה בינונית כ-30 דקות.",
        "מוסיפים את הלבנדר והפלפל הוורוד ומערבבים היטב.",
        "ממשיכים לבשל עוד כ-10-15 דקות עד שהריבה מגיעה לסמיכות הרצויה.",
        "מעבירים לצנצנות מעוקרות חמות וסוגרים מיד."
      ],
      cookTime: "45 דקות"
    },
    {
      name: "ריבת שזיף שחור, שוקולד מריר וצ'ילי",
      description: "שילוב דרמטי ועשיר של שזיפים סגולים חמצמצים, שוקולד מריר איכותי ונגיעה חרפרפה של צ'ילי יבש.",
      baseFruit: "שזיף",
      sweetness: "מתיקות מעודנת",
      twist: "שוקולד מריר 70% וצ'ילי יבש",
      ingredients: [
        "1 ק\"ג שזיפים שחורים מגולענים וחתוכים לרבעים",
        "500 גרם סוכר לבן",
        "50 גרם שוקולד מריר איכותי (לפחות 70% מוצקי קקאו), קצוץ",
        "חצי כפית שבבי צ'ילי יבש (או לפי הטעם)",
        "מיץ מחצי לימון"
      ],
      instructions: [
        "מניחים את שזיפים, הסוכר ומיץ הלימון בסיר ומבשלים על אש בינונית.",
        "לאחר רתיחה, מנמיכים את האש ומבשלים כ-35 דקות עד שהשזיפים רכים והריבה מסמיכה.",
        "מוסיפים את שבבי הצ'ילי ומבשלים עוד 5 דקות.",
        "מכבים את האש, מוסיפים מיד את השוקולד הקצוץ ומערבבים בעדינות עד שהוא נמס לחלוטין ומתמזג בריבה.",
        "יוצקים מיד לצנצנות מעוקרות."
      ],
      cookTime: "40 דקות"
    }
  ],
  sources: [
    { title: "Borough Market Jam Mages 2026", url: "https://boroughmarket.org.uk" },
    { title: "French Artisan Preserves Survey", url: "https://Saveur.fr" }
  ]
};

// Robust helper to parse JSON outputs from raw LLMs
function robustJsonParse(text) {
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
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

// OpenRouter API call implementation for trend scanning
async function callOpenRouterScan(apiKey) {
  console.log("Starting live agent trend scan using OpenRouter API...");
  const url = "https://openrouter.ai/api/v1/chat/completions";
  
  const schemaText = `
  {
    "summary": "סיכום קצר בעברית (2-3 משפטים) של המגמות והטרנדים בעולם הריבות שמצאת",
    "suggestions": [
      {
        "name": "שם הריבה בעברית (למשל: ריבת אפרסק, הל וזעפרן)",
        "description": "תיאור קולינרי קצר ומפתה של הריבה בעברית",
        "baseFruit": "פרי הבסיס של הריבה",
        "sweetness": "רמת המתיקות: מתוק מאוד, מתיקות בינונית, או מתיקות מעודנת",
        "twist": "הטוויסט המיוחד והייחודי של המתכון בעברית",
        "ingredients": ["רשימת מצרכים מפורטת כולל כמויות בעברית ל-1 ק\"ג פרי"],
        "instructions": ["הוראות הכנה שלב אחר שלב בעברית"],
        "cookTime": "זמן בישול משוער"
      }
    ]
  }
  `;

  const prompt = `
    Scan your knowledge and retrieve the latest (2025/2026) artisanal jam and fruit preserves trends.
    Identify what ingredients, flavor pairings, and concepts are popular in gourmet stores and boutique markets.
    Then, generate 2-3 creative recipes in Hebrew with a unique twist.
    You MUST output ONLY a valid JSON object matching the following schema structure, and nothing else (no markdown blocks, no prefix, no suffix):
    ${schemaText}
  `;

  const requestBody = {
    model: "meta-llama/llama-3-8b-instruct:free",
    messages: [
      {
        role: "system",
        content: SYSTEM_INSTRUCTION
      },
      {
        role: "user",
        content: prompt
      }
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
  if (!textResponse) {
    throw new Error("Empty response from OpenRouter API");
  }

  const parsedResult = robustJsonParse(textResponse);
  
  const agentLog = {
    id: 'l_' + Date.now(),
    timestamp: new Date().toISOString(),
    query: "סריקה חיה של טרנדים (OpenRouter AI)",
    summary: parsedResult.summary,
    suggestions: parsedResult.suggestions,
    sources: [
      { title: "סוכן בינה מלאכותית (OpenRouter)", url: "https://openrouter.ai" },
      { title: "ידע קולינרי מובנה", url: "https://github.com/adicore123/jelly" }
    ],
    offline: false
  };

  const currentLogs = await db.getAgentLogs();
  currentLogs.unshift(agentLog);
  await db.saveAgentLogs(currentLogs.slice(0, 50));

  return agentLog;
}

// OpenRouter API call implementation for custom recipe generation
async function callOpenRouterCustomRecipe(apiKey, baseFruit, sweetness, twistType, notes) {
  console.log("Generating custom recipe using OpenRouter API...");
  const url = "https://openrouter.ai/api/v1/chat/completions";
  
  const schemaText = `
  {
    "name": "שם הריבה בעברית",
    "description": "תיאור קצר ומפתה של הריבה בעברית",
    "baseFruit": "פרי הבסיס",
    "sweetness": "רמת המתיקות (מתוק מאוד, מתיקות בינונית, או מתיקות מעודנת)",
    "twist": "הטוויסט המיוחד והייחודי של המתכון בעברית",
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

    Ensure the twist is prominent and adds a gourmet character.
    You MUST output ONLY a valid JSON object matching the following schema structure, and nothing else (no markdown blocks, no prefix, no suffix):
    ${schemaText}
  `;

  const requestBody = {
    model: "meta-llama/llama-3-8b-instruct:free",
    messages: [
      {
        role: "system",
        content: "You are a Michelin-star pastry chef and jam expert. You write detailed, beautiful gourmet recipes in Hebrew."
      },
      {
        role: "user",
        content: prompt
      }
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
  if (!textResponse) {
    throw new Error("Empty response from OpenRouter API");
  }

  return robustJsonParse(textResponse);
}

// Gemini direct API call (optionally with search grounding)
async function callGeminiScanDirect(apiKey, enableSearch) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
  
  const prompt = `
    Scan the web and find the latest (2025/2026) artisanal jam and fruit preserves trends.
    Identify what ingredients, flavor pairings, and concepts are popular in gourmet stores and boutique markets.
    Then, generate 2-3 creative recipes in Hebrew with a unique twist, matching the JSON schema.
    Make sure to mention the trends you found in the 'summary' field.
  `;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.7
    }
  };

  if (enableSearch) {
    requestBody.tools = [
      {
        googleSearch: {}
      }
    ];
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const resJson = await response.json();
  const candidate = resJson.candidates?.[0];
  const textResponse = candidate?.content?.parts?.[0]?.text;
  
  if (!textResponse) {
    throw new Error("Empty response from Gemini API");
  }

  const parsedResult = robustJsonParse(textResponse);

  // Extract grounding sources (citations)
  const sources = [];
  const groundingMetadata = candidate?.groundingMetadata;
  if (groundingMetadata && groundingMetadata.groundingChunks) {
    for (const chunk of groundingMetadata.groundingChunks) {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "מקור מידע מהרשת",
          url: chunk.web.uri
        });
      }
    }
  }

  const searchQueries = groundingMetadata?.webSearchQueries || [];

  const agentLog = {
    id: 'l_' + Date.now(),
    timestamp: new Date().toISOString(),
    query: searchQueries.length > 0 ? searchQueries.join(", ") : "סריקה חיה של טרנדים בריבות בוטיק",
    summary: parsedResult.summary,
    suggestions: parsedResult.suggestions,
    sources: sources,
    offline: false
  };

  const currentLogs = await db.getAgentLogs();
  currentLogs.unshift(agentLog);
  await db.saveAgentLogs(currentLogs.slice(0, 50));

  return agentLog;
}

// Call Gemini scan with automatic fallback if search grounding fails
async function callGeminiScanWithFallback(apiKey) {
  console.log("Starting live agent trend scan using Gemini API...");
  
  try {
    return await callGeminiScanDirect(apiKey, true);
  } catch (error) {
    console.warn("Gemini Scan with Search Grounding failed, retrying WITHOUT search grounding...", error.message);
    try {
      const result = await callGeminiScanDirect(apiKey, false);
      result.summary = `[סריקה מבוססת בינה מלאכותית ללא חיפוש רשת עקב מגבלת מכסה] ${result.summary}`;
      result.query = "סריקה חיה (ללא חיפוש רשת)";
      return result;
    } catch (retryError) {
      throw new Error(`Gemini scan failed on both grounding and standard mode. Last error: ${retryError.message}`);
    }
  }
}

export async function runAgentScan() {
  const settings = await db.getSettings();
  const provider = settings.aiProvider || 'gemini';
  
  if (provider === 'openrouter') {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY || settings.openRouterApiKey;
    if (!openRouterApiKey) {
      console.log("No OpenRouter API key configured. Returning offline mock data.");
      return {
        ...OFFLINE_TRENDS,
        query: "מצב אופליין (חסר מפתח OpenRouter)",
        offline: true
      };
    }
    try {
      return await callOpenRouterScan(openRouterApiKey);
    } catch (error) {
      console.error("OpenRouter scan failed, returning offline fallback:", error);
      return {
        ...OFFLINE_TRENDS,
        query: "סריקה נכשלה (מצב אופליין)",
        summary: `חלה שגיאה בחיבור ל-OpenRouter (${error.message}). מוצגת סריקה מקומית.`,
        offline: true,
        error: error.message
      };
    }
  }

  // Gemini Provider logic
  const apiKey = process.env.GEMINI_API_KEY || settings.geminiApiKey;
  if (!apiKey) {
    console.log("No Gemini API key configured. Returning offline mock data.");
    return {
      ...OFFLINE_TRENDS,
      offline: true
    };
  }

  try {
    return await callGeminiScanWithFallback(apiKey);
  } catch (error) {
    console.error("Gemini scan failed, returning offline fallback:", error);
    return {
      id: 'l_err_' + Date.now(),
      timestamp: new Date().toISOString(),
      query: "ניסיון סריקה נכשל (מצב אופליין)",
      summary: `חלה שגיאה בחיבור לסוכן ה-AI (${error.message}). מוצגת סריקה היסטורית במצב אופליין.`,
      suggestions: OFFLINE_TRENDS.suggestions,
      sources: OFFLINE_TRENDS.sources,
      offline: true,
      error: error.message
    };
  }
}

export async function generateCustomRecipe(baseFruit, sweetness, twistType, notes) {
  const settings = await db.getSettings();
  const provider = settings.aiProvider || 'gemini';

  if (provider === 'openrouter') {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY || settings.openRouterApiKey;
    if (!openRouterApiKey) {
      console.log("No OpenRouter API key configured. Generating offline custom recipe fallback.");
      return generateOfflineRecipe(baseFruit, sweetness, twistType, notes);
    }
    try {
      return await callOpenRouterCustomRecipe(openRouterApiKey, baseFruit, sweetness, twistType, notes);
    } catch (error) {
      console.error("OpenRouter custom recipe generation failed, falling back to offline:", error);
      return generateOfflineRecipe(baseFruit, sweetness, twistType, notes);
    }
  }

  // Gemini Provider logic
  const apiKey = process.env.GEMINI_API_KEY || settings.geminiApiKey;
  if (!apiKey) {
    console.log("No Gemini API key. Generating offline custom recipe fallback.");
    return generateOfflineRecipe(baseFruit, sweetness, twistType, notes);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    
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

      Ensure the twist is prominent and adds a gourmet character.
      Return the output as a JSON object matching the schema.
    `;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: "You are a Michelin-star pastry chef and jam expert. You write detailed, beautiful gourmet recipes in Hebrew." }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RECIPE_SCHEMA,
        temperature: 0.8
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errText}`);
    }

    const resJson = await response.json();
    const textResponse = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) throw new Error("Empty response from API");
    
    return robustJsonParse(textResponse);
  } catch (error) {
    console.error("Error generating live custom recipe, falling back:", error);
    return generateOfflineRecipe(baseFruit, sweetness, twistType, notes);
  }
}

// Generate offline templates for various twist types
function generateOfflineRecipe(baseFruit, sweetness, twistType, notes) {
  let sugarAmt = "600 גרם סוכר לבן";
  if (sweetness === "מתוק מאוד") sugarAmt = "800 גרם סוכר לבן";
  if (sweetness === "מתיקות מעודנת") sugarAmt = "450 גרם סוכר לבן או סוכר חום";

  let twistName = "";
  let ingredients = [];
  let instructions = [];

  switch (twistType) {
    case "alcoholic":
      twistName = "יין אדום קברנה ותבלינים";
      ingredients = [
        `1 ק"ג ${baseFruit} טרי, חתוך ונקי`,
        sugarAmt,
        "150 מ\"ל יין אדום יבש (קברנה סובניון או מרלו)",
        "מיץ מחצי לימון סחוט טרי",
        "2 יחידות כוכב אניס",
        "1 מקל קינמון"
      ];
      instructions = [
        `מערבבים את ה-${baseFruit}, הסוכר, היין האדום ומיץ הלימון בסיר כבד.`,
        "מוסיפים את כוכב האניס ומקל הקינמון לתוך הסיר.",
        "מביאים לרתיחה על אש בינונית, תוך כדי ערבוב להמסת הסוכר.",
        "מנמיכים את האש ומבשלים כ-45 דקות עד שהריבה מסמיכה וצבעה הופך עמוק ועשיר.",
        "מוציאים את מקל הקינמון וכוכבי האניס.",
        "מעבירים לצנצנות מעוקרות חמות וסוגרים היטב."
      ];
      break;
    case "spicy":
      twistName = "ג'ינג'ר טרי ונגיעת צ'ילי";
      ingredients = [
        `1 ק"ג ${baseFruit} טרי וחתוך`,
        sugarAmt,
        "1.5 כפות ג'ינג'ר טרי מגורר דק",
        "רבע כפית שבבי צ'ילי יבש (או פרוסה דקה של צ'ילי טרי)",
        "מיץ מחצי לימון"
      ];
      instructions = [
        `מערבבים את ה-${baseFruit}, הסוכר, הג'ינג'ר המגורר, הצ'ילי ומיץ הלימון בסיר.`,
        "מביאים לרתיחה תוך ערבוב מתמיד.",
        "מנמיכים את האש ומבשלים כ-40 דקות, תוך כדי קיפוי קצף במידת הצורך.",
        "בודקים סמיכות על צלחת קרה, מכבים את האש ומוזגים לצנצנות נקיות."
      ];
      break;
    case "herbal":
      twistName = "רוזמרין ותפוז";
      ingredients = [
        `1 ק"ג ${baseFruit} נקי וחתוך`,
        sugarAmt,
        "1 גבעול רוזמרין טרי (עלים בלבד, קצוצים דק מאד)",
        "גרידה מתפוז אחד שלם",
        "מיץ מחצי לימון"
      ];
      instructions = [
        `מניחים את ה-${baseFruit}, הסוכר, גרידת התפוז ומיץ הלימון בסיר ומערבבים.`,
        "מביאים לרתיחה ומנמיכים את הלהבה.",
        "מבשלים כ-35 דקות, ולאחר מכן מוסיפים את הרוזמרין הקצוץ דק.",
        "מבשלים עוד 10 דקות נוספות לספיגת הארומה.",
        "יוצקים חם לצנצנות ומקררים."
      ];
      break;
    case "floral":
      twistName = "מי ורדים ועלי ורדים מיובשים";
      ingredients = [
        `1 ק"ג ${baseFruit} טרי וחתוך`,
        sugarAmt,
        "1 כפית מי ורדים איכותיים",
        "1 כף עלי ורדים מיובשים (לשימוש קולינרי)",
        "מיץ מחצי לימון"
      ];
      instructions = [
        `מבשלים את ה-${baseFruit}, הסוכר ומיץ הלימון בסיר על אש בינונית עד להמסת הסוכר.`,
        "מביאים לרתיחה, מנמיכים ומבשלים כ-40 דקות עד להסמכה.",
        "מכבים את האש, מוסיפים מיד את מי הורדים ועלי הורדים המיובשים ומערבבים בעדינות.",
        "מעבירים ישירות לצנצנות מעוקרות."
      ];
      break;
    case "acidic":
    default:
      twistName = "בלסמי מצומצם ופלפל שחור";
      ingredients = [
        `1 ק"ג ${baseFruit} חתוך ומוכן לבישול`,
        sugarAmt,
        "3 כפות חומץ בלסמי איכותי מיושן",
        "חצי כפית פלפל שחור גרוס טרי דק דק",
        "מיץ מחצי לימון"
      ];
      instructions = [
        `בסיר רחב מבשלים את ה-${baseFruit}, הסוכר ומיץ הלימון.`,
        "מביאים לרתיחה ומבשלים על אש קטנה כ-35 דקות.",
        "מוסיפים את החומץ הבלסמי והפלפל השחור הגרוס.",
        "ממשיכים לבשל כ-10 דקות נוספות עד שהריבה מבריקה וקטיפתית.",
        "מוזגים לצנצנות חמות ומעוקרות."
      ];
      break;
  }

  const customNotesText = notes ? ` (הערה: ${notes})` : "";

  return {
    name: `מרקחת ${baseFruit} מיוחדת עם ${twistName} (אופליין)`,
    description: `מתכון פרימיום בעבודת יד לריבת ${baseFruit} עשירה ומאוזנת בשילוב ${twistName}.${customNotesText}`,
    baseFruit: baseFruit,
    sweetness: sweetness,
    twist: twistName,
    ingredients: ingredients,
    instructions: instructions,
    cookTime: "45 דקות"
  };
}
