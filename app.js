/* ==============================
   GIBOR AI Marketing Prompter
   app.js  (drop-in)
   ============================== */

// ------- tiny helpers -------
const $ = (id) => document.getElementById(id);
const todayBadge = $("dateBadge");
$("year").textContent = new Date().getFullYear();
function setToday() {
  const d = new Date();
  todayBadge.textContent = d.toLocaleDateString();
}
setToday();
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ------- brand state (loaded/saved in Settings) -------
const BRAND_DEFAULTS = {
  brand: "Gibor Martial Arts",
  location: "Flatbush, Brooklyn",
  email: "info@begibor.com",
  phone: "(718) 555‑0123",
  offer: "Free Trial Class + $25 Uniform Credit",
  hash: "#BeTheGibor #TrainWithDiscipline #BrooklynKids"
};
function getBrand() {
  return JSON.parse(localStorage.getItem("gibor_brand") || "null") || BRAND_DEFAULTS;
}
function setBrand(b) {
  localStorage.setItem("gibor_brand", JSON.stringify(b));
}

// ------- content pools -------
const HOOKS = [
  "Respect isn’t taught. It’s trained.",
  "Small reps. Big results.",
  "Discipline today, confidence tomorrow.",
  "Show up. The rest follows.",
  "The mat builds more than muscles.",
  "Confidence comes from doing the hard thing.",
  "Habits make champions.",
];

const IG_TEMPLATES = [
  (B,H,L,O)=>`Every rep builds the warrior within. Start your journey at ${B}. ${H}`,
  (B,H,L,O)=>`${L}—we’re building strength, focus, and character. ${O ? O + ". " : ""}${H}`,
  (B,H,L,O)=>`New week. New skill. New you. Grab your free trial. ${H}`,
  (B,H,L,O)=>`Parents: confidence grows when kids face challenges in a safe, structured way. Book a free trial. ${H}`,
  (B,H,L,O)=>`Champions are made from habits. One class at a time. ${H}`,
];

const WA_TEMPLATES = [
  ()=>"Quick reminder: show up for yourself today. One class. One decision. 👊",
  ()=>"Your kid’s confidence grows on the mat. Free trial this week—reply YES to claim.",
  ()=>"Today’s focus: discipline over mood. See you in class?",
  ()=>"Small step today → big win tomorrow. Want the free trial link?",
];

const QUOTES = [
  "“Discipline over mood. Show up.”",
  "“Train like a warrior. Live like a champion.”",
  "“The fight starts within.”",
  "“Be the Gibor. Be the unbreakable.”",
  "“Master mind, master might.”",
];

const IMAGE_PROMPTS = [
  "High‑contrast action shot of a young student practicing kickboxing; dynamic side lighting; clean gym; black/red brand palette; confident expression.",
  "Coach kneeling to guide a child’s stance; shallow depth of field; warm, inspirational tone; subtle grain; copy space for caption.",
  "Row of gloves and belts; dramatic top light; minimalist composition; bold negative space.",
  "Teen mid‑combo on heavy bag; slight motion blur; cinematic framing; gritty resilience mood.",
];

const CATEGORY_LINES = {
  parents:  "Parents",
  teens:    "Teens",
  adults:   "Adults",
  gear:     "Students & families",
  character:"Gibor students",
  trial:    "New students",
  holiday:  "Community"
};

const TONE_WORD = {
  bold: "bold",
  warm: "warm",
  coach: "coach’s"
};

// seasonal/holiday flavor (light touch)
function seasonalSnippet(d = new Date()) {
  const m = d.getMonth() + 1;  // 1–12
  const dd = d.getDate();
  if ((m === 8 && dd >= 10) || (m === 9 && dd <= 30)) {
    return "🎒 Back‑to‑School: routines, respect, and confidence. Perfect time to start.";
  }
  if (m === 1 && dd <= 15) {
    return "🎯 New Year mindset: small habits, big change. First class = first win.";
  }
  if (m === 12) {
    return "🕎 Light over limits: small sparks become lasting strength.";
  }
  return "";
}

// ------- generator -------
function generateContent({ category, tone }) {
  const brand = getBrand();
  const who = CATEGORY_LINES[category] || "Community";
  const tword = TONE_WORD[tone] || "bold";
  const hook = pick(HOOKS);

  const ig = pick(IG_TEMPLATES)(brand.brand, brand.hash, brand.location, brand.offer);
  const wa = pick(WA_TEMPLATES)();
  const quote = pick(QUOTES);
  const image = pick(IMAGE_PROMPTS);
  const season = seasonalSnippet();

  const subject = `GIBOR: Today’s ${who} focus • ${tone.toUpperCase()}`;
  const hookLine = `🔥 Train with ${tword} intent. ${who}—today is your rep. ${season ? "\n" + season : ""}\n${hook}`;

  return { hook: hookLine, ig, wa, subject, quote, image };
}

function populateOutputs(pkg) {
  $("hook").value = pkg.hook;
  $("ig").value = pkg.ig;
  $("wa").value = pkg.wa;
  $("subject").value = pkg.subject;
  $("quote").value = pkg.quote;
  $("image").value = pkg.image;
  setToday();
}

// ------- events: Generate / Reshuffle -------
$("gen").addEventListener("click", () => {
  const category = $("category").value;
  const tone = $("tone").value;
  const pkg = generateContent({ category, tone });
  populateOutputs(pkg);
});

const reshuffleBtn = $("reshuffle");
if (reshuffleBtn) {
  reshuffleBtn.addEventListener("click", () => {
    // keep same selections, new randoms
    const category = $("category").value;
    const tone = $("tone").value;
    const pkg = generateContent({ category, tone });
    populateOutputs(pkg);
  });
}

// ------- copy buttons -------
document.querySelectorAll(".copy").forEach(btn => {
  btn.addEventListener("click", () => {
    const srcId = btn.getAttribute("data-src");
    const el = $(srcId);
    const txt = (el && (el.value ?? el.innerText)) || "";
    navigator.clipboard.writeText(txt).then(() => {
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = original), 900);
    });
  });
});

// ------- Library (localStorage) -------
function loadLibrary() {
  return JSON.parse(localStorage.getItem("gibor_library") || "[]");
}
function saveLibrary(list) {
  localStorage.setItem("gibor_library", JSON.stringify(list));
}
function renderLibrary() {
  const container = $("list");
  const items = loadLibrary();
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = `<div class="small">No saved prompts yet.</div>`;
    return;
  }
  items.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="sub">${item.date}</div>
      <div class="label">Hook</div>
      <div class="small" style="white-space:pre-wrap">${item.hook}</div>
      <hr/>
      <div class="label">Instagram</div>
      <div class="small" style="white-space:pre-wrap">${item.ig}</div>
      <hr/>
      <div class="label">WhatsApp</div>
      <div class="small" style="white-space:pre-wrap">${item.wa}</div>
      <div class="row" style="margin-top:10px; gap:8px">
        <button class="btn" data-del="${i}">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
  container.querySelectorAll("[data-del]").forEach(b => {
    b.addEventListener("click", () => {
      const idx = parseInt(b.getAttribute("data-del"), 10);
      const arr = loadLibrary();
      arr.splice(idx, 1);
      saveLibrary(arr);
      renderLibrary();
    });
  });
}

$("save").addEventListener("click", () => {
  const item = {
    date: $("dateBadge").textContent || new Date().toLocaleDateString(),
    hook: $("hook").value.trim(),
    ig: $("ig").value.trim(),
    wa: $("wa").value.trim(),
    subject: $("subject").value.trim(),
    quote: $("quote").value.trim(),
    image: $("image").value.trim()
  };
  if (!item.ig) { alert("Click Generate first."); return; }
  const list = loadLibrary();
  list.unshift(item);
  saveLibrary(list);
  alert("Saved to Library.");
});

// ------- tabs -------
const views = {
  today: document.getElementById("view-today"),
  library: document.getElementById("view-library"),
  settings: document.getElementById("view-settings")
};
function show(tab) {
  Object.keys(views).forEach(k => (views[k].style.display = k === tab ? "block" : "none"));
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.toggle("active", t.getAttribute("data-tab") === tab);
  });
  if (tab === "library") renderLibrary();
}
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => show(btn.getAttribute("data-tab")));
});
show("today");

// ------- brand settings load/save/reset -------
(function initBrandForm(){
  const b = getBrand();
  $("brand").value = b.brand;
  $("location").value = b.location;
  $("email").value = b.email;
  $("phone").value = b.phone;
  $("offer").value = b.offer;
  $("hash").value = b.hash;
})();
$("saveBrand").addEventListener("click", () => {
  const b = {
    brand: $("brand").value,
    location: $("location").value,
    email: $("email").value,
    phone: $("phone").value,
    offer: $("offer").value,
    hash: $("hash").value
  };
  setBrand(b);
  alert("Brand saved.");
});
$("resetAll").addEventListener("click", () => {
  if (confirm("Reset all saved prompts and brand settings?")) {
    localStorage.removeItem("gibor_brand");
    localStorage.removeItem("gibor_library");
    location.reload();
  }
});
