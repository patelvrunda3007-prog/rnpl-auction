/* ============================================================
   RNPL — RAJPUR NIGHT PREMIER LEAGUE · SEASON 2026
   Core Application Engine (V3 Fully Completed Live Bidding & Bypasses)
   ============================================================ */

'use strict';

// ── ROOT SYSTEM STATE ───────────────────────────────────────
let screenState = "tournament"; // "tournament" | "landing" | "auction" | "dashboard" | "admin"
let teams = [];                 // Franchise DB
let players = [];               // Players DB (69 players)
let drawCount = 0;              // Total available draws made
let recallCount = 0;            // Total unsold recall draws made

// ── LIVE BIDDING AUCTION STATE ──────────────────────────────
let activePlayer = null;        // Currently loaded player object
let currentBid = 2000;          // Incremental auction price, base = 2000
let bidder = null;              // Leading team ID
let bidHistory = [];            // Recent bids list
let running = false;            // Is bidding active
let paused = false;             // Is bidding paused
let isAnimating = false;        // Is draw animation running

// ── DRAW TRANSITION ENGINE STATE ────────────────────────────
let drawType = "available";     // "available" | "unsold"
let selectedDrawPlayer = null;  // Player drawn to be revealed
let cyclingInterval = null;     // Interval pointer for rapid names flash
let animationDuration = 3000;   // 3 seconds total duration

// ── NAVIGATION FILTERS STATE ────────────────────────────────
let selectedRoleFilter = 'ALL';

// ── FORMATTER HELPERS ───────────────────────────────────────

// Format numbers in Indian comma styling (e.g. 1,00,000 or 2,000)
function formatPoints(pts) {
  if (pts === null || pts === undefined) return '0';
  return pts.toLocaleString('en-IN');
}

// Generate 2-3 char uppercase avatar initials from full name
function getAvatar(name) {
  if (!name) return '';
  return name.trim().split(/\s+/).map(word => word[0]).join('').slice(0, 3).toUpperCase();
}

// ── APP INITIALIZATION ──────────────────────────────────────
function initApp() {
  if (typeof window.initialTeams === 'undefined' || typeof window.initialPlayers === 'undefined') {
    console.error("Critical: Initial teams/players configs are not loaded.");
    return;
  }

  // Clone Teams from configuration
  teams = window.initialTeams.map(t => ({
    id: t.id,
    name: t.name,
    short: t.short,
    color: t.color,
    captain: t.captain,
    budget: 100000,
    spent: 0,
    players: []
  }));

  // Clone Players from configuration (69 players total)
  players = window.initialPlayers.map(p => ({
    id: p.id,
    name: p.name,
    role: p.role,
    base: 2000,
    avatar: getAvatar(p.name),
    status: 'available', // 'available' | 'sold' | 'unsold' | 'recalled'
    soldTo: null,
    soldFor: null
  }));

  // Render initial first page (Tournament Info screen)
  renderTournamentPage();
  
  // Set default route
  navigateTo('tournament');
}

// ── SCREEN NAVIGATION & STADIUM ROUTER ──────────────────────
function navigateTo(screenId) {
  screenState = screenId;

  // Toggle visible containers
  document.getElementById('screen-tournament').style.display = 'none';
  document.getElementById('screen-landing').style.display = 'none';
  document.getElementById('screen-auction').style.display = 'none';
  document.getElementById('screen-dashboard').style.display = 'none';
  document.getElementById('screen-admin').style.display = 'none';

  // Toggle page-wide backgrounds based on current screen
  const body = document.getElementById('body-container');
  if (screenId === 'tournament') {
    body.className = "tournament-bg";
  } else {
    body.className = "app-bg-stadium";
  }

  // Show active screen
  document.getElementById(`screen-${screenId}`).style.display = 'block';

  // Manage navigation link highlights
  const links = ['tournament', 'landing', 'auction', 'dashboard', 'admin'];
  links.forEach(l => {
    const btn = document.getElementById(`navlink-${l}`);
    if (btn) {
      if (l === screenId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  // Trigger screen-specific rendering
  if (screenId === 'tournament') {
    renderTournamentPage();
  } else if (screenId === 'landing') {
    renderLandingPage();
  } else if (screenId === 'auction') {
    switchAuctionTab(currentAuctionTab);
  } else if (screenId === 'dashboard') {
    renderDashboardScreen();
  } else if (screenId === 'admin') {
    renderAdminScreen();
  }

  window.scrollTo(0, 0);
}

// ── SCREEN 1: TOURNAMENT INFO PAGE RENDERER ─────────────────
function renderTournamentPage() {
  // Update total players dynamic counter
  const totalPlayersCount = players.length;
  const countLbl = document.getElementById('tourney-total-players-lbl');
  if (countLbl) {
    countLbl.textContent = totalPlayersCount;
  }

  // Populate Right participating list
  const listContainer = document.getElementById('tournament-teams-list');
  if (!listContainer) return;

  listContainer.innerHTML = teams.map(t => {
    return `
      <div class="team-row-item">
        <div class="team-row-identity">
          <div class="team-row-badge" style="background: ${t.color}">${t.short}</div>
          <span class="team-row-name">${t.name}</span>
        </div>
        <span class="team-row-capt">${t.captain}</span>
      </div>
    `;
  }).join('');
}

// ── SCREEN 2: TEAMS LANDING PAGE RENDERER ───────────────────
function renderLandingPage() {
  const container = document.getElementById('landing-teams-list');
  if (!container) return;

  container.innerHTML = teams.map(t => {
    return `
      <div class="landing-team-card" style="border-left: 4px solid ${t.color}">
        <div class="team-card-captain-lbl">CAPTAIN</div>
        <div class="team-card-captain-val">${t.captain}</div>
        <div class="team-card-divider"></div>
        <div class="team-card-identity">
          <div class="team-card-badge-circle" style="background: ${t.color}">${t.short}</div>
          <div class="team-card-fullname">${t.name}</div>
        </div>
        <div class="team-card-budget">Budget: ${formatPoints(t.budget)} POINTS</div>
      </div>
    `;
  }).join('');
}

// ── SCREEN 3: LIVE AUCTION ROOM TAB CONTROLLERS ─────────────
let currentAuctionTab = 'live';

function switchAuctionTab(tabId) {
  currentAuctionTab = tabId;

  // Toggle panels
  document.getElementById('auction-tab-content-live').style.display = 'none';
  document.getElementById('auction-tab-content-squads').style.display = 'none';
  document.getElementById('auction-tab-content-pool').style.display = 'none';

  // Toggle buttons
  document.getElementById('btn-tab-live').classList.remove('active');
  document.getElementById('btn-tab-squads').classList.remove('active');
  document.getElementById('btn-tab-pool').classList.remove('active');

  if (tabId === 'live') {
    document.getElementById('auction-tab-content-live').style.display = 'block';
    document.getElementById('btn-tab-live').classList.add('active');
    renderLiveBiddingTab();
  } else if (tabId === 'squads') {
    document.getElementById('auction-tab-content-squads').style.display = 'block';
    document.getElementById('btn-tab-squads').classList.add('active');
    renderSquadsTab();
  } else if (tabId === 'pool') {
    document.getElementById('auction-tab-content-pool').style.display = 'block';
    document.getElementById('btn-tab-pool').classList.add('active');
    renderPlayerPool();
  }
}

// ── TAB: LIVE BIDDING SYSTEM RENDERERS ──────────────────────
function renderLiveBiddingTab() {
  renderDrawPanelCounts();
  renderActiveBidDisplayCard();
  renderActiveControlsArea();
  renderTeamBidGrid();
  renderBidHistory();
  renderBudgetTracker();
  renderStatusCounterBar();
}

// Render available/unsold/sold metrics inside the draw panel
function renderDrawPanelCounts() {
  const availableCount = players.filter(p => p.status === 'available').length;
  const unsoldCount = players.filter(p => p.status === 'unsold').length;
  const soldCount = players.filter(p => p.status === 'sold').length;

  const btnAvailable = document.getElementById('btn-draw-available');
  const btnUnsold = document.getElementById('btn-draw-unsold');
  
  if (btnAvailable) {
    btnAvailable.disabled = isAnimating || availableCount === 0;
  }

  if (btnUnsold) {
    btnUnsold.disabled = isAnimating || unsoldCount === 0;
    // Add pulsing orange glow if unsold players exist in pool
    if (unsoldCount > 0 && !isAnimating) {
      btnUnsold.classList.add('pulse-orange');
    } else {
      btnUnsold.classList.remove('pulse-orange');
    }
  }

  // Populate dynamic select dropdown
  const select = document.getElementById('manual-player-select');
  if (select) {
    let selectHtml = `<option value="">── CHOOSE A PLAYER MANUALLY ──</option>`;
    
    // Group 1: Available
    const availables = players.filter(p => p.status === 'available');
    if (availables.length > 0) {
      selectHtml += `<optgroup label="── AVAILABLE (${availables.length}) ──">`;
      availables.forEach(p => {
        selectHtml += `<option value="${p.id}">${p.name}</option>`;
      });
      selectHtml += `</optgroup>`;
    }

    // Group 2: Unsold
    const unsolds = players.filter(p => p.status === 'unsold');
    if (unsolds.length > 0) {
      selectHtml += `<optgroup label="── UNSOLD (${unsolds.length}) ──">`;
      unsolds.forEach(p => {
        selectHtml += `<option value="${p.id}">${p.name} (UNSOLD)</option>`;
      });
      selectHtml += `</optgroup>`;
    }
    
    select.innerHTML = selectHtml;
    select.disabled = isAnimating;
  }

  // Update dynamic count tags
  const badgeAvailable = document.getElementById('badge-count-available');
  const badgeUnsold = document.getElementById('badge-count-unsold');
  const badgeSold = document.getElementById('badge-count-sold');

  if (badgeAvailable) badgeAvailable.textContent = `🟢 AVAILABLE: ${availableCount}`;
  if (badgeUnsold) badgeUnsold.textContent = `🟡 UNSOLD: ${unsoldCount}`;
  if (badgeSold) badgeSold.textContent = `🔴 SOLD: ${soldCount}`;
}

// Left Card: CURRENT BID DISPLAY
function renderActiveBidDisplayCard() {
  const card = document.getElementById('active-bid-display-card');
  if (!card) return;

  if (!activePlayer) {
    card.className = "current-bid-display-card";
    card.innerHTML = `<div class="no-player-selected-msg">NO PLAYER SELECTED</div>`;
    return;
  }

  const p = activePlayer;
  const isWK = p.role === 'WICKET KEEPER';
  const circleBg = isWK ? '#00838F' : '#6A1B9A';
  const circleBorder = isWK ? '#00BCD4' : '#9C27B0';
  const badgeHtml = isWK ? `<span class="role-badge-wk">WICKET KEEPER</span>` : `<span class="role-badge-ar">ALL ROUNDER</span>`;

  let leadingText = "Leading: —";
  let leadingColor = "rgba(255,255,255,0.3)";
  if (bidder) {
    const leadTeam = teams.find(t => t.id === bidder);
    if (leadTeam) {
      leadingText = `Leading: ${leadTeam.short}`;
      leadingColor = leadTeam.color;
    }
  }

  card.className = "current-bid-display-card has-selected";
  card.innerHTML = `
    <div class="active-player-header">
      <div class="active-player-circle" style="background: ${circleBg}; border: 2px solid ${circleBorder}; box-shadow: 0 0 15px ${circleBorder}60;">
        ${p.avatar}
      </div>
      <div class="active-player-title-info">
        <span class="active-player-title-name">${p.name}</span>
        <div>${badgeHtml}</div>
      </div>
    </div>
    
    <div class="player-card-divider" style="margin: 16px 0 10px;"></div>
    
    <div class="bid-info-labels-row">
      <span class="bid-info-lbl">CURRENT BID</span>
      <span class="bid-info-base">BASE PRICE: 2,000 pts</span>
    </div>
    <div class="bid-info-val">${formatPoints(currentBid)} pts</div>
    <div class="bid-info-leader" style="color: ${leadingColor}">${leadingText}</div>
  `;
}

// Right Card: STATE-BASED ACTION CONTROLS
function renderActiveControlsArea() {
  const container = document.getElementById('active-controls-area');
  if (!container) return;

  if (!activePlayer) {
    container.innerHTML = `
      <div class="control-buttons-msg">SELECT A PLAYER FROM THE DRAW PANEL OR PLAYERS POOL TO BEGIN</div>
    `;
    return;
  }

  let controlsHtml = "";

  if (!running && !paused) {
    // STATE B — player selected, not started:
    controlsHtml = `
      <div class="control-buttons-container">
        <button class="btn-ctrl-start-b" onclick="startBidding()">▶ START BIDDING</button>
      </div>
    `;
  } else if (running && !paused) {
    // STATE C (bidder = null) or STATE D (bidder !== null)
    const isWaitingMsg = !bidder ? `<div class="state-c-waiting-msg">Waiting for first bid...</div>` : '';
    // SOLD button only rendered if a team has bid, never disabled
    const soldBtnHtml = bidder ? `<button class="btn-ctrl-sold-gold" onclick="markSold()">🔨 SOLD!</button>` : '';

    controlsHtml = `
      <div class="control-buttons-container">
        <div class="btn-ctrl-action-row">
          <button class="btn-ctrl-resume" style="opacity: 0.5; cursor: not-allowed;" disabled>▶ RESUME</button>
          <button class="btn-ctrl-pause" onclick="pauseBidding()">⏸ PAUSE</button>
          <button class="btn-ctrl-pass" onclick="markUnsold()">✗ PASS (UNSOLD)</button>
        </div>
        ${soldBtnHtml}
        ${isWaitingMsg}
      </div>
    `;
  } else if (paused) {
    // STATE E — paused
    const soldBtnHtml = bidder ? `<button class="btn-ctrl-sold-gold" onclick="markSold()">🔨 SOLD!</button>` : '';
    controlsHtml = `
      <div class="control-buttons-container">
        <div class="btn-ctrl-action-row">
          <button class="btn-ctrl-resume" onclick="resumeBidding()">▶ RESUME</button>
          <button class="btn-ctrl-pause" style="opacity: 0.5; cursor: not-allowed;" disabled>⏸ PAUSE</button>
          <button class="btn-ctrl-pass" onclick="markUnsold()">✗ PASS (UNSOLD)</button>
        </div>
        ${soldBtnHtml}
      </div>
    `;
  }

  container.innerHTML = controlsHtml;
}

// 8 TEAM BID CARDS (ALWAYS RENDERED)
function renderTeamBidGrid() {
  const container = document.getElementById('auction-team-bid-grid');
  if (!container) return;

  container.innerHTML = teams.map(t => {
    const isLeading = bidder === t.id;
    const activeClass = isLeading ? 'leading-bidder' : '';
    const budgetLeft = t.budget;

    // Enable buttons only if auction is running, not paused, and team has enough budget
    const canBid1000 = (running && !paused) && (budgetLeft >= currentBid + 1000);
    const canBid2000 = (running && !paused) && (budgetLeft >= currentBid + 2000);
    const canBid5000 = (running && !paused) && (budgetLeft >= currentBid + 5000);

    return `
      <div class="team-bid-card ${activeClass}">
        <div class="team-bid-card-header" style="background: ${t.color}">
          <span class="team-bid-card-short">${t.short}</span>
          <span class="team-bid-card-budget">${formatPoints(budgetLeft)} pts</span>
        </div>
        <div class="team-bid-card-captain">CAPTAIN: ${t.captain}</div>
        <div class="team-bid-card-buttons-stack">
          <button class="btn-bid-vertical" onclick="placeBid(${t.id}, 1000)" ${canBid1000 ? '' : 'disabled'}>+1K Bid</button>
          <button class="btn-bid-vertical" onclick="placeBid(${t.id}, 2000)" ${canBid2000 ? '' : 'disabled'}>+2K Bid</button>
          <button class="btn-bid-vertical" onclick="placeBid(${t.id}, 5000)" ${canBid5000 ? '' : 'disabled'}>+5K Bid</button>
        </div>
      </div>
    `;
  }).join('');
}

// Sidebar: BID HISTORY
function renderBidHistory() {
  const container = document.getElementById('auction-bid-history-list');
  const badge = document.getElementById('history-bid-badge');
  if (!container) return;

  if (badge) {
    badge.textContent = `${bidHistory.length} BIDS`;
  }

  if (bidHistory.length === 0) {
    container.innerHTML = `<div class="no-bids-placed-msg">No bids placed yet</div>`;
    return;
  }

  container.innerHTML = bidHistory.map((b, idx) => {
    const isLatest = idx === 0;
    const latestClass = isLatest ? 'latest-bid' : '';
    return `
      <div class="bid-history-row ${latestClass}">
        <span class="bid-history-dot" style="background: ${b.color};"></span>
        <span class="bid-history-team-short">${b.short}</span>
        <span class="bid-history-amt">${formatPoints(b.amount)} PTS</span>
        <span class="bid-history-time">${b.time}</span>
      </div>
    `;
  }).join('');
}

// Sidebar: TEAM BUDGET PROGRESS TRACKER
function renderBudgetTracker() {
  const container = document.getElementById('auction-budget-tracker-list');
  if (!container) return;

  container.innerHTML = teams.map(t => {
    const progressWidth = (t.budget / 100000) * 100;
    return `
      <div class="budget-tracker-row">
        <div class="budget-tracker-info">
          <span class="budget-tracker-fullname" style="color: ${t.color}">${t.name}</span>
          <span class="budget-tracker-pts">${formatPoints(t.budget)} pts / 1L</span>
        </div>
        <div class="budget-progress-bar-bg">
          <div class="budget-progress-bar-fill" style="background: ${t.color}; width: ${progressWidth}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

// Bottom Status Counter Bar (REMAINING: X | SOLD: X | UNSOLD: X)
function renderStatusCounterBar() {
  const container = document.getElementById('bottom-status-bar-counters');
  if (!container) return;

  const remaining = players.filter(p => p.status === 'available' || p.status === 'recalled').length;
  const sold = players.filter(p => p.status === 'sold').length;
  const unsold = players.filter(p => p.status === 'unsold').length;

  container.innerHTML = `
    <span>REMAINING: <span class="bottom-status-bar-val">${remaining}</span></span>
    <span style="color: rgba(255, 255, 255, 0.15);">|</span>
    <span>SOLD: <span class="bottom-status-bar-val">${sold}</span></span>
    <span style="color: rgba(255, 255, 255, 0.15);">|</span>
    <span>UNSOLD: <span class="bottom-status-bar-val">${unsold}</span></span>
  `;
}

// ── DIGITAL PLAYER DRAW TRANSITION ENGINE ───────────────────

// Start Draw workflow
function startDrawFromPool(type) {
  if (isAnimating) return;

  const pool = players.filter(p => p.status === type);
  if (pool.length === 0) return;

  isAnimating = true;
  drawType = type;
  
  // Disable dropdown and drawing triggers immediately
  renderLiveBiddingTab();

  // Pick target player randomly
  const targetIndex = Math.floor(Math.random() * pool.length);
  selectedDrawPlayer = pool[targetIndex];

  // Fire Visual Draw Overlay
  const drawOverlay = document.getElementById('overlay-draw');
  drawOverlay.classList.add('active');

  // Reset overlay stages
  document.getElementById('draw-anim-stage').style.display = 'flex';
  document.getElementById('draw-reveal-stage').style.display = 'none';
  document.getElementById('btn-close-draw-overlay').style.display = 'none';

  // Start cricket ball spinning
  const ball = document.getElementById('anim-cricket-ball');
  ball.style.animationPlayState = 'running';

  runDrawAnimationCycle(pool);
}

// Run dynamic name rapid flasher cycles
function runDrawAnimationCycle(pool) {
  const label = document.getElementById('draw-cycling-name');
  let startTime = Date.now();
  
  function flashName() {
    const elapsed = Date.now() - startTime;

    if (elapsed < 2000) {
      // Rapid cycling: every 80ms
      label.textContent = pool[Math.floor(Math.random() * pool.length)].name;
      cyclingInterval = setTimeout(flashName, 80);
    } else if (elapsed < 2600) {
      // Decelerating phase 1: every 200ms
      label.textContent = pool[Math.floor(Math.random() * pool.length)].name;
      cyclingInterval = setTimeout(flashName, 200);
    } else if (elapsed < 3000) {
      // Decelerating phase 2: every 350ms
      label.textContent = pool[Math.floor(Math.random() * pool.length)].name;
      cyclingInterval = setTimeout(flashName, 350);
    } else {
      // Complete: Lock target player, trigger white slot strobe flashes
      label.textContent = selectedDrawPlayer.name;
      
      const ball = document.getElementById('anim-cricket-ball');
      ball.style.animationPlayState = 'paused';
      
      triggerStrobeFlashes();
    }
  }

  flashName();
}

// Triggers 3 white flashes on selection complete
function triggerStrobeFlashes() {
  const flashOverlay = document.getElementById('draw-flash-effect');
  flashOverlay.classList.add('flash-active');

  setTimeout(() => {
    flashOverlay.classList.remove('flash-active');
    
    // Switch animation stage to Selected Player Reveal Screen
    document.getElementById('draw-anim-stage').style.display = 'none';
    document.getElementById('draw-reveal-stage').style.display = 'block';
    document.getElementById('btn-close-draw-overlay').style.display = 'block';

    renderPlayerRevealCard();
  }, 300);
}

// Populate Selected Player Reveal card inside the Draw Portal
function renderPlayerRevealCard() {
  const p = selectedDrawPlayer;
  const isWK = p.role === 'WICKET KEEPER';
  const roleBadge = isWK ? `<span class="role-badge-wk">WICKET KEEPER</span>` : `<span class="role-badge-ar">ALL ROUNDER</span>`;
  
  const avatar = document.getElementById('reveal-player-avatar');
  avatar.textContent = p.avatar;
  avatar.className = isWK ? "reveal-card-avatar wk-avatar" : "reveal-card-avatar ar-avatar";

  document.getElementById('reveal-player-name').textContent = p.name;
  document.getElementById('reveal-player-role-badge').innerHTML = roleBadge;

  // Status displays
  const statusLabel = document.getElementById('reveal-player-status-lbl');
  if (p.status === 'unsold') {
    statusLabel.textContent = "UNSOLD";
    statusLabel.className = "reveal-card-val status-badge-unsold";
  } else if (p.status === 'recalled') {
    statusLabel.textContent = "RECALLED";
    statusLabel.className = "reveal-card-val status-badge-recalled";
  } else {
    statusLabel.textContent = "AVAILABLE";
    statusLabel.className = "reveal-card-val status-badge-available";
  }

  // Pop-in pop Card
  const card = document.getElementById('anim-reveal-card');
  card.classList.remove('reveal-card-active');
  // force reflow
  void card.offsetWidth;
  card.classList.add('reveal-card-active');
}

// START BIDDING action triggered from reveal screen
function confirmRevealStartBidding() {
  if (!selectedDrawPlayer) return;
  const p = selectedDrawPlayer;

  // Enforce Status Recalled if drawn from Unsold Draw pool
  if (p.status === 'unsold') {
    p.status = 'recalled';
    recallCount++;
  } else if (p.status === 'available') {
    drawCount++;
  }

  // Set local state variables
  activePlayer = p;
  currentBid = 2000;
  bidder = null;
  running = true;
  paused = false;
  bidHistory = [];

  // Close Draw overlay
  closeDrawOverlay();

  // Force re-renders & direct lock
  switchAuctionTab('live');
}

// Bypasses Draw Animation completely for manual selection dropdown
function handleManualPlayerSelection(select) {
  const playerId = parseInt(select.value);
  if (isNaN(playerId)) return;

  const p = players.find(x => x.id === playerId);
  if (!p) return;

  selectedDrawPlayer = p;
  isAnimating = true;

  // Skip animation, fire overlay and reveal immediately
  const drawOverlay = document.getElementById('overlay-draw');
  drawOverlay.classList.add('active');

  document.getElementById('draw-anim-stage').style.display = 'none';
  document.getElementById('draw-reveal-stage').style.display = 'block';
  document.getElementById('btn-close-draw-overlay').style.display = 'block';

  renderPlayerRevealCard();
  
  // reset select element value
  select.value = "";
}

// Close Draw overlay Portal
function closeDrawOverlay() {
  clearTimeout(cyclingInterval);
  document.getElementById('overlay-draw').classList.remove('active');
  isAnimating = false;
  selectedDrawPlayer = null;
  renderLiveBiddingTab();
}

// ── AUCTION LIVE BIDDING ENGINE CONTROLLERS ─────────────────

function startBidding() {
  if (!activePlayer) return;
  running = true;
  paused = false;
  currentBid = 2000;
  bidder = null;
  bidHistory = [];
  renderLiveBiddingTab();
}

function pauseBidding() {
  paused = true;
  renderLiveBiddingTab();
}

function resumeBidding() {
  paused = false;
  renderLiveBiddingTab();
}

// Trigger place bid incremental ticks (+1K, +2K, +5K)
function placeBid(teamId, increment) {
  if (!running || paused) return;
  
  const team = teams.find(t => t.id === teamId);
  if (!team) return;

  if (team.budget < currentBid + increment) return;

  currentBid += increment;
  bidder = team.id;

  const now = new Date();
  const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  bidHistory.unshift({
    short: team.short,
    color: team.color,
    amount: currentBid,
    time: timestamp
  });

  // cap history rows
  if (bidHistory.length > 20) {
    bidHistory.pop();
  }

  renderLiveBiddingTab();
}

// Complete mark sold logic (V3 with 2.8s Portal display)
function markSold() {
  if (!activePlayer || bidder === null) return;

  const p = activePlayer;
  const team = teams.find(t => t.id === bidder);
  if (!team) return;

  // Deduct team budgets spent
  team.budget -= currentBid;
  team.spent += currentBid;
  team.players.push({ ...p, soldFor: currentBid });

  // Update status in master players array (Sold state is Permanent)
  const dbPlayer = players.find(x => x.id === p.id);
  if (dbPlayer) {
    dbPlayer.status = 'sold';
    dbPlayer.soldTo = bidder;
    dbPlayer.soldFor = currentBid;
  }

  // Populate sold overlay fields
  document.getElementById('overlay-sold-player-name').textContent = p.name;
  document.getElementById('overlay-sold-team-name').textContent = team.name;
  document.getElementById('overlay-sold-price-val').textContent = `${formatPoints(currentBid)} POINTS`;

  // Display Sold Overlay portal
  const soldOverlay = document.getElementById('overlay-sold');
  soldOverlay.classList.add('active');

  // Display for 2.8 seconds and auto-reset
  setTimeout(() => {
    soldOverlay.classList.remove('active');

    // Reset local auction states
    activePlayer = null;
    currentBid = 2000;
    bidder = null;
    bidHistory = [];
    running = false;
    paused = false;

    checkAuctionPoolCompleteness();
    renderLiveBiddingTab();
  }, 2800);
}

// Complete mark unsold logic (V3 with 2s Portal display)
function markUnsold() {
  if (!activePlayer) return;
  const p = activePlayer;

  // Update status in master players array (Unsold players stay in pool, moves to unsold status)
  const dbPlayer = players.find(x => x.id === p.id);
  if (dbPlayer) {
    dbPlayer.status = 'unsold';
    dbPlayer.soldTo = null;
    dbPlayer.soldFor = null;
  }

  // Populate Unsold overlay fields
  document.getElementById('overlay-unsold-player-name').textContent = p.name;

  // Display Unsold Overlay portal
  const unsoldOverlay = document.getElementById('overlay-unsold');
  unsoldOverlay.classList.add('active');

  // Display for 2 seconds and auto-reset
  setTimeout(() => {
    unsoldOverlay.classList.remove('active');

    // Reset local auction states
    activePlayer = null;
    currentBid = 2000;
    bidder = null;
    bidHistory = [];
    running = false;
    paused = false;

    checkAuctionPoolCompleteness();
    renderLiveBiddingTab();
  }, 2000);
}

// Check pool availability
function checkAuctionPoolCompleteness() {
  const remaining = players.some(p => p.status === 'available' || p.status === 'recalled');
  if (!remaining) {
    alert("AUCTION COMPLETE! All available players have been successfully drawn and auctioned.");
  }
}

// ── TAB: SQUADS VIEW TAB RENDERER ───────────────────────────
function renderSquadsTab() {
  const container = document.getElementById('auction-squads-grid');
  if (!container) return;

  container.innerHTML = teams.map(t => {
    let rowsHtml = "";
    if (t.players.length === 0) {
      rowsHtml = `<div class="squad-no-players">No players acquired yet</div>`;
    } else {
      rowsHtml = t.players.map(p => {
        const isWK = p.role === 'WICKET KEEPER';
        const circleBg = isWK ? '#00838F' : '#6A1B9A';
        const circleBorder = isWK ? '#00BCD4' : '#9C27B0';
        const roleShort = isWK ? `<span class="role-badge-wk">WK</span>` : `<span class="role-badge-ar">AR</span>`;

        return `
          <div class="compact-player-row">
            <div class="compact-circle-32" style="background: ${circleBg}; border: 1px solid ${circleBorder}; box-shadow: 0 0 8px ${circleBorder}40;">
              ${p.avatar}
            </div>
            <span class="compact-name-13">${p.name}</span>
            <div style="margin-left: 10px; margin-right: 8px;">${roleShort}</div>
            <span class="compact-price-gold">${formatPoints(p.soldFor)} pts</span>
          </div>
        `;
      }).join('');
    }

    return `
      <div class="squad-team-card">
        <div class="squad-team-card-header" style="background: ${t.color}">
          <div class="squad-team-header-left">
            <span class="squad-team-captain">CAPTAIN: ${t.captain}</span>
            <span class="squad-team-names">${t.short} · ${t.name}</span>
          </div>
          <span class="squad-team-budget-left">${formatPoints(t.budget)} pts left</span>
        </div>
        <div class="squad-team-card-body">
          <div class="squad-team-summary-lbl">${t.players.length} players · ${formatPoints(t.spent)} spent</div>
          <div class="squad-team-players-list">
            ${rowsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── TAB: PLAYERS POOL VIEW TAB RENDERER ─────────────────────
function filterPlayersByRole(role) {
  selectedRoleFilter = role;

  // Set tag active styling
  document.getElementById('btn-filter-all').classList.remove('active');
  document.getElementById('btn-filter-wk').classList.remove('active');
  document.getElementById('btn-filter-ar').classList.remove('active');

  if (role === 'ALL') {
    document.getElementById('btn-filter-all').classList.add('active');
  } else if (role === 'WICKET KEEPER') {
    document.getElementById('btn-filter-wk').classList.add('active');
  } else if (role === 'ALL ROUNDER') {
    document.getElementById('btn-filter-ar').classList.add('active');
  }

  renderPlayerPool();
}

function filterPlayersPool() {
  renderPlayerPool();
}

function renderPlayerPool() {
  const container = document.getElementById('auction-players-pool-grid');
  if (!container) return;

  const searchVal = document.getElementById('player-search-input').value.toLowerCase().trim();

  const filtered = players.filter(p => {
    const matchRole = (selectedRoleFilter === 'ALL') || (p.role === selectedRoleFilter);
    const matchSearch = p.name.toLowerCase().includes(searchVal);
    return matchRole && matchSearch;
  });

  // Update counter in title
  const titleText = document.getElementById('players-pool-title-text');
  if (titleText) {
    titleText.textContent = `PLAYERS POOL (${filtered.length})`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 48px 0;">
        No players found matching current search terms.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => getPlayerCardMarkup(p)).join('');
}

// Get standard player card template (Section 6 spec)
function getPlayerCardMarkup(p) {
  const isWK = p.role === 'WICKET KEEPER';
  const roleClass = isWK ? 'role-wk' : 'role-ar';
  const isActive = activePlayer && (activePlayer.id === p.id);
  const activeClass = isActive ? 'active-selected' : '';
  const badgeHtml = isWK ? `<span class="role-badge-wk">WICKET KEEPER</span>` : `<span class="role-badge-ar">ALL ROUNDER</span>`;

  let statusBadgeHtml = "";
  if (p.status === 'available') {
    statusBadgeHtml = `<span class="status-badge-available">AVAILABLE</span>`;
  } else if (p.status === 'sold') {
    statusBadgeHtml = `<span class="status-badge-sold">SOLD</span>`;
  } else if (p.status === 'unsold') {
    statusBadgeHtml = `<span class="status-badge-unsold">UNSOLD</span>`;
  } else if (p.status === 'recalled') {
    statusBadgeHtml = `<span class="status-badge-recalled">RECALLED</span>`;
  }

  let soldInfoHtml = "";
  if (p.status === 'sold' && p.soldTo) {
    const sTeam = teams.find(t => t.id === p.soldTo);
    if (sTeam) {
      soldInfoHtml = `<div class="player-card-sold-info">${sTeam.short} · ${formatPoints(p.soldFor)} PTS</div>`;
    }
  }

  // State-based Action button at card bottom
  let actionButtonHtml = "";
  if (isActive) {
    actionButtonHtml = `<button class="btn-card-action btn-card-sold" disabled>BIDDING ONGOING</button>`;
  } else if (p.status === 'available' || p.status === 'recalled') {
    actionButtonHtml = `<button class="btn-card-action btn-card-available" onclick="loadPlayerBypassingDraw(${p.id})">PUT UP FOR AUCTION</button>`;
  } else if (p.status === 'sold') {
    actionButtonHtml = `<button class="btn-card-action btn-card-sold" disabled>SOLD ✓</button>`;
  } else if (p.status === 'unsold') {
    actionButtonHtml = `<button class="btn-card-action btn-card-unsold" onclick="loadPlayerBypassingDraw(${p.id})">RECALL PLAYER</button>`;
  }

  return `
    <div class="player-card ${roleClass} ${activeClass}">
      <div>
        <div class="player-card-row1">
          <span class="player-card-name">${p.name}</span>
          <div class="player-card-circle">${p.avatar}</div>
        </div>
        <div class="player-card-row2">${badgeHtml}</div>
      </div>
      
      <div>
        <div class="player-card-divider"></div>
        <div class="player-card-row3">
          <div class="player-card-status-sec">
            <span class="player-card-lbl">STATUS</span>
            ${statusBadgeHtml}
            ${soldInfoHtml}
          </div>
          <div class="player-card-details-sec" style="text-align: right;">
            <span class="player-card-lbl">DETAILS</span>
            <span class="player-card-details-val">Base Price:</span>
            <span class="player-card-details-val" style="color: var(--gold); font-weight: 700;">2,000 pts</span>
          </div>
        </div>
        
        <div class="player-card-action">${actionButtonHtml}</div>
      </div>
    </div>
  `;
}

// Bypass draw animation and load directly from list actions
function loadPlayerBypassingDraw(playerId) {
  if (running) {
    if (!confirm("An auction is currently active. Do you want to terminate this bid and force load this selected player?")) {
      return;
    }
  }

  const p = players.find(x => x.id === playerId);
  if (!p) return;

  if (p.status === 'unsold') {
    p.status = 'recalled';
  }

  activePlayer = p;
  currentBid = 2000;
  bidder = null;
  running = false;
  paused = false;
  bidHistory = [];

  // Redirect to Live Bidding automatically
  switchAuctionTab('live');
}

// ── SCREEN 4: OWNER FRANCHISE DASHBOARD RENDERER ────────────
let selectedDashTeamId = 1;
let currentDashTab = 'squad';

function selectDashTeam(teamId) {
  selectedDashTeamId = teamId;
  renderDashboardScreen();
}

function switchDashboardTab(tabId) {
  currentDashTab = tabId;

  // Toggle visibility
  document.getElementById('dash-tab-panel-squad').style.display = 'none';
  document.getElementById('dash-tab-panel-roles').style.display = 'none';
  document.getElementById('dash-tab-panel-compare').style.display = 'none';

  // Set active tabs styles
  document.getElementById('btn-dash-tab-squad').classList.remove('active');
  document.getElementById('btn-dash-tab-roles').classList.remove('active');
  document.getElementById('btn-dash-tab-compare').classList.remove('active');

  if (tabId === 'squad') {
    document.getElementById('dash-tab-panel-squad').style.display = 'block';
    document.getElementById('btn-dash-tab-squad').classList.add('active');
    renderDashboardSquad();
  } else if (tabId === 'roles') {
    document.getElementById('dash-tab-panel-roles').style.display = 'block';
    document.getElementById('btn-dash-tab-roles').classList.add('active');
    renderDashboardRoles();
  } else if (tabId === 'compare') {
    document.getElementById('dash-tab-panel-compare').style.display = 'block';
    document.getElementById('btn-dash-tab-compare').classList.add('active');
    renderDashboardCompare();
  }
}

function renderDashboardScreen() {
  renderDashTeamSwitcher();
  renderDashHeroCard();
  renderDashStatsSummary();
  switchDashboardTab(currentDashTab);
}

// Render team selectors at top
function renderDashTeamSwitcher() {
  const container = document.getElementById('dash-team-selector');
  if (!container) return;

  container.innerHTML = teams.map(t => {
    const isActive = selectedDashTeamId === t.id;
    const activeStyle = isActive ? `background: ${t.color}; border-color: ${t.color}; color: #fff; box-shadow: 0 4px 12px ${t.color}50;` : '';
    const activeClass = isActive ? 'active' : '';

    return `
      <button class="dash-team-switcher-btn ${activeClass}" style="${activeStyle}" onclick="selectDashTeam(${t.id})">
        <span class="dash-team-switcher-btn-short">${t.short}</span>
        <span class="dash-team-switcher-btn-capt">${t.captain}</span>
      </button>
    `;
  }).join('');
}

// Render dynamic Hero card
function renderDashHeroCard() {
  const container = document.getElementById('dash-team-hero');
  if (!container) return;

  const t = teams.find(x => x.id === selectedDashTeamId);
  if (!t) return;

  container.innerHTML = `
    <div class="dash-hero-card" style="background: linear-gradient(135deg, ${t.color}35, #161722); border-left: 4px solid ${t.color};">
      <div class="dash-hero-left">
        <span class="dash-hero-captain-lbl">CAPTAIN</span>
        <span class="dash-hero-captain-val">${t.captain}</span>
        <span class="dash-hero-fullname">${t.name}</span>
      </div>
      <div class="dash-hero-stats-row">
        <div class="dash-hero-stat-box">
          <span class="dash-hero-stat-val">${formatPoints(t.budget)}</span>
          <span class="dash-hero-stat-lbl">Budget Left</span>
        </div>
        <div class="dash-hero-stat-box" style="margin-left: 24px;">
          <span class="dash-hero-stat-val">${formatPoints(t.spent)}</span>
          <span class="dash-hero-stat-lbl">Spent Points</span>
        </div>
      </div>
    </div>
  `;
}

// Render 3 stats cards
function renderDashStatsSummary() {
  const container = document.getElementById('dash-team-stats-row');
  if (!container) return;

  const t = teams.find(x => x.id === selectedDashTeamId);
  if (!t) return;

  container.innerHTML = `
    <div class="dash-summary-card">
      <div class="dash-summary-val">${t.players.length}</div>
      <div class="dash-summary-lbl">Players Acquired</div>
    </div>
    <div class="dash-summary-card">
      <div class="dash-summary-val">${formatPoints(t.budget)}</div>
      <div class="dash-summary-lbl">Budget Remaining</div>
    </div>
    <div class="dash-summary-card">
      <div class="dash-summary-val">${formatPoints(t.spent)}</div>
      <div class="dash-summary-lbl">Spent Points</div>
    </div>
  `;
}

// Subtab: Squad table
function renderDashboardSquad() {
  const tbody = document.getElementById('dash-squad-table-body');
  if (!tbody) return;

  const t = teams.find(x => x.id === selectedDashTeamId);
  if (!t) return;

  if (t.players.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--muted); padding: 32px 0;">
          No squad acquired yet. Acquire players in live bidding!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = t.players.map((p, idx) => {
    const isWK = p.role === 'WICKET KEEPER';
    const circleBg = isWK ? '#00838F' : '#6A1B9A';
    const circleBorder = isWK ? '#00BCD4' : '#9C27B0';
    const badge = isWK ? `<span class="role-badge-wk">WICKET KEEPER</span>` : `<span class="role-badge-ar">ALL ROUNDER</span>`;

    return `
      <tr>
        <td style="font-weight: 700; color: var(--muted);">${idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="compact-circle-32" style="background: ${circleBg}; border: 1px solid ${circleBorder}; box-shadow: 0 0 6px ${circleBorder}40;">
              ${p.avatar}
            </div>
            <span style="font-size: 13px; font-weight: 700; color: #fff; text-transform: uppercase;">${p.name}</span>
          </div>
        </td>
        <td>${badge}</td>
        <td style="text-align: right; font-weight: 700; color: var(--gold); font-size: 15px;">
          ${formatPoints(p.soldFor)} PTS
        </td>
      </tr>
    `;
  }).join('');
}

// Subtab: Role breakdowns
function renderDashboardRoles() {
  const container = document.getElementById('dash-roles-container');
  if (!container) return;

  const t = teams.find(x => x.id === selectedDashTeamId);
  if (!t) return;

  const wks = t.players.filter(p => p.role === 'WICKET KEEPER');
  const ars = t.players.filter(p => p.role === 'ALL ROUNDER');

  const getSubListHtml = (list) => {
    if (list.length === 0) {
      return `<div style="color: var(--muted); font-size: 12px; padding: 16px 0; text-align: center; font-style: italic;">None acquired</div>`;
    }
    return list.map(p => {
      const isWK = p.role === 'WICKET KEEPER';
      const circleBg = isWK ? '#00838F' : '#6A1B9A';
      const circleBorder = isWK ? '#00BCD4' : '#9C27B0';

      return `
        <div class="compact-player-row">
          <div class="compact-circle-32" style="background: ${circleBg}; border: 1px solid ${circleBorder};">
            ${p.avatar}
          </div>
          <span class="compact-name-13">${p.name}</span>
          <span class="compact-price-gold">${formatPoints(p.soldFor)} pts</span>
        </div>
      `;
    }).join('');
  };

  container.innerHTML = `
    <div class="dash-role-card">
      <div class="dash-role-card-header">
        <span class="role-badge-wk" style="font-size: 12px; padding: 4px 12px;">WICKET KEEPER</span>
      </div>
      <div class="dash-role-list-wrapper">
        ${getSubListHtml(wks)}
      </div>
    </div>
    <div class="dash-role-card">
      <div class="dash-role-card-header">
        <span class="role-badge-ar" style="font-size: 12px; padding: 4px 12px;">ALL ROUNDER</span>
      </div>
      <div class="dash-role-list-wrapper">
        ${getSubListHtml(ars)}
      </div>
    </div>
  `;
}

// Subtab: Compare spent budgets
function renderDashboardCompare() {
  const container = document.getElementById('dash-compare-container');
  if (!container) return;

  const sorted = [...teams].sort((a, b) => b.spent - a.spent);

  container.innerHTML = sorted.map(t => {
    const fillPct = (t.spent / 100000) * 100;
    return `
      <div class="dash-compare-row">
        <div class="dash-compare-team-lbl" style="color: ${t.color}">${t.short}</div>
        <div class="dash-compare-team-fullname">${t.name}</div>
        <div class="dash-compare-bar-bg">
          <div class="dash-compare-bar-fill" style="background: ${t.color}; width: ${fillPct}%;">
            ${t.spent > 0 ? formatPoints(t.spent) + ' PTS' : ''}
          </div>
        </div>
        <div class="dash-compare-right-stats">${formatPoints(t.spent)} PTS · ${t.players.length} players</div>
      </div>
    `;
  }).join('');
}

// ── SCREEN 5: CONSOLE ADMINISTRATIVE GATES ──────────────────
let adminAuthed = false;
let currentAdminTab = 'stats';

function verifyAdminLogin() {
  const input = document.getElementById('admin-pass-input');
  const err = document.getElementById('admin-auth-error');
  if (!input) return;

  if (input.value === 'RAJPUR2026') {
    adminAuthed = true;
    err.style.display = 'none';
    input.value = '';
    renderAdminScreen();
  } else {
    err.style.display = 'block';
    input.value = '';
    input.focus();
  }
}

function logoutAdmin() {
  adminAuthed = false;
  document.getElementById('admin-pass-input').value = '';
  renderAdminScreen();
}

function switchAdminTab(tabId) {
  currentAdminTab = tabId;

  // Toggle panels
  document.getElementById('admin-tab-panel-stats').style.display = 'none';
  document.getElementById('admin-tab-panel-teams').style.display = 'none';

  // Toggle active buttons
  document.getElementById('btn-admin-tab-stats').classList.remove('active');
  document.getElementById('btn-admin-tab-teams').classList.remove('active');

  if (tabId === 'stats') {
    document.getElementById('admin-tab-panel-stats').style.display = 'block';
    document.getElementById('btn-admin-tab-stats').classList.add('active');
    renderAdminStats();
  } else if (tabId === 'teams') {
    document.getElementById('admin-tab-panel-teams').style.display = 'block';
    document.getElementById('btn-admin-tab-teams').classList.add('active');
    renderAdminTeamsOverview();
  }
}

function renderAdminScreen() {
  const gate = document.getElementById('admin-auth-gate');
  const dashboard = document.getElementById('admin-dashboard-panel');

  if (adminAuthed) {
    gate.style.display = 'none';
    dashboard.style.display = 'flex';
    switchAdminTab(currentAdminTab);
  } else {
    gate.style.display = 'flex';
    dashboard.style.display = 'none';
  }
}

function renderAdminStats() {
  const sPlayers = players.filter(p => p.status === 'sold');
  const uPlayers = players.filter(p => p.status === 'unsold');
  const totalSpent = teams.reduce((sum, t) => sum + t.spent, 0);
  const maxBid = sPlayers.length > 0 ? Math.max(...sPlayers.map(p => p.soldFor)) : 0;

  document.getElementById('admin-stat-sold-players').textContent = sPlayers.length;
  document.getElementById('admin-stat-unsold-players').textContent = uPlayers.length;
  document.getElementById('admin-stat-total-spent').textContent = `${formatPoints(totalSpent)} POINTS`;
  document.getElementById('admin-stat-highest-bid').textContent = `${formatPoints(maxBid)} POINTS`;

  // Draw statistics
  document.getElementById('admin-stat-draws-made').textContent = drawCount;
  document.getElementById('admin-stat-recalls-made').textContent = recallCount;

  // Render Log table
  const tbody = document.getElementById('admin-sales-log-body');
  if (!tbody) return;

  if (sPlayers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--muted); padding: 28px 0;">
          No players sold in the system yet.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = sPlayers.map((p, idx) => {
    const sTeam = teams.find(t => t.id === p.soldTo);
    const short = sTeam ? sTeam.short : '—';
    const color = sTeam ? sTeam.color : 'transparent';
    const roleBadge = p.role === 'WICKET KEEPER' ? `<span class="role-badge-wk">WK</span>` : `<span class="role-badge-ar">AR</span>`;

    return `
      <tr>
        <td style="font-weight: 700; color: var(--muted);">${idx + 1}</td>
        <td style="font-weight: 700; color: #fff; text-transform: uppercase;">${p.name}</td>
        <td>${roleBadge}</td>
        <td>
          <span class="admin-sales-team-pill" style="background: ${color}">${short}</span>
        </td>
        <td style="text-align: right; font-weight: 700; color: var(--gold);">${formatPoints(p.soldFor)} PTS</td>
      </tr>
    `;
  }).join('');
}

function renderAdminTeamsOverview() {
  const container = document.getElementById('admin-teams-overview-list');
  if (!container) return;

  container.innerHTML = teams.map(t => {
    const progressWidth = (t.spent / 100000) * 100;
    return `
      <div class="admin-team-card">
        <div class="admin-team-card-header" style="background: ${t.color}">
          <span>${t.short} | ${t.name}</span>
        </div>
        <div class="admin-team-card-body">
          <div class="admin-team-body-capt" style="color: var(--gold); font-weight: bold;">CAPTAIN: ${t.captain}</div>
          <div class="admin-team-stats-row">
            <div class="admin-team-stat-item">
              <span class="admin-team-stat-lbl">Players Acquired</span>
              <span class="admin-team-stat-val">${t.players.length}</span>
            </div>
            <div class="admin-team-stat-item">
              <span class="admin-team-stat-lbl">Budget Remaining</span>
              <span class="admin-team-stat-val">${formatPoints(t.budget)} pts</span>
            </div>
            <div class="admin-team-stat-item">
              <span class="admin-team-stat-lbl">Spent Points</span>
              <span class="admin-team-stat-val">${formatPoints(t.spent)} pts</span>
            </div>
          </div>
          <div class="admin-team-progress-bar-bg">
            <div class="admin-team-progress-bar-fill" style="background: ${t.color}; width: ${progressWidth}%;"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Reset Entire Auction system to V3 fresh state
function resetEntireAuction() {
  if (!confirm("Caution! Are you completely sure you want to restore the auction database? All franchise budgets will restore to 1,00,000 POINTS, all rosters will clear, and all 69 players will be returned to the available draw pool.")) {
    return;
  }

  // Restore cloned configs
  teams = window.initialTeams.map(t => ({
    id: t.id,
    name: t.name,
    short: t.short,
    color: t.color,
    captain: t.captain,
    budget: 100000,
    spent: 0,
    players: []
  }));

  players = window.initialPlayers.map(p => ({
    id: p.id,
    name: p.name,
    role: p.role,
    base: 2000,
    avatar: getAvatar(p.name),
    status: 'available',
    soldTo: null,
    soldFor: null
  }));

  activePlayer = null;
  currentBid = 2000;
  bidder = null;
  bidHistory = [];
  running = false;
  paused = false;
  isAnimating = false;
  drawCount = 0;
  recallCount = 0;

  alert("Auction databases refreshed successfully!");
  renderAdminScreen();
}

// ── BOOTSTRAP EVENT BINDINGS ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
