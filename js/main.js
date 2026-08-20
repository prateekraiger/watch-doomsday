/* ============================================================
   ROAD TO DOOMSDAY — MAIN APPLICATION
   Watch states: "unwatched" | "watching" | "completed"
   Progress persisted in localStorage under "rtd_progress_v1".
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "rtd_progress_v1";
  const STATES = ["unwatched", "watching", "completed"];
  const TOTAL = DOOMSDAY_TITLES.length;

  /* ---------- state ---------- */
  let progress = loadProgress();
  let activeFilter = "all";
  let searchQuery = "";
  let modalItemId = null;
  let lastFocused = null;

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch (e) { return {}; }
  }
  function saveProgress() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* private mode */ }
  }
  function getState(id) {
    const s = progress[id];
    return STATES.includes(s) ? s : "unwatched";
  }
  function setState(id, state) {
    if (state === "unwatched") delete progress[id];
    else progress[id] = state;
    saveProgress();
    updateItemDom(id);
    updateDashboard();
    applyFilters();
    if (modalItemId === id) syncModalStatus();
    if (window.refreshHeroShowcase) window.refreshHeroShowcase();
  }

  /* ---------- helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, "0");

  function completedCount() {
    return DOOMSDAY_TITLES.filter((t) => getState(t.id) === "completed").length;
  }
  // next destination: first title in sequence that is not completed
  function nextTitle() {
    return DOOMSDAY_TITLES.find((t) => getState(t.id) !== "completed") || null;
  }

  function posterHTML(item, large) {
    if (item.poster) {
      return '<img src="' + item.poster + '" alt="' + escapeHTML(item.title) + ' poster" loading="lazy">';
    }
    const iconClass = item.type === "Series" ? "fa-tv" : "fa-film";
    const phaseLabel = item.phase || "MCU";
    return (
      '<div class="poster-ph ' + (item.phase ? item.phase.toLowerCase().replace(" ", "-") : "") + '" aria-hidden="true">' +
        '<div class="ph-top"><span class="ph-phase mono">' + phaseLabel + '</span><i class="fa-solid ' + iconClass + '"></i></div>' +
        '<span class="ph-seq">' + pad(item.seq) + "</span>" +
        '<span class="ph-title">' + escapeHTML(item.title) + '</span>' +
      "</div>"
    );
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  /* ---------- boot screen loader ---------- */
  const boot = $("#boot-screen");
  const bootPercent = $("#boot-percent");
  const bootFill = $("#boot-progress-fill");
  const bootStatus = $("#boot-status-text");

  let progressVal = 0;
  const loaderInterval = setInterval(() => {
    progressVal += Math.floor(Math.random() * 12) + 8;
    if (progressVal >= 100) {
      progressVal = 100;
      clearInterval(loaderInterval);
      if (bootPercent) bootPercent.textContent = "100%";
      if (bootFill) bootFill.style.width = "100%";
      if (bootStatus) bootStatus.textContent = "TIMELINE READY";
      setTimeout(() => boot && boot.classList.add("done"), 350);
    } else {
      if (bootPercent) bootPercent.textContent = progressVal + "%";
      if (bootFill) bootFill.style.width = progressVal + "%";
    }
  }, 75);

  setTimeout(() => {
    if (boot && !boot.classList.contains("done")) {
      boot.classList.add("done");
    }
  }, 2200);

  /* ---------- release countdown ---------- */
  const TARGET_DATE = new Date("2026-12-18T00:00:00Z").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      if ($("#cd-days")) $("#cd-days").textContent = "00";
      if ($("#cd-hours")) $("#cd-hours").textContent = "00";
      if ($("#cd-mins")) $("#cd-mins").textContent = "00";
      if ($("#cd-secs")) $("#cd-secs").textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if ($("#cd-days")) $("#cd-days").textContent = pad(days);
    if ($("#cd-hours")) $("#cd-hours").textContent = pad(hours);
    if ($("#cd-mins")) $("#cd-mins").textContent = pad(mins);
    if ($("#cd-secs")) $("#cd-secs").textContent = pad(secs);

    const navClock = $("#nav-clock");
    if (navClock) {
      navClock.textContent = days + "D " + pad(hours) + "H TO DOOMSDAY";
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- particles ---------- */
  (function spawnParticles() {
    const wrap = $("#particles");
    const count = window.innerWidth < 640 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = 14 + Math.random() * 22 + "s";
      s.style.animationDelay = -Math.random() * 30 + "s";
      const size = 1 + Math.random() * 2;
      s.style.width = s.style.height = size + "px";
      if (Math.random() < 0.3) s.style.background = "#ff7a1a";
      wrap.appendChild(s);
    }
  })();

  /* ---------- hero: real-poster backdrop + marquee ---------- */
  (function buildHeroBackdrop() {
    const withPosters = DOOMSDAY_TITLES.filter((t) => t.poster);
    if (!withPosters.length) return;

    function fillRow(el, items, reverseOrder) {
      if (!el) return;
      const order = reverseOrder ? [...items].reverse() : items;
      // duplicate the sequence so the CSS translateX(-50%) loop is seamless
      const doubled = order.concat(order);
      el.innerHTML = doubled
        .map((t) => '<img src="' + t.poster + '" alt="" loading="lazy" decoding="async">')
        .join("");
    }
    fillRow($("#poster-row-a"), withPosters, false);
    fillRow($("#poster-row-b"), withPosters, true);

    const track = $("#marquee-track");
    if (track) {
      const items = DOOMSDAY_TITLES.concat(DOOMSDAY_TITLES); // duplicate for seamless loop
      track.innerHTML = items
        .map(
          (t) =>
            '<span class="marquee-item">' +
              '<span class="mq-seq">' + pad(t.seq) + '</span>' +
              "<span>" + escapeHTML(t.title) + "</span>" +
              '<span class="mq-year">' + t.year + "</span>" +
            "</span>"
        )
        .join("");
    }
  })();

  /* ---------- nav ---------- */
  const navToggle = $("#nav-toggle");
  const navLinks = $("#nav-links");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.matches(".nav-link")) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- threat level chip ---------- */
  const THREATS = ["UNKNOWN", "ELEVATED", "SEVERE", "CRITICAL", "REDACTED", "…HE SEES YOU"];
  let threatIdx = 0;
  $("#threat-chip").addEventListener("click", () => {
    threatIdx = (threatIdx + 1) % THREATS.length;
    const el = $("#threat-level");
    el.textContent = "SCANNING…";
    setTimeout(() => { el.textContent = THREATS[threatIdx]; }, 450);
  });

  /* ---------- render timeline ---------- */
  const timelineEl = $("#timeline");

  function renderTimeline() {
    timelineEl.innerHTML = DOOMSDAY_TITLES.map((item) => {
      const typeLabel = item.type.toUpperCase() + (item.typeNote ? " · " + item.typeNote.toUpperCase() : "");
      const phaseBadge = item.phase ? '<span class="tl-badge phase">' + item.phase.toUpperCase() + '</span>' : '';
      return (
        '<li class="tl-item reveal" data-id="' + item.id + '" data-state="unwatched">' +
          '<div class="tl-node mono"><span>' + pad(item.seq) + "</span></div>" +
          '<article class="tl-card" tabindex="0" role="button" ' +
            'aria-label="Open details for ' + escapeHTML(item.title) + '">' +
            '<div class="poster">' + posterHTML(item, false) + "</div>" +
            '<div class="tl-body">' +
              '<div class="tl-meta">' +
                '<span class="tl-seq">ENTRY ' + pad(item.seq) + "/" + pad(TOTAL) + "</span>" +
                phaseBadge +
                '<span class="tl-badge ' + item.type.toLowerCase() + '">' + typeLabel + "</span>" +
                '<span class="tl-year">' + item.year + "</span>" +
              "</div>" +
              '<h3 class="tl-title">' + escapeHTML(item.title) + "</h3>" +
              '<p class="tl-desc">' + escapeHTML(item.desc) + "</p>" +
              '<div class="tl-actions">' +
                '<a class="watch-btn" href="' + item.link + '" target="_blank" rel="noopener noreferrer" ' +
                  'aria-label="Watch ' + escapeHTML(item.title) + ' (opens in new tab)">' +
                  '<i class="fa-solid fa-play"></i> WATCH NOW</a>' +
                '<button class="state-btn mono" aria-label="Cycle watch status for ' + escapeHTML(item.title) + '">' +
                  "NOT WATCHED</button>" +
              "</div>" +
            "</div>" +
          "</article>" +
        "</li>"
      );
    }).join("");

    // wire events
    $$(".tl-item").forEach((li) => {
      const id = li.dataset.id;
      const card = $(".tl-card", li);

      card.addEventListener("click", (e) => {
        if (e.target.closest(".watch-btn") || e.target.closest(".state-btn")) return;
        openModal(id, card);
      });
      card.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " ") && e.target === card) {
          e.preventDefault();
          openModal(id, card);
        }
      });
      $(".state-btn", li).addEventListener("click", (e) => {
        e.stopPropagation();
        const cur = getState(id);
        const next = STATES[(STATES.indexOf(cur) + 1) % STATES.length];
        setState(id, next);
      });
      $(".watch-btn", li).addEventListener("click", (e) => e.stopPropagation());
      updateItemDom(id);
    });
  }

  const STATE_LABELS = { unwatched: "NOT WATCHED", watching: "▶ WATCHING", completed: "✓ COMPLETED" };

  function updateItemDom(id) {
    const li = $('.tl-item[data-id="' + id + '"]');
    if (!li) return;
    const state = getState(id);
    li.dataset.state = state;
    $(".state-btn", li).textContent = STATE_LABELS[state];
    const nodeSpan = $(".tl-node span", li);
    const item = DOOMSDAY_TITLES.find((t) => t.id === id);
    nodeSpan.textContent = state === "completed" ? "✓" : pad(item.seq);
  }

  function updateCurrentMarker() {
    const next = nextTitle();
    $$(".tl-item").forEach((li) => {
      li.classList.toggle("is-current", !!next && li.dataset.id === next.id && getState(li.dataset.id) !== "completed");
    });
  }

  /* ---------- dashboard / progress ---------- */
  const NOTES = [
    "AWAITING FIRST TRANSMISSION…",
    "SIGNAL ACQUIRED. KEEP MOVING.",
    "TIMELINE INTEGRITY DEGRADING…",
    "YOU ARE PAST THE POINT OF NO RETURN.",
    "FINAL CONVERGENCE IMMINENT.",
    "ALL FILES DECRYPTED. DOOMSDAY AWAITS."
  ];

  function updateDashboard() {
    const done = completedCount();
    const pct = Math.round((done / TOTAL) * 100);

    $("#completed-count").textContent = done;
    $("#progress-percent").textContent = pct + "%";
    $("#progress-fill").style.width = pct + "%";
    const track = $("#progress-track");
    track.setAttribute("aria-valuenow", String(done));

    let noteIdx;
    if (done === 0) noteIdx = 0;
    else if (done <= 3) noteIdx = 1;
    else if (done <= 7) noteIdx = 2;
    else if (done <= 11) noteIdx = 3;
    else if (done < TOTAL) noteIdx = 4;
    else noteIdx = 5;
    $("#progress-note").textContent = "// " + NOTES[noteIdx];

    // next destination card
    const nd = $("#next-destination");
    const next = nextTitle();
    if (done > 0 && next) {
      nd.hidden = false;
      $("#next-title").textContent = next.title;
      $("#next-meta").textContent =
        "FILE " + pad(next.seq) + "/" + pad(TOTAL) + " · " + next.year + " · " + next.type.toUpperCase();
    } else if (done === TOTAL) {
      nd.hidden = false;
      $("#next-title").textContent = "JOURNEY COMPLETE";
      $("#next-meta").textContent = "ALL 15 FILES DECRYPTED · SEE YOU AT DOOMSDAY";
      $(".next-lead", nd).textContent = "There is nothing left to watch.";
    } else {
      nd.hidden = true;
    }
    updateCurrentMarker();
  }

  $("#continue-btn").addEventListener("click", () => {
    const next = nextTitle();
    if (!next) {
      document.getElementById("timeline-section").scrollIntoView({ behavior: "smooth" });
      return;
    }
    const li = $('.tl-item[data-id="' + next.id + '"]');
    if (li) {
      li.scrollIntoView({ behavior: "smooth", block: "center" });
      const card = $(".tl-card", li);
      card.style.boxShadow = "0 0 60px rgba(255,181,71,.45)";
      setTimeout(() => { card.style.boxShadow = ""; }, 1600);
    }
  });

  /* ---------- ticks ---------- */
  (function buildTicks() {
    const ticks = $(".progress-ticks");
    for (let i = 0; i < TOTAL; i++) ticks.appendChild(document.createElement("i"));
  })();

  /* ---------- search & filters ---------- */
  function applyFilters() {
    let visible = 0;
    $$(".tl-item").forEach((li) => {
      const item = DOOMSDAY_TITLES.find((t) => t.id === li.dataset.id);
      const state = getState(item.id);
      let show = true;

      if (activeFilter === "movies") show = item.type === "Movie";
      else if (activeFilter === "series") show = item.type === "Series";
      else if (activeFilter === "phase4") show = item.phase === "Phase 4";
      else if (activeFilter === "phase5") show = item.phase === "Phase 5";
      else if (activeFilter === "completed") show = state === "completed";
      else if (activeFilter === "remaining") show = state !== "completed";

      if (show && searchQuery) {
        const hay = (item.title + " " + item.year + " " + item.type + " " + (item.phase || "")).toLowerCase();
        show = hay.includes(searchQuery);
      }
      li.classList.toggle("hidden-by-filter", !show);
      if (show) visible++;
    });
    $("#empty-state").hidden = visible !== 0;
  }

  $("#search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    applyFilters();
  });

  $$(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  /* ---------- modal ---------- */
  const backdrop = $("#modal-backdrop");
  const modal = $("#detail-modal");

  function openModal(id, trigger) {
    const item = DOOMSDAY_TITLES.find((t) => t.id === id);
    if (!item) return;
    modalItemId = id;
    lastFocused = trigger || document.activeElement;

    $("#modal-seq").textContent = "FILE " + pad(item.seq) + " / " + pad(TOTAL) + " — DECRYPTED";
    $("#modal-title").textContent = item.title;
    $("#modal-meta").textContent =
      item.year + " · " + item.type.toUpperCase() + (item.typeNote ? " · " + item.typeNote.toUpperCase() : "");
    $("#modal-desc").textContent = item.desc;
    $("#modal-poster").innerHTML = '<div class="poster">' + posterHTML(item, true) + "</div>";
    $("#modal-watch").href = item.link;
    syncModalStatus();

    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("open"));
    document.body.style.overflow = "hidden";
    modal.focus();
  }

  function syncModalStatus() {
    if (!modalItemId) return;
    const state = getState(modalItemId);
    $$("#modal-toggle button").forEach((b) => b.classList.toggle("active", b.dataset.status === state));
    const label = $("#modal-status-label");
    label.className = "modal-status mono s-" + state;
    label.textContent =
      state === "completed" ? "◈ STATUS: FILE COMPLETED" :
      state === "watching" ? "◈ STATUS: TRANSMISSION IN PROGRESS" :
      "◈ STATUS: NOT YET ACCESSED";
  }

  function closeModal() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { backdrop.hidden = true; }, 300);
    modalItemId = null;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  $("#modal-close").addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!backdrop.hidden) closeModal();
      const breach = $("#breach-overlay");
      if (!breach.hidden) hideBreach();
    }
  });
  $$("#modal-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (modalItemId) setState(modalItemId, btn.dataset.status);
    });
  });

  /* ---------- easter egg: logo clicks ---------- */
  let logoClicks = 0;
  let logoTimer = null;
  const breachOverlay = $("#breach-overlay");

  $("#logo-btn").addEventListener("click", () => {
    logoClicks++;
    clearTimeout(logoTimer);
    logoTimer = setTimeout(() => { logoClicks = 0; }, 2500);
    if (logoClicks >= 5) {
      logoClicks = 0;
      showBreach();
    } else if (logoClicks === 1) {
      // single click = go home
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  function showBreach() {
    breachOverlay.hidden = false;
    breachOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("shake");
    document.body.style.overflow = "hidden";
    setTimeout(() => document.body.classList.remove("shake"), 450);
    $("#breach-close").focus();
  }
  function hideBreach() {
    breachOverlay.hidden = true;
    breachOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  $("#breach-close").addEventListener("click", hideBreach);

  /* ---------- scroll reveal ---------- */
  function setupReveal() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });
    
    $$(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------- footer year ---------- */
  const footerYear = $("#footer-year");
  if (footerYear) footerYear.textContent = "EARTH-616 · " + new Date().getFullYear();

  /* ---------- HERO CHARACTER PILLAR SHOWCASE ---------- */
  function initHeroShowcase() {
    const pillarLeft = $("#pillar-card-left");
    const pillarRight = $("#pillar-card-right");
    if (!pillarLeft || !pillarRight) return;

    // Click on cards opens detail modal for relevant movies
    pillarLeft.addEventListener("click", () => {
      openModal("mcu-19", pillarLeft); // Infinity War ID
    });
    pillarRight.addEventListener("click", () => {
      openModal("mcu-34", pillarRight); // Deadpool & Wolverine ID
    });

    // Mouse tilt effect
    [pillarLeft, pillarRight].forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / (rect.height / 2)) * -10;
        const tiltY = (x / (rect.width / 2)) * 10;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.04)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- init ---------- */
  renderTimeline();
  updateDashboard();
  applyFilters();
  setupReveal();
  initHeroShowcase();

})();
