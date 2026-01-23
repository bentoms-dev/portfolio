/**
 * Level 1 — "THE PLATFORM" (Inner Monologue Script)
 * Format: a simple list of triggerable dialogue beats.
 *
 * How to use:
 * - Call `monologue.trigger("EVENT_KEY")` when something happens (wake, pickup, etc.)
 * - Call `monologue.update(dt)` from your game loop if you want optional timers/idle lines.
 *
 * Notes:
 * - Each line is short for on-screen display.
 * - `once: true` prevents repeats.
 */

export const LEVEL_1_MONOLOGUE = {
  levelId: "level_1_platform",
  beats: [
    // --- WAKE / START ---
    {
      id: "wake_01",
      event: "LEVEL_START",
      once: true,
      lines: ["…Hello?", "Where am I?"],
    },
    {
      id: "wake_02",
      event: "PLAYER_FIRST_MOVE",
      once: true,
      lines: ["This is… a Tube platform.", "Why am I here?"],
    },

    // --- EARLY WALKING AMBIENCE ---
    {
      id: "walk_01",
      event: "WALKING_5S",
      once: true,
      lines: ["My head feels… heavy.", "Like I've been asleep for a long time."],
    },
    {
      id: "walk_02",
      event: "WALKING_12S",
      once: true,
      lines: ["I should remember how I got here.", "…but I don't."],
    },

    // --- NEWSPAPER ---
    {
      id: "news_01",
      event: "PICKUP_NEWSPAPER",
      once: true,
      lines: ["That's… comforting.", "Or it would be, if this felt real."],
    },
    {
      id: "news_02",
      event: "PICKUP_NEWSPAPER",
      once: true,
      delayMs: 800,
      lines: ["Why would someone leave this here?"],
    },
    {
      id: "news_03",
      event: "PICKUP_NEWSPAPER",
      once: true,
      delayMs: 1400,
      lines: ["It feels like it was meant for me."],
    },

    // --- WALLET / ID ---
    {
      id: "wallet_01",
      event: "PICKUP_WALLET",
      once: true,
      lines: ["Jack Mallace…", "That's me, I guess."],
    },
    {
      id: "wallet_02",
      event: "PICKUP_WALLET",
      once: true,
      delayMs: 900,
      lines: ["I don't feel like a “Jack Mallace”."],
    },
    {
      id: "wallet_03",
      event: "PICKUP_WALLET",
      once: true,
      delayMs: 1500,
      lines: ["But it's something.", "It's more than I had a minute ago."],
    },

    // --- AFTER BOTH ITEMS (subtle unease) ---
    {
      id: "both_01",
      event: "HAS_NEWSPAPER_AND_WALLET",
      once: true,
      lines: ["Why do I have my wallet…", "but nothing else?"],
    },
    {
      id: "both_02",
      event: "HAS_NEWSPAPER_AND_WALLET",
      once: true,
      delayMs: 1000,
      lines: ["No phone.", "No bag.", "No memories."],
    },

    // --- BLOCKED EXIT / END OF PLATFORM ---
    {
      id: "exit_01",
      event: "TRY_EXIT_BLOCKED",
      once: true,
      lines: ["Of course.", "It's not going to be that easy."],
    },
    {
      id: "exit_02",
      event: "TRY_EXIT_BLOCKED_AGAIN",
      once: true,
      lines: ["Feels like I'm supposed to look around first."],
    },
    {
      id: "exit_03",
      event: "TRY_EXIT_BLOCKED_AGAIN",
      once: true,
      delayMs: 900,
      lines: ["Like I missed something."],
    },

    // --- DEATH ---
    {
      id: "death_01",
      event: "HEALTH_BELOW_60",
      once: true,
      lines: ["I don't feel great.", "Something is wrong."],
    },
    {
      id: "death_02",
      event: "HEALTH_BELOW_30",
      once: true,
      lines: ["I'm getting weaker. I need get out of here right now!"],
    },
    {
      id: "death_03",
      event: "HEALTH_BELOW_1",
      once: true,
      lines: ["I can't go on. I can't see. My head!"],
    },

    // --- IDLE / PAUSE (optional) ---
    {
      id: "idle_01",
      event: "PLAYER_IDLE_6S",
      once: true,
      lines: ["This place is too quiet.", "Even for an empty station."],
    },
    {
    id: "idle_02",
    event: "PLAYER_IDLE_10S",
    once: true,
    lines: ["Feels like time isn't moving right."],
    },
    {
    id: "idle_03",
    event: "PLAYER_IDLE_14S",
    once: true,
    lines: ["I don't even know what I'm waiting for."],
    },
    {
    id: "idle_04",
    event: "PLAYER_IDLE_18S",
    once: true,
    lines: ["This place feels.. unfinished."],
    },
    {
    id: "idle_05",
    event: "PLAYER_IDLE_22S",
    once: true,
    lines: ["Like someone stopped in the middle of building it."],
    },
    {
    id: "idle_06",
    event: "PLAYER_IDLE_26S",
    once: true,
    lines: ["My thoughts keep slipping away."],
    },
    {
    id: "idle_07",
    event: "PLAYER_IDLE_30S",
    once: true,
    lines: ["Every time I try to focus… it hurts."],
    },
    {
    id: "idle_08",
    event: "PLAYER_IDLE_34S",
    once: true,
    lines: ["It's like I'm only half here."],
    },
    {
    id: "idle_09",
    event: "PLAYER_IDLE_40S",
    once: true,
    lines: ["No trains.", "No announcements.", "Nothing."],
    },
    {
    id: "idle_10",
    event: "PLAYER_IDLE_45S",
    once: true,
    lines: ["Even abandoned places usually feel… alive somehow."],
    },
    {
    id: "idle_11",
    event: "PLAYER_IDLE_50S",
    once: true,
    lines: ["This feels more like a memory of a station."],
    },
  ],
};
