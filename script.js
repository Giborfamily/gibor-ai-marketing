/* GIBOR Web Starter Pack - Shared JS
   Includes:
   - Mobile nav toggle
   - Dark mode toggle
   - Countdown helper
   - Schedule filter
   - WhatsApp chat button
*/

// Mobile nav toggle
document.querySelectorAll(".nav-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target ? document.querySelector(btn.dataset.target) : null;
    if (target) target.classList.toggle("open");
  });
});

// Dark mode toggle (simple: toggles a class on body)
(function initDarkMode(){
  const btn = document.querySelector("[data-action='toggle-theme']");
  if(!btn) return;
  const STORAGE_KEY = "gibor-theme";
  const apply = (mode) => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem(STORAGE_KEY, mode);
  };
  const saved = localStorage.getItem(STORAGE_KEY) || "dark";
  apply(saved);
  btn.addEventListener("click", () => {
    const next = (localStorage.getItem(STORAGE_KEY) === "dark") ? "light" : "dark";
    apply(next);
  });
})();

// Theme styles (very light toggle)
const themeStyle = document.createElement("style");
themeStyle.innerHTML = `
  :root[data-theme='light'] {
    --bg: #f7f9ff;
    --bg-alt: #ffffff;
    --text: #0e1220;
    --muted: #4b5468;
    --card: #fff;
    --border: #e6eaf2;
  }
  :root[data-theme='light'] .navbar { background: rgba(255,255,255,.8); }
`;
document.head.appendChild(themeStyle);

// Countdown helper
function initCountdown(el, deadlineISO){
  if(!el || !deadlineISO) return;
  const deadline = new Date(deadlineISO).getTime();
  const tick = () => {
    const now = Date.now();
    const diff = Math.max(deadline - now, 0);
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
    const m = Math.floor((diff%(1000*60*60))/(1000*60));
    const s = Math.floor((diff%(1000*60))/1000);
    el.textContent = `${d}d ${h}h ${m}m ${s}s`;
    if(diff === 0) clearInterval(timer);
  };
  tick();
  const timer = setInterval(tick, 1000);
}

// Schedule filter
function initScheduleFilter(){
  const filter = document.querySelector("[data-schedule-filter]");
  if(!filter) return;
  const rows = Array.from(document.querySelectorAll("[data-schedule-row]"));
  filter.addEventListener("change", () => {
    const val = filter.value;
    rows.forEach(r => {
      r.style.display = (val === "all" || r.dataset.group === val) ? "" : "none";
    });
  });
}
initScheduleFilter();

// WhatsApp floating button
(function initWhatsApp(){
  const wa = document.querySelector("[data-whatsapp]");
  if(!wa) return;
  const num = wa.getAttribute("data-number") || "17188802136";
  const msg = encodeURIComponent(wa.getAttribute("data-message") || "Hi! I'd like to learn more about GIBOR.");
  const btn = document.createElement("a");
  btn.href = `https://wa.me/${num}?text=${msg}`;
  btn.setAttribute("aria-label", "Chat on WhatsApp");
  btn.className = "btn";
  btn.style.position = "fixed";
  btn.style.left = "14px";
  btn.style.bottom = "14px";
  btn.style.zIndex = "60";
  btn.textContent = "Chat on WhatsApp";
  document.body.appendChild(btn);
})();

// Simple toast
function toast(msg){
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.top = "12px";
  t.style.right = "12px";
  t.style.padding = "10px 14px";
  t.style.background = "rgba(0,0,0,.7)";
  t.style.color = "#fff";
  t.style.borderRadius = "10px";
  t.style.zIndex = "80";
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2400);
}
