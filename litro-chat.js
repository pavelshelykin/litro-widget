/* LiTRO — чат-виджет для litro.kz.  Версия 2026-07-31 (+ кнопка геолокации).
   Разместите файл в корне сайта / на CDN и подключите перед </body>:
   <script src="/litro-chat.js" defer></script>
   Виджет самодостаточный; диалоги автоматически попадают в кабинет LiTRO.
   Геолокация отправляется обычным сообщением в вебхук — бэкенд менять не нужно. */
(function () {
  if (window.__litroWidget) return; window.__litroWidget = true;

  var ENDPOINT = "https://litro.app.n8n.cloud/webhook/47c44eeb-fa09-4ee8-aab1-a1eac36d6848/chat";
  var AVA = "https://litro.kz/img/masters/_1.webp";

  // ---------- styles (scoped by #lw / .lw-) ----------
  var css = ""
  + "#lw *{box-sizing:border-box;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif}"
  + ".lw-launch{position:fixed;right:26px;bottom:26px;width:64px;height:64px;border-radius:50%;background:linear-gradient(145deg,#12b95f,#00a451);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 26px rgba(0,164,81,.5);z-index:2147483000;transition:transform .2s}"
  + ".lw-launch:hover{transform:scale(1.06)}.lw-launch svg{width:30px;height:30px}"
  + ".lw-launch .badge{position:absolute;top:-3px;right:-3px;min-width:20px;height:20px;background:#ff4d4f;color:#fff;border-radius:11px;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #fff;padding:0 5px}"
  + ".lw-launch::after{content:'';position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(0,164,81,.45);animation:lwp 2.4s infinite}"
  + "@keyframes lwp{0%{box-shadow:0 0 0 0 rgba(0,164,81,.45)}70%{box-shadow:0 0 0 16px rgba(0,164,81,0)}100%{box-shadow:0 0 0 0 rgba(0,164,81,0)}}"
  + ".lw-teaser{position:fixed;right:104px;bottom:40px;max-width:262px;background:#fff;border-radius:16px 16px 4px 16px;padding:12px 14px;box-shadow:0 12px 34px rgba(16,40,26,.2);z-index:2147482999;display:flex;gap:10px;align-items:flex-start;transform:translateY(10px);opacity:0;pointer-events:none;transition:.35s}"
  + ".lw-teaser.show{transform:translateY(0);opacity:1;pointer-events:auto}"
  + ".lw-teaser img{width:38px;height:38px;border-radius:50%;object-fit:cover;flex:0 0 auto}.lw-teaser .tx{font-size:13.5px;line-height:1.45;color:#1b2733}"
  + ".lw-teaser .cl{position:absolute;top:6px;right:8px;color:#b3bdb7;font-size:15px;cursor:pointer;line-height:1}"
  + ".lw-win{position:fixed;right:26px;bottom:26px;width:384px;max-width:calc(100vw - 32px);height:600px;max-height:calc(100vh - 52px);background:#fff;border-radius:20px;box-shadow:0 24px 60px rgba(16,40,26,.3);z-index:2147483000;display:flex;flex-direction:column;overflow:hidden;transform-origin:bottom right;transform:scale(.86) translateY(16px);opacity:0;pointer-events:none;transition:.24s cubic-bezier(.22,1,.36,1)}"
  + ".lw-win.open{transform:scale(1) translateY(0);opacity:1;pointer-events:auto}"
  + ".lw-hd{background:linear-gradient(135deg,#12b95f,#00a451);padding:15px 16px;display:flex;align-items:center;gap:12px;color:#fff}"
  + ".lw-hd .ava{position:relative;flex:0 0 auto}.lw-hd .ava img{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.7)}"
  + ".lw-hd .ava .on{position:absolute;right:0;bottom:0;width:12px;height:12px;background:#37e07a;border:2px solid #00a451;border-radius:50%}"
  + ".lw-hd .nm{flex:1;min-width:0}.lw-hd .nm b{font-size:15.5px;font-weight:700;display:block}.lw-hd .nm span{font-size:12px;color:#dcf3e3;display:flex;align-items:center;gap:6px}"
  + ".lw-hd .ic{cursor:pointer;opacity:.92;padding:4px}.lw-hd .ic svg{width:20px;height:20px;display:block}"
  + ".lw-body{flex:1;overflow-y:auto;padding:18px 14px 8px;background:#f5f8f6;display:flex;flex-direction:column;gap:4px}"
  + ".lw-day{align-self:center;background:#e6ede9;color:#6d7d74;font-size:11px;padding:3px 10px;border-radius:10px;margin-bottom:6px}"
  + ".lw-row{display:flex;gap:8px;align-items:flex-end;margin-top:8px;max-width:88%}.lw-row.u{align-self:flex-end;flex-direction:row-reverse}"
  + ".lw-row .ma{width:28px;height:28px;border-radius:50%;object-fit:cover;flex:0 0 auto;margin-bottom:16px}.lw-row.u .ma{display:none}"
  + ".lw-bwrap{display:flex;flex-direction:column}"
  + ".lw-b{max-width:100%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}"
  + ".lw-b.usr{background:linear-gradient(135deg,#12b95f,#00a451);color:#fff;border-radius:14px 4px 14px 14px}"
  + ".lw-b.bot{background:#fff;border:1px solid #e6eae8;border-radius:4px 14px 14px 14px}"
  + ".lw-b.usr a{color:#eafff1;text-decoration:underline}.lw-b.bot a{color:#00a451}"
  + ".lw-tm{font-size:10.5px;color:#9aa8a0;margin-top:3px}.lw-row.u .lw-tm{text-align:right}"
  + ".lw-chips{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 2px 36px}"
  + ".lw-chip{border:1px solid #a9e2bd;color:#00813f;background:#fff;border-radius:16px;padding:8px 13px;font-size:13px;cursor:pointer;transition:.12s}.lw-chip:hover{background:#eaf6ee;border-color:#00a451}"
  + ".lw-chip.geo{background:#eaf6ee;border-color:#00a451;font-weight:600}"
  + ".lw-type{display:inline-flex;gap:4px;padding:12px 14px;background:#fff;border:1px solid #e9edeb;border-radius:4px 14px 14px 14px}"
  + ".lw-type i{width:7px;height:7px;border-radius:50%;background:#c0cabf;display:inline-block;animation:lwb 1.3s infinite}.lw-type i:nth-child(2){animation-delay:.18s}.lw-type i:nth-child(3){animation-delay:.36s}"
  + "@keyframes lwb{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}"
  + ".lw-ft{border-top:1px solid #eceeed;background:#fff;padding:10px 12px}.lw-inrow{display:flex;align-items:flex-end;gap:8px}"
  + ".lw-geo{width:42px;height:42px;border-radius:50%;border:1px solid #cfe6d6;background:#fff;color:#00a451;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto;transition:.15s}.lw-geo:hover{background:#eaf6ee;border-color:#00a451}.lw-geo svg{width:20px;height:20px}.lw-geo.busy{opacity:.5;pointer-events:none}"
  + ".lw-in{flex:1;border:0;resize:none;outline:none;font-size:14px;line-height:1.4;max-height:96px;padding:9px 4px;font-family:inherit}"
  + ".lw-send{width:42px;height:42px;border-radius:50%;border:0;background:#cfe6d6;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto;transition:.15s}"
  + ".lw-send.on{background:linear-gradient(135deg,#12b95f,#00a451);box-shadow:0 5px 14px rgba(0,164,81,.4)}.lw-send svg{width:20px;height:20px}"
  + ".lw-pw{text-align:center;font-size:11px;color:#a9b4ad;padding:7px 0 2px}.lw-pw b{color:#00a451}";

  var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  // ---------- markup ----------
  var wrap = document.createElement("div"); wrap.id = "lw";
  wrap.innerHTML =
    "<div class='lw-teaser' id='lwTeaser'><span class='cl' id='lwTclose'>&#10005;</span><img src='" + AVA + "' onerror=\"this.style.display='none'\"><div class='tx'>\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u041d\u0443\u0436\u043d\u0430 \u043f\u043e\u043c\u043e\u0449\u044c \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435 \u0438\u043b\u0438 \u0432\u043e\u043f\u0440\u043e\u0441 \u043f\u043e \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0435? \u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u2014 \u043e\u0442\u0432\u0435\u0447\u0443 \u0437\u0430 \u043c\u0438\u043d\u0443\u0442\u0443.</div></div>"
  + "<div class='lw-launch' id='lwLaunch'><span class='badge' id='lwBadge'>1</span><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'></path></svg></div>"
  + "<div class='lw-win' id='lwWin'><div class='lw-hd'><div class='ava'><img src='" + AVA + "'><span class='on'></span></div><div class='nm'><b>\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 LiTRO</b><span><span style='width:7px;height:7px;background:#b7f7c6;border-radius:50%;display:inline-block'></span>\u041e\u043d\u043b\u0430\u0439\u043d \u00b7 \u043e\u0442\u0432\u0435\u0447\u0430\u0435\u043c \u0437\u0430 ~1 \u043c\u0438\u043d</span></div><div class='ic' id='lwReset' title='\u041d\u043e\u0432\u044b\u0439 \u0434\u0438\u0430\u043b\u043e\u0433'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M23 4v6h-6'></path><path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10'></path></svg></div><div class='ic' id='lwClose' title='\u0421\u0432\u0435\u0440\u043d\u0443\u0442\u044c'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4' stroke-linecap='round'><path d='M5 12h14'></path></svg></div></div>"
  + "<div class='lw-body' id='lwBody'><div class='lw-day'>\u0421\u0435\u0433\u043e\u0434\u043d\u044f</div></div>"
  + "<div class='lw-ft'><div class='lw-inrow'><button class='lw-geo' id='lwGeo' title='\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0433\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044e'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path><circle cx='12' cy='10' r='3'></circle></svg></button><textarea class='lw-in' id='lwIn' rows='1' placeholder='\u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435\u2026'></textarea><button class='lw-send' id='lwSendBtn'><svg viewBox='0 0 24 24' fill='currentColor'><path d='M3 20.5l18-8.5L3 3.5 3 10l12 2-12 2z'></path></svg></button></div><div class='lw-pw'>\u0420\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u043d\u0430 <b>LiTRO AI</b></div></div></div>";
  document.body.appendChild(wrap);

  // ---------- refs ----------
  var $ = function (id) { return document.getElementById(id); };
  var win = $("lwWin"), launch = $("lwLaunch"), teaser = $("lwTeaser"),
      body = $("lwBody"), input = $("lwIn"), sendBtn = $("lwSendBtn"), badge = $("lwBadge"), geoBtn = $("lwGeo");
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
    if (role === "bot") { var im = document.createElement("img"); im.className = "ma"; im.src = AVA; im.onerror = function () { this.style.visibility = "hidden"; }; row.appendChild(im); }
    var w = document.createElement("div"); w.className = "lw-bwrap";
    var b = document.createElement("div"); b.className = "lw-b " + role; b.textContent = text;
    var t = document.createElement("div"); t.className = "lw-tm"; t.textContent = tm();
    w.appendChild(b); w.appendChild(t); row.appendChild(w); body.appendChild(row); body.scrollTop = body.scrollHeight;
  }
  function chips(list) {
    var c = document.createElement("div"); c.className = "lw-chips"; c.id = "lwChips";
    list.forEach(function (x) {
      var s = document.createElement("span");
      var isGeo = x.indexOf("\u0433\u0435\u043e\u043b\u043e\u043a") > -1;
      s.className = "lw-chip" + (isGeo ? " geo" : ""); s.textContent = x;
      s.onclick = isGeo ? sendGeo : function () { quick(x); };
      c.appendChild(s);
    });
    body.appendChild(c); body.scrollTop = body.scrollHeight;
  }
  function rmChips() { var c = $("lwChips"); if (c) c.remove(); }
  function typing(on) {
    var ex = $("lwTp");
    if (on) { if (ex) return; var row = document.createElement("div"); row.className = "lw-row"; row.id = "lwTp";
      var im = document.createElement("img"); im.className = "ma"; im.src = AVA; im.onerror = function () { this.style.visibility = "hidden"; };
      var t = document.createElement("div"); t.className = "lw-type"; t.innerHTML = "<i></i><i></i><i></i>";
      row.appendChild(im); row.appendChild(t); body.appendChild(row); body.scrollTop = body.scrollHeight;
    } else if (ex) { ex.remove(); }
  }
  function greet() {
    if (greeted) return; greeted = true;
    add("bot", "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u042f \u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043d\u0442 LiTRO. \u041f\u043e\u043c\u043e\u0433\u0443 \u0432\u044b\u0437\u0432\u0430\u0442\u044c \u043f\u043e\u043c\u043e\u0449\u044c \u043d\u0430 \u0434\u043e\u0440\u043e\u0433\u0435, \u043e\u0442\u0432\u0435\u0447\u0443 \u043f\u043e \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430\u043c, \u0446\u0435\u043d\u0430\u043c \u0438 \u0432\u043e\u0437\u0432\u0440\u0430\u0442\u0430\u043c.");
    chips(["\ud83d\udccd \u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0433\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044e", "\u0421\u043a\u043e\u043b\u044c\u043a\u043e \u0441\u0442\u043e\u0438\u0442 \u044d\u0432\u0430\u043a\u0443\u0430\u0442\u043e\u0440?", "\u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0438 PRO \u0438 VIP", "\u041a\u0430\u043a \u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0434\u0435\u043d\u044c\u0433\u0438?", "\u041f\u0440\u043e\u0434\u043b\u0451\u043d\u043d\u0430\u044f \u0433\u0430\u0440\u0430\u043d\u0442\u0438\u044f"]);
  }
  function open(force) {
    var show = (force === undefined) ? !opened : force; opened = show;
    win.classList.toggle("open", show); launch.style.display = show ? "none" : "flex"; teaser.classList.remove("show");
    if (show) { badge.style.display = "none"; greet(); setTimeout(function () { input.focus(); }, 260); } else { launch.style.display = "flex"; }
  }
  function reset() { id = "web-" + Date.now() + "-" + Math.floor(Math.random() * 99999); try { localStorage.setItem("litro_sid", id); } catch (e) {} body.innerHTML = "<div class='lw-day'>\u0421\u0435\u0433\u043e\u0434\u043d\u044f</div>"; greeted = false; greet(); }
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
  $("lwReset").onclick = reset;
  $("lwTclose").onclick = function (e) { e.stopPropagation(); teaser.classList.remove("show"); };
  teaser.onclick = function () { open(true); };
  geoBtn.onclick = sendGeo;
  sendBtn.onclick = send;
  input.addEventListener("input", grow);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
  setTimeout(function () { if (!opened) teaser.classList.add("show"); }, 1600);
})();
