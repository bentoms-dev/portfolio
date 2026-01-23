// Game configuration
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const POSTER_ASSEMBLE_DEFAULTS = {
    boardDx: 2,
    boardDy: 16,
    boardScale: 1.02,
    snapTol: 28,
    pieces: {
        memory_poster_1: { tx: 655, ty: 102, scale: 0.99 },
        memory_poster_2: { tx: 829, ty: 100, scale: 1 },
        memory_poster_3: { tx: 807, ty: 238, scale: 1 },
        memory_poster_4: { tx: 653, ty: 173, scale: 1 },
        memory_poster_5: { tx: 653, ty: 281, scale: 1 },
        memory_poster_6: { tx: 742, ty: 378, scale: 1 }
    }
};

function getPosterAssembleConfig() {
    if (!game.posterAssembleConfig) {
        game.posterAssembleConfig = Object.assign({}, POSTER_ASSEMBLE_DEFAULTS);
        game.posterAssembleConfig.pieces = JSON.parse(JSON.stringify(POSTER_ASSEMBLE_DEFAULTS.pieces));
        for (const k of Object.keys(POSTER_ASSEMBLE_DEFAULTS.pieces)) {
            if (!game.posterAssembleConfig.pieces[k]) game.posterAssembleConfig.pieces[k] = { tx: null, ty: null, scale: 1 };
            if (game.posterAssembleConfig.pieces[k].scale == null) game.posterAssembleConfig.pieces[k].scale = 1;
        }
    }
    return game.posterAssembleConfig;
}

const HALLWAY_PHONE_X = 1950; // Reverted to original position
const HALLWAY_PHONE_Y = 50;   // Positive Y = On Screen
const HALLWAY_PHONE_W = 100;  // Tuned Up (from 68)
const HALLWAY_PHONE_H = 118;  // Tuned Up (from 80)
// -------------------------------------

// Control room TV overlay (tune these to line up with the background TV)
// Coordinates are normalized against the *control room background image*
// and then converted into world/screen space.
const CONTROL_ROOM_TV = {
    u: 0.440,  // left/right across the background image (0..1)
    v: 0.105,  // top/bottom across the background image (0..1)
    wu: 0.074, // width as fraction of background image width
    hv: 0.166, // height as fraction of background image height
    dx: 519,   // pixel nudge in screen-space
    dy: -73
};

const TICKETHALL_BG_DEFAULT = 'assets/rooms/station-tickethall.png';
const TICKETHALL_BG_ACTIVE = 'assets/rooms/tickethall-active.png';

function ensureTvOverlayEl() {
    if (game.tvOverlayEl) return game.tvOverlayEl;
    const container = document.querySelector('.game-container');
    if (!container) return null;

    const el = document.createElement('img');
    el.className = 'tv-overlay';
    el.alt = 'TV';
    el.decoding = 'async';
    el.style.display = 'none';
    container.appendChild(el);
    game.tvOverlayEl = el;
    return el;
}

// Set canvas size
canvas.width = 1600;
canvas.height = 600;

// Game state
const game = {
    canvas: canvas,
    ctx: ctx,
    keys: {},
    background: null,
    backgroundLoaded: false,
    backgroundWidth: 3200, // 2x canvas width for scrolling
    backgroundScale: 1, // Will be calculated based on height
    cameraX: 0,
    gravity: 0.5,
    cameraX: 0,
    gravity: 0.35, // Reduced for floatier jump (was 0.5)
    platformY: 480, // Floor Level

    // Interactive Objects System
    objects: [
        { id: 1, type: 'newspaper', name: 'Newspaper', x: 600, y: 0, width: 40, height: 30, hover: false },
        { id: 2, type: 'wallet', name: 'Wallet', x: 950, y: 0, width: 20, height: 20, hover: false }
    ],
    inventory: [], // Stores picked up items
    overlayOpen: false,
    viewedItem: null,

    // Intro State
    introActive: true,
    cameraX: 0,
    gravity: 0.25, // Significantly reduced gravity for slower jump
    platformY: 230, // Reverted to 230 per user preference (Platform Level)

    // Interactive Objects System
    objects: [
        // Objects will be loaded dynamically per room
    ],
    objectSprites: {}, // Cache for object sprites

    // Game state
    paused: false,
    settingsOpen: false,
    settingsPage: 'audio', // 'audio' | 'controls'
    keys: {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false,
        ShiftLeft: false,
        ShiftRight: false,
        Space: false,
        KeyE: false, // Interact
        KeyI: false, // Inventory
        KeyO: false, // Dev: Toggle Debug
        KeyP: false, // Pause
        Digit1: false,
        Digit2: false,
        Digit3: false,
        Digit4: false,
        Digit5: false
    },

    // Inventory System
    inventory: [], // Array of collected item IDs
    activeSlot: 0, // Currently selected slot index (0-4)

    // Level Specific State (Hallway)
    phoneState: 'DEAD', // DEAD, WAITING, RINGING, ANSWERED, FINISHED
    activeRing: null,   // Audio Object for ringing
    phoneTimer: 0,      // Timer for phone events
    isPhoneLocked: false, // Prevents movement during calls
    phoneAnimSprite: null, // Overrides character sprite during calls

    // Hallway Poster State
    isPosterLocked: false, // Prevents movement during poster interactions
    posterAnimSprite: null, // Overrides character sprite during poster interactions

    // Cutscene lock (used for control-room system restore)
    cutsceneLocked: false,
    cutsceneAnimSprite: null,
    forceForwardFrames: 0,

    // DOM overlay element for TV gifs
    tvOverlayEl: null,
    tvOverlayKey: null,

    // Control Panel UI (Level 4)
    controlPanelOpen: false,
    controlPanel: {
        openedCount: 0,
        selectedIndex: 0,
        yellowOn: false,
        blueOn: false,
        greenOn: false,
        systemStarted: false
    },

    // Progress Flags
    flags: {
        controlRoomUnlocked: false,
        stationPowerOn: false,
        tvMode: 'static' // 'static' | 'hospital'
    },

    // Transition State
    transition: {
        active: false,
        alpha: 0, // Overlay opacity (0 to 1)
        state: 'IDLE', // IDLE, IN (Fade to Black), LOAD, WAIT_BG, OUT (Fade to Clear)
        timer: 0,
        targetRoom: null,
        spawnX: 0
    },

    // Deferred room switch (used when an interaction should finish dialogue first)
    pendingRoomSwitch: null,

    // Generic control lock (keeps update running but blocks player input)
    controlsLocked: false,

    // Level 5 (Outside) state
    outsideState: {
        busStopInRange: false,
        busStopVisitCount: 0,
        posterGameComplete: false,
        dadCutsceneStarted: false
    },

    // Credits roll (end of game)
    credits: {
        loaded: false,
        error: null,
        data: null,
        active: false,
        state: 'OFF', // OFF | ROLL | DONE
        lines: [],
        scrollY: 0,
        speed: 0.75,
        totalHeight: 0
    },

    // Poster Assemble mini-game (Level 5)
    posterAssembleOpen: false,
    posterAssemble: {
        pieces: [],
        draggingId: null,
        dragOffsetX: 0,
        dragOffsetY: 0,
        completed: false,
        pendingCutscene: false
    },

    // Camera override (when set, camera follows this instead of Jack)
    cameraOverrideX: null,

    // Scripted movement (used when controlsLocked is true)
    scriptedTargetVx: 0,

    // Dad NPC (Level 5)
    dadNpc: {
        visible: false,
        x: 4700,
        y: 0
    },

    // Room System
    currentRoom: 'platform',
    // Defined below
    rooms: {
        platform: {
            bg: 'assets/rooms/station-platform.png',
            music: 'platform',
            objects: [
                { type: 'newspaper', x: 800, y: 280, width: 50, height: 35, name: 'Newspaper', hovered: false },
                { type: 'wallet', x: 2000, y: 280, width: 40, height: 30, name: 'Wallet', hovered: false }
            ],
            exits: [
                // Central Tunnel
                { x: 1300, w: 150, target: 'hallway', spawnX: 250, label: 'HALLWAY', dir: 'up', type: 'door' }
            ]
        },
        hallway: {
            bg: 'assets/rooms/station-hallway.png',
            music: 'hallway',
            objects: [
                { type: 'phone', x: HALLWAY_PHONE_X, y: HALLWAY_PHONE_Y, width: HALLWAY_PHONE_W, height: HALLWAY_PHONE_H, name: 'Phone', hover: false },
                { type: 'poster', x: 500, y: 20, width: 150, height: 200, name: 'Poster', hover: false }
            ],
            exits: [
                { target: 'platform', x: 50, w: 100, h: 200, type: 'zone', dir: 'left', spawnX: 1300 },
                { target: 'ticket_hall', x: 5850, w: 100, h: 200, type: 'door', dir: 'right', spawnX: 300, label: 'To Ticket Hall' }
            ]
        },
        ticket_hall: {
            bg: TICKETHALL_BG_DEFAULT,
            music: 'tickethall',
            platformY: 260,
            objects: [
                { type: 'ticket_gates', x: 800, y: 200, width: 150, height: 200, name: 'Ticket Gates', hover: false, visible: false },
                { type: 'control_room_door', x: 513, y: 160, width: 80, height: 150, name: 'Control Room', hover: true, visible: true }
            ],
            exits: [
                { target: 'hallway', x: 50, w: 100, h: 200, type: 'zone', dir: 'left', spawnX: 5700 }
            ]
        },
          control_room: {
            bg: 'assets/rooms/station-control.png',
            music: 'control',
            platformY: 360,
            objects: [
                { type: 'control_desk', x: 1250, y: 250, width: 220, height: 160, name: 'Control Desk', hover: false, visible: false }
            ],
            exits: [
                { target: 'ticket_hall', x: 50, w: 100, h: 200, type: 'door', dir: 'up', spawnX: 520, label: 'Ticket Hall' }
            ]
        },
        outside: {
            bg: 'assets/rooms/outside.png',
            music: 'outside',
            platformY: 260,
            objects: [
                { type: 'bus_stop', x: 1670, y: 120, width: 220, height: 220, name: 'Bus Stop', hover: false, visible: true }
            ],
            exits: [
                // Return to the underground Ticket Hall
                { target: 'ticket_hall', x: 60, w: 160, h: 220, type: 'door', dir: 'down', spawnX: 900, label: 'Station', indicatorOffsetX: -50 }
            ]
        }
    },

    // Background Image
    background: null,
    backgroundLoaded: false,
    backgroundScale: 1,
    backgroundWidth: 0,

    // Logo
    logo: null,

    // Intro
    introActive: true,
    introPhase: 'wait', // wait, drop, stand, dialogue
    introTimer: 0,
    introTextPlayed: false,

    // Monologue System
    monologue: {
        active: false,
        text: "",
        timer: 0,
        alpha: 0,
        queue: [], // Queue of messages
        lastIdleLineIndex: -1,
        idleTimer: 0, // Time since last input/action
        nextIdleThreshold: 300, // Frames until next idle line (initially quick ~5s)
        hasHitWall: false,
        history: [], // Tracks played unique lines (for the current room)
        roomHistory: {} // roomKey -> history array (persists across re-entry)
    },

    // Health / Death System
    health: {
        maxTime: 108000, // 30 minutes @ 60fps (30 * 60 * 60)
        current: 108000,
        percentage: 100,
        state: 'ALIVE', // ALIVE, DYING, DEAD
        deathTimer: 0,
        fadeAlpha: 0, // For Game Over screen
    }
};

function getRoomBg(roomKey) {
    if (roomKey === 'ticket_hall' && game.flags?.stationPowerOn) return TICKETHALL_BG_ACTIVE;
    return game.rooms?.[roomKey]?.bg;
}

function ensureTicketHallActiveBg() {
    if (!game.flags?.stationPowerOn) return;
    if (game.rooms?.ticket_hall && game.rooms.ticket_hall.bg !== TICKETHALL_BG_ACTIVE) {
        game.rooms.ticket_hall.bg = TICKETHALL_BG_ACTIVE;
    }
}

// Game image assets
const character = {
    x: 300, // Moved significantly right to prevent sprite cut off (was 200)
    y: 230, // Platform Level (Fixed)
    width: 38, // Hitbox
    height: 70, // Hitbox
    speed: 5,
    runSpeed: 8,
    jumpPower: -7, // Reduced power (was -9)
    velocityX: 0,
    velocityY: 0,
    isGrounded: false,
    facingRight: true,
    direction: 'right', // 'left' or 'right'
    animationFrame: 0,
    sprites: {},
    spritesLoaded: 0,
    isInteracting: false,
    interactionTimer: 0
};

// Load Initial Background
// Load Initial Background
game.background = new Image();
game.background.onload = function() {
    game.backgroundLoaded = true;
    const scale = canvas.height / game.background.height;
    game.backgroundScale = scale;
};
game.background.src = getRoomBg(game.currentRoom);
// Objects will be loaded in init/switch
game.objects = [...game.rooms[game.currentRoom].objects];
character.animationTimer = 0;
character.animationSpeed = 10; // frames between animation changes
character.sprites = {
    forward: null,
    walkRight1: null,
    walkRight2: null,
    runRight1: null,
    runRight2: null,
    runRight3: null,
    jump: null,
    pickup: null
};

// Load background image
game.background = new Image();
game.background.onload = function() {
    game.backgroundLoaded = true;
    // Calculate the scaled background width
    const scale = canvas.height / game.background.height;
    game.backgroundScale = scale;
    game.backgroundWidth = game.background.width * scale;
};
game.background.src = 'assets/rooms/station-platform.png';

// Load character sprites
character.sprites.forward = new Image();
character.sprites.forward.onload = function() {
    character.spritesLoaded++;
};
character.sprites.forward.src = 'assets/character-forward.png';

character.sprites.walkRight1 = new Image();
character.sprites.walkRight1.onload = function() {
    character.spritesLoaded++;
};
character.sprites.walkRight1.src = 'assets/character-right.png';

character.sprites.walkRight2 = new Image();
character.sprites.walkRight2.onload = function() {
    character.spritesLoaded++;
};
character.sprites.walkRight2.src = 'assets/character-right-still.png';

character.sprites.runRight1 = new Image();
character.sprites.runRight1.onload = function() {
    character.spritesLoaded++;
};
character.sprites.runRight1.src = 'assets/character-run-1.png';

character.sprites.runRight2 = new Image();
character.sprites.runRight2.onload = function() {
    character.spritesLoaded++;
};
character.sprites.runRight2.src = 'assets/character-run-2.png';

character.sprites.runRight3 = new Image();
character.sprites.runRight3.onload = function() {
    character.spritesLoaded++;
};
character.sprites.runRight3.src = 'assets/character-run-3.png';

character.sprites.jump = new Image();
character.sprites.jump.onload = function() { character.spritesLoaded++; };
character.sprites.jump.src = 'assets/character-jump.png';

character.sprites.pickup = new Image();
character.sprites.pickup.onload = function() { character.spritesLoaded++; };
character.sprites.pickup.src = 'assets/character-pickup.png';

// Intro Sprites
character.sprites.sleep = new Image();
character.sprites.sleep.onload = function() { character.spritesLoaded++; };
character.sprites.sleep.src = 'assets/character-sleep.png';

character.sprites.kneel1 = new Image();
character.sprites.kneel1.onload = function() { character.spritesLoaded++; };
character.sprites.kneel1.src = 'assets/character-kneel-1.png'; // Mockup

// Load Object Sprites
// (Manual Phone Loader Removed - Moved to spritesToLoad)

// Phone Animation Sprites
character.sprites.back = new Image(); character.sprites.back.src = 'assets/character-back.png';
character.sprites.reach = new Image(); character.sprites.reach.src = 'assets/character-reach.png';
character.sprites.phoneTalk = new Image(); character.sprites.phoneTalk.src = 'assets/character-phone.png';

character.sprites.kneel2 = new Image();
character.sprites.kneel2.onload = function() { character.spritesLoaded++; };
character.sprites.kneel2.src = 'assets/character-kneel-2.png';

// Death Sprites
character.sprites.death1 = new Image();
character.sprites.death1.onload = function() { character.spritesLoaded++; };
character.sprites.death1.src = 'assets/character-death-1.png';

character.sprites.death2 = new Image();
character.sprites.death2.onload = function() { character.spritesLoaded++; };
character.sprites.death2.src = 'assets/character-death-2.png';

character.sprites.death3 = new Image();
character.sprites.death3.onload = function() { character.spritesLoaded++; };
character.sprites.death3.src = 'assets/character-death-3.png';

// Logo
game.logo = new Image();
game.logo.src = 'assets/terminal-logo.png';

// Load Sprites
const gameSprites = {}; // For Character
const spritesToLoad = {
    // Objects
    phone: 'assets/objects/phone.png',
    newspaper: 'assets/objects/newspaper.png',
    wallet: 'assets/objects/wallet.png',
    travel_card: 'assets/objects/travel-card.png',
    keycard: 'assets/objects/keycard.png',
    poster: 'assets/objects/key-poster.png',
    bus_stop: 'assets/objects/bus-stop.png',
    memory_poster_1: 'assets/objects/memory-poster-1.png',
    memory_poster_2: 'assets/objects/memory-poster-2.png',
    memory_poster_3: 'assets/objects/memory-poster-3.png',
    memory_poster_4: 'assets/objects/memory-poster-4.png',
    memory_poster_5: 'assets/objects/memory-poster-5.png',
    memory_poster_6: 'assets/objects/memory-poster-6.png',
    memory_poster_completed: 'assets/objects/memory-poster-completed.png',
    character_dad: 'assets/character-dad.png',
    // Control panel UI
    control_panel_bg: 'assets/control-panel.png',
    // Control room TV
    tv_static: 'assets/tv-static.gif',
    tv_hospital: 'assets/tv-hospital.gif',
    button_yellow: 'assets/objects/button-yellow.png',
    button_yellow_glow: 'assets/objects/button-yellow-glow.png',
    button_blue: 'assets/objects/button-blue.png',
    button_blue_glow: 'assets/objects/button-blue-glow.png',
    button_green: 'assets/objects/button-green.png',
    button_green_glow: 'assets/objects/button-green-glow.png',
    sys_start: 'assets/objects/sys-start.png',
    sys_start_glow: 'assets/objects/sys-start-glow.png',
    newspaper_large: 'assets/objects/newspaper-large.png', // Large view
    wallet_large: 'assets/objects/wallet-large.png',
    travel_card_large: 'assets/objects/travel-card-large.png',
    keycard_large: 'assets/objects/keycard-large.png',
    control_door: 'assets/objects/control-door.png',
    // Alias for level object type
    control_room_door: 'assets/objects/control-door.png',
    // Preload Room BGs?
    hallway: 'assets/rooms/station-hallway.png',
    tickethall_active_bg: TICKETHALL_BG_ACTIVE
};

game.objectSprites = {};
for (const key in spritesToLoad) {
    const img = new Image();
    img.src = spritesToLoad[key];
    game.objectSprites[key] = img;
    // img.onload ... (optional logging)
}

// Audio System
game.music = {
    platform: new Audio('assets/music/platform.ogg'),
    hallway: new Audio('assets/music/hallway.ogg'),
    tickethall: new Audio('assets/music/tickethall.ogg'),
    control: new Audio('assets/music/control.ogg'),
    outside: new Audio('assets/music/outside.ogg'),
    endCredits: new Audio('assets/music/end-credits.ogg')
};
game.music.platform.loop = true;
game.music.platform.volume = 0.4;
game.music.hallway.loop = true;
game.music.hallway.volume = 0.4;
game.music.tickethall.loop = true;
game.music.tickethall.volume = 0.4;
game.music.control.loop = true;
game.music.control.volume = 0.4;
game.music.outside.loop = true;
game.music.outside.volume = 0.4;
game.music.endCredits.loop = true;
game.music.endCredits.volume = 0.4;

function playMusic(key) {
    if (game.music[key]) {
        game.music[key].play().catch(() => {});
    }
}

function stopMusic(key) {
    if (game.music[key]) {
        game.music[key].pause();
        game.music[key].currentTime = 0;
    }
}

// SFX System
game.sfx = {
    text: new Audio('assets/sounds/text.wav'),
    pickup: new Audio('assets/sounds/pickup.wav'),
    jump: new Audio('assets/sounds/jump.wav'),
    confirm: new Audio('assets/sounds/confirm.wav')
};

function playSfx(key) {
    if (game.sfx[key]) {
        game.sfx[key].currentTime = 0;
        game.sfx[key].volume = 0.6;
        game.sfx[key].play().catch(() => {});
    }
}

async function loadCreditsData() {
    try {
        const url = new URL('credits.json', window.location.href);
        const res = await fetch(url.toString(), { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        game.credits.data = data;
        game.credits.loaded = true;
        game.credits.error = null;
    } catch (err) {
        game.credits.loaded = false;
        game.credits.error = String(err && err.message ? err.message : err);
        game.credits.data = {
            title: 'TERMINAL',
            subtitle: 'Thank you for playing',
            sections: []
        };
    }
}

function buildCreditsLines(data) {
    const safe = data || {};
    const title = (typeof safe.title === 'string') ? safe.title : 'TERMINAL';
    const subtitle = (typeof safe.subtitle === 'string') ? safe.subtitle : '';
    const sections = Array.isArray(safe.sections) ? safe.sections : [];

    const lines = [];
    lines.push({ type: 'title', text: title });
    if (subtitle) lines.push({ type: 'subtitle', text: subtitle });
    lines.push({ type: 'spacer', h: 24 });

    for (const section of sections) {
        const header = (section && typeof section.header === 'string') ? section.header : '';
        const entries = (section && Array.isArray(section.entries)) ? section.entries : [];
        if (header) {
            lines.push({ type: 'header', text: header });
            lines.push({ type: 'spacer', h: 10 });
        }
        for (const ent of entries) {
            const name = (ent && typeof ent.name === 'string') ? ent.name : '';
            const role = (ent && typeof ent.role === 'string') ? ent.role : '';
            if (!name && !role) continue;
            if (name) lines.push({ type: 'name', text: name });
            if (role) lines.push({ type: 'role', text: role });
            lines.push({ type: 'spacer', h: 10 });
        }
        lines.push({ type: 'spacer', h: 18 });
    }

    lines.push({ type: 'spacer', h: 40 });
    return lines;
}

function wrapTextLines(text, maxWidth, font) {
    const raw = String(text || '');
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [''];

    ctx.save();
    ctx.font = font;

    const out = [];
    let line = words[0];
    for (let i = 1; i < words.length; i++) {
        const test = line + ' ' + words[i];
        if (ctx.measureText(test).width <= maxWidth) {
            line = test;
        } else {
            out.push(line);
            line = words[i];
        }
    }
    out.push(line);
    ctx.restore();
    return out;
}

function measureCreditsTotalHeight(lines, maxWidth) {
    let h = 0;
    for (const line of lines) {
        if (line.type === 'spacer') {
            h += line.h || 0;
            continue;
        }

        let size = 12;
        let lineHeight = 18;
        if (line.type === 'title') { size = 42; lineHeight = 54; }
        else if (line.type === 'subtitle') { size = 16; lineHeight = 26; }
        else if (line.type === 'header') { size = 18; lineHeight = 30; }
        else if (line.type === 'name') { size = 14; lineHeight = 24; }
        else if (line.type === 'role') { size = 11; lineHeight = 18; }

        const font = `${size}px "Press Start 2P"`;
        const wrapped = wrapTextLines(line.text, maxWidth, font);
        h += wrapped.length * lineHeight;
    }
    return h;
}

function startCreditsRoll() {
    if (game.credits.active) return;

    game.settingsOpen = false;
    game.paused = false;
    game.controlsLocked = true;
    game.keys = {};

    // Stop room music + start credits music
    try {
        Object.keys(game.music || {}).forEach(k => stopMusic(k));
    } catch {}
    playMusic('endCredits');

    game.credits.active = true;
    game.credits.state = 'ROLL';
    game.credits.lines = buildCreditsLines(game.credits.data);
    game.credits.scrollY = canvas.height + 60;

    const maxWidth = Math.max(200, canvas.width - 220);
    game.credits.totalHeight = measureCreditsTotalHeight(game.credits.lines, maxWidth);
}

function updateCredits() {
    if (!game.credits.active) return;

    if (game.credits.state === 'ROLL') {
        game.credits.scrollY -= game.credits.speed;
        if (game.credits.scrollY + game.credits.totalHeight < -40) {
            game.credits.state = 'DONE';
        }
    }
}

function drawCredits() {
    if (!game.credits.active) return;

    ctx.save();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const cx = canvas.width / 2;
    const maxWidth = Math.max(200, canvas.width - 220);

    if (game.credits.state === 'DONE') {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.font = '36px "Press Start 2P"';
        ctx.fillText('THE END', cx, canvas.height / 2 - 20);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px "Press Start 2P"';
        ctx.fillText('PRESS ENTER TO RESTART', cx, canvas.height / 2 + 40);
        ctx.restore();
        return;
    }

    let y = game.credits.scrollY;
    for (const line of game.credits.lines) {
        if (line.type === 'spacer') {
            y += line.h || 0;
            continue;
        }

        let size = 12;
        let lineHeight = 18;
        let color = '#fff';
        if (line.type === 'title') { size = 42; lineHeight = 54; }
        else if (line.type === 'subtitle') { size = 16; lineHeight = 26; color = '#94a3b8'; }
        else if (line.type === 'header') { size = 18; lineHeight = 30; color = '#fbbf24'; }
        else if (line.type === 'name') { size = 14; lineHeight = 24; color = '#fff'; }
        else if (line.type === 'role') { size = 11; lineHeight = 18; color = '#94a3b8'; }

        const font = `${size}px "Press Start 2P"`;
        const wrapped = wrapTextLines(line.text, maxWidth, font);

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = color;
        ctx.font = font;

        for (const t of wrapped) {
            if (y > -100 && y < canvas.height + 100) {
                ctx.fillText(t, cx, y);
            }
            y += lineHeight;
        }
        ctx.restore();
    }
}

function ensureTravelCardInInventory() {
    if (game.inventory.some(i => i?.type === 'travel_card')) return;
    if (game.inventory.length >= 5) {
        return;
    }
    game.inventory.push({ type: 'travel_card', name: 'Travel Card' });
}

function switchRoomAfterMonologue(targetKey, spawnX, delayMs = 0) {
    game.pendingRoomSwitch = {
        targetKey,
        spawnX,
        at: Date.now() + Math.max(0, delayMs)
    };
}

// --- MONOLOGUE SYSTEM ---
function triggerMonologue(eventKey) {
    if (!game.monologue.ready || !game.monologue.data) return;

    // Check Trigger - FIND ALL MATCHING BEATS (sorted by delay roughly?)
    const beats = game.monologue.data.beats.filter(b => b.event === eventKey);
    // console.log("Trigger Monologue Matches:", beats.length);

    if (beats.length === 0) return;

    beats.forEach(beat => {
        // Check Once
        if (beat.once && game.monologue.history.includes(beat.id)) return;

        // Add to history
        game.monologue.history.push(beat.id);

        // Handle Delay (Silence Block)
        if (beat.delayMs && beat.delayMs > 0) {
            const frames = Math.ceil(beat.delayMs / 16.6);
            game.monologue.queue.push({
                text: "", // Silence
                duration: frames,
                meta: beat.meta,
                beatId: beat.id,
                eventKey
            });
        }

        beat.lines.forEach((line, index) => {
            const perChar = (beat.meta && beat.meta.perChar != null) ? beat.meta.perChar : 5;
            const minDuration = (beat.meta && beat.meta.minDuration != null) ? beat.meta.minDuration : 120;
            const durationMult = (beat.meta && beat.meta.durationMult != null) ? beat.meta.durationMult : 1;
            game.monologue.queue.push({
                text: line,
                duration: Math.ceil(Math.max(minDuration, line.length * perChar) * durationMult), // dynamic duration (tunable via meta)
                meta: beat.meta, // PASS METADATA (Speaker, Color)
                beatId: beat.id,
                eventKey
            });
        });
    });
}

function triggerMonologueBeatById(beatId) {
    if (!game.monologue.ready || !game.monologue.data) return;
    const beat = game.monologue.data.beats.find(b => b.id === beatId);
    if (!beat) return;
    if (beat.once && game.monologue.history.includes(beat.id)) return;

    game.monologue.history.push(beat.id);

    if (beat.delayMs && beat.delayMs > 0) {
        const frames = Math.ceil(beat.delayMs / 16.6);
        game.monologue.queue.push({
            text: "",
            duration: frames,
            meta: beat.meta,
            beatId: beat.id,
            eventKey: beat.event
        });
    }

    beat.lines.forEach((line) => {
        const perChar = (beat.meta && beat.meta.perChar != null) ? beat.meta.perChar : 5;
        const minDuration = (beat.meta && beat.meta.minDuration != null) ? beat.meta.minDuration : 120;
        const durationMult = (beat.meta && beat.meta.durationMult != null) ? beat.meta.durationMult : 1;
        game.monologue.queue.push({
            text: line,
            duration: Math.ceil(Math.max(minDuration, line.length * perChar) * durationMult),
            meta: beat.meta,
            beatId: beat.id,
            eventKey: beat.event
        });
    });
}

function openPosterAssemble() {
    if (game.posterAssembleOpen) return;
    if (game.outsideState?.posterGameComplete) return;

    game.posterAssembleOpen = true;
    game.controlsLocked = true;
    game.posterAssemble.completed = false;
    game.posterAssemble.pendingCutscene = false;

    const cfg = getPosterAssembleConfig();

    // Build board layout based on the completed poster image
    const completed = game.objectSprites['memory_poster_completed'];
    const w0 = completed?.naturalWidth || 600;
    const h0 = completed?.naturalHeight || 400;

    const maxW = canvas.width * 0.78;
    const maxH = canvas.height * 0.72;
    const baseScale = Math.min(maxW / w0, maxH / h0, 1);
    const scale = baseScale * (cfg.boardScale || 1);

    // Keep for live debug resizing/tuning
    game.posterAssemble.layout = { baseScale };

    const boardW = Math.floor(w0 * scale);
    const boardH = Math.floor(h0 * scale);
    const boardX = Math.floor((canvas.width - boardW) / 2) + (cfg.boardDx || 0);
    const boardY = Math.floor((canvas.height - boardH) / 2) + (cfg.boardDy || 0);

    const keys = [
        'memory_poster_1',
        'memory_poster_2',
        'memory_poster_3',
        'memory_poster_4',
        'memory_poster_5',
        'memory_poster_6'
    ];

    // If the user hasn't tuned slots yet, default to a simple 3x2 grid inside the board.
    const cols = 3;
    const rows = 2;
    const cellW = Math.floor(boardW / cols);
    const cellH = Math.floor(boardH / rows);

    game.posterAssemble.board = { x: boardX, y: boardY, w: boardW, h: boardH };
    game.posterAssemble.pieces = keys.map((key, idx) => {
        const img = game.objectSprites[key];
        const iw = img?.naturalWidth || cellW;
        const ih = img?.naturalHeight || cellH;

        const pieceCfg = cfg.pieces?.[key] || { tx: null, ty: null, scale: 1 };
        const pieceScale = (pieceCfg.scale == null) ? 1 : pieceCfg.scale;

        // Scale pieces using the SAME baseScale as the completed poster so they can line up,
        // but allow per-piece tuning via pieceScale.
        const pw = Math.max(1, Math.floor(iw * baseScale * pieceScale));
        const ph = Math.max(1, Math.floor(ih * baseScale * pieceScale));

        // Default slot: 3x2 grid (only used until user tunes tx/ty)
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const cellX = boardX + col * cellW;
        const cellY = boardY + row * cellH;
        const defaultTx = Math.floor(cellX + (cellW - pw) / 2);
        const defaultTy = Math.floor(cellY + (cellH - ph) / 2);
        const tx = (pieceCfg.tx == null) ? defaultTx : pieceCfg.tx;
        const ty = (pieceCfg.ty == null) ? defaultTy : pieceCfg.ty;

        // Scatter pieces randomly for difficulty (using the real piece dimensions)
        const margin = 30;
        const scatterMinX = margin;
        const scatterMaxX = Math.max(margin, canvas.width - pw - margin);
        const scatterMinY = margin;
        const scatterMaxY = Math.max(margin, canvas.height - ph - margin);

        return {
            id: key,
            key,
            x: Math.floor(scatterMinX + Math.random() * (scatterMaxX - scatterMinX)),
            y: Math.floor(scatterMinY + Math.random() * (scatterMaxY - scatterMinY)),
            w: pw,
            h: ph,
            tx,
            ty,
            iw,
            ih,
            locked: false
        };
    });

    playSfx('confirm');
    triggerMonologue('INTERACTION_POSTER_ASSEMBLE');
}

function applyPosterAssembleConfigToRuntime({ boardDeltaX = 0, boardDeltaY = 0, scaleKey = null } = {}) {
    if (!game.posterAssembleOpen) return;
    const cfg = getPosterAssembleConfig();
    const baseScale = game.posterAssemble.layout?.baseScale || 1;

    // Shift the whole board/targets if requested
    if (boardDeltaX || boardDeltaY) {
        if (game.posterAssemble.board) {
            game.posterAssemble.board.x += boardDeltaX;
            game.posterAssemble.board.y += boardDeltaY;
        }
        (game.posterAssemble.pieces || []).forEach(p => {
            p.tx += boardDeltaX;
            p.ty += boardDeltaY;
            if (p.locked) {
                p.x = p.tx;
                p.y = p.ty;
            }
        });
    }

    // Sync tuned targets into runtime pieces
    (game.posterAssemble.pieces || []).forEach(p => {
        const pc = cfg.pieces?.[p.key];
        if (!pc) return;
        if (pc.tx != null) p.tx = pc.tx;
        if (pc.ty != null) p.ty = pc.ty;

        if (scaleKey && scaleKey === p.key) {
            const pieceScale = (pc.scale == null) ? 1 : pc.scale;
            p.w = Math.max(1, Math.floor((p.iw || p.w) * baseScale * pieceScale));
            p.h = Math.max(1, Math.floor((p.ih || p.h) * baseScale * pieceScale));
        }

        if (p.locked) {
            p.x = p.tx;
            p.y = p.ty;
        }
    });
}

function closePosterAssemble() {
    game.posterAssembleOpen = false;
    game.posterAssemble.draggingId = null;
    game.controlsLocked = false;
    game.scriptedTargetVx = 0;
}

function tryCompletePosterAssemble() {
    const pieces = game.posterAssemble.pieces;
    if (!pieces || pieces.length === 0) return;
    if (pieces.some(p => !p.locked)) return;

    game.posterAssemble.completed = true;
    game.posterAssemble.pendingCutscene = true;

    // Completion dialogue
    triggerMonologue('INTERACTION_POSTER_ASSEMBLE_COMPLETE');
}

function updateOutside() {
    if (game.currentRoom !== 'outside') return;

    // Bus stop proximity dialogue
    const busStop = game.objects.find(o => o.type === 'bus_stop');
    if (busStop) {
        const playerCenter = character.x + (character.width / 2);
        const objCenter = busStop.x + (busStop.width / 2);
        const dist = Math.abs(playerCenter - objCenter);
        const inRange = dist < 220;

        if (inRange && !game.outsideState.busStopInRange) {
            game.outsideState.busStopInRange = true;
            game.outsideState.busStopVisitCount = (game.outsideState.busStopVisitCount || 0) + 1;
            if (game.outsideState.busStopVisitCount === 1) triggerMonologue('INTERACTION_BUS_STOP');
            if (game.outsideState.busStopVisitCount === 2) triggerMonologue('INTERACTION_BUS_STOP_AGAIN');
        }
        if (!inRange) game.outsideState.busStopInRange = false;
    }

    // After poster puzzle completion dialogue finishes, close overlay and begin dad cutscene.
    if (game.posterAssembleOpen && game.posterAssemble.pendingCutscene) {
        const monologueDone = (!game.monologue.activeLine && game.monologue.queue.length === 0);
        if (monologueDone) {
            game.posterAssemble.pendingCutscene = false;
            closePosterAssemble();
            game.outsideState.posterGameComplete = true;
        }
    }

    if (game.outsideState.posterGameComplete && !game.outsideState.dadCutsceneStarted) {
        game.outsideState.dadCutsceneStarted = true;
        startDadCutscene();
    }

    if (game.dadCutscene && game.dadCutscene.active) {
        updateDadCutscene();
    }
}

function startDadCutscene() {
    game.controlsLocked = true;
    // Dad should appear near the (original) bus stop area. This avoids placing him off-map
    // if the Outside background isn't as wide as expected.
    const desiredDadX = 3000;
    const bgW = game.backgroundWidth || 6000;
    const clampedDadX = Math.max(200, Math.min(bgW - 200, desiredDadX));

    game.dadNpc.x = clampedDadX;
    game.dadNpc.visible = true;

    // Clamp meet point so Jack can always reach it (prevents walking forever at world edge)
    const maxMeetX = Math.max(0, bgW - (character.width || 40) - 10);
    const meetX = Math.max(0, Math.min(clampedDadX - 140, maxMeetX));

    game.dadCutscene = {
        active: true,
        phase: 'pan',
        dadX: clampedDadX,
        meetX,
        triggeredDialogue: false,
        fadeAlpha: 0,
        fading: false
    };

    // Dad's first line (then we pan/walk; remaining dialogue triggers after Jack reaches him)
    triggerMonologueBeatById('l5_dad_01');
}

function updateDadCutscene() {
    const cs = game.dadCutscene;
    if (!cs || !cs.active) return;

    // Camera target to reveal dad
    const maxCameraX = Math.max(0, game.backgroundWidth - canvas.width);
    const targetCam = Math.max(0, Math.min(maxCameraX, Math.floor(cs.dadX - (canvas.width / 2))));

    if (cs.phase === 'pan') {
        game.cameraOverrideX = targetCam;
        game.scriptedTargetVx = 0;
        if (Math.abs(game.cameraX - targetCam) < 6) {
            cs.phase = 'walk';
        }
        return;
    }

    if (cs.phase === 'walk') {
        game.cameraOverrideX = targetCam;
        character.direction = 'right';
        character.facingRight = true;
        // If meetX is unreachable due to world bounds, stop once we hit the clamp.
        const bgW = game.backgroundWidth || 6000;
        const maxX = Math.max(0, bgW - (character.width || 40) - 10);

        if (character.x < cs.meetX - 2 && character.x < maxX - 1) {
            game.scriptedTargetVx = 3.0;
        } else {
            game.scriptedTargetVx = 0;
            // Snap to meet point if close enough
            if (Math.abs(character.x - cs.meetX) < 6) character.x = cs.meetX;
            cs.phase = 'talk';
        }
        return;
    }

    if (cs.phase === 'talk') {
        game.cameraOverrideX = targetCam;
        game.scriptedTargetVx = 0;

        // Trigger remaining dad dialogue once Jack arrives.
        if (!cs.triggeredDialogue) {
            cs.triggeredDialogue = true;
            triggerMonologue('FINAL_PUZZLE_COMPLETE');
        }

        const monologueDone = (!game.monologue.activeLine && game.monologue.queue.length === 0);
        if (cs.triggeredDialogue && monologueDone) {
            cs.fading = true;
            cs.phase = 'fade';
        }
        return;
    }

    if (cs.phase === 'fade') {
        game.scriptedTargetVx = 0;
        // Fade to black at the end of the dad dialogue
        cs.fadeAlpha = Math.min(1, (cs.fadeAlpha || 0) + 0.01);
        if (cs.fadeAlpha >= 1) {
            cs.active = false;
            // Start rolling credits once we're fully black.
            if (!game.credits.active) startCreditsRoll();
        }
    }
}

function drawDadNpc() {
    if (game.currentRoom !== 'outside') return;
    if (!game.dadNpc?.visible) return;

    const spr = game.objectSprites['character_dad'];
    if (!spr || !spr.complete || !spr.naturalWidth) return;

    const scale = 0.22;
    const w = Math.floor(spr.naturalWidth * scale);
    const h = Math.floor(spr.naturalHeight * scale);

    const feetY = Math.floor(game.platformY + character.height);
    const drawY = feetY - h;
    const drawX = Math.floor((game.dadNpc.x - game.cameraX) - (w / 2));

    // Culling
    if (drawX + w < 0 || drawX > canvas.width) return;
    ctx.drawImage(spr, drawX, drawY, w, h);
}

function drawPosterAssemble() {
    if (!game.posterAssembleOpen) return;

    // Dim Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const board = game.posterAssemble.board;
    if (board) {
        // Board outline
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.strokeRect(board.x, board.y, board.w, board.h);
    }

    // Draw pieces
    const pieces = game.posterAssemble.pieces || [];
    pieces.forEach(p => {
        const img = game.objectSprites[p.key];
        if (img && img.complete && img.naturalWidth) {
            ctx.drawImage(img, p.x, p.y, p.w, p.h);
        } else {
            ctx.fillStyle = '#334155';
            ctx.fillRect(p.x, p.y, p.w, p.h);
        }

        if (p.locked) {
            ctx.strokeStyle = 'rgba(34,197,94,0.9)';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.w, p.h);
        }
    });

    // UI text
    ctx.fillStyle = '#fff';
    ctx.font = '14px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('Assemble the Poster', canvas.width / 2, 40);
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Drag pieces into place  •  Esc to close', canvas.width / 2, 62);
}

function getCanvasPointerPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const x = (evt.clientX - rect.left) * (canvas.width / rect.width);
    const y = (evt.clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
}

function posterHitTest(piece, px, py) {
    return px >= piece.x && px <= piece.x + piece.w && py >= piece.y && py <= piece.y + piece.h;
}

canvas.addEventListener('mousedown', (evt) => {
    if (!game.posterAssembleOpen) return;
    const { x, y } = getCanvasPointerPos(evt);

    const pieces = game.posterAssemble.pieces || [];
    for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        if (p.locked) continue;
        if (posterHitTest(p, x, y)) {
            game.posterAssemble.draggingId = p.id;
            game.posterAssemble.dragOffsetX = x - p.x;
            game.posterAssemble.dragOffsetY = y - p.y;
            // Bring to front
            pieces.splice(i, 1);
            pieces.push(p);
            evt.preventDefault();
            return;
        }
    }
});

canvas.addEventListener('mousemove', (evt) => {
    if (!game.posterAssembleOpen) return;
    const id = game.posterAssemble.draggingId;
    if (!id) return;

    const { x, y } = getCanvasPointerPos(evt);
    const p = (game.posterAssemble.pieces || []).find(pp => pp.id === id);
    if (!p) return;
    p.x = x - game.posterAssemble.dragOffsetX;
    p.y = y - game.posterAssemble.dragOffsetY;
    evt.preventDefault();
});

canvas.addEventListener('mouseup', (evt) => {
    if (!game.posterAssembleOpen) return;
    const id = game.posterAssemble.draggingId;
    if (!id) return;

    const p = (game.posterAssemble.pieces || []).find(pp => pp.id === id);
    game.posterAssemble.draggingId = null;
    if (!p) return;

    const snapTol = (getPosterAssembleConfig().snapTol == null) ? 28 : getPosterAssembleConfig().snapTol;
    if (Math.abs(p.x - p.tx) < snapTol && Math.abs(p.y - p.ty) < snapTol) {
        p.x = p.tx;
        p.y = p.ty;
        p.locked = true;
        playSfx('confirm');
        tryCompletePosterAssemble();
    }
    evt.preventDefault();
});

function onMonologueLineStart(lineObj) {
    if (!lineObj || !lineObj.beatId) return;

    // Level 4 TV/cutscene hooks
    if (game.currentRoom === 'control_room') {
        if (lineObj.beatId === 'l4_voice_04') {
            if (game.flags) game.flags.tvMode = 'static';
            // Force the DOM overlay to actually swap sources immediately
            game.tvOverlayKey = null;
        }
        if (lineObj.beatId === 'l4_voice_05') {
            // Turn Jack back to forward pose for the final line
            game.cutsceneAnimSprite = character.sprites.forward;
        }
    }
}

function updateMonologue() {
    // 1. Init Data
    if (!game.monologue.ready) {
        if (window.LEVEL_DATA) {
            game.monologue.data = window.LEVEL_DATA;
            game.monologue.ready = true;
            // logic moved to Wake Up trigger
        }
        return;
    }

    // 2. Manage Active Line
    if (game.monologue.activeLine) {
        game.monologue.timer--;
        if (game.monologue.timer <= 0) {
            game.monologue.activeLine = null;
        }
    } else if (game.monologue.queue.length > 0) {
        const next = game.monologue.queue.shift();
        game.monologue.activeLine = next; // Store the full object (text, duration, meta)
        game.monologue.timer = next.duration;
        playSfx('text'); // Reuse text sound for monologue?
        onMonologueLineStart(next);
    }

    // Deferred room switch after dialogue finishes
    if (
        game.pendingRoomSwitch &&
        !game.transition.active &&
        !game.monologue.activeLine &&
        game.monologue.queue.length === 0 &&
        Date.now() >= game.pendingRoomSwitch.at
    ) {
        const { targetKey, spawnX } = game.pendingRoomSwitch;
        game.pendingRoomSwitch = null;
        switchRoom(targetKey, spawnX);
        return;
    }

    // 3. Track Stats for Triggers
    if (!game.introActive && !game.isPhoneLocked && !game.isPosterLocked) { // Only track when playing AND not on phone/poster
        // Check for ANY significant movement (velocity > 0.5)
        if (Math.abs(character.velocityX) > 0.5) {
            game.monologue.walkTime++;
            game.monologue.idleTime = 0;

            if (!game.monologue.hasMoved) {
                game.monologue.hasMoved = true;
                triggerMonologue('PLAYER_FIRST_MOVE');
            }

            if (game.monologue.walkTime === 300) triggerMonologue('WALKING_5S'); // 5s
            if (game.monologue.walkTime === 480) triggerMonologue('WALKING_8S'); // 8s (Level 2)
            if (game.monologue.walkTime === 720) triggerMonologue('WALKING_12S'); // 12s
            if (game.monologue.walkTime === 960) triggerMonologue('WALKING_16S'); // 16s (Level 2)
        } else {
            game.monologue.idleTime++;
            game.monologue.walkTime = 0;

            // Randomized Idle Message Interval (6s - 30s)
            if (game.monologue.idleTime >= game.monologue.idleThreshold) {
                // Reset timer and Re-roll threshold
                game.monologue.idleTime = 0;
                game.monologue.idleThreshold = 360 + Math.floor(Math.random() * (1800 - 360));

                if (game.monologue.data && game.monologue.data.beats) {
                    // Find all unused idle beats
                    const availableBeats = game.monologue.data.beats.filter(b =>
                        b.id.startsWith('idle_') &&
                        !game.monologue.history.includes(b.id)
                    );

                    if (availableBeats.length > 0) {
                        const randomBeat = availableBeats[Math.floor(Math.random() * availableBeats.length)];
                        triggerMonologue(randomBeat.event);
                    }
                }
            }
        }
    }
}

// Input Handling
game.keys = {};

window.addEventListener('keydown', e => {
    // Credits controls (end of game)
    if (game.credits && game.credits.active) {
        if (!e.repeat && (e.code === 'Enter' || e.code === 'Space')) {
            location.reload();
            e.preventDefault();
            return;
        }

        // Swallow all other input while credits are active.
        e.preventDefault();
        return;
    }

    // Control Panel Navigation
    if (game.controlPanelOpen) {
        if (!e.repeat) {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                controlPanelMoveSelection(-1);
                e.preventDefault();
                return;
            }
            if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                controlPanelMoveSelection(1);
                e.preventDefault();
                return;
            }
            if (e.code === 'ArrowUp' || e.code === 'KeyW') {
                controlPanelMoveSelection(-1);
                e.preventDefault();
                return;
            }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                controlPanelMoveSelection(1);
                e.preventDefault();
                return;
            }

            if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
                controlPanelActivateSelected();
                e.preventDefault();
                return;
            }

            if (e.code === 'Escape') {
                // Allow exiting the panel (no state changes)
                game.controlPanelOpen = false;
                e.preventDefault();
                return;
            }
        }

        // Swallow all other keys while panel is open
        e.preventDefault();
        return;
    }

    // Poster Assemble (Level 5) overlay
    if (game.posterAssembleOpen) {
        if (!e.repeat && (e.code === 'Escape' || e.code === 'KeyO')) {
            // Allow closing only if not already completed
            if (!game.posterAssemble.completed) {
                closePosterAssemble();
            }
            e.preventDefault();
            return;
        }

        // Swallow all other keys while puzzle is open
        e.preventDefault();
        return;
    }

    // Inventory Navigation
    if (e.code === 'Digit1') game.activeSlot = 0;
    if (e.code === 'Digit2') game.activeSlot = 1;
    if (e.code === 'Digit3') game.activeSlot = 2;
    if (e.code === 'Digit4') game.activeSlot = 3;
    if (e.code === 'Digit5') game.activeSlot = 4;

    // Item Interaction (Open/Close)
    if (e.code === 'KeyO' && !e.repeat) {
        if (game.health.state !== 'ALIVE') return; // Block input if dead

        if (game.overlayOpen) {
            // Close Interaction: Trigger Monologue Now
            const sourceType = game.overlaySourceType || game.viewedItem?.type;
            if (sourceType === 'newspaper') triggerMonologue('PICKUP_NEWSPAPER');
            if (sourceType === 'wallet') triggerMonologue('PICKUP_WALLET');

            game.overlayOpen = false;
            game.viewedItem = null;
            game.overlaySourceType = null;
        } else {
            // Open Active Item
            const item = game.inventory[game.activeSlot];
            if (item) {
                game.overlayOpen = true;
                game.viewedItem = item;
                game.overlaySourceType = item.type;
                playSfx('confirm');
            }
        }
    }

    // Wallet inspect: press E to find the travel card
    if (e.code === 'KeyE' && !e.repeat && game.overlayOpen) {
        if (game.viewedItem?.type === 'wallet') {
            ensureTravelCardInInventory();
            game.overlaySourceType = game.overlaySourceType || 'wallet';
            game.viewedItem = { type: 'travel_card', name: 'Travel Card' };
            playSfx('confirm');
            e.preventDefault();
            return;
        }

        // Swallow E while any overlay is open (prevents world interactions)
        e.preventDefault();
        return;
    }

    // Settings Menu (Escape)
    if (e.code === 'Escape' && !e.repeat) {
        if (!game.paused) {
            game.settingsOpen = !game.settingsOpen;
            if (game.settingsOpen) game.settingsPage = game.settingsPage || 'audio';
        }
    }

    // Pause Menu (P)
    if (e.code === 'KeyP' && !e.repeat) {
        if (!game.settingsOpen) game.paused = !game.paused;
    }

    // Settings Controls
    if (game.settingsOpen) {
        // Switch Settings page
        if (!e.repeat && e.code === 'Tab') {
            game.settingsPage = (game.settingsPage === 'controls') ? 'audio' : 'controls';
            playSfx('text');
            e.preventDefault();
            return;
        }

        // Audio page controls
        if (game.settingsPage !== 'controls') {
            if (e.code === 'ArrowLeft') {
                const newVol = Math.max(0, game.music.platform.volume - 0.1);
                Object.values(game.music).forEach(audio => audio.volume = newVol);
                e.preventDefault();
                return;
            }
            if (e.code === 'ArrowRight') {
                const newVol = Math.min(1, game.music.platform.volume + 0.1);
                Object.values(game.music).forEach(audio => audio.volume = newVol);
                e.preventDefault();
                return;
            }
            if (e.code === 'KeyM' && !e.repeat) {
                const newMute = !game.music.platform.muted;
                Object.values(game.music).forEach(audio => audio.muted = newMute);
                e.preventDefault();
                return;
            }
        }

        // Swallow input while settings are open
        if ([
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space',
            'KeyE', 'KeyO', 'KeyP', 'KeyM',
            'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'
        ].includes(e.code)) {
            e.preventDefault();
            return;
        }
    }

     // Movement keys
     if (game.health.state === 'ALIVE' && !game.cutsceneLocked && !game.controlsLocked) {
         game.keys[e.code] = true;
     }

    // Restart Game
    if (game.health.state === 'DEAD' && e.code === 'Enter') {
        location.reload();
    }

    // Prevent scrolling for arrows/space
    // Prevent scrolling for arrows/space
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    // Handle Interact (E)
    if (e.code === 'KeyE' && !e.repeat) {
        if (game.cutsceneLocked) return;
        // Special case: Wake up from intro
        if (game.introActive && game.introPhase === 'wait') {
            game.introPhase = 'waking';
            game.introTimer = 0;
            playMusic(game.rooms[game.currentRoom]?.music || 'platform'); // Start BGM on interaction
            triggerMonologue('LEVEL_START');
            return;
        }
        checkInteraction();
    }
});

document.addEventListener('keyup', (e) => {
    game.keys[e.code] = false;
});

function startSystemReadyCutscene() {
    // Ensure monologue is ready + pointed at the current room so the READY dialogue queues.
    if (window.LEVELS && window.LEVELS[game.currentRoom]) {
        game.monologue.data = window.LEVELS[game.currentRoom];
        game.monologue.ready = true;
        if (!game.monologue.queue) game.monologue.queue = [];
        if (!game.monologue.history) game.monologue.history = [];
    }

    game.cutsceneLocked = true;
    game.cutsceneAnimSprite = character.sprites.back;
    character.velocityX = 0;
    game.keys = {};

    // Ensure the TV DOM element swaps immediately
    game.tvOverlayKey = null;
}

// Check for player interaction with objects
function checkInteraction() {
    if (character.isInteracting) return; // Prevent double trigger

    const interactionRange = 60;
    const playerCenter = character.x + (character.width / 2);

    // Find closest interacting object
    let targetIndex = -1;
    for (let i = 0; i < game.objects.length; i++) {
        const obj = game.objects[i];
        const objCenter = obj.x + (obj.width / 2);
        const dist = Math.abs(playerCenter - objCenter);
        if (dist < interactionRange) {
            targetIndex = i;
            break; // Interact with one at a time
        }
    }

    if (targetIndex !== -1) {
        const obj = game.objects[targetIndex];

        // Special Interaction: Phone
        if (obj.type === 'phone') {
            interactPhone(obj);
            return;
        }

        // Hallway: Poster interaction (no highlight until after first interaction)
        if (obj.type === 'poster') {
            interactPoster(obj);
            return;
        }

        // Level 3: Ticket Hall
        if (obj.type === 'ticket_gates') {
            const hasPower = !!(game.flags && game.flags.stationPowerOn);
            const hasTravelCard = game.inventory.some(i => i?.type === 'travel_card');

            if (!hasPower) {
                triggerMonologue('TRY_TICKET_GATES_NO_POWER');
                return;
            }

            if (!hasTravelCard) {
                triggerMonologue('TRY_TICKET_GATES_NO_TRAVELCARD');
                return;
            }

            triggerMonologue('TRY_TICKET_GATES_WITH_TRAVELCARD');
            // After the success dialogue completes, transition to the new Outside level.
            // Spawn from the far left.
            switchRoomAfterMonologue('outside', 80);
            return;
        }

        // Level 5: Outside bus stop (opens poster assemble mini-game)
        if (obj.type === 'bus_stop') {
            openPosterAssemble();
            return;
        }
        if (obj.type === 'control_room_door') {
            // If already unlocked, just enter.
            if (game.flags && game.flags.controlRoomUnlocked) {
                switchRoom('control_room', 300);
                return;
            }

            const hasKeycard = game.inventory.some(i => i.type === 'keycard');
            if (hasKeycard) {
                // Unlock + enter with keycard
                game.flags.controlRoomUnlocked = true;
                triggerMonologue('TRY_CONTROL_ROOM_DOOR_WITH_KEYCARD');

                // Give the dialogue a moment, then transition
                setTimeout(() => {
                    switchRoom('control_room', 300);
                }, 800);
            } else {
                triggerMonologue('TRY_CONTROL_ROOM_DOOR');
            }
            return;
        }

        // Level 4: Control Room desk (opens control panel)
        if (obj.type === 'control_desk') {
            openControlPanel();
            return;
        }

        // Check Inventory Space (Max 5)
        if (game.inventory.length < 5) {
            // Remove from World
            game.objects.splice(targetIndex, 1);

            // Add to Inventory
            game.inventory.push(obj);

            // Trigger Pickup Animation
            character.isInteracting = true;
            character.interactionTimer = 30; // 0.5s at 60fps
            character.velocityX = 0; // Stop moving
            playSfx('pickup');

            // Monologue Triggers (Moved to Inspection)
            // if (obj.type === 'newspaper') triggerMonologue('PICKUP_NEWSPAPER');
            // if (obj.type === 'wallet') triggerMonologue('PICKUP_WALLET');

            // Check Combo (using implicit knowledge of items)
            const hasPaper = game.inventory.some(i => i.type === 'newspaper');
            const hasWallet = game.inventory.some(i => i.type === 'wallet');
            if (hasPaper && hasWallet) {
                // Delay slightly
                setTimeout(() => triggerMonologue('HAS_NEWSPAPER_AND_WALLET'), 1000);
            }

        } else {
            // Inventory full
        }
    }

}

// Get current character sprite
function getCurrentSprite() {
    // Override for Cutscene
    if (game.cutsceneAnimSprite) {
        return game.cutsceneAnimSprite;
    }

    // Hold idle forward sprite briefly after a cutscene ends
    if (game.forceForwardFrames && game.forceForwardFrames > 0) {
        return character.sprites.forward;
    }

    // Override for Phone Animation
    if (game.phoneAnimSprite) {
        return game.phoneAnimSprite;
    }

    // Override for Poster Animation
    if (game.posterAnimSprite) {
        return game.posterAnimSprite;
    }

    // Determine sprite based on state
    // Priority: Death
    if (game.health.state === 'DYING' || game.health.state === 'DEAD') {
        if (game.health.deathTimer < 60) return character.sprites.death1;
        if (game.health.deathTimer < 120) return character.sprites.death2;
        return character.sprites.death3;
    }

    // Priority: Intro Sequence
    if (game.introActive) {
        if (game.introPhase === 'wait') return character.sprites.sleep;
        // Waking phase

        if (game.introTimer < 60) return character.sprites.kneel1;
        return character.sprites.kneel2;
    }

    // Priority: Interaction
    if (character.isInteracting) {
        return character.sprites.pickup;
    }

    // Show jump sprite when in the air
    if (!character.isGrounded) {
         if (character.sprites.jump && character.sprites.jump.complete && character.sprites.jump.naturalWidth > 0) {
            return character.sprites.jump;
         }
         return character.sprites.forward; // Fallback
    }

    if (character.velocityX === 0) {
        return character.sprites.forward;
    }

    // Check if running (velocity higher than walk speed)
    const isRunning = Math.abs(character.velocityX) > character.speed + 1;

    // Animate
    if (isRunning) {
        // Run cycle: 1 -> 3 -> 2 -> 3
        const frame = character.animationFrame % 4; // Use 0-3 cycle
        if (frame === 0) return character.sprites.runRight1;
        if (frame === 1) return character.sprites.runRight3;
        if (frame === 2) return character.sprites.runRight2;
        return character.sprites.runRight3;
    } else {
        // Walking (2-frame cycle)
        if (character.animationFrame % 2 === 0) return character.sprites.walkRight1;
        else return character.sprites.walkRight2;
    }
}

// Update game state
function update() {
    // Credits roll runs as its own mode.
    if (game.credits && game.credits.active) {
        updateCredits();
        return;
    }

    // --- UPDATE LOOP ---
    // Pause if Overlay or Settings or Pause is Open
    if (game.settingsOpen || game.paused) return;
    if (game.overlayOpen || game.controlPanelOpen || game.posterAssembleOpen) {
        // Keep dialogue progressing while UI overlays are open
        updateMonologue();
        if (game.currentRoom === 'outside') updateOutside();
        return;
    }

    // Brief post-cutscene hold
    if (game.forceForwardFrames && game.forceForwardFrames > 0) {
        game.forceForwardFrames--;
    }

    // Cutscene lock: play monologue, lock controls, and release when finished
    if (game.cutsceneLocked) {
        character.velocityX = 0;
        character.velocityY = 0;
        updateMonologue();

        const monologueDone = (!game.monologue.activeLine && game.monologue.queue.length === 0);
        if (monologueDone) {
            game.cutsceneLocked = false;
            game.cutsceneAnimSprite = null;
            game.forceForwardFrames = 20;
            // Clear any held keys so Jack doesn't slide instantly on unlock
            game.keys = {};
            character.velocityX = 0;
        }
        return;
    }



    // Transition Update
    if (game.transition.active) {
        updateTransition();
        return;
    }

    // 0. Check Exits (Before Physics)
    // Allows preventing jump if entering power
    const roomData = game.rooms[game.currentRoom];
    if (roomData && roomData.exits) {
        roomData.exits.forEach(exit => {
            const exitCenter = exit.x + (exit.w / 2);
            const charCenter = character.x + (character.width / 2);
            const dist = Math.abs(exitCenter - charCenter);

            if (dist < 80) {
                exit.hovered = true;
                if (exit.type === 'zone') {
                        if (game.rooms[exit.target]) {
                        switchRoom(exit.target, exit.spawnX);
                    } else {
                        // Ticket Hall or future room not defined yet
                        // Allow walking through instead of pushing back
                        // console.log("Room not defined:", exit.target);
                    }
                }
                else if (exit.type === 'door') {
                    // Use ArrowUp only as requested
                    const upPressed = (game.keys['ArrowUp']);
                    if (game.keys['KeyE'] || (exit.dir === 'up' && upPressed)) {
                        switchRoom(exit.target, exit.spawnX);
                        // Consume Jump Input to prevent physics jump
                        game.keys['Space'] = false;
                        game.keys['ArrowUp'] = false;
                    }
                }
            } else {
                exit.hovered = false;
            }
        });
    }

    // Death Logic
    if (game.health.state === 'DYING') {
        game.health.deathTimer++;
        character.velocityX = 0; // Lock movement
        if (game.health.deathTimer > 180) { // 3 seconds decay
             game.health.state = 'DEAD';
        }
        return; // Skip normal update
    }
    if (game.health.state === 'DEAD') {
        if (game.health.fadeAlpha < 1) game.health.fadeAlpha += 0.01;
        return;
    }

    // Timer / Health Update (Only when playing)
    if (!game.introActive) {
        game.health.current--;
        const pct = (game.health.current / game.health.maxTime) * 100;

        // Check Thresholds
        if (game.health.percentage >= 60 && pct < 60) triggerMonologue('HEALTH_BELOW_60');
        if (game.health.percentage >= 30 && pct < 30) triggerMonologue('HEALTH_BELOW_30');
        if (game.health.percentage >= 1 && pct < 1) triggerMonologue('HEALTH_BELOW_1');

        game.health.percentage = pct;

        if (game.health.current <= 0) {
             game.health.state = 'DYING';
             // Also add offset fix for death?
        }
    }

    // Update Monologue
    updateMonologue();

    // Level Specific Logic
    if (game.currentRoom === 'hallway') updateHallway();
    if (game.currentRoom === 'ticket_hall') updateTicketHall();
    if (game.currentRoom === 'outside') updateOutside();

    // 1. Establish Ground State FIRST to ensure physics logic is consistent
    // Check if we are at or below platform level (with tiny tolerance for float errors)
    // AND we are not moving upwards (jump start)
    const wasGrounded = character.y >= game.platformY - 0.1 && character.velocityY >= 0;

    if (wasGrounded) {
        character.isGrounded = true;
        character.y = game.platformY;
        character.velocityY = 0;
    } else {
        character.isGrounded = false;
    }

    // 2. Handle Input
    // Movement Lock (Phone/Poster Interaction) - Moved Here so Logic updates run
    if (game.isPhoneLocked || game.isPosterLocked) {
        character.velocityX = 0;
        character.velocityY += game.gravity; // Still apply gravity
        if (character.y >= game.platformY) {
            character.y = game.platformY;
            character.velocityY = 0;
            character.isGrounded = true;
        }
        return; // Skip input and movement logic
    }

    let targetVx = 0; // Initialize targetVx here

    if (game.introActive) {
        // Handle Intro Sequence
        if (game.introPhase === 'waking') {
            game.introTimer++;
            if (game.introTimer > 120) { // 2 seconds total wake time
                game.introActive = false; // End intro, allow control
            }
        }
        targetVx = 0; // Lock movement
    } else if (character.isInteracting) {
        character.interactionTimer--;
        if (character.interactionTimer <= 0) {
            character.isInteracting = false;
        }
        // Lock Movement
        targetVx = 0;
    } else {
        // Normal Movement Input
        if (!game.controlsLocked) {
            const isShiftPressed = game.keys['ShiftLeft'] || game.keys['ShiftRight'];
            const currentSpeed = (isShiftPressed) ? character.runSpeed : character.speed;

            if (game.keys['ArrowLeft'] || game.keys['KeyA']) {
                targetVx = -currentSpeed;
                character.direction = 'left';
            }

            if (game.keys['ArrowRight'] || game.keys['KeyD']) {
                targetVx = currentSpeed;
                character.direction = 'right';
            }
        } else {
            targetVx = game.scriptedTargetVx || 0;
        }
    }

    // 3. Apply X Velocity Physics
    if (character.isGrounded) {
        // On ground: snappy movement (instant accelerate/stop)
        character.velocityX = targetVx;
    } else {
        // In air: Momentum handling
        if (targetVx !== 0) {
            // Apply air control if pressing keys
            character.velocityX = targetVx;
        } else {
            // No input: preserve momentum but with drag
            character.velocityX *= 0.85;
            if (Math.abs(character.velocityX) < 0.1) character.velocityX = 0;
        }
    }

    // 4. Handle Jumping
    // Logic to prevent holding key for repeated jumps (Bunny Hopping)
    const jumpKeyPressed = (game.keys['Space'] || game.keys['ArrowUp']);

    if (!jumpKeyPressed) {
        character.canJump = true;
    }

    if (!character.isInteracting && !game.introActive && jumpKeyPressed && character.isGrounded && character.canJump) {
        character.velocityY = character.jumpPower;
        character.isGrounded = false;
        character.canJump = false; // Lock jump until release
        playSfx('jump');
    }

    // 5. Apply Gravity & Move
    character.velocityY += game.gravity;

    character.x += character.velocityX;
    character.y += character.velocityY;

    // Safety Clamp: If we fell through floor due to high gravity, snap back next frame
    // (This is partially redundant with Step 1 but catches high-speed impacts)
    if (character.y > game.platformY) {
        character.y = game.platformY;
        character.velocityY = 0;
        character.isGrounded = true;
    }

    // 6. Animation Logic
    if (character.velocityX !== 0) {
        character.animationTimer++;
        // Slower animation speed for running (8 frames) to stop flickering
        const currentAnimSpeed = (Math.abs(character.velocityX) > character.speed + 1) ? 8 : 10;

        if (character.animationTimer >= currentAnimSpeed) {
            character.animationTimer = 0;
            // Cycle up to 4 for running support (walking uses modulo 2 of this)
            character.animationFrame = (character.animationFrame + 1) % 4;
        }
    } else {
        character.animationTimer = 0;
        character.animationFrame = 0;
    }

    // 7. Camera & Constraints
    if (game.backgroundLoaded) {
        const currentSprite = getCurrentSprite();
        if (currentSprite && currentSprite.complete) {
            const spriteWidth = currentSprite.naturalWidth * 0.3;

            // Character Bounds
            if (character.x < 0) {
                 character.x = 0;
                 triggerMonologue('TRY_EXIT_BLOCKED');
            }

            // DYNAMIC BACKGROUND CONFIGURATION (ALL ROOMS)
            // Strictly follow the referenced image dimensions to prevent "void walking"
            if (game.background && game.background.naturalWidth) {
                game.backgroundWidth = game.background.naturalWidth * game.backgroundScale;
            }

            // Hallway Specifics
            if (game.currentRoom === 'hallway') {
                // Automatically move the Ticket Hall exit to the end of the playable area

                // Automatically move the Ticket Hall exit to the end of the playable area
                // This ensures it's always reachable, whether the image is 2000px or 6000px
                const exit = game.rooms.hallway.exits.find(e => e.target === 'ticket_hall');
                if (exit) {
                    exit.x = game.backgroundWidth - 150;
                }
            }

            // Ticket Hall: keep the gates interactable on the right side
            if (game.currentRoom === 'ticket_hall') {
                const gates = game.rooms.ticket_hall?.objects?.find(o => o.type === 'ticket_gates');
                if (gates) {
                    gates.x = Math.max(0, game.backgroundWidth - 360);
                }
            }

            const maxCharacterX = game.backgroundWidth - spriteWidth;
            if (character.x > maxCharacterX) {
                 character.x = maxCharacterX;
                 triggerMonologue('TRY_EXIT_BLOCKED'); // Same trigger for both sides
            }

            // Camera Follow
            const centerX = canvas.width / 2;
            const logicalCenterOffset = (character.width * 0.5) || (spriteWidth * 0.5);
            let targetCameraX = (game.cameraOverrideX !== null)
                ? game.cameraOverrideX
                : (character.x - centerX + logicalCenterOffset);

            // Camera Bounds
            const maxCameraX = Math.max(0, game.backgroundWidth - canvas.width);
            if (targetCameraX < 0) targetCameraX = 0;
            if (targetCameraX > maxCameraX) targetCameraX = maxCameraX;

            // Camera Smoothing
            game.cameraX += (targetCameraX - game.cameraX) * 0.2;

            // Camera Clamp
            if (game.cameraX < 0) game.cameraX = 0;
            if (game.cameraX > maxCameraX) game.cameraX = maxCameraX;
        }
    }

    // Update Objects (Physics/Placement)
    game.objects.forEach(obj => {
        // REMOVED AUTO-SCALE AND FLOOR SNAP
        // allowing manual control via game.rooms config

        // Check proximity for UI prompt
        const playerCenter = character.x + (character.width / 2);
        const objCenter = obj.x + (obj.width / 2);
        const dist = Math.abs(playerCenter - objCenter);

        obj.hovered = (dist < 60);

        // Poster stays un-highlighted until after first interaction
        if (obj.type === 'poster' && (obj.interactCount || 0) < 1) {
            obj.hovered = false;
        }
    });


    // Exits moved to top of update


    // Apply friction
    character.velocityX *= 0.8;
    if (Math.abs(character.velocityX) < 0.5) character.velocityX = 0;

    // Apply gravity
    character.velocityY += 0.8;
    character.y += character.velocityY;

    // Boundary Checks (Dynamic based on Background)
    if (game.backgroundLoaded && game.backgroundWidth > 0) {
        if (character.x < 0) {
            character.x = 0;
            if (Math.abs(character.velocityX) > 0.5 && !game.monologue.hasHitWall) {
                 game.monologue.hasHitWall = true;
                 triggerMonologue('TRY_EXIT_BLOCKED');
            }
        }
        if (character.x > game.backgroundWidth - character.width) character.x = game.backgroundWidth - character.width;
    }
}

function switchRoom(targetKey, spawnX) {
    if (game.transition.active) return;
    if (!game.rooms[targetKey]) return;

    game.transition.active = true;
    game.transition.state = 'IN';
    game.transition.alpha = 0;
    game.transition.targetRoom = targetKey;
    game.transition.spawnX = spawnX;
}

function updateTransition() {
    if (!game.transition.active) return;

    if (game.transition.state === 'IN') {
        game.transition.alpha += 0.05;
        if (game.transition.alpha >= 1) {
            game.transition.alpha = 1;
            game.transition.state = 'LOAD';
        }
    } else if (game.transition.state === 'LOAD') {
        // Switch Room Data
        const oldRoom = game.rooms[game.currentRoom];
        game.currentRoom = game.transition.targetRoom;
        const newRoom = game.rooms[game.currentRoom];

        // If power is on, keep Ticket Hall in its active state permanently
        ensureTicketHallActiveBg();

        // Switch Music
        if (oldRoom.music !== newRoom.music) {
            stopMusic(oldRoom.music);
            playMusic(newRoom.music);
        }

        // Load BG (and wait)
        game.backgroundLoaded = false;
        game.background.src = getRoomBg(game.currentRoom);

        // Reset Char
        character.x = game.transition.spawnX;
        game.platformY = newRoom.platformY || 230;
        character.y = game.platformY; // Assume flat floors for now
        character.velocityX = 0;

        // Clear transient overlays/cutscene state on room load
        game.cameraOverrideX = null;
        game.controlsLocked = false;
        game.scriptedTargetVx = 0;
        game.posterAssembleOpen = false;
        if (game.posterAssemble) {
            game.posterAssemble.draggingId = null;
            game.posterAssemble.pendingCutscene = false;
            game.posterAssemble.completed = false;
        }
        if (game.dadNpc) game.dadNpc.visible = false;
        if (game.dadCutscene) game.dadCutscene.active = false;

        // Load Objects
        game.objects = [...newRoom.objects];

        // Load Level Monologue Data
        if (window.LEVELS && window.LEVELS[game.currentRoom]) {
            game.monologue.data = window.LEVELS[game.currentRoom];
            game.monologue.ready = true;
            if (!game.monologue.roomHistory) game.monologue.roomHistory = {};
            if (!game.monologue.roomHistory[game.currentRoom]) game.monologue.roomHistory[game.currentRoom] = [];
            game.monologue.history = game.monologue.roomHistory[game.currentRoom];
            game.monologue.queue = [];
            game.monologue.activeLine = null;
            game.monologue.hasHitWall = false;
            // Trigger start delay? Or immediate.
            setTimeout(() => triggerMonologue('LEVEL_START'), 100);
        } else {
               // No monologue script for this room: clear any previous room's script to prevent bleed-through.
               game.monologue.data = null;
               game.monologue.ready = false;
               game.monologue.queue = [];
               game.monologue.activeLine = null;
               game.monologue.hasHitWall = false;
        }

        game.transition.state = 'WAIT_BG';
    } else if (game.transition.state === 'WAIT_BG') {
        if (game.backgroundLoaded) {
             game.transition.state = 'OUT';
        }
    } else if (game.transition.state === 'OUT') {
        game.transition.alpha -= 0.05;
        if (game.transition.alpha <= 0) {
            game.transition.alpha = 0;
            game.transition.active = false;
        }
    }
}

// --- HALLWAY LOGIC ---
function updateHallway() {
    // Phone Trigger Logic
    if (game.phoneState === 'WAITING') {
        const dist = Math.abs(character.x - HALLWAY_PHONE_X);
        if (dist > 300) { // Walked away ~300px
            game.phoneState = 'READY_TO_RING';
            game.phoneTimer = 120; // 2 seconds delay before ring
             triggerMonologue('LEFT_PHONE_AREA_AFTER_DEAD');
        }
    }

    if (game.phoneState === 'READY_TO_RING') {
        game.phoneTimer--;
        if (game.phoneTimer <= 0) {
             // START SINGLE RING
             game.phoneState = 'RINGED_ONCE';
             triggerMonologue('PHONE_RINGED_ONCE');

             // Play Ring (2s then stop)
             if (!game.activeRing) game.activeRing = new Audio('assets/sounds/phone-ring.mp3');
             game.activeRing.currentTime = 0;
             game.activeRing.loop = false;
             game.activeRing.play().catch(() => {});

             // Stop after 2s
             setTimeout(() => {
                 if (game.phoneState === 'RINGED_ONCE' && game.activeRing) {
                     game.activeRing.pause();

                     // NOW enter continuous loop mode (ready for player return)
                     game.phoneState = 'RINGING_LOOP';
                     // Wait a moment then start looping? Or immediate?
                     // Script says: "Then for the continous ring until user interacts"
                     // We will start the loop.
                     game.activeRing.loop = true;
                     game.activeRing.play().catch(e => {});
                 }
             }, 2000);
        }
    }

    // Auto-Hangup Logic (When dialogue finishes)
    if (game.phoneState === 'ANSWERED') {
        // If monologue queue is empty AND no active line is being shown
        if (game.monologue.queue.length === 0 && !game.monologue.activeLine) {
            // FINISH CALL
            game.phoneState = 'HANGING_UP'; // Intermediate state to prevent re-trigger
            playSfx('ui-cancel');

            // Trigger Animation: Hang Up
             game.phoneAnimSprite = character.sprites.reach; // Put back

             setTimeout(() => {
                 game.phoneAnimSprite = character.sprites.back; // Hand down

                 setTimeout(() => {
                     game.phoneAnimSprite = null; // Idle
                     game.isPhoneLocked = false; // Unlock
                     game.phoneState = 'FINISHED';
                     triggerMonologue('AFTER_PHONE_CALL');
                 }, 500);
             }, 500);
        }
    }
}

function updateTicketHall() {
    // 1. See Control Room
    if (character.x > 1000) triggerMonologue('SEE_CONTROL_ROOM_DOOR');

    // 2. Voice Interrupt (After passing gates)
    if (character.x > 900) triggerMonologue('VOICE_INTERRUPT');

    // 3. Near Control Room (Objective Formed)
    if (character.x > 1150) triggerMonologue('NEAR_CONTROL_ROOM_END');
}

function interactPoster(obj) {
    if (game.isPosterLocked || game.isPhoneLocked) return;

    // Track per-object interaction count
    obj.interactCount = (obj.interactCount || 0) + 1;
    if (obj.interactCount > 4) obj.interactCount = 4;

    // Lock movement and set animation sprite
    game.isPosterLocked = true;
    character.velocityX = 0;
    game.posterAnimSprite = (obj.interactCount < 4) ? character.sprites.back : character.sprites.reach;

    // Trigger monologue beat for this interaction
    triggerMonologue(`poster_interact_0${obj.interactCount}`);

    // On 4th interaction, grant keycard
    if (obj.interactCount === 4) {
        const hasKeycard = game.inventory.some(i => i.type === 'keycard');
        if (!hasKeycard) {
            if (game.inventory.length < 5) {
                game.inventory.push({
                    type: 'keycard',
                    name: 'Keycard'
                });
                playSfx('pickup');
            } else {
                // Inventory full
            }
        }
    }

    // Unlock after a brief beat so the sprite swap is visible
    const lockMs = (obj.interactCount < 4) ? 650 : 800;
    setTimeout(() => {
        game.posterAnimSprite = null;
        game.isPosterLocked = false;
    }, lockMs);
}

function interactPhone(obj) {
    if (game.phoneState === 'DEAD') {
        game.phoneState = 'WAITING';
        playSfx('ui-deny');

        // ANIMATION: Check Dead Phone
        game.isPhoneLocked = true;
        character.velocityX = 0;

        game.phoneAnimSprite = character.sprites.back;
        setTimeout(() => {
            game.phoneAnimSprite = character.sprites.reach; // Reach for it
             triggerMonologue('PHONE_INTERACT_FIRST');

            setTimeout(() => {
                game.phoneAnimSprite = character.sprites.back;
                setTimeout(() => {
                    game.phoneAnimSprite = null;
                    game.isPhoneLocked = false;
                }, 400);
            }, 1000);
        }, 300);
    }
    else if (game.phoneState === 'RINGING_LOOP' || game.phoneState === 'RINGED_ONCE') {
        // Answer Call (Transition State first)
        game.phoneState = 'ANSWERING';
        game.phoneCutPlayed = false; // Reset flag for new call logic
        if (game.activeRing) {
            game.activeRing.pause();
            game.activeRing = null;
        }

        // LOCK MOVEMENT
        game.isPhoneLocked = true;
        character.velocityX = 0;

        // ANIMATION: Pick Up
        game.phoneAnimSprite = character.sprites.back;

        setTimeout(() => {
            game.phoneAnimSprite = character.sprites.reach;

            setTimeout(() => {
                game.phoneAnimSprite = character.sprites.phoneTalk;
                game.phoneState = 'ANSWERED'; // NOW we are answered, dialogue starts

                triggerMonologue('PHONE_INTERACT_AFTER_RING');
            }, 500);
        }, 300);
    }
    else if (game.phoneState === 'ANSWERED') {
         // Auto-Hangup if dialogue finishes
         if (game.monologue.queue.length === 0 && !game.monologue.activeLine) {

             // Check what just finished playing
             // If Cut hasn't successfully played yet, and we are done with other lines...
             if (!game.phoneCutPlayed) {
                 // Conversation ended -> Play Cut ("Wait-")
                 triggerMonologue('PHONE_CALL_CUT');
                 game.phoneCutPlayed = true;
                 return; // Keep phone up
             }
             else {
                 // Cut finished -> Hangup
                 triggerMonologue('AFTER_PHONE_CALL');

                 game.phoneState = 'HANGING_UP';
                 game.phoneAnimSprite = character.sprites.reach;
                 setTimeout(() => {
                     game.phoneAnimSprite = character.sprites.back;
                     setTimeout(() => {
                          game.phoneAnimSprite = null;
                          game.phoneState = 'FINISHED';
                          game.isPhoneLocked = false;
                     }, 300);
                 }, 500);
                 return;
             }

             // Safety Fallback (e.g. Dead Phone): Just Hangup
             game.phoneState = 'HANGING_UP';
             game.phoneAnimSprite = character.sprites.reach;
             setTimeout(() => {
                 game.phoneAnimSprite = character.sprites.back;
                 setTimeout(() => {
                      game.phoneAnimSprite = null;
                      game.phoneState = 'FINISHED';
                      game.isPhoneLocked = false;
                 }, 300);
             }, 500);
         }
    }
}

// Draw everything
function draw() {
    // Ensure the TV DOM overlay never lingers outside the control room
    if (game.tvOverlayEl && (game.currentRoom !== 'control_room' || game.controlPanelOpen)) {
        game.tvOverlayEl.style.display = 'none';
    }

    // Optimization for pixel art: prevent anti-aliasing
    ctx.imageSmoothingEnabled = false;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Game configuration
    const HUD_HEIGHT = 150;  // Bottom section for HUD
    const HUD_Y = canvas.height - HUD_HEIGHT;

    // Draw scrolling background
    // Draw scrolling background
    if (game.backgroundLoaded) {
        // Use the pre-calculated background dimensions
        const scaledWidth = game.backgroundWidth;

        // Draw the visible portion of the background
        const sourceX = game.cameraX / game.backgroundScale;
        const sourceY = 0;
        const sourceWidth = canvas.width / game.backgroundScale;
        const sourceHeight = game.background.height;

        // Destination: Draw full canvas (Background fills screen)
        // HUD will draw OVER this
        ctx.drawImage(
            game.background,
            sourceX, sourceY, sourceWidth, sourceHeight,  // source rectangle
            0, 0, canvas.width, canvas.height              // destination rectangle
        );
    }

    // Control Room: TV overlay (drawn between background and objects)
    if (game.currentRoom === 'control_room') {
        drawControlRoomTv();
    }

    // Draw Objects (Behind character relative to Z? Or just before)
    drawObjects();

    // Level 5: Dad NPC (outside)
    drawDadNpc();

    // Draw character (relative to camera)
    const currentSprite = getCurrentSprite();
    if (currentSprite && currentSprite.complete) {
        ctx.save();

        // Use sprite's natural dimensions to avoid distortion
        const spriteWidth = currentSprite.naturalWidth;
        const spriteHeight = currentSprite.naturalHeight;

        // Scale factor: 0.3 for Jack's Hi-Res sprites
        // Adjusted to 0.42 for Phone/Poster/Cutscene interaction sprites
        // Control room: Jack is ~20% larger for the different layout
        const roomScale = (game.currentRoom === 'control_room') ? 1.2 : 1.0;
        let scale = 0.3 * roomScale;
        const isPoseSprite = !!(game.phoneAnimSprite || game.posterAnimSprite || game.cutsceneAnimSprite);
        if (isPoseSprite) scale = 0.42 * roomScale;
        // Control room: character-back pose was a bit small
        if (game.currentRoom === 'control_room' && currentSprite === character.sprites.back) {
            scale *= 1.1;
        }

        const drawWidth = Math.floor(spriteWidth * scale);
        const drawHeight = Math.floor(spriteHeight * scale);

        // Calculate screen position (character position minus camera offset)
        // Center the sprite on the character's logical center (character.width = 80)
        // Use Math.floor to ensure we draw on exact pixels to avoid "shimmering"
        const logicalCenterX = Math.floor((character.x - game.cameraX) + (character.width / 2));

        // ANCHOR TO BOTTOM (FEET)
        // character.y is the Top of the physics box.
        // character.height is the height of the physics box.
        // visibleFloor matches (character.y + character.height).
        // So we draw up from the floor.
        const feetY = Math.floor(character.y + character.height);
        const drawY = feetY - drawHeight;

        // Use the calculated center to determine draw X
        // We round AFTER centering logic to ensure stability
        const drawX = Math.floor(logicalCenterX - (drawWidth / 2));

        // --- CALCULATE OFFSETS (Applied to both directions) ---
        let xOffset = 0;
        let yOffset = 0;

        // Run Animation Offsets
        // Run Animation Offsets
        if (currentSprite === character.sprites.runRight1) {
            yOffset = 0; // User matched this to walking
            xOffset = 0;
        }
        if (currentSprite === character.sprites.runRight2) {
            yOffset = 30; // Fix "very low" frame by raising it
            xOffset = 0;
        }
        if (currentSprite === character.sprites.runRight3) {
            yOffset = 50; // Fix "very low" frame by raising it
            xOffset = 0;
        }
        // Other Actions
        if (currentSprite === character.sprites.jump) {
            xOffset = 20;
        }
        if (currentSprite === character.sprites.pickup ||
            currentSprite === character.sprites.kneel1 ||
            currentSprite === character.sprites.kneel2 ||
            currentSprite === character.sprites.death1 ||
            currentSprite === character.sprites.death2 ||
            currentSprite === character.sprites.death3) {
            yOffset = 35; // Fix floating interact/low sprites
        }
        if (currentSprite === character.sprites.sleep) {
            yOffset = 15; // Raised 20px (was 35) to fix "too low"
        }
        // -----------------------------------------------------

        // Flip sprite if moving left
        if (character.direction === 'left') {
            // Flip around the logical center to ensure symmetry
            ctx.translate(logicalCenterX, feetY); // Origin is Floor Center
            ctx.scale(-1, 1);

            // Draw relative to new origin (0,0 is Floor Center)
            // Image should be drawn up from 0 (-drawHeight)
            // Apply Offsets
            ctx.drawImage(currentSprite, -Math.floor(drawWidth / 2) + xOffset, -drawHeight + yOffset, drawWidth, drawHeight);

        } else {
            // Normal Right Facing
            // Draw relative to Top-Left screen coordinates
            ctx.drawImage(currentSprite, drawX + xOffset, drawY + yOffset, drawWidth, drawHeight);
        }

        ctx.restore();
    }



    // Draw Exits (Arrows)
    drawExits();

    // Draw object indicators (e.g. control panel prompt)
    drawObjectIndicators();

    // Draw HUD (hidden when control panel open)
    if (!game.controlPanelOpen && !game.posterAssembleOpen) {
        drawHUD();
    }

    // Draw Transition
    if (game.transition.active) {
        ctx.fillStyle = `rgba(0,0,0,${game.transition.alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw Monologue


    // Draw Intro Text
    if (game.introActive && game.introPhase === 'wait') {
        if (!game.introTextPlayed) {
            playSfx('text');
            game.introTextPlayed = true;
        }

        ctx.fillStyle = '#fff';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText("WAKE UP, JACK - PRESS E", canvas.width / 2, canvas.height / 2 - 100);
    }

    // Draw Game Over
    if (game.health.state === 'DEAD' || game.health.state === 'DYING') {
        drawGameOver();
    }

    // Draw Overlay
    if (game.overlayOpen) {
        drawOverlay();
    }

    // Draw Poster Assemble (Full Screen)
    if (game.posterAssembleOpen) {
        drawPosterAssemble();
        drawMonologueOnly();
    }

    // Draw Control Panel (Full Screen)
    if (game.controlPanelOpen) {
        drawControlPanel();
        drawMonologueOnly();
    }

    // Level 5: end fade (dad cutscene)
    if (game.currentRoom === 'outside' && game.dadCutscene && game.dadCutscene.fadeAlpha) {
        ctx.fillStyle = `rgba(0,0,0,${game.dadCutscene.fadeAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // End credits (draw after the fade overlay)
    if (game.credits && game.credits.active) {
        drawCredits();
    }

    // Draw Settings
    if (game.settingsOpen) {
        drawSettings();
    }

    if (game.paused) {
        drawPause();
    }
    // Draw loading text if assets aren't loaded
    if (!game.backgroundLoaded || character.spritesLoaded < 4) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);
    }
}

function drawMonologueOnly() {
    if (!game.monologue.activeLine) return;

    const rawText = (game.monologue.activeLine.text !== undefined) ? game.monologue.activeLine.text : game.monologue.activeLine;
    const text = (typeof rawText === 'string') ? rawText : "";
    const meta = game.monologue.activeLine.meta || game.monologue.queue[0]?.meta;

    const x = canvas.width / 2;
    const y = canvas.height - 60;

    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.textAlign = 'center';
    ctx.font = '20px "Press Start 2P"';

    if (text !== "") {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillText(text, x + 2, y + 2);
    }

    if (meta && meta.color) {
        ctx.fillStyle = meta.color;
    } else if (meta && meta.speaker === 'VOICE') {
        ctx.fillStyle = '#39ff14';
    } else {
        ctx.fillStyle = '#ff00ff';
    }

    if (text !== "") {
        ctx.fillText(text, x, y);
    }

    ctx.restore();
}

function openControlPanel(options = {}) {
    if (game.controlPanelOpen) return;
    game.controlPanelOpen = true;

    const silent = !!options.silent;

    // Dialogue: first time vs again
    if (!silent) {
        if (game.controlPanel.openedCount === 0) {
            triggerMonologue('INTERACTION_CONTROL_PANEL');
        } else {
            triggerMonologue('INTERACTION_CONTROL_PANEL_AGAIN');
        }
        game.controlPanel.openedCount++;
    }

    // Default selection: first un-powered button
    const order = getControlPanelButtonOrder();
    const firstOffIdx = order.findIndex(k => (k !== 'sys') && !isControlButtonPowered(k));
    game.controlPanel.selectedIndex = (firstOffIdx >= 0) ? firstOffIdx : 0;
}

function getControlPanelButtonOrder() {
    // Navigation order
    return ['yellow', 'blue', 'green', 'sys'];
}

function isControlButtonPowered(key) {
    if (key === 'yellow') return !!game.controlPanel.yellowOn;
    if (key === 'blue') return !!game.controlPanel.blueOn;
    if (key === 'green') return !!game.controlPanel.greenOn;
    return false;
}

function isSystemReady() {
    return !!(game.controlPanel.yellowOn && game.controlPanel.blueOn && game.controlPanel.greenOn);
}

function controlPanelMoveSelection(delta) {
    const order = getControlPanelButtonOrder();
    const len = order.length;
    game.controlPanel.selectedIndex = (game.controlPanel.selectedIndex + delta + len) % len;
    playSfx('text');
}

function controlPanelActivateSelected() {
    const order = getControlPanelButtonOrder();
    const selectedKey = order[game.controlPanel.selectedIndex];

    if (selectedKey === 'yellow') {
        game.controlPanel.yellowOn = true;
        playSfx('confirm');
        return;
    }
    if (selectedKey === 'blue') {
        game.controlPanel.blueOn = true;
        playSfx('confirm');
        return;
    }
    if (selectedKey === 'green') {
        game.controlPanel.greenOn = true;
        playSfx('confirm');
        return;
    }

    // System Start
    if (selectedKey === 'sys') {
        if (game.controlPanel.systemStarted) {
            // Already done, just exit
            game.controlPanelOpen = false;
            return;
        }

        if (!isSystemReady()) {
            triggerMonologue('INTERACTION_CONTROL_SYSTEM_TRY');
            playSfx('ui-deny');
            return;
        }

        game.controlPanel.systemStarted = true;
        playSfx('confirm');

        // Exit back to the control room
        setTimeout(() => {
            game.controlPanelOpen = false;
            // Swap TV content + start dialogue after the panel closes
            if (game.flags) {
                game.flags.stationPowerOn = true;
                game.flags.tvMode = 'hospital';
            }
            // Permanently switch Ticket Hall background once power is restored
            ensureTicketHallActiveBg();
            startSystemReadyCutscene();
            triggerMonologue('INTERACTION_CONTROL_SYSTEM_READY');
            triggerMonologue('VOICE_INTERRUPT_TV');
        }, 900);
    }
}

function drawControlRoomTv() {
    const el = ensureTvOverlayEl();
    if (!el) return;

    // Hide overlay when not in control room or when full-screen UI is open
    if (game.currentRoom !== 'control_room' || game.controlPanelOpen) {
        el.style.display = 'none';
        return;
    }

    const bg = game.background;
    if (!bg || !bg.complete || bg.naturalWidth <= 0 || bg.naturalHeight <= 0) {
        el.style.display = 'none';
        return;
    }

    const mode = game.flags?.tvMode;
    const tvKey = (mode === 'hospital') ? 'tv_hospital' : 'tv_static';
    const tvSprite = game.objectSprites[tvKey];
    const src = tvSprite?.src;
    if (!src) {
        el.style.display = 'none';
        return;
    }

    // Convert normalized image rect -> scaled world rect -> screen rect (canvas coords)
    const x = (bg.naturalWidth * CONTROL_ROOM_TV.u) * game.backgroundScale - game.cameraX + CONTROL_ROOM_TV.dx;
    const y = (bg.naturalHeight * CONTROL_ROOM_TV.v) * game.backgroundScale + CONTROL_ROOM_TV.dy;
    const w = (bg.naturalWidth * CONTROL_ROOM_TV.wu) * game.backgroundScale;
    const h = (bg.naturalHeight * CONTROL_ROOM_TV.hv) * game.backgroundScale;

    // Project canvas coords into CSS pixels
    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = document.querySelector('.game-container')?.getBoundingClientRect();
    if (!containerRect) return;

    const sx = canvasRect.width / canvas.width;
    const sy = canvasRect.height / canvas.height;
    const left = (canvasRect.left - containerRect.left) + (x * sx);
    const top = (canvasRect.top - containerRect.top) + (y * sy);

    if (game.tvOverlayKey !== tvKey) {
        game.tvOverlayKey = tvKey;
        el.dataset.src = src;
        el.src = src;
    }

    el.style.display = 'block';
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.width = `${w * sx}px`;
    el.style.height = `${h * sy}px`;
}

function getControlPanelLayout() {
    const bg = game.objectSprites['control_panel_bg'];
    const rect = getControlPanelBgCoverRect(bg);

    // Button positions are expressed in normalized coordinates (u,v) over the
    // control panel image, then projected into screen-space using the cover-rect.
    // Tweak these to line up with the artwork.
    const norms = {
        sys:   { u: 0.52, v: 0.37, s: 0.14 },
        yellow:{ u: 0.64, v: 0.34, s: 0.07 },
        blue:  { u: 0.71, v: 0.34, s: 0.07 },
        green: { u: 0.79, v: 0.34, s: 0.07 }
    };

    const base = Math.min(rect.w, rect.h);
    const project = ({ u, v, s }) => {
        const size = Math.round(base * s);
        return {
            x: rect.x + rect.w * u,
            y: rect.y + rect.h * v,
            w: size,
            h: size
        };
    };

    return {
        sys: project(norms.sys),
        yellow: project(norms.yellow),
        blue: project(norms.blue),
        green: project(norms.green)
    };
}

function getControlPanelBgCoverRect(bgImg) {
    // Draw the background using "cover" scaling: preserve aspect ratio and fill
    // the canvas, cropping overflow (no stretching).
    if (!bgImg || !bgImg.complete || bgImg.naturalWidth <= 0 || bgImg.naturalHeight <= 0) {
        return { x: 0, y: 0, w: canvas.width, h: canvas.height };
    }

    const iw = bgImg.naturalWidth;
    const ih = bgImg.naturalHeight;
    const cw = canvas.width;
    const ch = canvas.height;

    const scale = Math.max(cw / iw, ch / ih);
    const w = iw * scale;
    const h = ih * scale;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;

    // If the panel feels "too high" after cover-cropping, nudge it down here.
    // Positive values move the image down; negative move it up.
    const yOffsetPx = 40;

    return { x, y: y + yOffsetPx, w, h };
}

function drawControlPanel() {
    // Background
    const bg = game.objectSprites['control_panel_bg'];
    if (bg && bg.complete && bg.naturalWidth > 0) {
        const r = getControlPanelBgCoverRect(bg);
        ctx.drawImage(bg, r.x, r.y, r.w, r.h);
    } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const layout = getControlPanelLayout();
    const order = getControlPanelButtonOrder();
    const selectedKey = order[game.controlPanel.selectedIndex];

    // If glow artwork doesn't line up perfectly (different padding/center), tweak here.
    // dx/dy are pixels in screen-space; scale multiplies the final draw size.
    const glowTweaks = {
        yellow: { dx: 0, dy: 0, scale: 1.8 },
        blue: { dx: 0, dy: 0, scale: 1.8 },
        green: { dx: 0, dy: 0, scale: 1.8 },
        sys: { dx: 0, dy: 0, scale: 2.5 }
    };

    const drawButtonNormalized = (rect, baseKey, activeKey, tweakKey) => {
        const base = game.objectSprites[baseKey];
        const spr = game.objectSprites[activeKey];
        if (!spr || !spr.complete) return;

        let w = rect.w;
        let h = rect.h;

        const isGlow = activeKey !== baseKey;
        const tweak = (isGlow && tweakKey && glowTweaks[tweakKey]) ? glowTweaks[tweakKey] : { dx: 0, dy: 0, scale: 1.0 };

        // If the active sprite has different intrinsic dimensions than the base
        // sprite (common when glow art is authored at a different size), normalize
        // so the on-screen size matches the base.
        if (base && base.complete && base.naturalWidth > 0 && base.naturalHeight > 0 && spr.naturalWidth > 0 && spr.naturalHeight > 0) {
            const scaleX = base.naturalWidth / spr.naturalWidth;
            const scaleY = base.naturalHeight / spr.naturalHeight;
            w = rect.w * scaleX;
            h = rect.h * scaleY;
        }

        w *= tweak.scale;
        h *= tweak.scale;

        ctx.drawImage(spr, rect.x + tweak.dx - w / 2, rect.y + tweak.dy - h / 2, w, h);
    };

    const sysEnabled = isSystemReady();
    const sysSpriteKey = (game.controlPanel.systemStarted || sysEnabled) ? 'sys_start_glow' : 'sys_start';

    drawButtonNormalized(layout.yellow, 'button_yellow', game.controlPanel.yellowOn ? 'button_yellow_glow' : 'button_yellow', 'yellow');
    drawButtonNormalized(layout.blue, 'button_blue', game.controlPanel.blueOn ? 'button_blue_glow' : 'button_blue', 'blue');
    drawButtonNormalized(layout.green, 'button_green', game.controlPanel.greenOn ? 'button_green_glow' : 'button_green', 'green');
    drawButtonNormalized(layout.sys, 'sys_start', sysSpriteKey, 'sys');

    // Selection outline
    const selRect = layout[selectedKey];
    if (selRect) {
        ctx.save();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.strokeRect(selRect.x - selRect.w/2 - 6, selRect.y - selRect.h/2 - 6, selRect.w + 12, selRect.h + 12);
        ctx.restore();
    }

    // Minimal instruction text
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.font = '12px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('[ARROWS/WASD] SELECT   [E/SPACE] PRESS   [ESC] EXIT', canvas.width / 2, canvas.height - 20);
    ctx.restore();
}

function drawHUD() {
    const margin = 20;
    const hudY = canvas.height - 130; // Float slightly above bottom

    // --- HUD Strip ---
    const cardWidth = 300;
    const cardHeight = 110;
    const portraitSize = 80;

    const hudW = canvas.width - (margin * 2);
    const hudH = cardHeight;

    // Strip Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(margin, hudY, hudW, hudH);

    // Strip Border
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.strokeRect(margin, hudY, hudW, hudH);

    // Inner Shadow
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin + 4, hudY + 4, hudW - 8, hudH - 8);

    // --- Player Card (Left) ---

    // Portrait Frame
    const portraitX = margin + 15;
    const portraitY = hudY + 15;
    ctx.fillStyle = '#000';
    ctx.fillRect(portraitX, portraitY, portraitSize, portraitSize);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(portraitX, portraitY, portraitSize, portraitSize);

    // Character Face (Crop)
    if (character.sprites.forward && character.sprites.forward.complete) {
        const s = character.sprites.forward;
        // Draw headshot slightly zoomed
        ctx.drawImage(s, 0, 0, s.naturalWidth, s.naturalHeight * 0.4, portraitX, portraitY, portraitSize, portraitSize);
    }

    // Name (Pixel Font)
    ctx.fillStyle = '#fff';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText("JACK", portraitX + portraitSize + 20, portraitY);

    // Health Bar (Decorative)
    const barX = portraitX + portraitSize + 20;
    const barY = portraitY + 35;
    const barW = 150;
    const barH = 15;

    // Bar BG
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    // Bar Fill (Green)
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(barX, barY, barW * 1.0, barH); // 80% HP
    // Health Bar Background
    ctx.fillStyle = '#334155';
    ctx.fillRect(barX, barY, barW, barH); // Use barX, barY, barW, barH for consistency

    // Health Bar Foreground (Dynamic)
    // Optional: Change color based on health
    if (game.health.percentage < 30) ctx.fillStyle = '#ef4444'; // Red
    else if (game.health.percentage < 60) ctx.fillStyle = '#f59e0b'; // Orange
    else ctx.fillStyle = '#22c55e'; // Green

    const hpWidth = Math.max(0, barW * (game.health.percentage / 100)); // Use barW
    ctx.fillRect(barX, barY, hpWidth, barH); // Use barX, barY, barH

    // Bar Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    // HP Text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "Press Start 2P"'; // Changed to 10px to match original status text size
    ctx.fillText(`HP: ${Math.ceil(game.health.percentage)}/100`, barX, barY + barH + 7); // Adjusted Y position to be below the bar

    // --- Inventory (Horizontal Bar across HUD) ---
    const slots = 5;
    const padding = 14;
    const invStartX = margin + cardWidth + 750;
    const invAvailableW = (margin + hudW) - invStartX - 10;

    // Make them bigger, but keep them fitting the available width.
    let slotSize = Math.floor((invAvailableW - padding * (slots + 1)) / slots);
    slotSize = Math.max(64, Math.min(86, slotSize));

    const invW = (slots * slotSize) + (padding * (slots + 1));
    const invX = invStartX + Math.max(0, Math.floor((invAvailableW - invW) / 2));
    const invY = hudY + Math.floor((hudH - slotSize) / 2);

    // Label (left of slots)
    const firstSlotX = invX + padding;
    const labelX = firstSlotX - 14;
    const labelY = invY + Math.floor(slotSize / 2);
    ctx.save();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "Press Start 2P"';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('INVENTORY', labelX, labelY);
    ctx.restore();

    // Draw Slots
    ctx.lineWidth = 3;
    for (let i = 0; i < slots; i++) {
        const sx = invX + padding + (i * (slotSize + padding));
        const sy = invY;

        // Slot Box
        ctx.strokeStyle = '#334155';
        if (i === game.activeSlot) ctx.strokeStyle = '#fbbf24';
        ctx.strokeRect(sx, sy, slotSize, slotSize);

        // Slot Number
        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'left';
        ctx.fillText(String(i + 1), sx + 6, sy + 14);

        // Item Icon
        if (game.inventory[i]) {
            const type = game.inventory[i].type;
            const sprite = game.objectSprites[type];
            if (sprite && sprite.complete) {
                const pad = 10;
                ctx.drawImage(sprite, sx + pad, sy + pad, slotSize - pad * 2, slotSize - pad * 2);
            }
        }
    }

    // --- Monologue Drawing (Moved to HUD) ---
    // FORCE DEBUG TEXT (Commented out)
    // ctx.fillStyle = 'lime';
    // ctx.font = '10px "Press Start 2P"';
    // ctx.fillText("DEBUG HUD RUNNING", 100, 100);

    if (game.monologue.activeLine) {
        // Safe Text Access
        const rawText = (game.monologue.activeLine.text !== undefined) ? game.monologue.activeLine.text : game.monologue.activeLine;
        const text = (typeof rawText === 'string') ? rawText : "";

        const meta = game.monologue.activeLine.meta || game.monologue.queue[0]?.meta;

        const x = canvas.width / 2;
        const y = canvas.height - 180; // Above HUD

        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.textAlign = 'center';
        ctx.font = '20px "Press Start 2P"';

        // Debug Box (Remove later)
        // ctx.strokeStyle = 'lime';
        // ctx.lineWidth = 2;
        // ctx.strokeRect(x - 300, y - 30, 600, 40);

        // Shadow
        if (text !== "") { // Don't draw silence
             ctx.fillStyle = 'rgba(0,0,0,0.8)';
             ctx.fillText(text, x + 2, y + 2);
        }

           // Color
           if (meta && meta.color) {
               ctx.fillStyle = meta.color;
           } else if (meta && meta.speaker === 'VOICE') {
               ctx.fillStyle = '#39ff14'; // Bright Neon Green
           } else {
               ctx.fillStyle = '#ff00ff'; // Pink
           }

        if (text !== "") {
            ctx.fillText(text, x, y);
        }
        ctx.restore();
    }

    // Controls moved into Settings → Controls page
}

function drawKeyboardHelp(cx, cy) {
    const keySize = 25; // Base Unit
    const gap = 5;

    ctx.textAlign = 'center';

    // Key Defs
    const keys = [
        { label: 'ESC', w: 1.5, text: 'MENU' },
        { label: 'SHIFT', w: 2.2, text: 'RUN' },
        { label: 'A', w: 1, text: 'LEFT' },
        { label: 'D', w: 1, text: 'RIGHT' },
        { label: 'SPACE', w: 3, text: 'JUMP' },
        { label: 'E', w: 1, text: 'ACT' },
        { label: 'O', w: 1, text: 'LOOK' },
        { label: 'P', w: 1, text: 'PAUSE' }
    ];

    // Calculate Total Width
    let totalW = 0;
    keys.forEach(k => totalW += (k.w * keySize) + gap);
    totalW -= gap;

    let currentX = cx - (totalW / 2);

    // Draw Loop
    keys.forEach((k, i) => {
        const w = k.w * keySize;
        const h = keySize;
        const x = currentX;
        const y = cy - (h/2);

        // Key Box (Stylized)
        ctx.fillStyle = '#0f172a'; // Dark
        ctx.fillRect(x, y + 2, w, h);

        ctx.fillStyle = '#1e293b'; // Top
        ctx.fillRect(x, y, w, h);

        // Highlight Active (All shown are active)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);

        // Key Label
        ctx.fillStyle = '#fbbf24';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText(k.label, x + w/2, y + (h/2) + 4);

        // Description Line
        const dir = (i % 2 === 0) ? 'up' : 'down';
        const ly = (dir === 'up') ? y : y + h;
        const ty = (dir === 'up') ? y - 15 : y + h + 15;

        ctx.strokeStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(x + w/2, ly);
        ctx.lineTo(x + w/2, ty);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8'; // Text Color
        ctx.fillText(k.text, x + w/2, (dir === 'up') ? ty - 5 : ty + 8);

        // Advance
        currentX += w + gap;
    });
}



function drawExits() {
    const room = game.rooms[game.currentRoom];
    if (!room || !room.exits) return;

    room.exits.forEach(exit => {
        if (exit.hovered && exit.type === 'door') {
             const drawX = Math.floor(exit.x - game.cameraX + (exit.w/2) - 10 + (exit.indicatorOffsetX || 0));
             const drawY = Math.floor(game.platformY - 120);

             // Bounce
             const bounce = Math.sin(Date.now() / 200) * 5;

             // Arrow
             ctx.fillStyle = '#fbbf24';
             ctx.beginPath();

             if (exit.dir === 'right') {
                 // Point Right >
                 ctx.moveTo(drawX, drawY + bounce - 10);
                 ctx.lineTo(drawX, drawY + bounce + 10);
                 ctx.lineTo(drawX + 20, drawY + bounce);
             }
             else if (exit.dir === 'left') {
                 // Point Left <
                 ctx.moveTo(drawX + 20, drawY + bounce - 10);
                 ctx.lineTo(drawX + 20, drawY + bounce + 10);
                 ctx.lineTo(drawX, drawY + bounce);
             }
             else if (exit.dir === 'down') {
                 // Point Down v
                 ctx.moveTo(drawX, drawY + bounce);
                 ctx.lineTo(drawX + 20, drawY + bounce);
                 ctx.lineTo(drawX + 10, drawY + 12 + bounce);
             }
             else {
                 // Point Up ^ (Default)
                 ctx.moveTo(drawX, drawY + bounce);
                 ctx.lineTo(drawX + 20, drawY + bounce);
                 ctx.lineTo(drawX + 10, drawY - 10 + bounce);
             }
             ctx.fill();

             ctx.fillStyle = '#fff';
             ctx.font = '10px "Press Start 2P"';
             ctx.textAlign = 'center';
             ctx.fillText(exit.label || 'ENTER', drawX + 10, drawY - 15 + bounce);
        }
        // Zones don't draw unless debug
    });
}

function drawObjectIndicators() {
    if (!game.objects || game.objects.length === 0) return;

    // Outside: Bus stop indicator
    if (game.currentRoom === 'outside') {
        const stop = game.objects.find(o => o.type === 'bus_stop');
        if (stop && stop.hovered) {
            const drawX = Math.floor(stop.x - game.cameraX + (stop.width / 2) - 10);
            const drawY = Math.floor(stop.y - 70);
            const bounce = Math.sin(Date.now() / 200) * 5;

            // Arrow (points up)
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(drawX, drawY + bounce);
            ctx.lineTo(drawX + 20, drawY + bounce);
            ctx.lineTo(drawX + 10, drawY - 10 + bounce);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = '10px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText('Bus Stop', drawX + 10, drawY - 15 + bounce);
        }
        return;
    }

    // Ticket Hall: Gates indicator
    if (game.currentRoom === 'ticket_hall') {
        const gates = game.objects.find(o => o.type === 'ticket_gates');
        if (gates && gates.hovered) {
            const drawX = Math.floor(gates.x - game.cameraX + (gates.width / 2) - 10 - 100);
            const drawY = Math.floor(gates.y - 70);
            const bounce = Math.sin(Date.now() / 200) * 5;

            // Arrow (points up, like room entrances)
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(drawX, drawY + bounce);
            ctx.lineTo(drawX + 20, drawY + bounce);
            ctx.lineTo(drawX + 10, drawY - 10 + bounce);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = '10px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText('Ticket Gates', drawX + 10, drawY - 15 + bounce);
        }
        return;
    }

    if (game.currentRoom !== 'control_room') return;

    const obj = game.objects.find(o => o.type === 'control_desk');
    if (!obj || !obj.hovered) return;

    const drawX = Math.floor(obj.x - game.cameraX + (obj.width / 2) - 10);
    const drawY = Math.floor(obj.y - 70);
    const bounce = Math.sin(Date.now() / 200) * 5;

    // Arrow (points down to the desk)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(drawX, drawY + bounce);
    ctx.lineTo(drawX + 20, drawY + bounce);
    ctx.lineTo(drawX + 10, drawY + 12 + bounce);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '10px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('Control Panel', drawX + 10, drawY - 15 + bounce);
}

function drawOverlay() {
    if (!game.viewedItem) return;

    // Dim Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Determine Sprite
    let sprite = null;
    if (game.viewedItem.type === 'newspaper') {
        sprite = game.objectSprites['newspaper_large'];
    } else if (game.viewedItem.type === 'wallet') {
        sprite = game.objectSprites['wallet_large'];
    } else if (game.viewedItem.type === 'travel_card') {
        sprite = game.objectSprites['travel_card_large'];
    } else if (game.viewedItem.type === 'keycard') {
        sprite = game.objectSprites['keycard_large'];
    }

    if (sprite && sprite.complete) {
        // Draw Centered
        const x = (canvas.width - sprite.naturalWidth) / 2;
        const y = (canvas.height - sprite.naturalHeight) / 2;
        ctx.drawImage(sprite, x, y);

        // Instruction
        ctx.fillStyle = '#fff';
        ctx.font = '15px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText("Press O to Close", canvas.width / 2, y + sprite.naturalHeight + 30);
    } else {
        // Fallback text if no large sprite
        ctx.fillStyle = '#fff';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(`Viewing: ${game.viewedItem.name}`, canvas.width / 2, canvas.height / 2);
        ctx.font = '15px "Press Start 2P"';
        ctx.fillText("Press O to Close", canvas.width / 2, canvas.height / 2 + 30);
    }
}

function drawObjects() {
    // Draw Objects
    if (game.rooms[game.currentRoom].objects) {
        game.objects.forEach(obj => {
            if (obj.visible === false) return; // Skip invisible objects

            // Calculate screen position
            const drawX = Math.floor(obj.x - game.cameraX);
            const drawY = Math.floor(obj.y); // Use calculated Y from update()

            // Culling
            if (drawX + obj.width < 0 || drawX > canvas.width) return;

            ctx.save(); // Save context for effects

            // Hover Effect (Glow)
            if (obj.hovered) {
                 ctx.shadowColor = '#fbbf24'; // Gold Glow
                 ctx.shadowBlur = 15;
            }

            // Draw Sprite if available
            const sprite = game.objectSprites[obj.type];

            if (sprite && sprite.complete && sprite.naturalWidth > 0) {
                // Ringing Glow
                if (obj.type === 'phone' && (game.phoneState === 'RINGING_LOOP' || game.phoneState === 'RINGED_ONCE')) {
                     ctx.shadowColor = '#fbbf24'; // Amber
                     ctx.shadowBlur = 20;
                }

                // Draw Sprite
                ctx.drawImage(sprite, drawX, drawY, obj.width, obj.height);
                ctx.shadowBlur = 0; // Reset
            } else {
                 // Fallback Box
                ctx.fillStyle = obj.color || '#ef4444';
                ctx.fillRect(drawX, drawY, obj.width, obj.height);
            }

            ctx.restore(); // Restore context (remove glow)
        });
    }
}

function drawSettings() {
    // Dim Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const page = game.settingsPage || 'audio';

    // Modal Panel
    const panelW = Math.min(980, canvas.width - 140);
    const panelH = Math.min(520, canvas.height - 120);
    const panelX = Math.floor((canvas.width - panelW) / 2);
    const panelY = Math.floor((canvas.height - panelH) / 2);
    const pad = 32;
    const headerH = 110;

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.strokeRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX + 6, panelY + 6, panelW - 12, panelH - 12);
    ctx.restore();

    // Title row
    const titleY = panelY + 46;
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';
    ctx.font = '28px "Press Start 2P"';
    ctx.fillText('SETTINGS', panelX + pad, titleY);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText('ESC: CLOSE', panelX + panelW - pad, titleY);
    ctx.restore();

    // Tabs
    const tabsY = panelY + 72;
    const tabH = 34;
    const tabW = 210;
    const gap = 14;
    const tabsX = panelX + Math.floor((panelW - (tabW * 2 + gap)) / 2);

    const drawTab = (label, x, isActive) => {
        ctx.save();
        ctx.fillStyle = isActive ? 'rgba(251, 191, 36, 0.22)' : 'rgba(30, 41, 59, 0.85)';
        ctx.fillRect(x, tabsY, tabW, tabH);
        ctx.strokeStyle = isActive ? '#fbbf24' : '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, tabsY, tabW, tabH);
        ctx.fillStyle = isActive ? '#fbbf24' : '#cbd5e1';
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + tabW / 2, tabsY + tabH / 2);
        ctx.restore();
    };

    drawTab('AUDIO', tabsX, page === 'audio');
    drawTab('CONTROLS', tabsX + tabW + gap, page === 'controls');

    // Divider
    ctx.save();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(panelX + pad, panelY + headerH);
    ctx.lineTo(panelX + panelW - pad, panelY + headerH);
    ctx.stroke();
    ctx.restore();

    const contentX = panelX + pad;
    const contentY = panelY + headerH + 26;
    const contentW = panelW - (pad * 2);
    const footerY = panelY + panelH - 34;

    // Footer (always)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText('TAB: SWITCH PAGE        ESC: CLOSE', panelX + panelW / 2, footerY);
    ctx.restore();

    if (page === 'controls') {
        // Controls page
        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#fff';
        ctx.font = '18px "Press Start 2P"';
        ctx.fillText('CONTROLS', contentX, contentY);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText('Use these keys during gameplay:', contentX, contentY + 28);
        ctx.restore();

        // Keyboard diagram (centered in panel)
        const diagramCx = panelX + panelW / 2;
        const diagramCy = contentY + 140;
        drawKeyboardHelp(diagramCx, diagramCy);

        // Text list (kept short, well-spaced)
        const listY = diagramCy + 70;
        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px "Press Start 2P"';
        const lines = [
            'MOVE: A/D or  / ',
            'RUN: SHIFT',
            'JUMP: SPACE',
            'INTERACT: E',
            'INVENTORY LOOK: O',
            'PAUSE: P'
        ];
        const colGap = 40;
        const colW = Math.floor((contentW - colGap) / 2);
        const leftX = contentX;
        const rightX = contentX + colW + colGap;
        for (let i = 0; i < lines.length; i++) {
            const x = (i < 3) ? leftX : rightX;
            const y = listY + ((i % 3) * 22);
            ctx.fillText(lines[i], x, y);
        }
        ctx.restore();

        return;
    }

    // Audio page
    const vol = game.music.platform.volume;
    const muted = !!game.music.platform.muted;
    const safeVol = Math.max(0, Math.min(1, vol));

    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    ctx.font = '18px "Press Start 2P"';
    ctx.fillText('AUDIO', contentX, contentY);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText('Master Volume', contentX, contentY + 34);
    ctx.textAlign = 'right';
    ctx.fillStyle = muted ? '#ef4444' : '#cbd5e1';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText(muted ? 'MUTED' : `${Math.round(safeVol * 100)}%`, contentX + contentW, contentY + 34);
    ctx.restore();

    // Slider
    const trackX = contentX;
    const trackY = contentY + 66;
    const trackW = contentW;
    const trackH = 18;
    const fillW = Math.max(0, Math.floor(trackW * safeVol));
    const knobX = trackX + fillW;

    ctx.save();
    // Track
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(trackX, trackY, trackW, trackH);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(trackX, trackY, trackW, trackH);

    // Fill
    ctx.fillStyle = muted ? '#475569' : '#fbbf24';
    if (fillW > 0) ctx.fillRect(trackX, trackY, fillW, trackH);

    // Knob
    ctx.fillStyle = '#fff';
    ctx.fillRect(Math.max(trackX, Math.min(trackX + trackW - 4, knobX - 2)), trackY - 4, 4, trackH + 8);
    ctx.restore();

    // Help text
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText(' / : ADJUST   M: MUTE', contentX, trackY + 34);
    ctx.restore();
}

function drawPause() {
    // Dim
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Logo
    drawLogo(cx, cy - 50, 'center');

    // Text
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.font = '20px "Press Start 2P"';
    ctx.fillText("PAUSED", cx, cy + 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText("PRESS P TO RESUME", cx, cy + 60);
}



function drawGameOver() {
    if (game.health.state !== 'DEAD' && game.health.state !== 'DYING') return;

    // Fade
    ctx.fillStyle = `rgba(0, 0, 0, ${game.health.fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (game.health.state === 'DEAD') {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        ctx.textAlign = 'center';
        ctx.fillStyle = '#ef4444'; // Red
        ctx.font = '60px "Press Start 2P"';
        ctx.fillText("GAME OVER", cx, cy - 20);

        ctx.fillStyle = '#fff';
        ctx.font = '20px "Press Start 2P"';
        ctx.fillText("PRESS ENTER TO TRY AGAIN", cx, cy + 50);
    }
}

function drawLogo(x = 40, y = 60, align = 'left', width = 400) {
    if (!game.logo.complete) return;

    ctx.save();

    // Scale Dimensions
    const targetWidth = width; // Custom width
    const ratio = game.logo.naturalHeight / game.logo.naturalWidth;
    const w = targetWidth;
    const h = targetWidth * ratio;

    let drawX = x;
    const drawY = y; // Treat y as Top

    if (align === 'center') {
        drawX = x - (w / 2);
    }

    ctx.drawImage(game.logo, drawX, drawY, w, h);
    ctx.restore();
}

// Safety: Clear keys if window loses focus to prevent "stuck run"
window.addEventListener('blur', () => {
    game.keys = {};
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
loadCreditsData();
gameLoop();
