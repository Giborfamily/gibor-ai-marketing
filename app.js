// Tabs
const tabs = document.querySelectorAll('.tab');
const views = {
  today: document.getElementById('view-today'),
  library: document.getElementById('view-library'),
  settings: document.getElementById('view-settings'),
};

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    Object.keys(views).forEach((key) => {
      views[key].style.display = tab.dataset.tab === key ? 'block' : 'none';
    });
  });
});

// Save current date
document.getElementById('dateBadge').innerText = new Date().toDateString();

// Load saved brand info
window.addEventListener('DOMContentLoaded', () => {
  const keys = ['brand', 'location', 'email', 'phone', 'offer', 'hash'];
  keys.forEach((key) => {
    const input = document.getElementById(key);
    if (input) input.value = localStorage.getItem(key) || input.value;
  });
  loadSavedPrompts();
});

// Save brand settings
document.getElementById('saveBrand').addEventListener('click', () => {
  ['brand', 'location', 'email', 'phone', 'offer', 'hash'].forEach((key) => {
    const val = document.getElementById(key).value;
    localStorage.setItem(key, val);
  });
  alert('Brand info saved!');
});

// Reset app
document.getElementById('resetAll').addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

// Generate button
document.getElementById('gen').addEventListener('click', () => {
  const category = document.getElementById('category').value;
  const tone = document.getElementById('tone').value;

  const content = generatePrompt(category, tone);
  Object.entries(content).forEach(([key, val]) => {
    const el = document.getElementById(key);
    if (el) el.value = val;
  });
});

// Copy buttons
document.querySelectorAll('.copy').forEach((btn) => {
  btn.addEventListener('click', () => {
    const src = btn.dataset.src;
    const el = document.getElementById(src);
    el.select();
    document.execCommand('copy');
    btn.innerText = 'Copied!';
    setTimeout(() => (btn.innerText = 'Copy ' + src.charAt(0).toUpperCase() + src.slice(1)), 1000);
  });
});

// Save to library
document.getElementById('save').addEventListener('click', () => {
  const entry = {
    date: new Date().toDateString(),
    hook: document.getElementById('hook').value,
    ig: document.getElementById('ig').value,
    wa: document.getElementById('wa').value,
    subject: document.getElementById('subject').value,
    quote: document.getElementById('quote').value,
    image: document.getElementById('image').value,
  };

  const saved = JSON.parse(localStorage.getItem('gibor_prompts') || '[]');
  saved.push(entry);
  localStorage.setItem('gibor_prompts', JSON.stringify(saved));
  alert('Saved to Library!');
  loadSavedPrompts();
});

// Load saved prompts
function loadSavedPrompts() {
  const list = document.getElementById('list');
  list.innerHTML = '';
  const saved = JSON.parse(localStorage.getItem('gibor_prompts') || '[]');
  saved.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<div class="sub">${item.date}</div><p>${item.hook}</p>`;
    list.appendChild(div);
  });
}

// Dummy AI generator
function generatePrompt(category, tone) {
  const base = `${tone.toUpperCase()} / ${category.toUpperCase()} — This is a placeholder until you integrate GPT`;
  return {
    hook: `🔥 ${base} Hook`,
    ig: `${base} Instagram caption with value and CTA.`,
    wa: `👋 ${base} WhatsApp Message`,
    subject: `Don't Miss This: ${base}`,
    quote: `“${base}”`,
    image: `AI image prompt: ${base} imagery, high contrast, clean layout`,
  };
}
