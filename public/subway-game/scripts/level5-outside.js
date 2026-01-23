/**
 * Level 5 — "OUTSIDE"
 *
 * Setting:
 * - In the street outside the subway station
 * - Buildings, streetlights, trees. Abandoned. Quiet.
 *
 * Narrative Goals:
 * - Player realises he needs to accept his situation
 * - A character appears to guide him and help him move on
 *
 */

export const LEVEL_5_OUTSIDE_MONOLOGUE = {
  levelId: "level_5_outside",
  beats: [
    // --- LEVEL START ---
    {
      id: "l5_start_01",
      event: "LEVEL_START",
      once: true,
      lines: ["What? Why am I still here?", "I thought I would have woken up by now.", "How do I get out of here?"],
      meta: { speaker: "JACK" },
    },

    // --- Bus Stop ---
    {
      id: "l5_bus_stop_look_01",
      event: "INTERACTION_BUS_STOP",
      once: true,
      lines: ["What's the point of waiting here?", "No one's coming."],
      meta: { speaker: "JACK" },
    },
    {
      id: "l5_bus_stop_look_02",
      event: "INTERACTION_BUS_STOP_AGAIN",
      once: true,
      lines: ["Who tore up this poster?"],
      meta: { speaker: "JACK" },
    },

    // --- POSTER ASSEMBLE GAME ---
    {
      id: "l5_poster_assemble_01",
      event: "INTERACTION_POSTER_ASSEMBLE",
      once: true,
      lines: ["These pieces... they fit together."],
      meta: { speaker: "JACK" },
    },
    // --- POSTER ASSEMBLE GAME COMPLETE ---
    {
      id: "l5_poster_assemble_complete_01",
      event: "INTERACTION_POSTER_ASSEMBLE_COMPLETE",
      once: true,
      lines: ["Omg!", "That's me...", "I remember now.", "I was going to Molly's.", "That bus cut me off...", "I must have crashed..."],
      meta: { speaker: "JACK" },
    },

    // --- NEW CHARACTER APPEARS ---
    {
        id: "l5_dad_01",
        event: "FINAL_PUZZLE_COMPLETE",
        once: true,
      meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
        lines: ["Took you long enough."],
    },
    {
        id: "l5_dad_02",
        event: "FINAL_PUZZLE_COMPLETE",
        once: true,
      delayMs: 350,
      meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
        lines: ["...Dad?", "Is that really you?"],
    },
    {
        id: "l5_dad_03",
        event: "FINAL_PUZZLE_COMPLETE",
        once: true,
      delayMs: 250,
      meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
        lines: ["Yeah.", "Still me."],
    },
    {
        id: "l5_dad_04",
        event: "FINAL_PUZZLE_COMPLETE",
        once: true,
      delayMs: 250,
      meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
        lines: ["I think I remember what happened.", "A bus cut me off...", "I lost control."],
    },
    {
    id: "l5_dad_05",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["No, son.", "That's not how it happened."],
    },
    {
    id: "l5_dad_06",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
    lines: ["What do you mean?", "That's what I remember."],
    },
    {
    id: "l5_dad_07",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["That's what you needed it to be."],
    },
    {
    id: "l5_dad_08",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["You didn't lose control, Jack.", "You let go."],
    },
    {
    id: "l5_dad_09",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
    lines: ["No...", "I wouldn't—", "I wouldn't do that."],
    },
    {
    id: "l5_dad_10",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["You weren't trying to die.", "You were trying to stop hurting."],
    },
    {
    id: "l5_dad_11",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
    lines: ["I was so tired.", "Everything felt… heavy."],
    },
    {
    id: "l5_dad_12",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["I know.", "I've been there too."],
    },
    {
    id: "l5_dad_13",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
    lines: ["Molly…", "I didn’t even think about her."],
    },
    {
    id: "l5_dad_14",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["You did.", "That's why it hurt so much."],
    },
    {
    id: "l5_dad_15",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["She's still there, Jack.", "Still waiting for you to come back."],
    },
    {
    id: "l5_dad_16",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
    lines: ["After what I did...", "How can I face her?"],
    },
    {
    id: "l5_dad_17",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["By staying.", "By trying.", "That's all anyone can ask of you."],
    },
    {
    id: "l5_dad_18",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
    lines: ["I don't want to feel like that again."],
    },
    {
    id: "l5_dad_19",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["You will.", "But you won't be alone with it this time."],
    },
    {
    id: "l5_dad_20",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
    lines: ["...I want to go home."],
    },
    {
    id: "l5_dad_21",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["Then go.", "It's not your time to stay here."],
    },
    {
    id: "l5_dad_22",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
    lines: ["Will you be okay?"],
    },
    {
    id: "l5_dad_23",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["I will.", "You worry about living."],
    },
    {
    id: "l5_dad_24",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "JACK", perChar: 6.2, minDuration: 140 },
    lines: ["…Okay.", "I'm ready."],
    },
    {
    id: "l5_dad_25",
    event: "FINAL_PUZZLE_COMPLETE",
    once: true,
    delayMs: 250,
    meta: { speaker: "DAD", color: "#39ff14", perChar: 6.0, minDuration: 140 },
    lines: ["That's all I ever wanted to hear."],
    },
  ],
};
