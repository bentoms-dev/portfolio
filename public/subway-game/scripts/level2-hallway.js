/**
 * Level 2 — "THE HALLWAY" (Inner Monologue + Emergency Phone Clue)
 *
 * Assumptions:
 * - Side-scrolling corridor, left-to-right.
 * - There is an emergency phone interactable mounted on the wall.
 *
 * Key set pieces:
 * 1) Phone is dead on first interaction
 * 2) Later, it rings once (no prompt)
 * 3) Player returns, answers, hears distorted voice, call cuts
 * 4) Aftermath monologue reinforces "external contact" + unease
 *
 * How to use:
 * - Call `monologue.trigger("EVENT_KEY")` when events happen.
 * - Drive time-based triggers (walking/idle) from your own timers.
 */

export const LEVEL_2_MONOLOGUE = {
  levelId: "level_2_hallway",
  beats: [
    // --- LEVEL START ---
    {
      id: "l2_start_01",
      event: "LEVEL_START",
      once: true,
      lines: ["This isn't part of the station I remember."],
    },
    {
      id: "l2_start_02",
      event: "PLAYER_FIRST_MOVE",
      once: true,
      lines: ["Feels like I've been here before."],
    },

    // --- WALKING: SPACE FEELS OFF ---
    {
      id: "l2_walk_01",
      event: "WALKING_8S",
      once: true,
      lines: ["This hallway's too long.", "I should've reached something by now."],
    },
    {
      id: "l2_walk_02",
      event: "WALKING_16S",
      once: true,
      lines: ["It's like the walls are... stretching."],
    },

    // --- PHONE: FIRST INTERACTION (DEAD LINE) ---
    {
      id: "phone_dead_01",
      event: "PHONE_INTERACT_FIRST",
      once: true,
      lines: ["It's dead.", "Figures."],
    },
    {
      id: "phone_dead_02",
      event: "PHONE_INTERACT_FIRST",
      once: true,
      delayMs: 900,
      lines: ["Nothing works properly in this place."],
    },

    // --- OPTIONAL: PLAYER WALKS AWAY FROM PHONE AFTER FIRST TRY ---
    // --- PHONE RINGS ONCE (NO PROMPT) ---
    // This is usually triggered by your game logic:
    // e.g., after the player has walked X distance from the phone OR after a light flicker event.
    {
      id: "phone_ring_reaction_01",
      event: "PHONE_RINGED_ONCE",
      once: true,
      lines: ["...What?"],
    },

    // --- PHONE: SECOND INTERACTION (CALL CONNECTS) ---
    // You can play VOICE audio while showing these subtitles.
    // Keep the VOICE label out of UI if you want it creepier.
    {
      id: "phone_call_01",
      event: "PHONE_INTERACT_AFTER_RING",
      once: false, // Allow replay
      lines: ["Hello? Who is this?"],
      meta: { speaker: "JACK" },
    },

    // Distorted voice subtitles
    {
      id: "phone_call_02",
      event: "PHONE_INTERACT_AFTER_RING", // Same trigger, queued after
      once: true,
      delayMs: 2000,
      meta: { speaker: "VOICE" },
      lines: ["Jack...", "Don't... leave...", "We are..."],
    },
    {
      id: "phone_call_voice_01",
      event: "PHONE_INTERACT_AFTER_RING",
      once: true,
      delayMs: 800,
      lines: ["Jack...", "Can you hear me?"],
      meta: { speaker: "VOICE" },
    },
    {
      id: "phone_call_voice_02",
      event: "PHONE_INTERACT_AFTER_RING",
      once: true,
      delayMs: 1900,
      lines: ["You need to-"],
      meta: { speaker: "VOICE" },
    },

    // --- CALL CUTS / DISCONNECT ---
    {
      id: "phone_call_cut_01",
      event: "PHONE_INTERACT_AFTER_RING",
      once: false,
      delayMs: 2100,
      lines: ["Wait—", "Hello?...", "Hello?"],
      meta: { speaker: "JACK" },
    },

    // --- AFTERMATH: JACK PROCESSES IT ---
    {
      id: "phone_after_01",
      event: "AFTER_PHONE_CALL",
      once: false,
      lines: ["What the hell was that?"],
    },
    {
      id: "phone_after_02",
      event: "AFTER_PHONE_CALL",
      once: false,
      delayMs: 1100,
      lines: ["It sounded like...", "No, it can't be."],
    },
    {
      id: "phone_after_03",
      event: "AFTER_PHONE_CALL",
      once: false,
      delayMs: 2200,
      lines: ["I need to find a way out"],
    },

    // --- PHONE: SPAM PREVENTION / LATER INTERACTIONS ---
    {
      id: "phone_dead_again_01",
      event: "PHONE_INTERACT_AFTER_CALL",
      once: true,
      lines: ["It's dead again."],
    },
    {
      id: "phone_dead_again_02",
      event: "PHONE_INTERACT_AFTER_CALL",
      once: true,
      delayMs: 900,
      lines: ["Am I going crazy?"],
    },

        // --- POSTER: INTERACTIONS ---
      {
        id: "poster_interact_01",
        event: "poster_interact_01",
        once: true,
        lines: ["Something weird about this poster"],
      },
      {
        id: "poster_interact_02",
        event: "poster_interact_02",
        once: true,
        lines: ["It looks like there is something behind it"],
      },
      {
        id: "poster_interact_03",
        event: "poster_interact_03",
        once: true,
        lines: ["There's a keycard taped behind the poster."],
      },
      {
        id: "poster_interact_04",
        event: "poster_interact_04",
        once: true,
        lines: ["Got it!", "I wonder what this opens?"],
      },

    // --- LOOPING / REPETITION (IF YOUR HALLWAY LOOPS OR REUSES ASSETS) ---
    {
      id: "l2_loop_01",
      event: "HALLWAY_REPEAT_HINT",
      once: true,
      lines: ["Haven't I already passed this?", "I definitely have."],
    },
    {
      id: "l2_loop_02",
      event: "HALLWAY_REPEAT_HINT",
      once: true,
      delayMs: 1000,
      lines: ["Why am I still here?"],
    },

    // --- IDLE (OPTIONAL) ---
    {
      id: "l2_idle_01",
      event: "PLAYER_IDLE_8S",
      once: true,
      lines: ["I don't like being still here."],
    },
    {
      id: "l2_idle_02",
      event: "PLAYER_IDLE_14S",
      once: true,
      lines: ["Feels like time isn't moving right."],
    },
    {
      id: "l2_idle_03",
      event: "PLAYER_IDLE_22S",
      once: true,
      lines: ["It's like I'm only half here."],
    },

    // --- LEVEL END / EXIT ---
    {
      id: "l2_exit_01",
      event: "REACH_LEVEL_EXIT",
      once: true,
      lines: ["Whatever this place is...", "it's not just a station anymore."],
    },
    {
      id: "l2_exit_02",
      event: "REACH_LEVEL_EXIT",
      once: true,
      delayMs: 1000,
      lines: ["It's something else."],
    },
  ],
};

/**
 *
 * LEVEL_START
 * PLAYER_FIRST_MOVE
 *
 * WALKING_8S / WALKING_16S
 *   - fire once after the player has accumulated walking time in this level
 *
 * PHONE_INTERACT_FIRST
 *   - first time player interacts with phone
 *
 * LEFT_PHONE_AREA_AFTER_DEAD
 *   - after PHONE_INTERACT_FIRST has happened, player moves X distance away from phone trigger zone
 *
 * PHONE_RINGED_ONCE
 *   - trigger this once after leaving phone zone OR after a light-flicker beat
 *   - play ring SFX once, then fire event to show Jack reaction text
 *
 * PHONE_INTERACT_AFTER_RING
 *   - player interacts with phone AFTER it rang
 *   - start call audio, show VOICE subtitles
 *
 * PHONE_CALL_CUT
 *   - when you cut the call (timed ~2-3 seconds)
 *
 * AFTER_PHONE_CALL
 *   - fired after PHONE_CALL_CUT, when player regains movement or steps away
 *
 * PHONE_INTERACT_AFTER_CALL
 *   - if player tries the phone again after call
 *
 * HALLWAY_REPEAT_HINT
 *   - if you loop the corridor or detect backtracking past the same landmark/poster
 *
 * PLAYER_IDLE_8S / 14S / 22S
 *   - based on idle timer
 *
 * REACH_LEVEL_EXIT
 *   - when player hits the exit trigger to Level 3
 */
