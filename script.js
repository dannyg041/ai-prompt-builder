// DOM Elements
const form = document.getElementById("promptForm");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");
const clearSavedBtn = document.getElementById("clearSavedBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const templateSelect = document.getElementById("template");
const result = document.getElementById("result");
const copyMessage = document.getElementById("copyMessage");
const savedPromptsContainer = document.getElementById("savedPrompts");

// Form field elements
const roleInput = document.getElementById("role");
const goalInput = document.getElementById("goal");
const audienceInput = document.getElementById("audience");
const toneSelect = document.getElementById("tone");
const outputInput = document.getElementById("output");
const constraintsInput = document.getElementById("constraints");

// Storage keys
const STORAGE_KEYS = {
  DARK_MODE: "ai-prompt-builder-dark-mode",
  SAVED_PROMPTS: "ai-prompt-builder-saved-prompts"
};

// Prompt templates
const templates = {
  marketing: {
    role: "senior marketing strategist with expertise in digital campaigns",
    goal: "Create a compelling marketing campaign strategy for a product launch",
    audience: "Marketing team and stakeholders",
    tone: "Professional",
    output: "Structured campaign plan with bullet points",
    constraints: "Focus on digital channels, include timeline"
  },
  coding: {
    role: "expert software developer and code reviewer",
    goal: "Help me write clean, efficient, and well-documented code",
    audience: "Development team",
    tone: "Direct",
    output: "Code with comments and explanations",
    constraints: "Follow best practices, include error handling"
  },
  teaching: {
    role: "experienced educator who excels at explaining complex topics simply",
    goal: "Explain a concept in a clear, step-by-step manner",
    audience: "Students or beginners learning this topic",
    tone: "Friendly",
    output: "Step-by-step explanation with examples",
    constraints: "Use simple language, include analogies"
  },
  writing: {
    role: "creative writer with a knack for engaging storytelling",
    goal: "Help craft compelling and original written content",
    audience: "General readers",
    tone: "Creative",
    output: "Prose or narrative text",
    constraints: "Be original, maintain consistent voice"
  },
  analysis: {
    role: "data analyst skilled in interpreting complex information",
    goal: "Analyze data and provide actionable insights",
    audience: "Business stakeholders and decision makers",
    tone: "Professional",
    output: "Analysis report with key findings",
    constraints: "Include data-driven recommendations, be concise"
  }
};

// Current generated prompt
let currentPrompt = "";

// Initialize app
function init() {
  loadDarkModePreference();
  loadSavedPrompts();
  setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
  form.addEventListener("submit", handleGenerate);
  clearBtn.addEventListener("click", handleClear);
  copyBtn.addEventListener("click", handleCopy);
  saveBtn.addEventListener("click", handleSave);
  clearSavedBtn.addEventListener("click", handleClearAllSaved);
  darkModeBtn.addEventListener("click", toggleDarkMode);
  templateSelect.addEventListener("change", handleTemplateChange);

  // Clear error styling on input
  [roleInput, goalInput].forEach(input => {
    input.addEventListener("input", () => {
      input.classList.remove("error");
    });
  });
}

// Generate prompt
function handleGenerate(e) {
  e.preventDefault();

  const role = roleInput.value.trim();
  const goal = goalInput.value.trim();
  const audience = audienceInput.value.trim();
  const tone = toneSelect.value;
  const output = outputInput.value.trim();
  const constraints = constraintsInput.value.trim();

  // Clear previous errors
  roleInput.classList.remove("error");
  goalInput.classList.remove("error");
  clearCopyMessage();

  // Validate required fields
  let hasError = false;
  if (!role) {
    roleInput.classList.add("error");
    hasError = true;
  }
  if (!goal) {
    goalInput.classList.add("error");
    hasError = true;
  }

  if (hasError) {
    result.textContent = "Please fill in the required fields (AI Role and Goal).";
    copyBtn.disabled = true;
    saveBtn.disabled = true;
    currentPrompt = "";
    return;
  }

  // Build prompt
  let prompt = `You are an expert ${role}.

Your task:
${goal}`;

  if (audience) {
    prompt += `

Target audience:
${audience}`;
  }

  prompt += `

Tone:
${tone}`;

  if (output) {
    prompt += `

Output format:
${output}`;
  }

  if (constraints) {
    prompt += `

Constraints:
${constraints}`;
  }

  prompt += `

Respond clearly and concisely.`;

  currentPrompt = prompt;
  result.textContent = prompt;
  copyBtn.disabled = false;
  saveBtn.disabled = false;
}

// Clear form
function handleClear() {
  form.reset();
  templateSelect.value = "";
  result.textContent = "";
  currentPrompt = "";
  copyBtn.disabled = true;
  saveBtn.disabled = true;
  clearCopyMessage();

  // Clear error states
  roleInput.classList.remove("error");
  goalInput.classList.remove("error");
}

// Copy to clipboard
async function handleCopy() {
  if (!currentPrompt) return;

  try {
    await navigator.clipboard.writeText(currentPrompt);
    showCopyMessage("Copied to clipboard!", "success");
  } catch (err) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = currentPrompt;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showCopyMessage("Copied to clipboard!", "success");
    } catch (fallbackErr) {
      showCopyMessage("Failed to copy. Please select and copy manually.", "error");
    }
  }
}

// Show copy message
function showCopyMessage(message, type) {
  copyMessage.textContent = message;
  copyMessage.className = `copy-message ${type}`;

  setTimeout(() => {
    clearCopyMessage();
  }, 3000);
}

// Clear copy message
function clearCopyMessage() {
  copyMessage.textContent = "";
  copyMessage.className = "copy-message";
}

// Template handling
function handleTemplateChange() {
  const selectedTemplate = templateSelect.value;

  if (!selectedTemplate || !templates[selectedTemplate]) {
    return;
  }

  const template = templates[selectedTemplate];
  roleInput.value = template.role;
  goalInput.value = template.goal;
  audienceInput.value = template.audience;
  toneSelect.value = template.tone;
  outputInput.value = template.output;
  constraintsInput.value = template.constraints;

  // Clear any error states
  roleInput.classList.remove("error");
  goalInput.classList.remove("error");
}

// Dark mode
function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, newTheme);
}

function loadDarkModePreference() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.DARK_MODE);

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

// Saved prompts
function handleSave() {
  if (!currentPrompt) return;

  const savedPrompts = getSavedPrompts();
  const role = roleInput.value.trim();
  const timestamp = Date.now();

  const newPrompt = {
    id: timestamp,
    title: role || "Untitled Prompt",
    prompt: currentPrompt,
    formData: {
      role: roleInput.value,
      goal: goalInput.value,
      audience: audienceInput.value,
      tone: toneSelect.value,
      output: outputInput.value,
      constraints: constraintsInput.value
    },
    createdAt: new Date().toISOString()
  };

  savedPrompts.unshift(newPrompt);

  // Limit to 20 saved prompts
  if (savedPrompts.length > 20) {
    savedPrompts.pop();
  }

  localStorage.setItem(STORAGE_KEYS.SAVED_PROMPTS, JSON.stringify(savedPrompts));
  renderSavedPrompts(savedPrompts);
  showCopyMessage("Prompt saved!", "success");
}

function getSavedPrompts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_PROMPTS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function loadSavedPrompts() {
  const savedPrompts = getSavedPrompts();
  renderSavedPrompts(savedPrompts);
}

function renderSavedPrompts(prompts) {
  if (!prompts || prompts.length === 0) {
    savedPromptsContainer.innerHTML = '<p class="empty-state">No saved prompts yet. Generate a prompt and click "Save Current Prompt" to save it.</p>';
    clearSavedBtn.style.display = "none";
    return;
  }

  clearSavedBtn.style.display = "block";
  savedPromptsContainer.innerHTML = prompts.map(prompt => `
    <div class="saved-prompt-item" data-id="${prompt.id}">
      <div class="saved-prompt-content">
        <div class="saved-prompt-title">${escapeHtml(prompt.title)}</div>
        <div class="saved-prompt-preview">${escapeHtml(prompt.prompt.substring(0, 80))}...</div>
      </div>
      <div class="saved-prompt-actions">
        <button class="load-btn" onclick="loadPrompt(${prompt.id})">Load</button>
        <button class="delete-btn" onclick="deletePrompt(${prompt.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Global functions for onclick handlers
window.loadPrompt = function(id) {
  const savedPrompts = getSavedPrompts();
  const prompt = savedPrompts.find(p => p.id === id);

  if (!prompt || !prompt.formData) return;

  const { formData } = prompt;
  roleInput.value = formData.role || "";
  goalInput.value = formData.goal || "";
  audienceInput.value = formData.audience || "";
  toneSelect.value = formData.tone || "Professional";
  outputInput.value = formData.output || "";
  constraintsInput.value = formData.constraints || "";

  // Clear template selection
  templateSelect.value = "";

  // Clear error states
  roleInput.classList.remove("error");
  goalInput.classList.remove("error");

  // Trigger generate
  form.dispatchEvent(new Event("submit"));

  // Scroll to result
  result.scrollIntoView({ behavior: "smooth", block: "center" });
};

window.deletePrompt = function(id) {
  const savedPrompts = getSavedPrompts();
  const filtered = savedPrompts.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.SAVED_PROMPTS, JSON.stringify(filtered));
  renderSavedPrompts(filtered);
};

function handleClearAllSaved() {
  if (confirm("Are you sure you want to delete all saved prompts?")) {
    localStorage.removeItem(STORAGE_KEYS.SAVED_PROMPTS);
    renderSavedPrompts([]);
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
