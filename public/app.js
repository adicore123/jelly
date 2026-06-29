// RibaManager Frontend Application State
const state = {
  activeTab: 'dashboard-tab',
  customers: [],
  recipes: [],
  agentLogs: [],
  settings: { hasKey: false, usingEnv: false }
};

// API Base URL (Relative since hosted on same server)
const API_BASE = '';

// DOM Elements
const elements = {
  tabs: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  
  // Dashboard
  statRecipesCount: document.getElementById('stat-recipes-count'),
  statCustomersCount: document.getElementById('stat-customers-count'),
  statAgentScans: document.getElementById('stat-agent-scans'),
  dashboardMatches: document.getElementById('dashboard-matches'),
  dashboardLatestAgent: document.getElementById('dashboard-latest-agent'),

  // Customers
  customersList: document.getElementById('customers-list'),
  customerSearchInput: document.getElementById('customer-search-input'),
  openCustomerModalBtn: document.getElementById('open-customer-modal-btn'),
  customerModal: document.getElementById('customer-modal'),
  closeCustomerModal: document.getElementById('close-customer-modal'),
  cancelCustomerBtn: document.getElementById('cancel-customer-btn'),
  customerForm: document.getElementById('customer-form'),
  customerIdInput: document.getElementById('customer-id-input'),
  custName: document.getElementById('cust-name'),
  custPhone: document.getElementById('cust-phone'),
  custEmail: document.getElementById('cust-email'),
  custFruitsInput: document.getElementById('cust-fruits-input'),
  custSweetness: document.getElementById('cust-sweetness'),
  custAllergies: document.getElementById('cust-allergies'),
  custNotes: document.getElementById('cust-notes'),
  fruitChips: document.querySelectorAll('.fruit-chip'),

  // Recipes
  recipesList: document.getElementById('recipes-list'),
  recipeFruitFilter: document.getElementById('recipe-fruit-filter'),
  recipeSweetnessFilter: document.getElementById('recipe-sweetness-filter'),
  openRecipeModalBtn: document.getElementById('open-recipe-modal-btn'),
  recipeModal: document.getElementById('recipe-modal'),
  closeRecipeModal: document.getElementById('close-recipe-modal'),
  cancelRecipeBtn: document.getElementById('cancel-recipe-btn'),
  recipeForm: document.getElementById('recipe-form'),
  recipeIdInput: document.getElementById('recipe-id-input'),
  recName: document.getElementById('rec-name'),
  recDescription: document.getElementById('rec-description'),
  recBaseFruit: document.getElementById('rec-base-fruit'),
  recSweetness: document.getElementById('rec-sweetness'),
  recCookTime: document.getElementById('rec-cook-time'),
  recTwist: document.getElementById('rec-twist'),
  recIngredients: document.getElementById('rec-ingredients'),
  recInstructions: document.getElementById('rec-instructions'),

  // Recipe Generator
  recipeGeneratorForm: document.getElementById('recipe-generator-form'),
  genBaseFruit: document.getElementById('gen-base-fruit'),
  genSweetness: document.getElementById('gen-sweetness'),
  genTwistType: document.getElementById('gen-twist-type'),
  genCustomNotes: document.getElementById('gen-custom-notes'),
  generatorResultContainer: document.getElementById('generator-result-container'),
  generateBtn: document.getElementById('generate-btn'),

  // Production Tools
  prodRecipeSelect: document.getElementById('prod-recipe-select'),
  prodJarSize: document.getElementById('prod-jar-size'),
  prodJarCount: document.getElementById('prod-jar-count'),
  costFruitKg: document.getElementById('cost-fruit-kg'),
  costSugarKg: document.getElementById('cost-sugar-kg'),
  costJarUnit: document.getElementById('cost-jar-unit'),
  costLabelUnit: document.getElementById('cost-label-unit'),
  costOtherBatch: document.getElementById('cost-other-batch'),
  prodMarkup: document.getElementById('prod-markup'),
  labelBrandName: document.getElementById('label-brand-name'),
  labelBatchCode: document.getElementById('label-batch-code'),
  labelProduceDate: document.getElementById('label-produce-date'),
  labelExpiryMonths: document.getElementById('label-expiry-months'),
  calculatorResults: document.getElementById('calculator-results'),
  labelPreviewContainer: document.getElementById('label-preview-container'),
  printLabelBtn: document.getElementById('print-label-btn'),
  printLabelsContainer: document.getElementById('print-labels-container'),

  // Agent
  triggerScanBtn: document.getElementById('trigger-scan-btn'),
  agentApiStatus: document.getElementById('agent-api-status'),
  sidebarApiStatus: document.getElementById('sidebar-api-status'),
  agentLoading: document.getElementById('agent-loading'),
  agentLoadingStatus: document.getElementById('agent-loading-status'),
  agentConsoleLogs: document.getElementById('agent-console-logs'),
  agentResultsBox: document.getElementById('agent-results-box'),
  agentHistoryList: document.getElementById('agent-history-list'),

  // Settings
  settingsForm: document.getElementById('settings-form'),
  aiProviderSelect: document.getElementById('ai-provider-select'),
  geminiKeyGroup: document.getElementById('gemini-key-group'),
  openRouterKeyGroup: document.getElementById('openrouter-key-group'),
  groqKeyGroup: document.getElementById('groq-key-group'),
  geminiApiKeyInput: document.getElementById('gemini-api-key-input'),
  openRouterApiKeyInput: document.getElementById('openrouter-api-key-input'),
  groqApiKeyInput: document.getElementById('groq-api-key-input'),
  toggleKeyVisibility: document.getElementById('toggle-key-visibility'),
  toggleOpenRouterKeyVisibility: document.getElementById('toggle-openrouter-key-visibility'),
  toggleGroqKeyVisibility: document.getElementById('toggle-groq-key-visibility'),
  settingsStatusMessage: document.getElementById('settings-status-message'),

  // Matches Modal
  matchModal: document.getElementById('match-modal'),
  closeMatchModal: document.getElementById('close-match-modal'),
  closeMatchBtn: document.getElementById('close-match-btn'),
  matchModalBody: document.getElementById('match-modal-body'),
  
  // Toast
  toastContainer: document.getElementById('toast-container')
};

// Selected fruits for Customer Modal
let selectedFruits = new Set();

// Cache for static agent sites list
let _masterSitesCache = null;

/* --- INIT APP --- */
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupEventListeners();
  setDefaultDates();
  loadAllData();
});

// Setup Navigation Tabs
function setupNavigation() {
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      
      elements.tabs.forEach(t => t.classList.remove('active'));
      elements.tabContents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
      state.activeTab = targetTab;
      
      // Reload relevant tab data
      if (targetTab === 'dashboard-tab') {
        renderDashboard();
      } else if (targetTab === 'customers-tab') {
        renderCustomers();
      } else if (targetTab === 'recipes-tab') {
        renderRecipes();
      } else if (targetTab === 'production-tab') {
        updateProductionCalculator();
      } else if (targetTab === 'agent-tab') {
        renderAgentTab();
      }
    });
  });
}

function setDefaultDates() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  if (elements.labelProduceDate) {
    elements.labelProduceDate.value = `${year}-${month}-${day}`;
  }
  if (elements.labelBatchCode) {
    elements.labelBatchCode.value = `B-${year}-${month}${day}`;
  }
}

// Fetch and load data
async function loadAllData() {
  try {
    await Promise.all([
      fetchCustomers(),
      fetchRecipes(),
      fetchAgentLogs(),
      fetchSettings()
    ]);
    
    // Initial renders
    renderDashboard();
    populateRecipeFilters();
    populateProductionRecipes();
    updateSidebarStatus();
    showToast('הנתונים נטענו בהצלחה', 'success');
  } catch (error) {
    console.error('Error loading initial data:', error);
    showToast('שגיאה בטעינת הנתונים מהשרת', 'error');
  }
}

/* --- API CALLS --- */
async function fetchCustomers() {
  const res = await fetch(`${API_BASE}/api/customers`);
  state.customers = await res.json();
}

async function fetchRecipes() {
  const res = await fetch(`${API_BASE}/api/recipes`);
  state.recipes = await res.json();
}

async function fetchAgentLogs() {
  const res = await fetch(`${API_BASE}/api/agent/logs`);
  state.agentLogs = await res.json();
}

async function fetchSettings() {
  const res = await fetch(`${API_BASE}/api/settings`);
  state.settings = await res.json();
  
  if (elements.aiProviderSelect) {
    elements.aiProviderSelect.value = state.settings.aiProvider || 'groq';
    toggleSettingsFields();
  }
}

function toggleSettingsFields() {
  const provider = elements.aiProviderSelect.value;
  elements.geminiKeyGroup.classList.add('hidden');
  elements.openRouterKeyGroup.classList.add('hidden');
  elements.groqKeyGroup.classList.add('hidden');
  
  if (provider === 'gemini') {
    elements.geminiKeyGroup.classList.remove('hidden');
  } else if (provider === 'openrouter') {
    elements.openRouterKeyGroup.classList.remove('hidden');
  } else if (provider === 'groq') {
    elements.groqKeyGroup.classList.remove('hidden');
  }
}

/* --- CUSTOM CONFIRM MODAL --- */
function confirmAction(message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.style.zIndex = '9999';
  
  const card = document.createElement('div');
  card.className = 'modal-card';
  card.style.maxWidth = '400px';
  card.style.textAlign = 'center';
  card.style.padding = '2rem';
  
  card.innerHTML = `
    <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; color: var(--danger); margin-bottom: 1rem;"></i>
    <h3 style="margin-bottom: 1rem; color: var(--text-dark); font-weight: 700;">${message}</h3>
    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;">
      <button class="btn btn-text" id="custom-confirm-cancel">ביטול</button>
      <button class="btn btn-danger" id="custom-confirm-ok">אישור מחיקה</button>
    </div>
  `;
  
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  
  document.getElementById('custom-confirm-cancel').onclick = () => overlay.remove();
  document.getElementById('custom-confirm-ok').onclick = () => {
    overlay.remove();
    onConfirm();
  };
}

/* --- TOAST NOTIFICATIONS --- */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-circle-xmark';
  
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* --- UPDATE SIDEBAR CONNECT STATUS --- */
function updateSidebarStatus() {
  const sidebarStatus = elements.sidebarApiStatus;
  if (!sidebarStatus) return;
  
  if (state.settings.hasKey) {
    const p = state.settings.aiProvider;
    const providerLabel = p === 'groq' ? 'Groq ⚡' : (p === 'openrouter' ? 'OpenRouter' : 'Gemini');
    sidebarStatus.innerHTML = `
      <span class="status-indicator status-active"></span>
      <span>סוכן AI מחובר (${providerLabel})</span>
    `;
  } else {
    sidebarStatus.innerHTML = `
      <span class="status-indicator status-inactive"></span>
      <span>סוכן AI במצב מקומי</span>
    `;
  }
}

/* --- SETTINGS HANDLERS --- */
if (elements.aiProviderSelect) {
  elements.aiProviderSelect.addEventListener('change', toggleSettingsFields);
}

elements.settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const provider = elements.aiProviderSelect.value;
  const geminiApiKey = elements.geminiApiKeyInput.value.trim();
  const openRouterApiKey = elements.openRouterApiKeyInput.value.trim();
  const groqApiKey = elements.groqApiKeyInput.value.trim();
  
  // Validation
  if (provider === 'gemini' && !geminiApiKey && !state.settings.hasGeminiKey) {
    elements.settingsStatusMessage.className = 'settings-status-box error';
    elements.settingsStatusMessage.innerText = 'נא להזין מפתח Gemini API תקין';
    return;
  }
  if (provider === 'openrouter' && !openRouterApiKey && !state.settings.hasOpenRouterKey) {
    elements.settingsStatusMessage.className = 'settings-status-box error';
    elements.settingsStatusMessage.innerText = 'נא להזין מפתח OpenRouter API תקין';
    return;
  }
  if (provider === 'groq' && !groqApiKey && !state.settings.hasGroqKey) {
    elements.settingsStatusMessage.className = 'settings-status-box error';
    elements.settingsStatusMessage.innerText = 'נא להזין מפתח Groq API תקין';
    return;
  }

  try {
    const body = { aiProvider: provider };
    if (geminiApiKey) body.geminiApiKey = geminiApiKey;
    if (openRouterApiKey) body.openRouterApiKey = openRouterApiKey;
    if (groqApiKey) body.groqApiKey = groqApiKey;
    
    const res = await fetch(`${API_BASE}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (res.ok) {
      elements.settingsStatusMessage.className = 'settings-status-box success';
      elements.settingsStatusMessage.innerText = 'ההגדרות נשמרו בהצלחה!';
      showToast('הגדרות בינה מלאכותית עודכנו בשרת', 'success');
      
      elements.geminiApiKeyInput.value = '';
      elements.openRouterApiKeyInput.value = '';
      elements.groqApiKeyInput.value = '';
      
      await fetchSettings();
      updateSidebarStatus();
      renderAgentTab();
    } else {
      throw new Error('שגיאת שרת');
    }
  } catch (error) {
    elements.settingsStatusMessage.className = 'settings-status-box error';
    elements.settingsStatusMessage.innerText = 'חלה שגיאה בשמירת הנתונים';
  }
});

elements.toggleKeyVisibility.addEventListener('click', () => {
  const type = elements.geminiApiKeyInput.type === 'password' ? 'text' : 'password';
  elements.geminiApiKeyInput.type = type;
  elements.toggleKeyVisibility.querySelector('i').className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
});

elements.toggleOpenRouterKeyVisibility.addEventListener('click', () => {
  const type = elements.openRouterApiKeyInput.type === 'password' ? 'text' : 'password';
  elements.openRouterApiKeyInput.type = type;
  elements.toggleOpenRouterKeyVisibility.querySelector('i').className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
});

if (elements.toggleGroqKeyVisibility) {
  elements.toggleGroqKeyVisibility.addEventListener('click', () => {
    const type = elements.groqApiKeyInput.type === 'password' ? 'text' : 'password';
    elements.groqApiKeyInput.type = type;
    elements.toggleGroqKeyVisibility.querySelector('i').className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
  });
}

/* --- CUSTOMERS HANDLERS --- */
function setupEventListeners() {
  // Modal open/close
  elements.openCustomerModalBtn.addEventListener('click', () => {
    openCustomerModal();
  });
  
  elements.closeCustomerModal.addEventListener('click', () => closeCustomerModal());
  elements.cancelCustomerBtn.addEventListener('click', () => closeCustomerModal());
  
  elements.customerForm.addEventListener('submit', handleCustomerFormSubmit);
  elements.customerSearchInput.addEventListener('input', renderCustomers);
  
  // Chips interaction
  elements.fruitChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const fruit = chip.getAttribute('data-fruit');
      if (selectedFruits.has(fruit)) {
        selectedFruits.delete(fruit);
        chip.classList.remove('selected');
      } else {
        selectedFruits.add(fruit);
        chip.classList.add('selected');
      }
    });
  });

  // Recipes listeners
  elements.openRecipeModalBtn.addEventListener('click', () => openRecipeModal());
  elements.closeRecipeModal.addEventListener('click', () => closeRecipeModal());
  elements.cancelRecipeBtn.addEventListener('click', () => closeRecipeModal());
  elements.recipeForm.addEventListener('submit', handleRecipeFormSubmit);
  elements.recipeFruitFilter.addEventListener('change', renderRecipes);
  elements.recipeSweetnessFilter.addEventListener('change', renderRecipes);

  // Generator
  elements.recipeGeneratorForm.addEventListener('submit', handleGenerateRecipe);

  // Production Tools listeners
  elements.prodRecipeSelect.addEventListener('change', updateProductionCalculator);
  [elements.prodJarSize, elements.prodJarCount, elements.costFruitKg, elements.costSugarKg, 
   elements.costJarUnit, elements.costLabelUnit, elements.costOtherBatch, elements.prodMarkup]
   .forEach(input => {
     input.addEventListener('input', updateProductionCalculator);
   });
   
  [elements.labelBrandName, elements.labelBatchCode, elements.labelProduceDate, elements.labelExpiryMonths]
   .forEach(input => {
     input.addEventListener('input', updateLabelPreview);
   });

  elements.printLabelBtn.addEventListener('click', printLabels);

  // Agent
  elements.triggerScanBtn.addEventListener('click', handleAgentScan);

  // Matches modal close
  elements.closeMatchModal.addEventListener('click', () => elements.matchModal.classList.remove('active'));
  elements.closeMatchBtn.addEventListener('click', () => elements.matchModal.classList.remove('active'));

  // Mobile Menu Toggle
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const appSidebar = document.getElementById('app-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  if (menuToggleBtn && appSidebar && sidebarOverlay) {
    menuToggleBtn.addEventListener('click', () => {
      appSidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
    });

    const closeMobileSidebar = () => {
      appSidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    };

    sidebarOverlay.addEventListener('click', closeMobileSidebar);

    elements.tabs.forEach(tab => {
      tab.addEventListener('click', closeMobileSidebar);
    });
  }
}

function openCustomerModal(customer = null) {
  elements.customerForm.reset();
  selectedFruits.clear();
  elements.fruitChips.forEach(c => c.classList.remove('selected'));
  
  if (customer) {
    document.getElementById('customer-modal-title').innerText = 'עריכת פרטי לקוח';
    elements.customerIdInput.value = customer.id;
    elements.custName.value = customer.name;
    elements.custPhone.value = customer.phone;
    elements.custEmail.value = customer.email || '';
    elements.custSweetness.value = customer.preferences.sweetness;
    elements.custAllergies.value = customer.allergies.join(', ');
    elements.custNotes.value = customer.preferences.notes || '';
    
    // Setup fruits
    const fruits = customer.preferences.fruits || [];
    fruits.forEach(f => {
      selectedFruits.add(f);
      const chip = document.querySelector(`.fruit-chip[data-fruit="${f}"]`);
      if (chip) chip.classList.add('selected');
    });
    
    // Filter out fruits that have chips, put others in custom input
    const chipFruits = Array.from(elements.fruitChips).map(c => c.getAttribute('data-fruit'));
    const otherFruits = fruits.filter(f => !chipFruits.includes(f));
    elements.custFruitsInput.value = otherFruits.join(', ');
  } else {
    document.getElementById('customer-modal-title').innerText = 'הוספת לקוח חדש';
    elements.customerIdInput.value = '';
  }
  
  elements.customerModal.classList.add('active');
}

function closeCustomerModal() {
  elements.customerModal.classList.remove('active');
}

async function handleCustomerFormSubmit(e) {
  e.preventDefault();
  
  const id = elements.customerIdInput.value;
  const name = elements.custName.value.trim();
  const phone = elements.custPhone.value.trim();
  const email = elements.custEmail.value.trim();
  const sweetness = elements.custSweetness.value;
  const notes = elements.custNotes.value.trim();
  
  // Parse allergies
  const allergies = elements.custAllergies.value.split(',')
    .map(a => a.trim())
    .filter(a => a.length > 0);
    
  // Combine chip fruits and typed fruits
  const fruits = new Set(selectedFruits);
  elements.custFruitsInput.value.split(',')
    .map(f => f.trim())
    .filter(f => f.length > 0)
    .forEach(f => fruits.add(f));

  const customerData = {
    id: id || undefined,
    name,
    phone,
    email,
    preferences: {
      fruits: Array.from(fruits),
      sweetness,
      notes
    },
    allergies,
    purchaseHistory: id ? (state.customers.find(c => c.id === id)?.purchaseHistory || []) : []
  };

  try {
    const res = await fetch(`${API_BASE}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });

    if (res.ok) {
      const saved = await res.json();
      const idx = state.customers.findIndex(c => c.id === saved.id);
      if (idx !== -1) {
        state.customers[idx] = saved;
      } else {
        state.customers.push(saved);
      }
      showToast(id ? 'פרטי הלקוח עודכנו' : 'לקוח חדש נוסף בהצלחה', 'success');
      closeCustomerModal();
      renderCustomers();
      renderDashboard();
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'שגיאה בשמירת הלקוח');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteCustomer(id) {
  confirmAction('האם אתה בטוח שברצונך למחוק לקוח זה?', async () => {
    try {
      const res = await fetch(`${API_BASE}/api/customers/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        state.customers = state.customers.filter(c => c.id !== id);
        showToast('הלקוח נמחק בהצלחה', 'success');
        renderCustomers();
        renderDashboard();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'שגיאה במחיקת הלקוח');
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

function renderCustomers() {
  const query = elements.customerSearchInput.value.toLowerCase().trim();
  elements.customersList.innerHTML = '';
  
  const filtered = state.customers.filter(c => {
    const fruitsText = c.preferences.fruits.join(' ').toLowerCase();
    return c.name.toLowerCase().includes(query) || 
           c.phone.includes(query) || 
           fruitsText.includes(query);
  });

  if (filtered.length === 0) {
    elements.customersList.innerHTML = `<p class="placeholder-text">לא נמצאו לקוחות מתאימים.</p>`;
    return;
  }

  filtered.forEach(c => {
    const card = document.createElement('div');
    card.className = 'customer-card';
    
    const fruitTags = c.preferences.fruits.map(f => `<span class="tag tag-fruit">🍓 ${f}</span>`).join('');
    const allergyTags = c.allergies.map(a => `<span class="tag tag-allergy"><i class="fa-solid fa-triangle-exclamation"></i> אלרגיה: ${a}</span>`).join('');
    
    card.innerHTML = `
      <div>
        <div class="card-header">
          <h3>${c.name}</h3>
          <span class="tag tag-sweetness">${c.preferences.sweetness}</span>
        </div>
        <div class="card-contact">
          <span><i class="fa-solid fa-phone"></i> ${c.phone}</span>
          ${c.email ? `<span><i class="fa-solid fa-envelope"></i> ${c.email}</span>` : ''}
        </div>
        <div class="card-tags">
          ${fruitTags}
          ${allergyTags}
        </div>
        ${c.preferences.notes ? `<div class="card-notes">${c.preferences.notes}</div>` : ''}
      </div>
      <div class="card-actions">
        <button class="btn btn-secondary" onclick="matchPersonalJam('${c.id}')">
          <i class="fa-solid fa-wand-magic-sparkles"></i> התאמת ריבה
        </button>
        <div>
          <button class="btn btn-text" onclick="editCustomer('${c.id}')"><i class="fa-solid fa-pencil"></i></button>
          <button class="btn btn-text text-danger" onclick="deleteCustomer('${c.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
    elements.customersList.appendChild(card);
  });
}

// Global functions exposed for onclick handlers
window.editCustomer = (id) => {
  const customer = state.customers.find(c => c.id === id);
  if (customer) openCustomerModal(customer);
};

window.deleteCustomer = (id) => deleteCustomer(id);

window.matchPersonalJam = (id) => {
  const customer = state.customers.find(c => c.id === id);
  if (!customer) return;
  
  elements.matchModalBody.innerHTML = '';
  
  const customerFruits = customer.preferences.fruits.map(f => f.toLowerCase().trim());
  const customerSweetness = customer.preferences.sweetness;
  const customerAllergies = customer.allergies.map(a => a.toLowerCase().trim());
  
  let matches = [];
  
  state.recipes.forEach(r => {
    let score = 0;
    let reasons = [];
    let isAllergic = false;
    
    // Check allergy
    const recipeText = (r.name + ' ' + r.description + ' ' + r.ingredients.join(' ')).toLowerCase();
    customerAllergies.forEach(allergen => {
      if (recipeText.includes(allergen)) {
        isAllergic = true;
        reasons.push(`❌ מכיל רכיב אלרגני: <strong>${allergen}</strong>!`);
      }
    });
    
    if (isAllergic) {
      matches.push({ recipe: r, matchType: 'warning-match', score: -100, reasons });
      return;
    }
    
    // Match base fruit
    if (customerFruits.includes(r.baseFruit.toLowerCase().trim())) {
      score += 50;
      reasons.push(`🍓 מבוסס על פרי מועדף: <strong>${r.baseFruit}</strong>`);
    }
    
    // Match sweetness
    if (r.sweetness === customerSweetness) {
      score += 30;
      reasons.push(`✨ רמת מתיקות תואמת מושלם: <strong>${r.sweetness}</strong>`);
    } else {
      reasons.push(`ℹ️ מתיקות: ${r.sweetness} (העדפת לקוח: ${customerSweetness})`);
    }
    
    // Twist bonus
    if (r.twist) {
      score += 10;
      reasons.push(`💡 כולל טוויסט מיוחד: ${r.twist}`);
    }
    
    let matchType = 'neutral-match';
    if (score >= 80) matchType = 'excellent-match';
    else if (score >= 50) matchType = 'good-match';
    
    matches.push({ recipe: r, matchType, score, reasons });
  });
  
  // Sort matches (highest score first)
  matches.sort((a, b) => b.score - a.score);
  
  const fruitsList = customer.preferences.fruits.map(f => `<span class="tag tag-fruit">🍓 ${f}</span>`).join('');
  const allergyAlerts = customer.allergies.map(a => `<span class="tag tag-allergy">⚠️ ${a}</span>`).join('');
  
  let html = `
    <div class="match-header">
      <h4>התאמה עבור <strong>${customer.name}</strong></h4>
      <div class="match-preferences">
        <span>העדפות:</span> ${fruitsList}
        <span style="margin-right: 10px;">מתיקות:</span> <span class="tag tag-sweetness">${customer.preferences.sweetness}</span>
        ${customer.allergies.length > 0 ? `<span style="margin-right: 10px;">אלרגיות:</span> ${allergyAlerts}` : ''}
      </div>
    </div>
    <div class="match-recipes-list">
  `;
  
  if (matches.length === 0) {
    html += `<p class="placeholder-text">אין מתכונים בספר כרגע להתאמה.</p>`;
  } else {
    matches.forEach(m => {
      let scoreBadge = '';
      if (m.matchType === 'warning-match') {
        scoreBadge = `<span class="match-score score-warning">סכנת אלרגיה</span>`;
      } else if (m.matchType === 'excellent-match') {
        scoreBadge = `<span class="match-score score-perfect">התאמה מעולה (${m.score}%)</span>`;
      } else {
        scoreBadge = `<span class="match-score score-neutral">התאמה חלקית (${Math.max(0, m.score)}%)</span>`;
      }
      
      html += `
        <div class="match-recipe-item ${m.matchType}">
          <div class="match-recipe-title">
            <span>${m.recipe.name}</span>
            ${scoreBadge}
          </div>
          <div class="match-reason">
            ${m.reasons.map(r => `<div>${r}</div>`).join('')}
          </div>
        </div>
      `;
    });
  }
  
  html += `</div>`;
  elements.matchModalBody.innerHTML = html;
  elements.matchModal.classList.add('active');
};

/* --- RECIPES HANDLERS --- */
function populateRecipeFilters() {
  const select = elements.recipeFruitFilter;
  select.innerHTML = '<option value="all">הכל</option>';
  
  const fruits = Array.from(new Set(state.recipes.map(r => r.baseFruit.trim()))).filter(f => f.length > 0);
  fruits.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.innerText = f;
    select.appendChild(opt);
  });
}

function openRecipeModal(recipe = null) {
  elements.recipeForm.reset();
  
  if (recipe) {
    document.getElementById('recipe-modal-title').innerText = 'עריכת מתכון';
    elements.recipeIdInput.value = recipe.id;
    elements.recName.value = recipe.name;
    elements.recDescription.value = recipe.description || '';
    elements.recBaseFruit.value = recipe.baseFruit;
    elements.recSweetness.value = recipe.sweetness;
    elements.recCookTime.value = recipe.cookTime || '45 דקות';
    elements.recTwist.value = recipe.twist || '';
    elements.recIngredients.value = recipe.ingredients.join('\n');
    elements.recInstructions.value = recipe.instructions.join('\n');
  } else {
    document.getElementById('recipe-modal-title').innerText = 'הוספת מתכון ידני';
    elements.recipeIdInput.value = '';
  }
  
  elements.recipeModal.classList.add('active');
}

function closeRecipeModal() {
  elements.recipeModal.classList.remove('active');
}

async function handleRecipeFormSubmit(e) {
  e.preventDefault();
  
  const id = elements.recipeIdInput.value;
  const name = elements.recName.value.trim();
  const description = elements.recDescription.value.trim();
  const baseFruit = elements.recBaseFruit.value.trim();
  const sweetness = elements.recSweetness.value;
  const cookTime = elements.recCookTime.value.trim() || '45 דקות';
  const twist = elements.recTwist.value.trim();
  
  const ingredients = elements.recIngredients.value.split('\n')
    .map(i => i.trim())
    .filter(i => i.length > 0);
    
  const instructions = elements.recInstructions.value.split('\n')
    .map(i => i.trim())
    .filter(i => i.length > 0);

  const recipeData = {
    id: id || undefined,
    name,
    description,
    baseFruit,
    sweetness,
    cookTime,
    twist,
    ingredients,
    instructions,
    createdViaAgent: id ? (state.recipes.find(r => r.id === id)?.createdViaAgent || false) : false
  };

  try {
    const res = await fetch(`${API_BASE}/api/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipeData)
    });
    
    if (res.ok) {
      const saved = await res.json();
      const idx = state.recipes.findIndex(r => r.id === saved.id);
      if (idx !== -1) {
        state.recipes[idx] = saved;
      } else {
        state.recipes.push(saved);
      }
      showToast(id ? 'המתכון עודכן בהצלחה' : 'מתכון חדש נשמר בספר', 'success');
      closeRecipeModal();
      populateRecipeFilters();
      populateProductionRecipes();
      renderRecipes();
      renderDashboard();
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'שגיאה בשמירת המתכון');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteRecipe(id) {
  confirmAction('האם אתה בטוח שברצונך למחוק מתכון זה?', async () => {
    try {
      const res = await fetch(`${API_BASE}/api/recipes/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        state.recipes = state.recipes.filter(r => r.id !== id);
        showToast('המתכון נמחק', 'success');
        populateRecipeFilters();
        populateProductionRecipes();
        renderRecipes();
        renderDashboard();
      } else {
        throw new Error('שגיאה במחיקת המתכון');
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

function renderRecipes() {
  const fruitFilter = elements.recipeFruitFilter.value;
  const sweetnessFilter = elements.recipeSweetnessFilter.value;
  elements.recipesList.innerHTML = '';
  
  const filtered = state.recipes.filter(r => {
    const matchFruit = fruitFilter === 'all' || r.baseFruit.trim() === fruitFilter;
    const matchSweetness = sweetnessFilter === 'all' || r.sweetness === sweetnessFilter;
    return matchFruit && matchSweetness;
  });

  if (filtered.length === 0) {
    elements.recipesList.innerHTML = `<p class="placeholder-text">לא נמצאו מתכונים בסינון זה.</p>`;
    return;
  }

  filtered.forEach(r => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    const ingredientsHtml = r.ingredients.map(i => `<li>${i}</li>`).join('');
    const instructionsHtml = r.instructions.map(step => `<li>${step}</li>`).join('');
    
    card.innerHTML = `
      <div>
        <div class="card-header">
          <h3>${r.name}</h3>
          ${r.createdViaAgent ? '<span class="tag tag-fruit" style="background:#4a154b;color:#fff;"><i class="fa-solid fa-robot"></i> AI</span>' : ''}
        </div>
        <p class="recipe-desc">${r.description || 'אין תיאור זמין למתכון זה.'}</p>
        <div class="recipe-meta-row">
          <span><strong>פרי בסיס:</strong> ${r.baseFruit}</span>
          <span><strong>מתיקות:</strong> ${r.sweetness}</span>
        </div>
        ${r.twist ? `<p style="font-size:0.9rem; margin-bottom:1rem;">💡 <strong>הטוויסט:</strong> ${r.twist}</p>` : ''}
        
        <button class="collapsible-trigger" onclick="toggleRecipeDetails(this)">
          <span>רכיבים והוראות הכנה</span>
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        
        <div class="collapsible-content">
          <div style="margin-bottom:0.8rem;">
            <strong style="font-size:0.9rem;color:var(--primary-berry);">רכיבים:</strong>
            <ul style="padding-right:1rem;font-size:0.85rem;">${ingredientsHtml}</ul>
          </div>
          <div>
            <strong style="font-size:0.9rem;color:var(--primary-berry);">שלבי הכנה:</strong>
            <ol style="padding-right:1rem;font-size:0.85rem;">${instructionsHtml}</ol>
          </div>
          <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.5rem;"><i class="fa-solid fa-clock"></i> זמן הכנה: ${r.cookTime}</p>
        </div>
      </div>
      <div class="card-actions" style="margin-top:1.2rem;">
        <button class="btn btn-text" onclick="editRecipe('${r.id}')"><i class="fa-solid fa-pencil"></i> ערוך</button>
        <button class="btn btn-text text-danger" onclick="deleteRecipe('${r.id}')"><i class="fa-solid fa-trash"></i> מחק</button>
      </div>
    `;
    elements.recipesList.appendChild(card);
  });
}

window.editRecipe = (id) => {
  const recipe = state.recipes.find(r => r.id === id);
  if (recipe) openRecipeModal(recipe);
};

window.deleteRecipe = (id) => deleteRecipe(id);

window.toggleRecipeDetails = (btn) => {
  const content = btn.nextElementSibling;
  content.classList.toggle('open');
  const icon = btn.querySelector('i');
  icon.className = content.classList.contains('open') ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
};

/* --- RECIPE GENERATOR HANDLERS --- */
async function handleGenerateRecipe(e) {
  e.preventDefault();
  
  const baseFruit = elements.genBaseFruit.value.trim();
  const sweetness = elements.genSweetness.value;
  const twistType = elements.genTwistType.value;
  const notes = elements.genCustomNotes.value.trim();
  
  if (!baseFruit) {
    showToast('נא להזין פרי בסיס', 'error');
    return;
  }

  // Set loading state
  elements.generateBtn.disabled = true;
  elements.generateBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> מחולל מתכון...`;
  elements.generatorResultContainer.innerHTML = `
    <div class="result-placeholder" style="animation: pulse 1.5s infinite;">
      <i class="fa-solid fa-wand-magic-sparkles fa-spin text-berry"></i>
      <h3>הסוכן רוקח את המתכון האידיאלי עבורך...</h3>
      <p>זה עשוי לקחת מספר שניות בהתאם לשרת.</p>
    </div>
  `;

  try {
    const res = await fetch(`${API_BASE}/api/recipes/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseFruit, sweetness, twistType, notes })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'שגיאת שרת בחילול מתכון');
    }
    
    const recipe = await res.json();
    renderGeneratedRecipe(recipe);
    showToast('המתכון חולל בהצלחה!', 'success');
  } catch (error) {
    console.error('Error generating recipe:', error);
    elements.generatorResultContainer.innerHTML = `
      <div class="result-placeholder text-danger">
        <i class="fa-solid fa-circle-exclamation"></i>
        <h3>לא ניתן לחולל מתכון חי</h3>
        <p>${error.message}. אנא ודא שהגדרת מפתח API תקין בלשונית ההגדרות.</p>
      </div>
    `;
    showToast('חילול המתכון נכשל', 'error');
  } finally {
    elements.generateBtn.disabled = false;
    elements.generateBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> חולל מתכון גורמה`;
  }
}

function renderGeneratedRecipe(r) {
  const container = elements.generatorResultContainer;
  container.innerHTML = `
    <div class="gen-recipe-display">
      <div class="gen-recipe-header">
        <h3>${r.name}</h3>
        <p>${r.description || ''}</p>
        <div class="gen-badge-row">
          <span class="badge badge-berry">פרי: ${r.baseFruit}</span>
          <span class="badge badge-apricot">מתיקות: ${r.sweetness}</span>
          ${r.twist ? `<span class="badge badge-plum">טוויסט: ${r.twist}</span>` : ''}
        </div>
      </div>
      
      <div class="gen-recipe-section">
        <h4><i class="fa-solid fa-basket-shopping"></i> רכיבים נדרשים:</h4>
        <ul style="list-style-type: square;">
          ${r.ingredients.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>

      <div class="gen-recipe-section">
        <h4><i class="fa-solid fa-list-check"></i> שלבי הכנה:</h4>
        <ol>
          ${r.instructions.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>

      <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.2rem;">
        <i class="fa-solid fa-clock"></i> זמן בישול משוער: ${r.cookTime || '45 דקות'}
      </div>

      <div class="gen-recipe-actions">
        <button class="btn btn-primary btn-block" id="adopt-gen-recipe-btn">
          <i class="fa-solid fa-bookmark"></i> ✨ שמור מתכון זה בספר שלי
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('adopt-gen-recipe-btn').addEventListener('click', async () => {
    r.createdViaAgent = true;
    try {
      const res = await fetch(`${API_BASE}/api/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(r)
      });
      if (res.ok) {
        const saved = await res.json();
        const idx = state.recipes.findIndex(rec => rec.id === saved.id);
        if (idx !== -1) { state.recipes[idx] = saved; } else { state.recipes.push(saved); }
        showToast('המתכון אומץ בהצלחה והתווסף לספר שלך!', 'success');
        populateRecipeFilters();
        populateProductionRecipes();
        const tabBtn = Array.from(elements.tabs).find(t => t.getAttribute('data-tab') === 'recipes-tab');
        if (tabBtn) tabBtn.click();
      } else {
        throw new Error('שגיאה בשמירת המתכון');
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  });
}

/* --- PRODUCTION TOOLS LOGIC --- */
function populateProductionRecipes() {
  const select = elements.prodRecipeSelect;
  if (!select) return;
  
  // Save current selection
  const currentVal = select.value;
  select.innerHTML = '<option value="">-- בחר מתכון --</option>';
  
  state.recipes.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.innerText = r.name;
    select.appendChild(opt);
  });
  
  if (currentVal && state.recipes.some(r => r.id === currentVal)) {
    select.value = currentVal;
  }
}

function updateProductionCalculator() {
  const recipeId = elements.prodRecipeSelect.value;
  if (!recipeId) {
    elements.calculatorResults.innerHTML = `<p class="placeholder-text">בחר מתכון מימין כדי לחשב כמויות ועלויות.</p>`;
    elements.labelPreviewContainer.innerHTML = `<p class="placeholder-text">בחר מתכון כדי לעצב את מדבקת הצנצנת.</p>`;
    elements.printLabelBtn.disabled = true;
    return;
  }

  const recipe = state.recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  elements.printLabelBtn.disabled = false;

  // Gather inputs
  const jarSizeG = parseFloat(elements.prodJarSize.value) || 250;
  const jarCount = parseInt(elements.prodJarCount.value) || 10;
  const markup = parseFloat(elements.prodMarkup.value) || 60;
  
  const costFruit = parseFloat(elements.costFruitKg.value) || 0;
  const costSugar = parseFloat(elements.costSugarKg.value) || 0;
  const costJar = parseFloat(elements.costJarUnit.value) || 0;
  const costLabel = parseFloat(elements.costLabelUnit.value) || 0;
  const costOther = parseFloat(elements.costOtherBatch.value) || 0;

  // Output calculations:
  // Total jam yield needed (grams)
  const totalYieldG = jarSizeG * jarCount;
  
  // Proportions of fruit and sugar
  // Ratio = Sugar weight relative to fruit weight
  let sugarRatio = 0.6; // medium sweetness default
  if (recipe.sweetness === "מתוק מאוד") sugarRatio = 0.8;
  if (recipe.sweetness === "מתיקות מעודנת") sugarRatio = 0.45;

  // In cooking, yield of jam ≈ 1.5 times the fruit weight (due to sugar and pectin added vs evaporation)
  const fruitWeightG = totalYieldG / 1.5;
  const sugarWeightG = fruitWeightG * sugarRatio;
  
  // Scaling Factor relative to a standard 1kg (1000g) base fruit recipe
  const scaleFactor = fruitWeightG / 1000;

  // Costs calculation
  const totalFruitCost = (fruitWeightG / 1000) * costFruit;
  const totalSugarCost = (sugarWeightG / 1000) * costSugar;
  const totalJarsCost = jarCount * costJar;
  const totalLabelsCost = jarCount * costLabel;
  const totalCost = totalFruitCost + totalSugarCost + totalJarsCost + totalLabelsCost + costOther;
  
  const costPerJar = totalCost / jarCount;
  
  // Suggested retail price per jar (cost + markup)
  // Retail = Cost / (1 - markup/100)
  const suggestedPrice = costPerJar / (1 - (markup / 100));
  const totalRevenue = suggestedPrice * jarCount;
  const totalProfit = totalRevenue - totalCost;

  // Format scaled ingredients list
  // Scale other ingredients by scanning the recipe's text or scaling general text
  let scaledIngredients = [];
  scaledIngredients.push(`🍓 <strong>${recipe.baseFruit}:</strong> ${(fruitWeightG/1000).toFixed(2)} ק"ג`);
  scaledIngredients.push(`🍬 <strong>סוכר:</strong> ${(sugarWeightG/1000).toFixed(2)} ק"ג (${recipe.sweetness})`);
  
  // Try to list other non-fruit ingredients scaled if possible, otherwise list them proportionally
  recipe.ingredients.forEach(ing => {
    // If it's not base fruit or sugar, try to mention it
    const lowerIng = ing.toLowerCase();
    if (!lowerIng.includes(recipe.baseFruit.toLowerCase().substring(0, 4)) && !lowerIng.includes('סוכר')) {
      // Find numbers in string to try scaling, or just print with indicator
      const numMatch = ing.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
      if (numMatch) {
        const val = parseFloat(numMatch[1]);
        const unit = numMatch[2];
        scaledIngredients.push(`• ${(val * scaleFactor).toFixed(1)} ${unit}`);
      } else {
        scaledIngredients.push(`• ${ing} (להתאים לפי מנה)`);
      }
    }
  });

  // Render results panel
  elements.calculatorResults.innerHTML = `
    <table class="results-table">
      <thead>
        <tr>
          <th>רכיב נדרש</th>
          <th>כמות מומלצת למנה</th>
        </tr>
      </thead>
      <tbody>
        ${scaledIngredients.map(ing => `<tr><td colspan="2">${ing}</td></tr>`).join('')}
      </tbody>
    </table>

    <div class="results-summary-row bg-summary-cost">
      <span>עלות ייצור כוללת (ל-${jarCount} צנצנות):</span>
      <span class="val">₪${totalCost.toFixed(1)}</span>
    </div>
    
    <div class="results-summary-row bg-summary-cost" style="font-size:0.9rem; margin-top:-5px; padding-top:0.2rem; padding-bottom:0.4rem;">
      <span>עלות ייצור לצנצנת בודדת (${jarSizeG} גרם):</span>
      <span class="val" style="font-size:1rem;">₪${costPerJar.toFixed(2)}</span>
    </div>

    <div class="results-summary-row bg-summary-price">
      <span>מחיר מכירה מומלץ (מתח רווח ${markup}%):</span>
      <span class="val">₪${suggestedPrice.toFixed(1)}</span>
    </div>

    <div class="results-summary-row bg-summary-profit">
      <span>רווח צפוי מהמנה:</span>
      <span class="val">₪${totalProfit.toFixed(1)}</span>
    </div>
  `;

  // Update label preview simultaneously
  updateLabelPreview();
}

function updateLabelPreview() {
  const recipeId = elements.prodRecipeSelect.value;
  if (!recipeId) return;

  const recipe = state.recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  const brand = elements.labelBrandName.value.trim() || 'ריבות הבוטיק שלי';
  const batch = elements.labelBatchCode.value.trim() || 'A-01';
  const produceDateVal = elements.labelProduceDate.value;
  const expiryMonths = parseInt(elements.labelExpiryMonths.value) || 12;

  // Format dates
  const produceDate = produceDateVal ? new Date(produceDateVal) : new Date();
  const expiryDate = new Date(produceDate);
  expiryDate.setMonth(expiryDate.getMonth() + expiryMonths);

  const formattedProduce = produceDate.toLocaleDateString('he-IL');
  const formattedExpiry = expiryDate.toLocaleDateString('he-IL');
  const jarSize = elements.prodJarSize.value || '250';

  // Check for allergens
  let allergensFound = [];
  const recipeText = (recipe.name + ' ' + recipe.description + ' ' + recipe.ingredients.join(' ')).toLowerCase();
  
  const commonAllergens = [
    { key: 'אגוז', val: 'אגוזים' },
    { key: 'שקד', val: 'שקדים' },
    { key: 'פיסטוק', val: 'פיסטוקים' },
    { key: 'גלוטן', val: 'גלוטן' },
    { key: 'שומשום', val: 'שומשום' },
    { key: 'חלב', val: 'לקטוז/חלב' }
  ];

  commonAllergens.forEach(all => {
    if (recipeText.includes(all.key)) {
      allergensFound.push(all.val);
    }
  });

  const allergenWarning = allergensFound.length > 0 
    ? `<div class="sticker-allergen-alert"><i class="fa-solid fa-triangle-exclamation"></i> <strong>מידע על אלרגנים:</strong> מכיל ${allergensFound.join(', ')}</div>`
    : `<div class="sticker-allergen-alert" style="background:#f0fff4; border-color:#d4edda; color:#155724;"><i class="fa-solid fa-circle-check"></i> ללא אלרגנים נפוצים</div>`;

  // Render sticker preview
  elements.labelPreviewContainer.innerHTML = `
    <div class="product-label-sticker">
      <div>
        <div class="sticker-brand">${brand}</div>
        <div class="sticker-divider"></div>
        <div class="sticker-title">${recipe.name}</div>
        <div class="sticker-sub">מרקחת פרימיום בעבודת יד</div>
      </div>
      
      <div>
        <div class="sticker-info-section">
          <strong>רכיבים:</strong> ${recipe.ingredients.map(i => i.trim()).join(', ')}.
          ${allergenWarning}
        </div>
      </div>

      <div>
        <div class="sticker-footer-meta">
          <span>משקל נטו: ${jarSize} גרם</span>
          <span>אצווה: ${batch}</span>
        </div>
        <div class="sticker-footer-meta" style="border-top:none; padding-top:0; margin-top:2px;">
          <span>ייצור: ${formattedProduce}</span>
          <span>לשימוש לפני: ${formattedExpiry}</span>
        </div>
      </div>
    </div>
  `;
}

function printLabels() {
  const preview = elements.labelPreviewContainer.querySelector('.product-label-sticker');
  if (!preview) return;

  const count = parseInt(elements.prodJarCount.value) || 10;
  
  // Populate the hidden print container
  elements.printLabelsContainer.innerHTML = '';
  
  const grid = document.createElement('div');
  grid.className = 'print-labels-grid';

  // Clone the preview label N times
  for (let i = 0; i < count; i++) {
    const clone = preview.cloneNode(true);
    clone.className = 'print-label-item';
    grid.appendChild(clone);
  }

  elements.printLabelsContainer.appendChild(grid);
  
  // Trigger print dialog
  window.print();
}

/* --- AI AGENT HANDLERS --- */
function renderAgentTab() {
  const statusBox = elements.agentApiStatus;
  if (state.settings.hasKey) {
    const p = state.settings.aiProvider;
    const providerLabel = p === 'groq' ? 'Groq (Llama 3.3 70B) ⚡' : (p === 'openrouter' ? 'OpenRouter' : 'Gemini');
    statusBox.innerHTML = `
      <span class="status-indicator status-active"></span>
      <span>סוכן AI מחובר דרך ${providerLabel} — סריקת 56 אתרים וקהילות רשת מופעלת!</span>
    `;
  } else {
    statusBox.innerHTML = `
      <span class="status-indicator status-inactive"></span>
      <span>סוכן AI לא מוגדר. הזן מפתח API בהגדרות.</span>
    `;
  }

  // Render master sites grid
  loadMasterSitesGrid();

  const historyList = elements.agentHistoryList;
  historyList.innerHTML = '';
  
  if (state.agentLogs.length === 0) {
    historyList.innerHTML = `<p class="placeholder-text">טרם בוצעו סריקות טרנדים.</p>`;
    return;
  }

  state.agentLogs.forEach(log => {
    const item = document.createElement('div');
    item.className = `history-item ${log.offline ? '' : 'live-scan'}`;
    item.addEventListener('click', () => {
      displayAgentScanResult(log);
      window.scrollTo({ top: elements.agentResultsBox.offsetTop - 100, behavior: 'smooth' });
    });

    const date = new Date(log.timestamp).toLocaleString('he-IL');
    const typeLabel = log.offline ? 'אופליין' : 'סריקה חיה';
    
    item.innerHTML = `
      <div class="history-item-info">
        <h4>${log.query}</h4>
        <p>${date} • ${typeLabel} • ${log.suggestions.length} מתכונים מוצעים</p>
      </div>
      <i class="fa-solid fa-chevron-left" style="color:var(--text-muted)"></i>
    `;
    historyList.appendChild(item);
  });
}

async function loadMasterSitesGrid() {
  const grid = document.getElementById('master-sites-grid');
  if (!grid) return;
  const categoryIcons = { 'ישראלי': '🇮🇱', 'בינלאומי': '🌍', 'מדע ושימור': '🔬', 'שפים וארטיזנים': '👨‍🍳', 'ליקוט והתססה': '🌿', 'פורומים וקהילות': '💬' };
  if (_masterSitesCache) {
    grid.innerHTML = _masterSitesCache.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="master-site-chip">
        <span class="site-icon">${categoryIcons[s.category] || '🌐'}</span>
        <span class="site-name">${s.name}</span>
      </a>
    `).join('');
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/agent/sites`);
    _masterSitesCache = await res.json();
    grid.innerHTML = _masterSitesCache.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="master-site-chip">
        <span class="site-icon">${categoryIcons[s.category] || '🌐'}</span>
        <span class="site-name">${s.name}</span>
      </a>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<p class="placeholder-text">לא ניתן לטעון רשימת אתרים.</p>';
  }
}

async function handleAgentScan() {
  elements.triggerScanBtn.disabled = true;
  elements.agentLoading.classList.remove('hidden');
  elements.agentResultsBox.innerHTML = '';
  
  const consoleLogs = elements.agentConsoleLogs;
  consoleLogs.innerHTML = '';
  
  const appendConsole = (text) => {
    consoleLogs.innerHTML += `<div>[${new Date().toLocaleTimeString()}] ${text}</div>`;
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  };

  const isGroq = state.settings.aiProvider === 'groq';
  const isOR = state.settings.aiProvider === 'openrouter';

  appendConsole("יוזם סוכן טרנדים...");
  elements.agentLoadingStatus.innerText = "הסוכן מתחבר לשרת...";
  
  await new Promise(r => setTimeout(r, 600));
  appendConsole("בודק הגדרות מפתח API...");
  
  if (state.settings.hasKey && isGroq) {
    appendConsole("⚡ מפתח Groq API נמצא. מפעיל סריקת 56 אתרי מאסטר וקהילות רשת...");
    await new Promise(r => setTimeout(r, 500));
    elements.agentLoadingStatus.innerText = "🔍 שלב 1: סורק פידים חיים מ-56 מקורות כולל Reddit...";
    appendConsole("💬 מתחבר לקהילות Reddit (r/canning, r/Preserving, r/foraging, r/jam)...");
    await new Promise(r => setTimeout(r, 400));
    appendConsole("🌍 מתחבר לבלוגים רב-לשוניים בצרפתית, ספרדית, איטלקית, גרמנית, רוסית ופורטוגזית...");
    await new Promise(r => setTimeout(r, 400));
    appendConsole("🇮🇱 מתחבר לפודי, השולחן, עוגיו.נט, קרוטית...");
    await new Promise(r => setTimeout(r, 400));
    appendConsole("🌍 מתחבר ל-Serious Eats, Food52, BBC Good Food...");
    await new Promise(r => setTimeout(r, 400));
    appendConsole("🔬 מתחבר ל-Healthy Canning, NCHFP, Ball Mason Jars...");
    await new Promise(r => setTimeout(r, 400));
    appendConsole("👨‍🍳 מתחבר ל-Food in Jars, David Lebovitz, Fab Food 4 All...");
    await new Promise(r => setTimeout(r, 400));
    appendConsole("🌿 מתחבר ל-Practical Self Reliance, Grow Forage Cook Ferment...");
    await new Promise(r => setTimeout(r, 300));
    elements.agentLoadingStatus.innerText = "🧠 שלב 2: שולח ל-Groq (Llama 3.3 70B) לניתוח ותרגום...";
    appendConsole("🧠 שולח נתונים לשרתי Groq לניתוח, תרגום לעברית ויצירת מתכונים...");
  } else if (state.settings.hasKey && isOR) {
    appendConsole(`מפתח API נמצא. מכין סריקה חיה דרך OpenRouter...`);
    await new Promise(r => setTimeout(r, 600));
    appendConsole("מתחבר למודל Llama 3...");
    elements.agentLoadingStatus.innerText = "הסוכן מנתח ידע קולינרי עולמי...";
  } else if (state.settings.hasKey) {
    appendConsole(`מפתח API נמצא. מכין סריקה חיה דרך Gemini...`);
    await new Promise(r => setTimeout(r, 600));
    appendConsole("מתחבר למנוע Google Search Grounding...");
    elements.agentLoadingStatus.innerText = "סורק טרנדים קולינריים ברשת...";
  } else {
    appendConsole("לא נמצא מפתח API. מפעיל מנגנון סריקה מקומי (אופליין)...");
    await new Promise(r => setTimeout(r, 1000));
    elements.agentLoadingStatus.innerText = "טוען טרנדים ממאגר מקומי...";
  }

  try {
    const res = await fetch(`${API_BASE}/api/agent/scan`, {
      method: 'POST'
    });
    
    if (!res.ok) throw new Error("סריקת הסוכן נכשלה בשרת");
    
    const result = await res.json();
    
    if (result.liveFeedsFound) {
      appendConsole(`✅ סריקה הושלמה! ${result.liveFeedsFound} פידים חיים נמצאו עם ${result.totalTitles || 0} כותרות.`);
    } else {
      appendConsole("סריקה הושלמה! מעבד נתונים...");
    }
    await new Promise(r => setTimeout(r, 500));
    
    elements.agentLoading.classList.add('hidden');
    displayAgentScanResult(result);
    await fetchAgentLogs();
    renderAgentTab();
    renderDashboard();
    showToast('סריקת 40 אתרי מאסטר הושלמה בהצלחה!', 'success');
  } catch (error) {
    console.error(error);
    appendConsole(`שגיאה: ${error.message}`);
    elements.agentLoading.classList.add('hidden');
    showToast('פעולת הסוכן נכשלה', 'error');
  } finally {
    elements.triggerScanBtn.disabled = false;
  }
}

function displayAgentScanResult(log) {
  const box = elements.agentResultsBox;
  box.style.display = 'block';
  
  // Ensure this log is available in state for index retrieval
  if (!state.agentLogs.some(l => l.id === log.id)) {
    state.agentLogs.unshift(log);
  }
  
  const sourcesHtml = log.sources.map(s => `
    <span class="source-chip">
      <i class="fa-solid fa-link"></i> 
      <a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a>
    </span>
  `).join('');
  
  let recipesHtml = '';
  
  log.suggestions.forEach((recipe, idx) => {
    recipesHtml += `
      <div class="agent-recipe-box">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h4>${recipe.name}</h4>
            <p class="desc">${recipe.description}</p>
          </div>
          <span class="tag tag-sweetness">${recipe.sweetness}</span>
        </div>
        <div style="font-size:0.85rem; margin-bottom:0.8rem;">
          💡 <strong>הטוויסט:</strong> ${recipe.twist}
        </div>
        
        <button class="collapsible-trigger" onclick="toggleRecipeDetails(this)">
          <span>הוראות ורכיבים</span>
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        
        <div class="collapsible-content">
          <div style="margin-bottom:0.8rem;">
            <strong>רכיבים:</strong>
            <ul style="padding-right:1.2rem; font-size:0.85rem;">${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
          </div>
          <div style="margin-bottom:0.8rem;">
            <strong>הכנה:</strong>
            <ol style="padding-right:1.2rem; font-size:0.85rem;">${recipe.instructions.map(step => `<li>${step}</li>`).join('')}</ol>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-solid fa-clock"></i> זמן בישול: ${recipe.cookTime || '45 דקות'}</p>
        </div>

        <button class="btn btn-primary btn-block" style="margin-top:0.8rem;" onclick="adoptAgentRecipeByIndex('${log.id}', ${idx})">
          <i class="fa-solid fa-plus-circle"></i> ✨ אמץ מתכון זה לספר שלי
        </button>
      </div>
    `;
  });

  const offlineLabel = log.offline ? '⚠️ מצב אופליין - מוצגים טרנדים שמורים' : '✅ סריקה חיה בעולם';

  box.innerHTML = `
    <div class="agent-result-card" style="animation: fadeIn 0.4s ease;">
      <div class="agent-result-title">
        <i class="fa-solid fa-robot"></i>
        <span>הצעות הסוכן מיום ${new Date(log.timestamp).toLocaleString('he-IL')}</span>
      </div>
      
      <div style="font-size: 0.85rem; font-weight:700; margin-bottom: 1rem; color: ${log.offline ? 'var(--danger)' : 'var(--success)'};">
        ${offlineLabel}
      </div>

      <div class="trend-summary-box">
        <strong>ניתוח מגמות של הסוכן:</strong><br>
        ${log.summary}
      </div>

      ${log.sources.length > 0 ? `
        <div class="sources-list">
          <h4><i class="fa-solid fa-circle-nodes"></i> מקורות מידע שנסרקו:</h4>
          <div class="sources-chips">${sourcesHtml}</div>
        </div>
      ` : ''}

      <h4 style="color:var(--primary-berry); font-weight:800; margin-bottom: 1rem; font-size:1.2rem; border-bottom:1px solid #ebdbe2; padding-bottom:0.5rem;">
        מתכונים עם טוויסט קולינרי שהסוכן פיתח:
      </h4>
      <div class="agent-recipes-grid">
        ${recipesHtml}
      </div>
    </div>
  `;
}

window.adoptAgentRecipe = async (recipe) => {
  recipe.createdViaAgent = true;
  try {
    const res = await fetch(`${API_BASE}/api/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    if (res.ok) {
      const saved = await res.json();
      const idx = state.recipes.findIndex(r => r.id === saved.id);
      if (idx !== -1) { state.recipes[idx] = saved; } else { state.recipes.push(saved); }
      showToast('המתכון אומץ בהצלחה והתווסף לספר שלך!', 'success');
      populateRecipeFilters();
      populateProductionRecipes();
      const tabBtn = Array.from(elements.tabs).find(t => t.getAttribute('data-tab') === 'recipes-tab');
      if (tabBtn) tabBtn.click();
    } else {
      throw new Error('שגיאה באימוץ המתכון');
    }
  } catch (e) {
    showToast(e.message, 'error');
  }
};

window.adoptAgentRecipeByIndex = async (logId, idx) => {
  const log = state.agentLogs.find(l => l.id === logId);
  if (!log) {
    showToast('יומן סריקה לא נמצא', 'error');
    return;
  }
  const recipe = log.suggestions[idx];
  if (!recipe) {
    showToast('מתכון לא נמצא ביומן', 'error');
    return;
  }
  await window.adoptAgentRecipe(recipe);
};

/* --- DASHBOARD RENDER --- */
function renderDashboard() {
  elements.statRecipesCount.innerText = state.recipes.length;
  elements.statCustomersCount.innerText = state.customers.length;
  elements.statAgentScans.innerText = state.agentLogs.length;

  // Show latest agent suggestion
  const latestBox = elements.dashboardLatestAgent;
  if (state.agentLogs.length > 0) {
    const latestLog = state.agentLogs[0];
    const suggestion = latestLog.suggestions[0];
    latestBox.innerHTML = `
      <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">
        סריקה אחרונה: ${new Date(latestLog.timestamp).toLocaleDateString('he-IL')}
      </div>
      <h4 style="color:var(--primary-berry); font-weight:700; margin-bottom:0.4rem;">${suggestion.name}</h4>
      <p style="font-size:0.9rem; color:#555; margin-bottom:0.8rem; font-style:italic;">"${suggestion.description}"</p>
      <div style="font-size:0.85rem; margin-bottom:1rem;">
        💡 <strong>הטוויסט:</strong> ${suggestion.twist}
      </div>
      <button class="btn btn-secondary btn-block" id="dash-view-agent-btn">
        <i class="fa-solid fa-robot"></i> צפה בכל הצעות הסוכן
      </button>
    `;
    
    document.getElementById('dash-view-agent-btn').addEventListener('click', () => {
      const tabBtn = Array.from(elements.tabs).find(t => t.getAttribute('data-tab') === 'agent-tab');
      if (tabBtn) {
        tabBtn.click();
        displayAgentScanResult(latestLog);
      }
    });
  } else {
    latestBox.innerHTML = `<p class="placeholder-text">טרם בוצעו סריקות. עבר ללשונית "סוכן הטרנדים" והפעל את הסריקה הראשונה שלך!</p>`;
  }

  // Dashboard customer match suggestions
  const matchBox = elements.dashboardMatches;
  matchBox.innerHTML = '';
  
  if (state.customers.length === 0) {
    matchBox.innerHTML = `<p class="placeholder-text">הוסף לקוחות במודול הלקוחות כדי לראות התאמות אישיות.</p>`;
    return;
  }
  
  let matchCount = 0;
  state.customers.slice(0, 5).forEach(customer => {
    const preferredFruits = customer.preferences.fruits.map(f => f.toLowerCase().trim());
    const matchedRecipes = state.recipes.filter(r => {
      const isPreferred = preferredFruits.includes(r.baseFruit.toLowerCase().trim());
      const recipeText = (r.name + ' ' + r.description + ' ' + r.ingredients.join(' ')).toLowerCase();
      const hasAllergy = customer.allergies.some(allergen => recipeText.includes(allergen.toLowerCase().trim()));
      return isPreferred && !hasAllergy;
    });

    if (matchedRecipes.length > 0) {
      matchCount++;
      const recipe = matchedRecipes[0];
      const div = document.createElement('div');
      div.style.padding = '0.8rem';
      div.style.borderBottom = '1px solid #ebdbe2';
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      
      div.innerHTML = `
        <div>
          <strong style="color:var(--accent-plum);">${customer.name}</strong> 
          <span style="font-size:0.85rem;color:var(--text-muted);">מעדיף/ה ${customer.preferences.fruits[0]}</span>
          <div style="font-size:0.85rem;color:#444;margin-top:0.2rem;">💡 מומלץ: <strong>${recipe.name}</strong></div>
        </div>
        <button class="btn btn-text" onclick="matchPersonalJam('${customer.id}')" style="padding:0.3rem 0.6rem;font-size:0.8rem;">
          <i class="fa-solid fa-expand"></i> התאם
        </button>
      `;
      matchBox.appendChild(div);
    }
  });

  if (matchCount === 0) {
    matchBox.innerHTML = `<p class="placeholder-text">אין התאמות פשוטות כרגע. נסה להוסיף מתכונים עם פירות התואמים את העדפות הלקוחות שלך.</p>`;
  }
}
