/**
 * Level 3 — "TICKET HALL"
 *
 * Setting:
 * - Large ticket hall with locked ticket gates (main exit blocked)
 * - Visible control room door on one side of the hall
 *
 * Narrative Goals:
 * - Player realises exits are blocked
 * - Control room is important
 * - Shift from wandering -> fixing the system
 * - Objective becomes: get into control room
 *
 * NOTE:
 * This script assumes Level 4 will handle how the door is opened (power, key, override, etc.)
 * Level 3 is about REALISING what must be done, not solving it yet.
 */

export const LEVEL_3_MONOLOGUE = {
  levelId: "level_3_ticket_hall",
  beats: [
    // --- LEVEL START ---
    {
      id: "l3_start_01",
      event: "LEVEL_START",
      once: true,
      lines: ["This must be the main hall.", "Everything leads through here."],
      meta: { speaker: "JACK" },
    },
    {
      id: "l3_start_02",
      event: "PLAYER_FIRST_MOVE",
      once: true,
      lines: ["If I can get through those gates..", "maybe I can finally leave this place."],
      meta: { speaker: "JACK" },
    },

    // --- TICKET GATES: BLOCKED EXIT ---
    {
      id: "l3_gates_blocked_01",
      event: "TRY_TICKET_GATES",
      once: true,
      lines: ["Locked.", "Of course they are."],
      meta: { speaker: "JACK" },
    },
    {
      id: "l3_gates_blocked_02",
      event: "TRY_TICKET_GATES_AGAIN",
      once: true,
      lines: ["No power... or no permission.", "Either way, I'm not getting through."],
      meta: { speaker: "JACK" },
    },
    {
      id: "l3_gates_blocked_03",
      event: "AFTER_TICKET_GATES_FAIL",
      once: true,
      delayMs: 1000,
      lines: ["So the exit's right there...", "and I can't reach it."],
      meta: { speaker: "JACK" },
    },

    // --- ENVIRONMENT SCANNING ---
    {
      id: "l3_env_01",
      event: "WALKING_10S",
      once: true,
      lines: ["Cameras, wires...", "There's got to be some kind of control system."],
    },

    // --- CONTROL ROOM DOOR: FIRST DISCOVERY ---
    {
      id: "l3_control_seen_01",
      event: "SEE_CONTROL_ROOM_DOOR",
      once: true,
      lines: ["That room...", "That's where everything connects."],
    },

    // --- CONTROL ROOM DOOR: TRY OPEN ---
    {
      id: "l3_control_try_01",
      event: "TRY_CONTROL_ROOM_DOOR",
      once: true,
      lines: ["Locked...", "There must be a way inside."],
    },
    {
      id: "l3_control_try_02",
      event: "TRY_CONTROL_ROOM_DOOR",
      once: true,
      delayMs: 900,
      lines: ["Looks like it needs a keycard."],
    },
        {
      id: "l3_control_try_03",
      event: "TRY_CONTROL_ROOM_DOOR_WITH_KEYCARD",
      once: true,
      lines: ["Wait. Let me try this keycard.", "IT WORKS!"],
    },

    // --- SHIFT IN MINDSET (OBJECTIVE FORMS) ---
    {
      id: "l3_realise_01",
      event: "AFTER_EXPLORING_HALL",
      once: true,
      lines: ["Running around isn't helping anymore.", "I need to fix what's broken."],
    },
    {
      id: "l3_realise_02",
      event: "AFTER_EXPLORING_HALL",
      once: true,
      delayMs: 1100,
      lines: ["If this place won't let me leave...", "maybe I have to make it let me."],
    },

    // --- VOICE RETURNS (MORE URGENT) ---
    {
      id: "l3_voice_01",
      event: "VOICE_INTERRUPT",
      once: true,
      meta: { speaker: "VOICE" },
      lines: ["Jack… please…", "come back—"],
    },
    {
      id: "l3_voice_02",
      event: "VOICE_INTERRUPT",
      once: true,
      delayMs: 1300,
      meta: { speaker: "JACK" },
      lines: ["Huh? Who is that?"],
    },
    {
      id: "l3_voice_03",
      event: "VOICE_INTERRUPT",
      once: true,
      delayMs: 2600,
      meta: { speaker: "VOICE" },
      lines: ["Come-", 'back...'],
    },
    {
      id: "l3_voice_04",
      event: "VOICE_INTERRUPT",
      once: true,
      delayMs: 3000,
      meta: { speaker: "JACK" },
      lines: ["What? I don't understand!", "Hello?", "Gone."],
    },

    // --- OBJECTIVE LOCK-IN ---
    {
      id: "l3_objective_01",
      event: "NEAR_CONTROL_ROOM_END",
      once: true,
      lines: ["If I can get into that control room…", "maybe I can turn things back on."],
    },
    {
      id: "l3_objective_02",
      event: "NEAR_CONTROL_ROOM_END",
      once: true,
      delayMs: 1100,
      lines: ["Maybe I can get this place moving again."],
    },

        // --- GATES: TRY OPEN ---
    {
      id: "l3_gates_try_01",
      event: "TRY_TICKET_GATES_NO_POWER",
      once: true,
      lines: ["Locked..", "I need to get the power back on."],
    },
    {
      id: "l3_gates_try_02",
      event: "TRY_TICKET_GATES_NO_TRAVELCARD",
      once: true,
      delayMs: 900,
      lines: ["I need a travel card to get through here!"],
    },
        {
      id: "l3_gates_try_03",
      event: "TRY_TICKET_GATES_WITH_TRAVELCARD",
      once: true,
      lines: ["Let me try this travel card.", "YES!"],
    },

  ],
};

/**
 * Suggested event wiring:
 *
 * LEVEL_START
 * PLAYER_FIRST_MOVE
 *
 * TRY_TICKET_GATES
 * TRY_TICKET_GATES_AGAIN
 * AFTER_TICKET_GATES_FAIL
 *   - fired after 1–2 failed attempts or after stepping away
 *
 * WALKING_10S
 *
 * SEE_CONTROL_ROOM_DOOR
 *   - when control room door enters camera view or player enters trigger zone
 *
 * TRY_CONTROL_ROOM_DOOR
 *
 * AFTER_EXPLORING_HALL
 *   - after player has:
 *       - tried ticket gates
 *       - seen control room
 *       - attempted control room door
 *
 * VOICE_INTERRUPT
 *   - timed beat or proximity to control room
 *
 * NEAR_CONTROL_ROOM_END
 *   - when player is close to door after mindset shift
 *
 * LEVEL_COMPLETE
 *   - just before fade-out to Level 4
 */

/**
 * NOTE ON MECHANICS:
 * Level 3 should NOT open the control room yet.
 * This level establishes:
 *   - exits are blocked
 *   - control room is key
 *   - player objective is formed
 *
 * Level 4 will handle:
 *   - how the door opens
 *   - power restoration puzzle
 */
