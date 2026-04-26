/* Crystal Drops — shared bottom control bar (MOBILE ONLY).
   Hidden on screens > 900px since admin uses a sidebar on desktop. */
(function(){
  if(window.__cdBottomBarLoaded) return;
  window.__cdBottomBarLoaded = true;

  const tabs = [
    {id:"hub",    href:"index.html",       label:"Hub",    icon:'<path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-7h4v7h4a1 1 0 0 0 1-1V10"/>'},
    {id:"admin",  href:"admin.html",       label:"Admin",  icon:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'},
    {id:"order",  href:"order.html",       label:"Order",  icon:'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>'},
    {id:"themes", href:"themes.html",      label:"Theme",  icon:'<circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.4 0 1.8-1 1.4-2-1-2.4 1-3 2.6-3H19a3 3 0 0 0 3-3c0-6-4.5-10-10-10z"/>'},
    {id:"bg",     href:"backgrounds.html", label:"BG",     icon:'<path d="M12 2.5s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z"/><circle cx="9" cy="13" r="1"/>'}
  ];

  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const cleanFile = file.replace(/\.html$/,"") || "index";
  const map = {"":"hub","index":"hub","admin":"admin","order":"order","themes":"themes","backgrounds":"bg"};
  const active = map[cleanFile] || "hub";

  const style = document.createElement("style");
  style.textContent = `
    .cd-bbar{display:none}
    @media (max-width:900px){
      .cd-bbar{position:fixed;left:50%;transform:translateX(-50%);bottom:max(12px,env(safe-area-inset-bottom));display:flex;gap:2px;background:rgba(255,255,255,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(186,230,253,.7);border-radius:999px;padding:5px;box-shadow:0 4px 14px rgba(15,27,45,.08),0 18px 50px rgba(15,27,45,.16);z-index:999;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;max-width:calc(100vw - 24px)}
      .cd-bbar a{display:flex;align-items:center;gap:5px;padding:9px 12px;border-radius:999px;color:#475569;font-size:11.5px;font-weight:600;text-decoration:none;transition:all .15s;-webkit-tap-highlight-color:transparent;flex:0 0 auto}
      .cd-bbar a svg{width:17px;height:17px;flex-shrink:0}
      .cd-bbar a:active{transform:scale(.94)}
      .cd-bbar a:not(.active) .label{display:none}
      .cd-bbar a.active{background:linear-gradient(135deg,#0ea5e9,#0284c7);color:#fff;box-shadow:0 4px 12px rgba(14,165,233,.36);padding:9px 14px}
      body{padding-bottom:calc(72px + env(safe-area-inset-bottom))}
    }
    @media (max-width:380px){
      .cd-bbar a{padding:8px 10px}
      .cd-bbar a.active{padding:8px 12px;font-size:11px}
    }
  `;
  document.head.appendChild(style);

  const bar = document.createElement("nav");
  bar.className = "cd-bbar";
  bar.setAttribute("aria-label","Crystal Drops navigation");
  bar.innerHTML = tabs.map(t => `
    <a href="${t.href}" data-id="${t.id}" class="${t.id === active ? "active" : ""}" aria-current="${t.id === active ? "page" : "false"}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t.icon}</svg>
      <span class="label">${t.label}</span>
    </a>
  `).join("");

  if(document.body) document.body.appendChild(bar);
  else document.addEventListener("DOMContentLoaded", () => document.body.appendChild(bar));
})();
