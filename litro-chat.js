/* LiTRO — чат-виджет для litro.kz.  Версия 2026-10-07.
   Разместите файл в корне сайта / на CDN и подключите перед </body>:
   <script src="/litro-chat.js" defer></script>
   Виджет самодостаточный; диалоги автоматически попадают в кабинет LiTRO.
   Геолокация отправляется обычным сообщением в вебхук — бэкенд менять не нужно. */
(function () {
  if (window.__litroWidget) return; window.__litroWidget = true;

  var ENDPOINT = "https://litro.app.n8n.cloud/webhook/47c44eeb-fa09-4ee8-aab1-a1eac36d6848/chat";
  var AVA = "https://cdn.jsdelivr.net/gh/pavelshelykin/litro-widget@main/litro-support-avatar.webp";

  // ---------- styles (scoped by #lw / .lw-) ----------
  var css = ""
  + "#lw *{box-sizing:border-box;font-family:'Uber Move Text CYR','Uber Move Text',Arial,sans-serif}"
  + ".lw-launch{appearance:none;position:fixed;right:24px;bottom:24px;min-width:222px;height:64px;border:0;border-radius:18px;background:#007037;color:#fff;display:flex;align-items:center;gap:10px;padding:8px 12px 8px 8px;cursor:pointer;box-shadow:0 12px 30px rgba(0,65,32,.34);z-index:2147483000;transition:transform .2s,box-shadow .2s}"
  + ".lw-launch:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(0,65,32,.4)}.lw-launch:focus-visible{outline:3px solid rgba(0,112,55,.28);outline-offset:3px}"
  + ".lw-launch-ava{position:relative;flex:0 0 auto}.lw-launch-ava img,.lw-launch-ava .fb{width:46px;height:46px;border-radius:50%;border:2px solid rgba(255,255,255,.72)}.lw-launch-ava img{display:block;object-fit:cover}.lw-launch-ava .fb{display:none;align-items:center;justify-content:center;background:#e2f0e9;color:#007037;font-size:19px;font-weight:700}.lw-launch-ava .on{position:absolute;right:0;bottom:0;width:11px;height:11px;background:#37e07a;border:2px solid #007037;border-radius:50%}"
  + ".lw-launch-copy{display:flex;flex:1;min-width:0;flex-direction:column;align-items:flex-start;text-align:left}.lw-launch-copy b{font-size:16px;line-height:21px;font-weight:700;white-space:nowrap}.lw-launch-copy span{font-size:13px;line-height:18px;color:#d7f2e3;white-space:nowrap}.lw-launch>svg{width:23px;height:23px;flex:0 0 auto}"
  + ".lw-launch::after{content:'';position:absolute;inset:0;border-radius:18px;box-shadow:0 0 0 0 rgba(0,112,55,.35);animation:lwp 2.8s infinite;pointer-events:none}"
  + "@keyframes lwp{0%{box-shadow:0 0 0 0 rgba(0,164,81,.45)}70%{box-shadow:0 0 0 16px rgba(0,164,81,0)}100%{box-shadow:0 0 0 0 rgba(0,164,81,0)}}"
  + ".lw-teaser{position:fixed;right:104px;bottom:40px;max-width:262px;background:#fff;border-radius:16px 16px 4px 16px;padding:12px 14px;box-shadow:0 12px 34px rgba(16,40,26,.2);z-index:2147482999;display:flex;gap:10px;align-items:flex-start;transform:translateY(10px);opacity:0;pointer-events:none;transition:.35s}"
  + ".lw-teaser.show{transform:translateY(0);opacity:1;pointer-events:auto}"
  + ".lw-teaser img{width:46px;height:46px;border-radius:50%;object-fit:cover;flex:0 0 auto}.lw-teaser .tx{font-size:15px;line-height:1.45;color:#00140a}"
  + ".lw-teaser .cl{position:absolute;top:6px;right:8px;color:#6c6d7b;font-size:17px;cursor:pointer;line-height:1}"
  + ".lw-win{position:fixed;right:24px;bottom:24px;width:400px;max-width:calc(100vw - 32px);height:min(460px,calc(100vh - 48px));background:#fff;border-radius:20px;box-shadow:0 24px 60px rgba(16,40,26,.3);z-index:2147483000;display:flex;flex-direction:column;overflow:hidden;transform-origin:bottom right;transform:scale(.86) translateY(16px);opacity:0;pointer-events:none;transition:.24s cubic-bezier(.22,1,.36,1)}"
  + ".lw-win.expanded{height:min(532px,calc(100vh - 48px))}"
  + ".lw-win.open{transform:scale(1) translateY(0);opacity:1;pointer-events:auto}"
  + ".lw-hd{background:#004b25;padding:16px;display:flex;align-items:center;gap:12px;color:#fff}"
  + ".lw-hd .ava{position:relative;flex:0 0 auto}.lw-hd .ava img,.lw-hd .ava .fb{width:52px;height:52px;border-radius:50%;border:2px solid rgba(255,255,255,.7)}.lw-hd .ava img{display:block;object-fit:cover}.lw-hd .ava .fb{display:none;align-items:center;justify-content:center;background:#e2f0e9;color:#007037;font-size:21px;font-weight:700}"
  + ".lw-hd .ava .on{position:absolute;right:0;bottom:0;width:12px;height:12px;background:#37e07a;border:2px solid #004b25;border-radius:50%}"
  + ".lw-hd .nm{flex:1;min-width:0}.lw-hd .nm b{font-size:18px;line-height:24px;font-weight:700;display:block}.lw-hd .nm span{font-size:14px;line-height:19px;color:#fff;display:flex;align-items:center;gap:6px}"
  + ".lw-hd .ic{appearance:none;width:44px;height:44px;border:0;border-radius:50%;background:transparent;color:inherit;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.92;padding:0;flex:0 0 auto}.lw-hd .ic:hover{background:rgba(255,255,255,.12)}.lw-hd .ic:focus-visible{outline:3px solid rgba(255,255,255,.65);outline-offset:-2px}.lw-hd .ic svg{width:22px;height:22px;display:block}"
  + ".lw-body{flex:1;overflow-y:auto;padding:18px 16px 10px;background:#fafcfb;display:flex;flex-direction:column;gap:4px}"
  + ".lw-row{display:flex;gap:10px;align-items:flex-end;margin-top:8px;max-width:94%}.lw-row.u{align-self:flex-end;flex-direction:row-reverse}"
  + ".lw-row .ma,.lw-row .mafb{width:36px;height:36px;border-radius:50%;flex:0 0 auto;margin-bottom:18px}.lw-row .ma{object-fit:cover}.lw-row .mafb{display:none;align-items:center;justify-content:center;background:#e2f0e9;color:#007037;font-size:15px;font-weight:700}.lw-row.u .ma,.lw-row.u .mafb{display:none}"
  + ".lw-bwrap{display:flex;flex-direction:column}"
  + ".lw-b{max-width:100%;padding:12px 15px;border-radius:14px;font-size:16px;line-height:1.5;color:#00140a;white-space:pre-wrap;word-wrap:break-word}"
  + ".lw-b.usr{background:#007037;color:#fff;border-radius:14px 4px 14px 14px}"
  + ".lw-b.bot{background:#fff;border:1px solid #e6eae8;border-radius:4px 14px 14px 14px}"
  + ".lw-b.usr a{color:#eafff1;text-decoration:underline}.lw-b.bot a{color:#00a451}"
  + ".lw-tm{font-size:13px;line-height:17px;color:#6c6d7b;margin-top:4px}.lw-row.u .lw-tm{text-align:right}"
  + ".lw-chips{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:100%;margin:14px 0 4px}"
  + ".lw-chip{appearance:none;min-height:62px;border:1px solid #cceddc;color:#007037;background:#eef6f2;border-radius:12px;padding:11px 12px;font-size:16px;line-height:1.3;font-weight:500;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;transition:background .12s ease,border-color .12s ease,transform .12s ease}.lw-chip.wide{grid-column:1/-1;background:#007037;border-color:#007037;color:#fff;font-weight:700}.lw-chip:hover{background:#e2f0e9;border-color:#00a451}.lw-chip.wide:hover{background:#005e2e;border-color:#005e2e}.lw-chip:focus-visible{outline:3px solid #007037;outline-offset:2px}.lw-chip:active{transform:scale(.98)}"
  + ".lw-chip-icon{width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 20px}.lw-chip-icon svg{width:20px;height:20px;display:block}"
  + ".lw-type{display:inline-flex;gap:4px;padding:12px 14px;background:#fff;border:1px solid #e9edeb;border-radius:4px 14px 14px 14px}"
  + ".lw-type i{width:7px;height:7px;border-radius:50%;background:#c0cabf;display:inline-block;animation:lwb 1.3s infinite}.lw-type i:nth-child(2){animation-delay:.18s}.lw-type i:nth-child(3){animation-delay:.36s}"
  + "@keyframes lwb{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}"
  + ".lw-ft{border-top:1px solid #eceeed;background:#fff;padding:12px 14px}.lw-inrow{display:flex;align-items:flex-end;gap:10px}"
  + ".lw-geo{width:46px;height:46px;border-radius:50%;border:1px solid #cfe6d6;background:#fff;color:#00a451;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto;transition:.15s}.lw-geo:hover{background:#eaf6ee;border-color:#00a451}.lw-geo svg{width:22px;height:22px}.lw-geo.busy{opacity:.5;pointer-events:none}"
  + ".lw-in{flex:1;border:0;resize:none;outline:none;font-size:16px;line-height:1.45;max-height:104px;padding:10px 4px;font-family:inherit;color:#00140a;border-radius:8px}.lw-in:focus-visible{outline:3px solid #007037;outline-offset:1px}"
  + ".lw-send{width:46px;height:46px;border-radius:50%;border:0;background:#e4f0e8;color:#79a88a;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto;transition:.15s}"
  + ".lw-send.on{background:linear-gradient(135deg,#12b95f,#00a451);color:#fff;box-shadow:0 5px 14px rgba(0,164,81,.4)}.lw-send svg{width:20px;height:20px}"
  + ".lw-pw{text-align:center;font-size:13px;line-height:17px;color:#6c6d7b;padding:8px 0 2px}.lw-pw b{color:#008341}"
  + "@media(max-width:480px){.lw-launch{right:12px;bottom:12px;min-width:184px;height:56px;border-radius:16px;padding:7px 10px 7px 7px}.lw-launch::after{border-radius:16px}.lw-launch-ava img,.lw-launch-ava .fb{width:42px;height:42px}.lw-launch-copy b{font-size:15px;line-height:19px}.lw-launch-copy span{font-size:12px;line-height:16px}.lw-launch>svg{width:21px;height:21px}.lw-win{right:8px;bottom:8px;width:calc(100vw - 16px);max-width:none;height:min(460px,calc(100dvh - 16px));border-radius:18px}.lw-win.expanded{height:min(540px,calc(100dvh - 16px))}.lw-hd{padding:12px 14px}.lw-hd .ava img,.lw-hd .ava .fb{width:48px;height:48px}.lw-body{padding:16px 14px 10px}.lw-ft{padding:10px 12px}}"
  + "@media(prefers-reduced-motion:reduce){.lw-launch::after,.lw-type i{animation:none}.lw-type i{opacity:.55}.lw-launch,.lw-win,.lw-chip{transition:none}}";

  var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  // ---------- markup ----------
  var wrap = document.createElement("div"); wrap.id = "lw";
  wrap.innerHTML =
    "<div class='lw-teaser' id='lwTeaser'><span class='cl' id='lwTclose'>&#10005;</span><img src='" + AVA + "' onerror=\"this.style.display='none'\"><div class='tx'>\u041d\u0443\u0436\u043d\u0430 \u043f\u043e\u043c\u043e\u0449\u044c \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435? \u041e\u043f\u0438\u0448\u0438\u0442\u0435 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u044e \u2014 \u043e\u0442\u0432\u0435\u0447\u0443 \u0441\u0440\u0430\u0437\u0443.</div></div>"
  + "<button class='lw-launch' id='lwLaunch' type='button' aria-label='\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0447\u0430\u0442 LiTRO'><span class='lw-launch-ava'><img src='" + AVA + "' alt='' onerror=\"this.style.display='none';this.nextElementSibling.style.display='flex'\"><span class='fb'>\u0410</span><span class='on'></span></span><span class='lw-launch-copy'><b>\u0427\u0430\u0442 \u0441 LiTRO</b><span>\u041c\u044b \u043e\u043d\u043b\u0430\u0439\u043d</span></span><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'></path></svg></button>"
  + "<div class='lw-win' id='lwWin' aria-hidden='true'><div class='lw-hd'><div class='ava'><img src='" + AVA + "' alt='' onerror=\"this.style.display='none';this.nextElementSibling.style.display='flex'\"><span class='fb'>\u0410</span><span class='on'></span></div><div class='nm'><b>\u0410\u0440\u0443\u0436\u0430\u043d</b><span>\u041e\u043d\u043b\u0430\u0439\u043d</span></div><button class='ic' id='lwReset' type='button' aria-label='\u041d\u043e\u0432\u044b\u0439 \u0434\u0438\u0430\u043b\u043e\u0433' title='\u041d\u043e\u0432\u044b\u0439 \u0434\u0438\u0430\u043b\u043e\u0433'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M23 4v6h-6'></path><path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10'></path></svg></button><button class='ic' id='lwClose' type='button' aria-label='\u0421\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0447\u0430\u0442' title='\u0421\u0432\u0435\u0440\u043d\u0443\u0442\u044c'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4' stroke-linecap='round' aria-hidden='true'><path d='M5 12h14'></path></svg></button></div>"
  + "<div class='lw-body' id='lwBody' role='log' aria-live='polite' aria-relevant='additions'></div>"
  + "<div class='lw-ft'><div class='lw-inrow'><button class='lw-geo' id='lwGeo' type='button' aria-label='\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0433\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044e' title='\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0433\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044e'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path><circle cx='12' cy='10' r='3'></circle></svg></button><textarea class='lw-in' id='lwIn' rows='1' aria-label='\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435' placeholder='\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435\u2026'></textarea><button class='lw-send' id='lwSendBtn' type='button' aria-label='\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435'><svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M3 20.5l18-8.5L3 3.5 3 10l12 2-12 2z'></path></svg></button></div><div class='lw-pw'>\u0421\u043b\u0443\u0436\u0431\u0430 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0438 <b>LiTRO</b></div></div></div>";
  document.body.appendChild(wrap);

  // ---------- refs ----------
  var $ = function (id) { return document.getElementById(id); };
  var win = $("lwWin"), launch = $("lwLaunch"), teaser = $("lwTeaser"),
      body = $("lwBody"), input = $("lwIn"), sendBtn = $("lwSendBtn"), geoBtn = $("lwGeo");
  var greeted = false, opened = false;

  function sid() {
    var s = ""; try { s = localStorage.getItem("litro_sid") || ""; } catch (e) {}
    if (!s) { s = "web-" + Date.now() + "-" + Math.floor(Math.random() * 99999); try { localStorage.setItem("litro_sid", s); } catch (e) {} }
    return s;
  }
  var id = sid();

  function tm() { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }

  function add(role, text) {
    var row = document.createElement("div"); row.className = "lw-row " + (role === "usr" ? "u" : "");
    if (role === "bot") { var im = document.createElement("img"); im.className = "ma"; im.src = AVA; im.alt = "Аружан"; var fb = document.createElement("span"); fb.className = "mafb"; fb.textContent = "А"; im.onerror = function () { this.style.display = "none"; fb.style.display = "flex"; }; row.appendChild(im); row.appendChild(fb); }
    var w = document.createElement("div"); w.className = "lw-bwrap";
    var b = document.createElement("div"); b.className = "lw-b " + role; b.textContent = text;
    var t = document.createElement("div"); t.className = "lw-tm"; t.textContent = tm();
    w.appendChild(b); w.appendChild(t); row.appendChild(w); body.appendChild(row); body.scrollTop = body.scrollHeight;
  }
  var chipIcons = {
    help: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><circle cx='12' cy='12' r='9'></circle><circle cx='12' cy='12' r='3'></circle><path d='m6.4 6.4 3.5 3.5M14.1 14.1l3.5 3.5M17.6 6.4l-3.5 3.5M9.9 14.1l-3.5 3.5'></path></svg>",
    service: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><rect x='4' y='4' width='6' height='6' rx='1'></rect><rect x='14' y='4' width='6' height='6' rx='1'></rect><rect x='4' y='14' width='6' height='6' rx='1'></rect><rect x='14' y='14' width='6' height='6' rx='1'></rect></svg>",
    phone: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z'></path></svg>",
    geo: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z'></path><circle cx='12' cy='10' r='2.5'></circle></svg>"
  };
  function chips(list, onPick) {
    var c = document.createElement("div"); c.className = "lw-chips"; c.id = "lwChips";
    list.forEach(function (x) {
      var item = typeof x === "string" ? { label: x } : x;
      var s = document.createElement("button");
      s.type = "button";
      var isGeo = item.action === "geo";
      s.className = "lw-chip" + (isGeo ? " geo" : "") + (item.wide ? " wide" : "");
      if (item.icon) s.innerHTML = "<span class='lw-chip-icon'>" + chipIcons[item.icon] + "</span><span>" + item.label + "</span>";
      else s.textContent = item.label;
      s.onclick = isGeo ? sendGeo : function () { (onPick || quick)(item.label); };
      c.appendChild(s);
    });
    body.appendChild(c); body.scrollTop = body.scrollHeight; return c;
  }
  function showMainChips(focusFirst) {
    win.classList.remove("expanded");
    rmChips();
    var mainChips = chips([
      { label: "\u041d\u0443\u0436\u043d\u0430 \u043f\u043e\u043c\u043e\u0449\u044c", icon: "help", wide: true },
      { label: "\u0417\u0430\u043a\u0430\u0437\u0430\u0442\u044c \u0437\u0432\u043e\u043d\u043e\u043a", icon: "phone" },
      { label: "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0433\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044e", icon: "geo", action: "geo" }
    ], function (choice) {
      if (choice.indexOf("\u041d\u0443\u0436\u043d\u0430 \u043f\u043e\u043c\u043e\u0449\u044c") > -1) return showServiceChips("help");
      quick("\u041f\u0435\u0440\u0435\u0437\u0432\u043e\u043d\u0438\u0442\u0435 \u043c\u043d\u0435");
    });
    if (focusFirst) mainChips.querySelector("button").focus();
  }
  function showServiceChips(mode) {
    win.classList.add("expanded");
    rmChips();
    var serviceChips = chips(["\u042d\u0432\u0430\u043a\u0443\u0430\u0442\u043e\u0440", "\u041f\u043e\u043c\u043e\u0449\u044c \u0441 \u043a\u043e\u043b\u0435\u0441\u043e\u043c", "\u0417\u0430\u043f\u0443\u0441\u043a \u0430\u043a\u043a\u0443\u043c\u0443\u043b\u044f\u0442\u043e\u0440\u0430", "\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0442\u043e\u043f\u043b\u0438\u0432\u0430", "\u0414\u0440\u0443\u0433\u0430\u044f \u043f\u0440\u043e\u0431\u043b\u0435\u043c\u0430", "\u2190 \u041d\u0430\u0437\u0430\u0434"], function (service) {
      if (service.indexOf("\u041d\u0430\u0437\u0430\u0434") > -1) return showMainChips(true);
      var prompt = mode === "service" ? "\u0418\u043d\u0442\u0435\u0440\u0435\u0441\u0443\u0435\u0442 \u0443\u0441\u043b\u0443\u0433\u0430: " + service : "\u041d\u0443\u0436\u043d\u0430 \u043f\u043e\u043c\u043e\u0449\u044c: " + service;
      win.classList.remove("expanded"); rmChips(); add("usr", service); ask(prompt);
    });
    serviceChips.querySelector("button").focus();
  }
  function rmChips() { var c = $("lwChips"); if (c) c.remove(); }
  function typing(on) {
    var ex = $("lwTp");
    if (on) { if (ex) return; var row = document.createElement("div"); row.className = "lw-row"; row.id = "lwTp";
      var im = document.createElement("img"); im.className = "ma"; im.src = AVA; im.alt = "Аружан"; var fb = document.createElement("span"); fb.className = "mafb"; fb.textContent = "А"; im.onerror = function () { this.style.display = "none"; fb.style.display = "flex"; };
      var t = document.createElement("div"); t.className = "lw-type"; t.innerHTML = "<i></i><i></i><i></i>";
      row.appendChild(im); row.appendChild(fb); row.appendChild(t); body.appendChild(row); body.scrollTop = body.scrollHeight;
    } else if (ex) { ex.remove(); }
  }
  function greet() {
    if (greeted) return; greeted = true;
    add("bot", "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u0427\u0435\u043c \u043c\u043e\u0433\u0443 \u043f\u043e\u043c\u043e\u0447\u044c?");
    showMainChips();
  }
  function playOpenSound() {
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      var context = new AudioContext();
      var play = function () {
        if (context.state !== "running") { context.close(); return; }
        var start = context.currentTime;
        var gain = context.createGain();
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.055, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
        gain.connect(context.destination);
        [660, 880].forEach(function (frequency, index) {
          var tone = context.createOscillator();
          tone.type = "sine";
          tone.frequency.setValueAtTime(frequency, start + index * 0.08);
          tone.connect(gain);
          tone.start(start + index * 0.08);
          tone.stop(start + 0.24 + index * 0.08);
        });
        setTimeout(function () { context.close(); }, 500);
      };
      if (context.state === "suspended") context.resume().then(play).catch(function () { context.close(); });
      else play();
    } catch (e) {}
  }
  function open(force) {
    var wasOpen = opened;
    var show = (force === undefined) ? !opened : force; opened = show;
    win.inert = !show;
    win.setAttribute("aria-hidden", show ? "false" : "true");
    win.classList.toggle("open", show); launch.style.display = show ? "none" : "flex"; teaser.classList.remove("show");
    if (show) { if (!wasOpen) playOpenSound(); greet(); if (arguments[1] !== false) setTimeout(function () { input.focus(); }, 260); } else { launch.style.display = "flex"; launch.focus(); }
  }
  function reset() { id = "web-" + Date.now() + "-" + Math.floor(Math.random() * 99999); try { localStorage.setItem("litro_sid", id); } catch (e) {} body.innerHTML = ""; greeted = false; greet(); }
  function grow() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 96) + "px"; sendBtn.classList.toggle("on", input.value.trim().length > 0); }
  function ask(q) {
    typing(true);
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "sendMessage", chatInput: q, sessionId: id }) })
      .then(function (r) { return r.json(); })
      .then(function (d) { typing(false); add("bot", (d && (d.output || d.text)) || "\u0421\u0435\u043a\u0443\u043d\u0434\u0443, \u0443\u0442\u043e\u0447\u043d\u044e \u0438 \u0432\u0435\u0440\u043d\u0443\u0441\u044c."); })
      .catch(function () { typing(false); add("bot", "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u0432\u044f\u0437\u0430\u0442\u044c\u0441\u044f \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c. \u041f\u043e\u0437\u0432\u043e\u043d\u0438\u0442\u0435 5070 \u2014 \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e \u0438 \u043a\u0440\u0443\u0433\u043b\u043e\u0441\u0443\u0442\u043e\u0447\u043d\u043e."); });
  }
  // ---------- геолокация ----------
  function sendGeo() {
    if (!opened) open(true);
    greet();
    if (!navigator.geolocation) { add("bot", "\u0413\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044f \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u0432 \u044d\u0442\u043e\u043c \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435. \u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0438\u043b\u0438 \u043f\u0440\u0438\u0448\u043b\u0438\u0442\u0435 \u0441\u0441\u044b\u043b\u043a\u0443 \u043d\u0430 \u043a\u0430\u0440\u0442\u0443."); return; }
    rmChips();
    geoBtn.classList.add("busy");
    typing(true);
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        typing(false); geoBtn.classList.remove("busy");
        var la = pos.coords.latitude.toFixed(6), lo = pos.coords.longitude.toFixed(6);
        var link = "https://maps.google.com/?q=" + la + "," + lo;
        add("usr", "\ud83d\udccd \u041c\u043e\u044f \u0433\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044f: " + link);
        ask("\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u043f\u0440\u0438\u0441\u043b\u0430\u043b \u0433\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044e \u0434\u043b\u044f \u043f\u043e\u043c\u043e\u0449\u0438 \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435. \u041a\u043e\u043e\u0440\u0434\u0438\u043d\u0430\u0442\u044b: " + la + ", " + lo + ". \u0421\u0441\u044b\u043b\u043a\u0430 \u043d\u0430 \u043a\u0430\u0440\u0442\u0443: " + link + ". \u0423\u0442\u043e\u0447\u043d\u0438, \u0447\u0442\u043e \u0441\u043b\u0443\u0447\u0438\u043b\u043e\u0441\u044c, \u0438 \u043f\u043e\u043c\u043e\u0433\u0438 \u043e\u0444\u043e\u0440\u043c\u0438\u0442\u044c \u0432\u044b\u0437\u043e\u0432 \u044d\u0432\u0430\u043a\u0443\u0430\u0442\u043e\u0440\u0430 \u043d\u0430 \u044d\u0442\u043e \u043c\u0435\u0441\u0442\u043e.");
      },
      function (err) {
        typing(false); geoBtn.classList.remove("busy");
        add("bot", (err && err.code === 1)
          ? "\u0414\u043e\u0441\u0442\u0443\u043f \u043a \u0433\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u0438 \u0437\u0430\u043f\u0440\u0435\u0449\u0451\u043d. \u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u0435 \u0435\u0433\u043e \u0432 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430\u0445 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430 \u0438\u043b\u0438 \u043f\u0440\u043e\u0441\u0442\u043e \u043d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u2014 \u044f \u043f\u0435\u0440\u0435\u0434\u0430\u043c."
          : "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0438\u0442\u044c \u043c\u0435\u0441\u0442\u043e\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u0435. \u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0438\u043b\u0438 \u043f\u0440\u0438\u0448\u043b\u0438\u0442\u0435 \u0441\u0441\u044b\u043b\u043a\u0443 \u043d\u0430 \u043a\u0430\u0440\u0442\u0443.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }
  function quick(q) { if (!opened) open(true); greet(); rmChips(); add("usr", q); ask(q); }
  function send() { var v = (input.value || "").trim(); if (!v) return; rmChips(); input.value = ""; grow(); add("usr", v); ask(v); }

  launch.onclick = function () { open(); };
  $("lwClose").onclick = function () { open(false); };
  $("lwReset").onclick = function () { if (window.confirm("\u041d\u0430\u0447\u0430\u0442\u044c \u043d\u043e\u0432\u044b\u0439 \u0434\u0438\u0430\u043b\u043e\u0433? \u0422\u0435\u043a\u0443\u0449\u0430\u044f \u043f\u0435\u0440\u0435\u043f\u0438\u0441\u043a\u0430 \u0431\u0443\u0434\u0435\u0442 \u0441\u043a\u0440\u044b\u0442\u0430.")) reset(); };
  $("lwTclose").onclick = function (e) { e.stopPropagation(); teaser.classList.remove("show"); };
  teaser.onclick = function () { open(true); };
  geoBtn.onclick = sendGeo;
  sendBtn.onclick = send;
  input.addEventListener("input", grow);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
  win.inert = true;
  setTimeout(function () { if (!opened) open(true, false); }, 4000);
})();

/* Временно: клик по номеру на ads.litro.kz → событие GA4 click_number.
   Триггер в GTM-WKVVTRQ ловит только «tel:5070», а на ads.litro.kz номер +77788701775,
   поэтому с 29.09.2026 звонки с рекламы не попадали в GA4 и в конверсию Google Ads.
   Убрать этот блок, когда условие триггера в GTM заменят на «Click URL начинается с tel:»,
   иначе каждый клик посчитается дважды. */
(function () {
  if (location.hostname !== "ads.litro.kz" || window.__litroTelClick) return;
  window.__litroTelClick = true;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!a) return;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag("event", "click_number", { send_to: "G-99EYT3XGP0", link_url: a.getAttribute("href") });
  }, true);
})();
