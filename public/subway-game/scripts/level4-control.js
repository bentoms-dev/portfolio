/**
 * Level 4 — "CONTROL ROOM"
 *
 * Setting:
 * - Small control room with control desk
 * - Visible TV on the wall
 *
 * Narrative Goals:
 * - Player realises they have to turn on the controls to fix the station
 * - TV shows static / distorted images hinting at outside world
 *
 */

export const LEVEL_4_MONOLOGUE = {
  levelId: "level_4_control_room",
  beats: [
    // --- LEVEL START ---
    {
      id: "l4_start_01",
      event: "LEVEL_START",
      once: true,
      lines: ["I'M IN!", "I need to a way to turn the system back on."],
      meta: { speaker: "JACK" },
    },

    // --- CONTROL PANEL ---
    {
      id: "l4_control_try_01",
      event: "INTERACTION_CONTROL_PANEL",
      once: true,
      lines: ["How do I start this thing?"],
      meta: { speaker: "JACK" },
    },
    {
      id: "l4_control_try_02",
      event: "INTERACTION_CONTROL_PANEL_AGAIN",
      once: true,
      lines: ["There are some buttons here..."],
      meta: { speaker: "JACK" },
    },

    // --- SYSTEM START ATTEMPT BEFORE READY ---
    {
      id: "l4_control_sys_try_01",
      event: "INTERACTION_CONTROL_SYSTEM_TRY",
      once: true,
      lines: ["Hmm...I think we need power first."],
      meta: { speaker: "JACK" },
    },
        {
      id: "l4_control_sys_try_02",
      event: "INTERACTION_CONTROL_SYSTEM_TRY",
      once: true,
      lines: ["Maybe I should try something else first."],
      meta: { speaker: "JACK" },
    },


 // --- SYSTEM START ATTEMPT AFTER READY ---
    {
      id: "l4_control_sys_ready_01",
      event: "INTERACTION_CONTROL_SYSTEM_READY",
      once: true,
      lines: ["THAT'S IT!", "The system's coming back online."],
      meta: { speaker: "JACK" },
    },

    // --- VOICE RETURNS (MORE URGENT) ---
    {
      id: "l4_voice_01",
      event: "VOICE_INTERRUPT_TV",
      once: true,
      meta: { speaker: "VOICE" },
      lines: ["Jack, they said we need to shut down soon"],
    },
    {
      id: "l4_voice_02",
      event: "VOICE_INTERRUPT_TV",
      once: true,
      delayMs: 1300,
      meta: { speaker: "JACK" },
      lines: ["Molly! What?!", "What's going on?"],
    },
    {
      id: "l4_voice_03",
      event: "VOICE_INTERRUPT_TV",
      once: true,
      delayMs: 2600,
      meta: { speaker: "VOICE" },
      lines: ["You need to wake up", 'Please, Jack...'],
    },
    {
      id: "l4_voice_04",
      event: "VOICE_INTERRUPT_TV",
      once: true,
      delayMs: 3000,
      meta: { speaker: "JACK" },
      lines: ["Wake up? But...what?", "Molly? Are you there?", "MOLLY!"],
    },
        {
      id: "l4_voice_05",
      event: "VOICE_INTERRUPT_TV",
      once: true,
      delayMs: 4000,
      meta: { speaker: "JACK" },
      lines: ["I need to get out of here, now!"],
    },
  ],
};
