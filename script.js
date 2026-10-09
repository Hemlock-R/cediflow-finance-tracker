const defaultVocabulary = {
  income: [
    "income",
    "job",
    "salary",
    "wage",
    "pay",
    "bonus",
    "dividend",
    "profit",
    "sales",
    "freelance",
    "commission",
    "grant",
    "allowance",
    "payout",
    "interest earned",
    "royalty",
    "gig",
    "airdrop",
    "staking rewards",
    "gift money",
    "funding",
    "refund",
    "reimbursement",
    "side hustle",
    "tips",
    "revenue",
    "earnings",
  ],
  asset: [
    "house",
    "stock",
    "bond",
    "crypto",
    "bitcoin",
    "gold",
    "real estate",
    "land",
    "investment",
    "savings",
    "equity",
    "fund",
    "property",
    "ethereum",
    "solana",
    "usdt",
    "portfolio",
    "share",
    "cash account",
    "forex balance",
    "nft",
    "equipment",
    "machinery",
    "vehicle",
    "car asset",
    "gold bars",
    "silver",
    "wallet balance",
  ],
  liability: [
    "loan",
    "debt",
    "mortgage",
    "credit",
    "borrow",
    "overdraft",
    "owe",
    "paylater",
    "leverage margin",
    "funding fee debt",
    "bill outstanding",
    "dues",
    "arrears",
    "taxes owed",
    "pawn",
  ],
  expense: [
    "clothes",
    "rent",
    "gas",
    "car",
    "utility",
    "bill",
    "grocery",
    "groceries",
    "subscription",
    "tax",
    "fee",
    "fees",
    "shoe",
    "shirt",
    "jacket",
    "meal",
    "restaurant",
    "transport",
    "wifi",
    "internet",
    "electricity",
    "water",
    "insurance",
    "entertainment",
    "movie",
    "game",
    "software",
    "hosting",
    "domain",
    "data bundle",
    "airtime",
    "credit unit",
    "snacks",
    "drinks",
    "lunch",
    "dinner",
    "uber",
    "bolt",
    "repairs",
    "maintenance",
  ],
};

const defaultPreferences = {
  theme: "dark",

  currency: "GHS",
};

// Safe local storage parsers to prevent crashes if storage is corrupted or empty
function safeGetLocalStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error parsing localStorage key "${key}":`, e);
    return fallback;
  }
}

let systemVocab = safeGetLocalStorage("sys_vocabulary", defaultVocabulary);
let systemPrefs = safeGetLocalStorage("sys_preferences", defaultPreferences);
let systemGoals = safeGetLocalStorage("sys_goals", []);
let calcClearOnNextInput = false;
let formatter;

const padFactor = 0.01;

function updateFormatter() {
  const currencyConfig = {
    GHS: { locale: "en-GH", code: "GHS", symbol: "GH₵" },
    USD: { locale: "en-US", code: "USD", symbol: "$" },
    EUR: { locale: "de-DE", code: "EUR", symbol: "€" },
    GBP: { locale: "en-GB", code: "GBP", symbol: "£" },
  };
  const config = currencyConfig[systemPrefs.currency] || currencyConfig["GHS"];

  formatter = {
    format: function (value) {
      const num = Number(value) || 0;
      const standardFormatted = new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);

      if (config.code === "GHS") {
        return `GH₵${standardFormatted}`;
      }
      const nativeIntl = new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: config.code,
      });
      return nativeIntl.format(num);
    },
  };
}

const rootContainer = document.documentElement;

// Lazy-eval or safe UI binder to prevent null reference errors if elements aren't immediately found
function getUIElements() {
  return {
    assets: document.getElementById("assets"),
    liabilities: document.getElementById("liabilities"),
    income: document.getElementById("income"),
    expenses: document.getElementById("expenses"),
    savedMoney: document.getElementById("savedMoney"),
    logDate: document.getElementById("logDate"),
    barAsset: document.getElementById("barAsset"),
    barIncome: document.getElementById("barIncome"),
    barExpense: document.getElementById("barExpense"),
    barLiability: document.getElementById("barLiability"),
    pctAsset: document.getElementById("pctAsset"),
    pctIncome: document.getElementById("pctIncome"),
    pctExpense: document.getElementById("pctExpense"),
    pctLiability: document.getElementById("pctLiability"),
    sketchIncome: document.getElementById("sketchIncome"),
    sketchExpenses: document.getElementById("sketchExpenses"),
    sketchAssets: document.getElementById("sketchAssets"),
    sketchLiabilities: document.getElementById("sketchLiabilities"),
    nwDisplay: document.getElementById("netWorthDisplay"),
    nwStatus: document.getElementById("netWorthStatus"),
    niDisplay: document.getElementById("netIncomeDisplay"),
    niStatus: document.getElementById("netIncomeStatus"),
    advisorPanel: document.getElementById("blueprintContent"),
    historyBody: document.getElementById("historyBody"),
  };
}

let ui = {};

window.showSiteMessage = function showSiteMessage(message, type = "success") {
  const existingMessage = document.querySelector(".site-message");

  if (existingMessage) {
    existingMessage.remove();
  }

  const messageBox = document.createElement("div");
  messageBox.className = `site-message ${type}`;

  const config = {
    success: {
      icon: "✓",
      title: "Success",
    },
    error: {
      icon: "!",
      title: "Something went wrong",
    },
    warning: {
      icon: "⚠",
      title: "Notice",
    },
  };

  const selected = config[type] || config.success;

  messageBox.innerHTML = `
    <div class="site-message-icon">${selected.icon}</div>
    <div class="site-message-content">
      <strong>${selected.title}</strong>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(messageBox);

  requestAnimationFrame(() => {
    messageBox.classList.add("show");
  });

  setTimeout(() => {
    messageBox.classList.remove("show");

    setTimeout(() => {
      messageBox.remove();
    }, 250);
  }, 3500);
};

window.showConfirmMessage = function showConfirmMessage(
  title,
  message,
  confirmText = "Yes, Continue",
) {
  const existingConfirm = document.querySelector(".site-confirm");

  if (existingConfirm) {
    existingConfirm.remove();
  }

  const confirmBox = document.createElement("div");
  confirmBox.className = "site-confirm";

  confirmBox.innerHTML = `
    <div class="site-confirm-content">
      <div class="site-confirm-icon">!</div>

      <div class="site-confirm-text">
        <strong>${title}</strong>
        <span>${message}</span>
      </div>
    </div>

    <div class="site-confirm-actions">
      <button type="button" class="site-confirm-cancel">
        Cancel
      </button>

      <button type="button" class="site-confirm-confirm">
        ${confirmText}
      </button>
    </div>
  `;

  document.body.appendChild(confirmBox);

  requestAnimationFrame(() => {
    confirmBox.classList.add("show");
  });

  return new Promise((resolve) => {
    const cancelButton = confirmBox.querySelector(".site-confirm-cancel");

    const confirmButton = confirmBox.querySelector(".site-confirm-confirm");

    const close = (result) => {
      confirmBox.classList.remove("show");

      setTimeout(() => {
        confirmBox.remove();
        resolve(result);
      }, 250);
    };

    cancelButton.addEventListener("click", () => {
      close(false);
    });

    confirmButton.addEventListener("click", () => {
      close(true);
    });
  });
};

function initApp() {
  ui = getUIElements();
  if (ui.logDate && !ui.logDate.value) {
    ui.logDate.value = new Date().toISOString().split("T")[0];
  }

  const footerYear = document.getElementById("footerYear");
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  applyPreferencesEngineState();

  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach((i) => i.addEventListener("input", calculateAndCompare));

  setTimeout(() => {
    ui = getUIElements();

    calculateAndCompare();
    renderHistoryTable();
    calculateSuccessMetrics();
  }, 0);
}

window.switchTab = function switchTab(targetViewId, element) {
  const panels = document.querySelectorAll(".view-panel");
  const tabs = document.querySelectorAll(".nav-tab");

  tabs.forEach((tab) => tab.classList.remove("active"));
  if (element) element.classList.add("active");

  panels.forEach((panel) => {
    if (panel.classList.contains("active")) {
      panel.style.opacity = "0";
      panel.style.transform = "translateY(10px)";
      setTimeout(() => {
        panel.classList.remove("active");
      }, 200);
    }
  });

  setTimeout(() => {
    const targetPanel = document.getElementById(targetViewId);
    if (targetPanel) {
      targetPanel.classList.add("active");
      setTimeout(() => {
        targetPanel.style.opacity = "1";
        targetPanel.style.transform = "translateY(0)";
      }, 50);
    }
  }, 200);

  if (targetViewId === "adminView") {
    renderVocabularyTags();
    syncPreferencesUIElements();
  }
  if (targetViewId === "successView") {
    calculateSuccessMetrics();
  }
}

function renderVocabularyTags() {
  const filterEl = document.getElementById("vocabExplorerFilter");
  const container = document.getElementById("vocabDeckTags");
  if (!filterEl || !container) return;

  const currentDeck = filterEl.value;
  container.innerHTML = "";

  if (systemVocab[currentDeck]) {
    systemVocab[currentDeck].forEach((word, index) => {
      const tag = document.createElement("span");
      tag.className = "keyword-tag";

      const labelNode = document.createTextNode(word + " ");
      tag.appendChild(labelNode);

      const delBtn = document.createElement("button");
      delBtn.textContent = "x";
      delBtn.onclick = function () {
        deleteKeyword(currentDeck, index);
      };

      tag.appendChild(delBtn);
      container.appendChild(tag);
    });
  }
}

function addNewKeyword() {
  const categoryEl = document.getElementById("vocabTargetCategory");
  const textInput = document.getElementById("newVocabWord");
  if (!categoryEl || !textInput) return;

  const category = categoryEl.value;
  const targetWord = textInput.value.toLowerCase().trim();

  if (!targetWord) {
    showSiteMessage("Please type a valid word.", "error");
    return;
  }

  if (systemVocab[category].includes(targetWord)) {
    showSiteMessage("Keyword already exists in this category.", "warning");
    return;
  }

  systemVocab[category].push(targetWord);
  localStorage.setItem("sys_vocabulary", JSON.stringify(systemVocab));
  textInput.value = "";

  renderVocabularyTags();
}

async function deleteKeyword(category, index) {
  const word = systemVocab[category][index];

  const confirmed = await showConfirmMessage(
    "Confirm keyword deletion",
    `Are you sure you want to delete "${word}" from the vocabulary list?`,
    "Yes, Delete",
  );

  if (!confirmed) return;

  systemVocab[category].splice(index, 1);
  localStorage.setItem("sys_vocabulary", JSON.stringify(systemVocab));
  renderVocabularyTags();

  showSiteMessage("Keyword deleted successfully.", "success");
}

function syncPreferencesUIElements() {
  const themeSel = document.getElementById("siteThemeSelector");
  const currencySel = document.getElementById("siteCurrencySelector");

  if (themeSel) themeSel.value = systemPrefs.theme;
  if (currencySel) currencySel.value = systemPrefs.currency || "GHS";
}

function commitAndSecurePreferences() {
  const themeSel = document.getElementById("siteThemeSelector");
  const currencySel = document.getElementById("siteCurrencySelector");

  if (themeSel) systemPrefs.theme = themeSel.value;
  if (currencySel) systemPrefs.currency = currencySel.value;

  localStorage.setItem("sys_preferences", JSON.stringify(systemPrefs));
  applyPreferencesEngineState();
  showSiteMessage("Settings applied successfully.", "success");
}

function applyPreferencesEngineState() {
  const smartLabelEl = document.getElementById("smartLabel");
  if (smartLabelEl) smartLabelEl.textContent = "Smart Classifier Input";

  

  if (systemPrefs.theme === "light") {
    rootContainer.style.setProperty("--bg-color", "#f6f8fa");
    rootContainer.style.setProperty(
      "--surface-color",
      "rgba(255, 255, 255, 0.95)",
    );
    rootContainer.style.setProperty("--bg-input", "#ffffff");
    rootContainer.style.setProperty("--border-color", "#d0d7de");
    rootContainer.style.setProperty("--text-primary", "#24292f");
    rootContainer.style.setProperty("--text-secondary", "#57606a");
  } else {
    rootContainer.style.setProperty("--bg-color", "#0a0c10");
    rootContainer.style.setProperty(
      "--surface-color",
      "rgba(22, 27, 34, 0.75)",
    );
    rootContainer.style.setProperty("--bg-input", "rgba(1, 4, 9, 0.6)");
    rootContainer.style.setProperty(
      "--border-color",
      "rgba(255, 255, 255, 0.08)",
    );
    rootContainer.style.setProperty("--text-primary", "#c9d1d9");
    rootContainer.style.setProperty("--text-secondary", "#8b949e");
  }

  updateFormatter();
  calculateAndCompare();
  renderHistoryTable();
  calculateSuccessMetrics();
}

function classifyItem() {
  const itemEl = document.getElementById("smartItem");
  const amountEl = document.getElementById("smartAmount");
  const resultDiv = document.getElementById("classificationResult");
  if (!itemEl || !amountEl || !resultDiv) return;

  const itemName = itemEl.value.toLowerCase().trim();
  const amount = parseFloat(amountEl.value);

  resultDiv.innerHTML = "";
  if (!itemName || isNaN(amount) || amount <= 0) {
    resultDiv.style.backgroundColor = "rgba(218, 54, 51, 0.1)";
    const errSpan = document.createElement("span");
    errSpan.style.color = "var(--color-liability)";
    errSpan.textContent = "Please enter a valid item name and amount.";
    resultDiv.appendChild(errSpan);
    return;
  }

  let category = "Expense";
  let color = "var(--color-expense)";
  let targetInput = ui.expenses;
  let explanation = "";

  if (
    systemVocab.income &&
    systemVocab.income.some((kw) => itemName.includes(kw))
  ) {
    category = "Income";
    color = "var(--color-income)";
    targetInput = ui.income;
    explanation = `This is classified as Income because it represents an inbound inflow or influx of capital increasing overall cash reservoirs. Tip: Funnel a fixed ratio of this entry directly to purchase assets!`;
  } else if (
    systemVocab.asset &&
    systemVocab.asset.some((kw) => itemName.includes(kw))
  ) {
    category = "Asset";
    color = "var(--color-asset)";
    targetInput = ui.assets;
    explanation = `This is classified as an Asset because it holds future value retrieval property equity options or builds yield. Tip: Protect your asset holdings; these act as engines multiplying long term security layouts.`;
  } else if (
    systemVocab.liability &&
    systemVocab.liability.some((kw) => itemName.includes(kw))
  ) {
    category = "Liability";
    color = "var(--color-liability)";
    targetInput = ui.liabilities;
    explanation = `This is classified as a Liability because it is an outstanding financial commitment or leverage drag drawing value backwards. Tip: Prioritize extra balances into erasing liabilities early to avoid structural performance compound friction fees.`;
  } else {
    category = "Expense";
    color = "var(--color-expense)";
    targetInput = ui.expenses;
    if (
      itemName.includes("grocery") ||
      itemName.includes("groceries") ||
      itemName.includes("restaurant")
    ) {
      explanation = `This is classified as an Expense because it's a consumption cost where money leaves without returning equity. Try planning weekly bulk meal preps, setting an explicit budget cap before tracking checkout menus, or cutting down high restaurant markups to preserve structural cash balance velocity.`;
    } else {
      explanation = `This is classified as an Expense because it tracks immediate outflow and lifestyle consumption drain metrics. Tip: Review recurring components to see if they can be minimized or substituted for long term gains.`;
    }
  }

  if (targetInput) {
    const currentVal = parseFloat(targetInput.value) || 0;
    targetInput.value = (currentVal + amount).toFixed(2);
  }

  calculateAndCompare();

  resultDiv.style.backgroundColor = "rgba(255,255,255,0.03)";
  resultDiv.style.border = `1px solid ${color}`;

  const headDiv = document.createElement("div");
  headDiv.style.marginBottom = "0.3rem";
  headDiv.appendChild(document.createTextNode("Categorized as "));

  const badgeSpan = document.createElement("span");
  badgeSpan.style.color = color;
  badgeSpan.style.textTransform = "uppercase";
  badgeSpan.style.fontWeight = "900";
  badgeSpan.textContent = category;

  headDiv.appendChild(badgeSpan);
  headDiv.appendChild(
    document.createTextNode(
      `. Added ${formatter.format(amount)} to systems profile.`,
    ),
  );

  const bodyDiv = document.createElement("div");
  bodyDiv.style.fontSize = "0.8rem";
  bodyDiv.style.fontWeight = "normal";
  bodyDiv.style.color = "var(--text-secondary)";
  bodyDiv.style.lineHeight = "1.4";
  bodyDiv.textContent = explanation;

  resultDiv.appendChild(headDiv);
  resultDiv.appendChild(bodyDiv);

  itemEl.value = "";
  amountEl.value = "";
}

window.calculateAndCompare = function calculateAndCompare() {
  if (!ui.assets) ui = getUIElements();
  if (!ui.assets) return;

 const snapshot = getDashboardFinancialSnapshot();

 const assets = snapshot.assets;
 const liabilities = snapshot.liabilities;
 const income = snapshot.income;
 const expenses = snapshot.expenses;

  if (ui.sketchIncome) ui.sketchIncome.textContent = formatter.format(income);
  if (ui.sketchExpenses)
    ui.sketchExpenses.textContent = formatter.format(expenses);
  if (ui.sketchAssets) ui.sketchAssets.textContent = formatter.format(assets);
  if (ui.sketchLiabilities)
    ui.sketchLiabilities.textContent = formatter.format(liabilities);

  const totalBalanceSheet = assets + liabilities;
  const totalVerticalSum = income + expenses + totalBalanceSheet;

  const dashboardEl = document.getElementById("dashboardView");
  if (dashboardEl) {
    if (totalVerticalSum === 0) {
      dashboardEl.style.setProperty("--flex-income", "1");
      dashboardEl.style.setProperty("--flex-expenses", "1");
      dashboardEl.style.setProperty("--flex-split", "1");
    } else {
      const baseValue = totalVerticalSum * padFactor;
      dashboardEl.style.setProperty("--flex-income", `${income + baseValue}`);
      dashboardEl.style.setProperty(
        "--flex-expenses",
        `${expenses + baseValue}`,
      );
      dashboardEl.style.setProperty(
        "--flex-split",
        `${totalBalanceSheet + baseValue}`,
      );

      const horizontalBase = (totalBalanceSheet || 1) * (padFactor * 1.3);
      dashboardEl.style.setProperty(
        "--flex-assets",
        `${assets + horizontalBase}`,
      );
      dashboardEl.style.setProperty(
        "--flex-liabilities",
        `${liabilities + horizontalBase}`,
      );
    }
  }

  const grandTotal = assets + liabilities + income + expenses;
  if (grandTotal === 0) {
    if (ui.barAsset)
      ui.barAsset.style.width =
        ui.barIncome.style.width =
        ui.barExpense.style.width =
        ui.barLiability.style.width =
          "25%";
    if (ui.pctAsset)
      ui.pctAsset.textContent =
        ui.pctIncome.textContent =
        ui.pctExpense.textContent =
        ui.pctLiability.textContent =
          "0%";
  } else {
    const aP = (assets / grandTotal) * 100;
    const iP = (income / grandTotal) * 100;
    const eP = (expenses / grandTotal) * 100;
    const lP = (liabilities / grandTotal) * 100;

    if (ui.barAsset) ui.barAsset.style.width = `${aP}%`;
    if (ui.barIncome) ui.barIncome.style.width = `${iP}%`;
    if (ui.barExpense) ui.barExpense.style.width = `${eP}%`;
    if (ui.barLiability) ui.barLiability.style.width = `${lP}%`;

    if (ui.pctAsset) ui.pctAsset.textContent = `${aP.toFixed(1)}%`;
    if (ui.pctIncome) ui.pctIncome.textContent = `${iP.toFixed(1)}%`;
    if (ui.pctExpense) ui.pctExpense.textContent = `${eP.toFixed(1)}%`;
    if (ui.pctLiability) ui.pctLiability.textContent = `${lP.toFixed(1)}%`;
  }

  const netWorth = assets - liabilities;
  if (ui.nwDisplay) {
    ui.nwDisplay.textContent = formatter.format(netWorth);
    ui.nwDisplay.className = `value ${netWorth > 0 ? "good" : netWorth < 0 ? "bad" : ""}`;
  }
  if (ui.nwStatus) {
    ui.nwStatus.textContent =
      netWorth > 0 ? "Solvent" : netWorth < 0 ? "Insolvent" : "Breakeven";
    ui.nwStatus.className = `status ${netWorth > 0 ? "good" : netWorth < 0 ? "bad" : ""}`;
  }

  const netIncome = income - expenses;
  if (ui.niDisplay) {
    ui.niDisplay.textContent = formatter.format(netIncome);
    ui.niDisplay.className = `value ${netIncome > 0 ? "good" : netIncome < 0 ? "bad" : ""}`;
  }
  if (ui.niStatus) {
    ui.niStatus.textContent =
      netIncome > 0
        ? "Positive Flow"
        : netIncome < 0
          ? "Negative Flow"
          : "Breakeven";
    ui.niStatus.className = `status ${netIncome > 0 ? "good" : netIncome < 0 ? "bad" : ""}`;
  }

  if (ui.advisorPanel) {
    ui.advisorPanel.textContent = "";
    const adviceBlocks = generateWealthAdvice(snapshot);
    adviceBlocks.forEach((itemText) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "blueprint-item";
      itemDiv.textContent = itemText;
      ui.advisorPanel.appendChild(itemDiv);
    });
    if (adviceBlocks.length === 0) {
      ui.advisorPanel.textContent =
        "Enter numbers to isolate exactly which quadrant holds leverage logic runtime properties.";
    }
  }
};

function generateWealthAdvice(snapshot) {
  const {
    assets,
    liabilities,
    income,
    expenses,
    latestNetWorth,
    savings,
    incomeExpenseBalance,
    assetTrend,
    liabilityTrend,
  } = snapshot;

  if (assets === 0 && liabilities === 0 && income === 0 && expenses === 0) {
    return [
      "Your financial history is still empty. Save your first financial entry and I'll start tracking your progress.",
    ];
  }

  const logs = [];

  if (latestNetWorth < 0) {
    logs.push(
      "Your latest net worth is below zero. Reducing liabilities should be one of your main priorities.",
    );
  } else if (latestNetWorth > 0) {
    logs.push(
      "Your latest net worth is positive. Keep strengthening your assets while keeping your liabilities under control.",
    );
  }

  if (incomeExpenseBalance < 0) {
    logs.push(
      `Across your recorded history, you've spent more than you've earned. Reducing unnecessary expenses or increasing income should be your next focus.`,
    );
  } else if (incomeExpenseBalance > 0) {
    logs.push(
      `Across your recorded history, you've earned more than you've spent. Directing part of that surplus toward savings and productive assets can strengthen your position.`,
    );
  }

  if (assetTrend > 0) {
    logs.push(
      "Your recorded asset position is moving upward. Continue building assets that can support your long-term financial growth.",
    );
  } else if (assetTrend < 0) {
    logs.push(
      "Your recorded asset position has declined over time. Review what caused the reduction before committing more money elsewhere.",
    );
  }

  if (liabilityTrend < 0) {
    logs.push(
      "Your liabilities are moving downward, which is a positive sign. Keep that reduction going.",
    );
  } else if (liabilityTrend > 0) {
    logs.push(
      "Your liabilities have increased over your recorded history. Be careful about taking on additional debt.",
    );
  }

  if (savings > 0) {
    logs.push(
      "You have recorded savings activity. Keep building that reserve and connect it to your financial goals.",
    );
  }

  return logs;
}

function getHistory() {
  return safeGetLocalStorage("wealthDashboardHistory", []);
}

function getDashboardFinancialSnapshot() {
  const history = getHistory();

  if (!history.length) {
    return {
      assets: 0,
      liabilities: 0,
      income: 0,
      expenses: 0,
      latestNetWorth: 0,
      savings: 0,
      incomeExpenseBalance: 0,
      assetTrend: 0,
      liabilityTrend: 0,
    };
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const assetValues = sortedHistory.map((item) =>
    Number(item.calculatedAssets ?? item.assets ?? 0),
  );

  const liabilityValues = sortedHistory.map((item) =>
    Number(item.liabilities ?? 0),
  );

  const assets =
    assetValues.reduce((total, value) => total + value, 0) / assetValues.length;

  const liabilities =
    liabilityValues.reduce((total, value) => total + value, 0) /
    liabilityValues.length;

  const income = sortedHistory.reduce(
    (total, item) => total + Number(item.income || 0),
    0,
  );

  const expenses = sortedHistory.reduce(
    (total, item) => total + Number(item.expenses || 0),
    0,
  );

  const savings = sortedHistory.reduce(
    (total, item) => total + Number(item.saved || 0),
    0,
  );

  const latestEntry = sortedHistory[sortedHistory.length - 1];

  const latestNetWorth = Number(
    latestEntry?.netWorth ??
      Number(latestEntry?.calculatedAssets ?? latestEntry?.assets ?? 0) -
        Number(latestEntry?.liabilities ?? 0),
  );

  const firstAssets = assetValues[0] || 0;
  const lastAssets = assetValues[assetValues.length - 1] || 0;

  const firstLiabilities = liabilityValues[0] || 0;
  const lastLiabilities = liabilityValues[liabilityValues.length - 1] || 0;

  return {
    assets,
    liabilities,
    income,
    expenses,
    latestNetWorth,
    savings,
    incomeExpenseBalance: income - expenses,
    assetTrend: lastAssets - firstAssets,
    liabilityTrend: lastLiabilities - firstLiabilities,
  };
}

async function saveCurrentDay() {
  if (!ui.logDate) ui = getUIElements();
  const date = ui.logDate.value;

  let history = getHistory();
  const existIndex = history.findIndex((i) => i.date === date);
  if (existIndex !== -1) {
  const confirmed = await showConfirmMessage(
    "Entry already exists",
    `A financial entry for ${date} already exists. Do you want to overwrite it?`,
    "Yes, Overwrite",
  );

  if (!confirmed) {
    renderHistoryTable();
    return;
  }
}

  const currentTimeStr = new Date().toLocaleTimeString("en-US", {
    hour12: false,
  });
  const saved = parseFloat(ui.savedMoney?.value) || 0;
  const assets = parseFloat(ui.assets?.value) || 0;
  const liabilities = parseFloat(ui.liabilities?.value) || 0;

  const entry = {
    id: existIndex !== -1 ? history[existIndex].id : Date.now(),
    date: date,
    timestamp: currentTimeStr,
    assets: assets,
    saved: saved,
    liabilities: liabilities,
    income: parseFloat(ui.income?.value) || 0,
    expenses: parseFloat(ui.expenses?.value) || 0,
    netWorth: assets - liabilities,
  };

  if (existIndex !== -1) {
    history[existIndex] = entry;
  } else {
    history.push(entry);
  }

  history.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("wealthDashboardHistory", JSON.stringify(history));
  renderHistoryTable();

  ui.assets.value = "";
  ui.liabilities.value = "";
  ui.income.value = "";
  ui.expenses.value = "";
  ui.savedMoney.value = "";

 calculateAndCompare();
 calculateSuccessMetrics();

 showSiteMessage("Day saved successfully!", "success");
}

function editEntry(id) {
  const row = document.getElementById("row-" + id);
  if (!row) return;

  // If another row is being edited, cancel that first.
  const existingEdit = document.querySelector("tr.editing-row");
  if (existingEdit) {
    cancelEntryEdit(existingEdit.id.replace("row-", ""));
  }

  const entry = getHistory().find((item) => item.id === id);
  if (!entry) return;

  // Cells: 0=Timestamp, 1=Date, 2=Assets, 3=Liabilities, 4=Income, 5=Expenses, 6=Net Worth, 7=Action
  const dateCell = row.cells[1];
  const assetCell = row.cells[2];
  const savedCell = row.cells[3];
  const liaCell = row.cells[4];
  const incCell = row.cells[5];
  const expCell = row.cells[6];

  row.classList.add("editing-row");

  // Replace date cell with a date input
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = entry.date;
  dateInput.className = "inline-edit";
  dateInput.dataset.field = "date";
  dateCell.innerHTML = "";
  dateCell.appendChild(dateInput);

  // Replace numeric cells with number inputs
 const numericFields = [
   {
     cell: assetCell,
     value: entry.assets || 0,
     field: "assets",
   },
   {
     cell: savedCell,
     value: entry.saved || 0,
     field: "saved",
   },
   {
     cell: liaCell,
     value: entry.liabilities || 0,
     field: "liabilities",
   },
   {
     cell: incCell,
     value: entry.income || 0,
     field: "income",
   },
   {
     cell: expCell,
     value: entry.expenses || 0,
     field: "expenses",
   },
 ];

  numericFields.forEach((f) => {
    f.cell.innerHTML = "";
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.step = "0.01";
    input.value = f.value;
    input.className = "inline-edit";
    input.dataset.field = f.field;
    f.cell.appendChild(input);
  });

  // Replace action cell with Save / Cancel buttons
  const tAct = row.cells[8];
  tAct.innerHTML = "";

  const saveBtn = document.createElement("button");
  saveBtn.className = "btn-action edit-mode";
  saveBtn.textContent = "Save";
  saveBtn.onclick = function () {
    saveEntryEdit(id);
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.marginLeft = "4px";
  cancelBtn.onclick = function () {
    cancelEntryEdit(id);
  };

  tAct.appendChild(saveBtn);
  tAct.appendChild(cancelBtn);
}

function saveEntryEdit(id) {
  const row = document.getElementById("row-" + id);
  if (!row) return;

  let history = getHistory();
  const index = history.findIndex((item) => item.id === id);
  if (index === -1) return;

  const readInput = (field) => {
    const input = row.querySelector(`input[data-field="${field}"]`);
    return input ? parseFloat(input.value) || 0 : 0;
  };

  const dateInput = row.querySelector('input[data-field="date"]');

  if (!dateInput || !dateInput.value) {
    showSiteMessage("Please select a valid date.", "error");
    return;
  }

  const assets = readInput("assets");
  const saved = readInput("saved");
  const liabilities = readInput("liabilities");
  const income = readInput("income");
  const expenses = readInput("expenses");

  const updatedEntry = {
    id: history[index].id,
    date: dateInput.value,
    timestamp: history[index].timestamp,
    assets: assets,
    saved: saved,
    liabilities: liabilities,
    income: income,
    expenses: expenses,
    netWorth: assets - liabilities,
  };

  history[index] = updatedEntry;

  history.sort((a, b) => new Date(b.date) - new Date(a.date));

  localStorage.setItem("wealthDashboardHistory", JSON.stringify(history));

  renderHistoryTable();
  calculateAndCompare();
  calculateSuccessMetrics();

  showSiteMessage("History entry updated successfully!", "success");
}

window.renderHistoryTable = function renderHistoryTable() {
  if (!ui.historyBody) ui = getUIElements();
  if (!ui.historyBody) return;

  const history = getHistory();
  ui.historyBody.innerHTML = "";
  if (history.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.setAttribute("colspan", "9");
    td.style.textAlign = "center";
    td.style.color = "var(--text-secondary)";
    td.textContent = "No historical records logged yet.";
    tr.appendChild(td);
    ui.historyBody.appendChild(tr);
    return;
  }
  history.forEach((item) => {
    const r = document.createElement("tr");
    r.id = "row-" + item.id;

    const tTime = document.createElement("td");
    tTime.style.color = "var(--text-secondary)";
    tTime.style.fontSize = "0.8rem";
    tTime.textContent = item.timestamp || "N/A";

    const tDate = document.createElement("td");
    tDate.style.fontWeight = "bold";
    tDate.style.color = "#ffffff";
    tDate.textContent = item.date;

    const tAst = document.createElement("td");
    tAst.style.color = "var(--color-asset)";
    tAst.textContent = formatter.format(item.assets || 0);

    const tSaved = document.createElement("td");
    tSaved.style.color = "var(--color-income)";
    tSaved.textContent = formatter.format(item.saved || 0);

    const tLia = document.createElement("td");
    tLia.style.color = "var(--color-liability)";
    tLia.textContent = formatter.format(item.liabilities || 0);

    const tInc = document.createElement("td");
    tInc.style.color = "var(--color-income)";
    tInc.textContent = formatter.format(item.income);

    const tExp = document.createElement("td");
    tExp.style.color = "var(--color-expense)";
    tExp.textContent = formatter.format(item.expenses);

    const tNw = document.createElement("td");
    tNw.className = item.netWorth >= 0 ? "good" : "bad";
    tNw.style.fontWeight = "bold";
    tNw.textContent = formatter.format(item.netWorth);

    const tAct = document.createElement("td");
    const eBtn = document.createElement("button");
    eBtn.className = "btn-action edit-mode";
    eBtn.textContent = "Edit";
    eBtn.onclick = function () {
      editEntry(item.id);
    };

    const dBtn = document.createElement("button");
    dBtn.className = "btn-action";
    dBtn.textContent = "Delete";
    dBtn.style.marginLeft = "4px";
    dBtn.onclick = function () {
      deleteEntry(item.id);
    };

    tAct.appendChild(eBtn);
    tAct.appendChild(dBtn);

    r.appendChild(tTime);
    r.appendChild(tDate);
    r.appendChild(tAst);
    r.appendChild(tSaved);
    r.appendChild(tLia);
    r.appendChild(tInc);
    r.appendChild(tExp);
    r.appendChild(tNw);
    r.appendChild(tAct);

    ui.historyBody.appendChild(r);
  });
};

function saveSystemGoal() {
  const typeEl = document.getElementById("goalType");
  const periodEl = document.getElementById("goalPeriod");
  const amountEl = document.getElementById("goalAmount");

  if (!typeEl || !periodEl || !amountEl) return;

  const type = typeEl.value;
  const period = periodEl.value;
  const amount = parseFloat(amountEl.value);

  if (isNaN(amount) || amount <= 0) {
    showSiteMessage("Please enter a valid target amount.", "error");
    return;
  }

  const newGoal = {
    id: Date.now(),
    type,
    period,
    amount,
  };

  systemGoals.push(newGoal);

  localStorage.setItem("sys_goals", JSON.stringify(systemGoals));

  amountEl.value = "";

  calculateSuccessMetrics();

  showSiteMessage("Financial goal added successfully.", "success");
}

window.deleteGoal = async function deleteGoal(id) {
  const confirmed = await showConfirmMessage(
    "Remove this goal?",
    "This goal will be removed from your active financial goals.",
    "Yes, Remove Goal",
  );

  if (!confirmed) return;

  systemGoals = systemGoals.filter((goal) => goal.id !== id);

  localStorage.setItem("sys_goals", JSON.stringify(systemGoals));

  calculateSuccessMetrics();

  showSiteMessage("Goal removed successfully.", "success");
};



function getGoalPeriodHistory(history, period) {
  const now = new Date();

  return history.filter((item) => {
    if (!item.date) return false;

    const date = new Date(item.date + "T00:00:00");

    if (period === "week") {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;

      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(now.getDate() - diff);

      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      return date >= start && date < end;
    }

    if (period === "month") {
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    }

    if (period === "year") {
      return date.getFullYear() === now.getFullYear();
    }

    return true;
  });
}

window.calculateSuccessMetrics = function calculateSuccessMetrics() {
  if (!ui.assets) ui = getUIElements();
  const history = getHistory();

  const deltaValEl = document.getElementById("deltaValue");
  const deltaStatusEl = document.getElementById("deltaStatus");
  if (deltaValEl && deltaStatusEl) {
    if (history.length >= 2) {
      const currentDayNW = history[0].netWorth;
      const previousDayNW = history[1].netWorth;
      const netDelta = currentDayNW - previousDayNW;

      deltaValEl.textContent = formatter.format(netDelta);
      if (netDelta > 0) {
        deltaValEl.className = "value good";
        deltaStatusEl.textContent = `Gained ground compared to your previous entry on ${history[1].date}.`;
      } else if (netDelta < 0) {
        deltaValEl.className = "value bad";
        deltaStatusEl.textContent = `Loss tracked compared to your previous entry on ${history[1].date}.`;
      } else {
        deltaValEl.className = "value";
        deltaStatusEl.textContent = `Perfect performance equilibrium maintained since ${history[1].date}.`;
      }
    } else {
      deltaValEl.textContent = formatter.format(0);
      deltaValEl.className = "value";
      deltaStatusEl.textContent =
        "Log at least two individual dates inside your history grid to compute progress steps.";
    }
  }

  const saved = parseFloat(ui.savedMoney?.value) || 0;
  const assets = parseFloat(ui.assets?.value) || 0;
  const liabilities = parseFloat(ui.liabilities?.value) || 0;
  const income = parseFloat(ui.income?.value) || 0;
  const expenses = parseFloat(ui.expenses?.value) || 0;

  const latestEntry = history.length > 0 ? history[0] : null;

  const actualNetWorth = latestEntry
    ? Number(latestEntry.netWorth || 0)
    : assets - liabilities;

  const actualSavings = history.reduce(
    (total, entry) => total + Number(entry.saved || 0),
    0,
  );

  const actualExpenses = latestEntry
    ? Number(latestEntry.expenses || 0)
    : expenses;

  let score = 50;
  if (assets > liabilities) score += 15;
  else if (assets < liabilities) score -= 15;
  if (income > expenses) score += 15;
  else if (income < expenses) score -= 15;
  if (saved > 0) score += 10;
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  const scoreValEl = document.getElementById("scoreValue");
  const statusEl = document.getElementById("scoreStatus");
  if (scoreValEl) scoreValEl.textContent = `${score} / 100`;
  if (statusEl) {
    if (score >= 75) {
      statusEl.textContent = "Excellent Health Profile Stability";
      statusEl.className = "status good";
    } else if (score >= 45) {
      statusEl.textContent = "Standard Operational Baseline Standing";
      statusEl.className = "status";
    } else {
      statusEl.textContent = "Vulnerable Leverage Exposure Detected";
      statusEl.className = "status bad";
    }
  }

  const container = document.getElementById("activeGoalsDisplay");
  if (!container) return;
  container.innerHTML = "";

  if (systemGoals.length === 0) {
    container.textContent = "No targets configured yet. Set one above!";
    container.style.fontSize = "0.85rem";
    container.style.color = "var(--text-secondary)";
    container.style.textAlign = "center";
    return;
  }

  systemGoals.forEach((goal) => {
    const periodHistory = getGoalPeriodHistory(history, goal.period || "month");

    let currentActual = 0;
    let titleLabel = "";

    if (goal.type === "netWorth") {
      titleLabel = "Net Worth Goal";

      if (periodHistory.length > 0) {
        const latest = [...periodHistory].sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        )[0];

        currentActual = Number(latest.netWorth) || 0;
      }
    }

    if (goal.type === "savings") {
      titleLabel = "Money Saved Goal";

      currentActual = periodHistory.reduce(
        (total, item) => total + (Number(item.saved) || 0),
        0,
      );
    }

    if (goal.type === "expenses") {
      titleLabel = "Expense Reduction Goal";

      currentActual = periodHistory.reduce(
        (total, item) => total + (Number(item.expenses) || 0),
        0,
      );
    }

    const periodLabel =
      goal.period === "week"
        ? "This Week"
        : goal.period === "year"
          ? "This Year"
          : "This Month";

    let pct = 0;

    if (goal.type === "expenses") {
      pct =
        goal.amount > 0
          ? Math.max(
              0,
              Math.min(
                100,
                ((goal.amount - currentActual) / goal.amount) * 100,
              ),
            )
          : 0;
    } else {
      pct =
        goal.amount > 0
          ? Math.min(100, Math.max(0, (currentActual / goal.amount) * 100))
          : 0;
    }

    const card = document.createElement("div");

    card.style.backgroundColor = "rgba(0,0,0,0.2)";
    card.style.padding = "0.6rem";
    card.style.borderRadius = "6px";
    card.style.border = "1px solid var(--border-color)";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "0.25rem";

    const rowWrap = document.createElement("div");

    rowWrap.style.display = "flex";
    rowWrap.style.justifyContent = "space-between";
    rowWrap.style.alignItems = "center";
    rowWrap.style.fontSize = "0.85rem";
    rowWrap.style.fontWeight = "bold";

    const tSpan = document.createElement("span");

    tSpan.textContent =
      `${titleLabel} — ${periodLabel}: ` + formatter.format(goal.amount);

    const rBtn = document.createElement("button");

    rBtn.className = "btn-action";
    rBtn.textContent = "Remove";

    rBtn.onclick = function () {
      deleteGoal(goal.id);
    };

    rowWrap.appendChild(tSpan);
    rowWrap.appendChild(rBtn);

    const labelSub = document.createElement("div");

    labelSub.style.fontSize = "0.75rem";
    labelSub.style.color = "var(--text-secondary)";

    if (goal.type === "expenses") {
      labelSub.textContent =
        `Expenses: ${formatter.format(currentActual)} ` +
        `of ${formatter.format(goal.amount)} ` +
        `(${pct.toFixed(1)}% within target)`;
    } else {
      labelSub.textContent =
        `Current: ${formatter.format(currentActual)} ` +
        `of ${formatter.format(goal.amount)} ` +
        `(${pct.toFixed(1)}% complete)`;
    }

    const barBg = document.createElement("div");

    barBg.style.width = "100%";
    barBg.style.height = "6px";
    barBg.style.background = "rgba(255,255,255,0.05)";
    barBg.style.borderRadius = "3px";
    barBg.style.overflow = "hidden";

    const barFill = document.createElement("div");

    barFill.style.width = pct + "%";
    barFill.style.height = "100%";

    if (goal.type === "expenses") {
      barFill.style.background =
        pct >= 100 ? "var(--color-income)" : "var(--color-liability)";
    } else {
      barFill.style.background =
        pct >= 100 ? "var(--color-asset)" : "var(--color-income)";
    }

    barFill.style.transition = "width 0.4s";

    barBg.appendChild(barFill);

    card.appendChild(rowWrap);
    card.appendChild(labelSub);
    card.appendChild(barBg);

    container.appendChild(card);
  });
};

let calcExpression = "";

function pressNum(num) {
  const screen = document.getElementById("calcScreen");
  if (!screen) return;
  if ((screen.textContent === "0" && num !== ".") || calcClearOnNextInput) {
    calcExpression = "";
    calcClearOnNextInput = false;
  }
  if (
    num === "." &&
    calcExpression
      .split(/[\+\-\*\/]/)
      .pop()
      .includes(".")
  )
    return;
  calcExpression += num;
  screen.textContent = calcExpression;
}

function pressOp(op) {
  const screen = document.getElementById("calcScreen");
  calcClearOnNextInput = false;
  if (!calcExpression) {
    if (op === "-") calcExpression = "-";
    return;
  }
  const lastChar = calcExpression.trim().slice(-1);
  if (["+", "-", "*", "/"].includes(lastChar)) {
    calcExpression = calcExpression.trim().slice(0, -1) + op;
  } else {
    calcExpression += op;
  }
  if (screen) screen.textContent = calcExpression;
}

function clearCalc() {
  calcExpression = "";
  const screen = document.getElementById("calcScreen");
  if (screen) screen.textContent = "0";
  calcClearOnNextInput = false;
}

function runCalc() {
  const screen = document.getElementById("calcScreen");
  if (!screen) return;
  try {
    const sanitized = calcExpression.replace(/[^0-9\+\-\*\/\.]/g, "");
    if (!sanitized) return;

    const computed = Function(`"use strict"; return (${sanitized})`)();
    if (computed === Infinity || isNaN(computed)) {
      screen.textContent = "Error";
      calcExpression = "";
    } else {
      screen.textContent = Number(computed.toFixed(4));
      calcExpression = computed.toString();
    }
  } catch (e) {
    screen.textContent = "Error";
    calcExpression = "";
  }
  calcClearOnNextInput = true;
}

async function triggerSystemFactoryReset() {
  const confirmed = await showConfirmMessage(
    "Confirm factory reset",
    "This will permanently remove your saved financial data, goals, vocabulary, and preferences from this device.",
    "Yes, Reset Everything",
  );

  if (!confirmed) return;

  localStorage.removeItem("wealthDashboardHistory");
  localStorage.removeItem("sys_goals");
  localStorage.removeItem("sys_vocabulary");
  localStorage.removeItem("sys_preferences");

  showSiteMessage("Your CediFlow data has been reset successfully.", "success");

  setTimeout(() => {
    location.reload();
  }, 1200);
}


// ==========================================
// EXPORT FUNCTION (Cross-Environment)
// ==========================================
async function exportSystemData() {
  const exportData = {
    sys_vocabulary: safeGetLocalStorage("sys_vocabulary", defaultVocabulary),
    sys_preferences: safeGetLocalStorage("sys_preferences", defaultPreferences),
    sys_goals: safeGetLocalStorage("sys_goals", []),
    wealthDashboardHistory: safeGetLocalStorage("wealthDashboardHistory", []),
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const fileName = `financial_dashboard_backup_${new Date().toISOString().split("T")[0]}.json`;

  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: "JSON Backup File",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(jsonString);
      await writable.close();
      showSiteMessage("Export completed successfully.", "success");
      return;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.warn("File picker skipped/failed, using fallback:", err);
      } else {
        return;
      }
    }
  }

  try {
    const blob = new Blob([jsonString], {
      type: "application/json;charset=utf-8",
    });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = fileName;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    setTimeout(() => URL.revokeObjectURL(downloadAnchor.href), 1000);
    showSiteMessage("Export completed successfully.", "success");
  } catch (fallbackErr) {
    console.error("Export fallback failed:", fallbackErr);
    showSiteMessage(
      "Export failed. Please check your browser permissions.",
      "error",
    );
  }
}

// ==========================================
// PATCHED IMPORT FUNCTION (Mobile Android Fix)
// ==========================================
function importSystemData(event) {
  if (!event || !event.target || !event.target.files) {
    let oldInput = document.getElementById("hiddenImportInput");
    if (oldInput) oldInput.remove();

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "hiddenImportInput";
    fileInput.accept = ".json,application/json";
    fileInput.style.display = "none";

    fileInput.onchange = function (e) {
      importSystemData(e);
      fileInput.remove();
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    return;
  }

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);

      if (imported.sys_vocabulary)
        localStorage.setItem(
          "sys_vocabulary",
          JSON.stringify(imported.sys_vocabulary),
        );
      if (imported.sys_preferences)
        localStorage.setItem(
          "sys_preferences",
          JSON.stringify(imported.sys_preferences),
        );
      if (imported.sys_goals)
        localStorage.setItem("sys_goals", JSON.stringify(imported.sys_goals));
      if (imported.wealthDashboardHistory)
        localStorage.setItem(
          "wealthDashboardHistory",
          JSON.stringify(imported.wealthDashboardHistory),
        );

      if (
        !imported.sys_vocabulary &&
        !imported.sys_preferences &&
        !imported.wealthDashboardHistory
      ) {
        for (const key in imported) {
          if (typeof imported[key] === "object") {
            localStorage.setItem(key, JSON.stringify(imported[key]));
          } else {
            localStorage.setItem(key, imported[key]);
          }
        }
      }

      showSiteMessage(
        "Data imported successfully. The page will now reload.",
        "success",
      );
      location.reload();
    } catch (err) {
      showSiteMessage(
        "Failed to parse the import file. Make sure it is a valid JSON backup.",
        "error",
      );
      console.error(err);
    }
  };
  reader.readAsText(file);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

(function addMultiDayComparison() {
  function setupMultiDay() {
    const successGrid = document.querySelector(
      "#successView .success-metrics-grid",
    );
    if (!successGrid) return;

    if (document.getElementById("multiDayComparisonCard")) return;

    const multiDayCard = document.createElement("div");
    multiDayCard.className = "result-card";
    multiDayCard.id = "multiDayComparisonCard";

    multiDayCard.innerHTML = `
            <h3 style="color:var(--text-secondary); font-size:0.85rem;">7-Day Rolling Financial Shift</h3>
            <div class="value" id="multiDayDeltaValue">GH₵0.00</div>
            <div class="status" id="multiDayDeltaStatus">Awaiting historical depth for a 7-day span.</div>
        `;

    successGrid.appendChild(multiDayCard);
    updateMultiDayMetrics();
  }

  function updateMultiDayMetrics() {
    const historyData = safeGetLocalStorage("wealthDashboardHistory", []);
    const valEl = document.getElementById("multiDayDeltaValue");
    const statusEl = document.getElementById("multiDayDeltaStatus");

    if (!valEl || !statusEl) return;

    const targetIndex = historyData.length >= 8 ? 7 : historyData.length - 1;

    if (historyData.length >= 2 && targetIndex > 0) {
      const currentNW = historyData[0].netWorth;
      const pastNW = historyData[targetIndex].netWorth;
      const pastDate = historyData[targetIndex].date;

      const multiDayDelta = currentNW - pastNW;
      const currentCurrency =
        safeGetLocalStorage("sys_preferences", defaultPreferences).currency ||
        "GHS";

      const currencyConfig = {
        GHS: { locale: "en-GH", code: "GHS", symbol: "GH₵" },
        USD: { locale: "en-US", code: "USD", symbol: "$" },
        EUR: { locale: "de-DE", code: "EUR", symbol: "€" },
        GBP: { locale: "en-GB", code: "GBP", symbol: "£" },
      };
      const config = currencyConfig[currentCurrency] || currencyConfig["GHS"];

      const activeFormatter = {
        format: function (val) {
          const num = Number(val) || 0;
          const standardFormatted = new Intl.NumberFormat(config.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(num);

          if (config.code === "GHS") {
            return `GH₵${standardFormatted}`;
          }
          return new Intl.NumberFormat(config.locale, {
            style: "currency",
            currency: config.code,
          }).format(num);
        },
      };

      valEl.textContent = activeFormatter.format(multiDayDelta);

      if (multiDayDelta > 0) {
        valEl.className = "value good";
        statusEl.textContent = `Net growth achieved compared to your record from ${pastDate}.`;
      } else if (multiDayDelta < 0) {
        valEl.className = "value bad";
        statusEl.textContent = `Net drawdown tracked compared to your record from ${pastDate}.`;
      } else {
        valEl.className = "value";
        statusEl.textContent = `Net position remained flat since ${pastDate}.`;
      }
    } else {
      valEl.textContent = "GH₵0.00";
      valEl.className = "value";
      statusEl.textContent =
        "Log entries across multiple different dates to calculate multi-day trends.";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupMultiDay);
  } else {
    setupMultiDay();
  }

  document.addEventListener("click", function (e) {
    if (e.target.matches(".nav-tab")) {
      setTimeout(updateMultiDayMetrics, 100);
    }
  });
})();
