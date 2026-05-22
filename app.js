const TAU = Math.PI * 2;
const POINTER_ANGLE = -Math.PI / 2;
const STORAGE_KEY = "spinny-wheel-exe-state-v1";

const DEFAULT_CONTENT = {
  squadName: "STANDUP SQUAD",
  fallbackPeople: ["Ada", "Grace", "Linus", "Margaret"],
  winnerPhrases: [
    "{name} is up next",
    "the wheel picked {name}",
    "over to {name}",
    "{name} has the floor"
  ],
  finalWheelLabels: [
    "and finally, {name}",
    "last one: {name}",
    "closing ceremony: {name}",
    "the final pick is {name}"
  ],
  sendoffMessages: [
    "standup is complete",
    "everyone has had a turn",
    "the wheel is empty now",
    "round complete"
  ],
  squadLore: [
    "STANDUP CONTINUES",
    "ROUND IN PROGRESS",
    "THE WHEEL HAS NOTES",
    "EVERYONE GETS A TURN"
  ],
  targetedAds: [
    {
      eyebrow: "Sponsored",
      target: "the team",
      headline: "Need a standup order with extra drama?",
      body: "WheelCorp rotates names, invents fake urgency, and keeps the meeting moving.",
      product: "WheelCorp",
      cta: "Spin again",
      lore: "THE WHEEL NEEDS TEAM CONTENT"
    }
  ],
  winnerBadges: ["PICKED", "NEXT UP", "WHEEL SAYS", "YOUR TURN"],
  sendoffStamps: ["ALL DONE", "ROUND COMPLETE", "GOODBYE MODE", "NO MORE NAMES"],
  sendoffSubtitles: [
    "click anywhere to return",
    "no further wheel events remain",
    "reset round if you need another pass"
  ],
  crashMessages: [
    "Fatal ceremony error at 0xWHEEL",
    "",
    "Cause: everyone has spoken and the application cannot cope.",
    "Recovered names: 0",
    "Pointer integrity: emotionally unavailable",
    "Suggested action: reset the round.",
    "",
    "SPINNY_WHEEL_STACKTRACE:",
    "  at SendoffPopup.close()",
    "  at MeetingFinished.butTooDramatically()",
    "  at Wheel.exe: line absolutely not found"
  ]
};

const configuredContent = window.SPINNY_CONTENT && typeof window.SPINNY_CONTENT === "object"
  ? window.SPINNY_CONTENT
  : {};
const squadName = contentText(configuredContent.squadName, DEFAULT_CONTENT.squadName);
const fallbackPeople = contentList(configuredContent.fallbackPeople, DEFAULT_CONTENT.fallbackPeople);
const winnerPhrases = contentList(configuredContent.winnerPhrases, DEFAULT_CONTENT.winnerPhrases);
const finalWheelLabels = contentList(configuredContent.finalWheelLabels, DEFAULT_CONTENT.finalWheelLabels);
const sendoffMessages = contentList(configuredContent.sendoffMessages, DEFAULT_CONTENT.sendoffMessages);
const squadLore = contentList(configuredContent.squadLore, DEFAULT_CONTENT.squadLore);
const targetedAds = contentAdList(configuredContent.targetedAds, DEFAULT_CONTENT.targetedAds);
const winnerBadges = contentList(configuredContent.winnerBadges, DEFAULT_CONTENT.winnerBadges);
const sendoffStamps = contentList(configuredContent.sendoffStamps, DEFAULT_CONTENT.sendoffStamps);
const sendoffSubtitles = contentList(configuredContent.sendoffSubtitles, DEFAULT_CONTENT.sendoffSubtitles);
const crashMessages = contentList(configuredContent.crashMessages, DEFAULT_CONTENT.crashMessages);

const wheelColors = [
  "#c45532",
  "#e7d46f",
  "#8fbd76",
  "#5d78aa",
  "#bc7ca0",
  "#b88347",
  "#82b9b1",
  "#c6cf82",
  "#7f6aa4",
  "#e1adc0",
  "#587d66",
  "#d59d7a"
];

const peopleInput = document.querySelector("#peopleInput");
const spinButton = document.querySelector("#spinButton");
const resetButton = document.querySelector("#resetButton");
const undoButton = document.querySelector("#undoButton");
const soundButton = document.querySelector("#soundButton");
const remainingCount = document.querySelector("#remainingCount");
const resultOverlay = document.querySelector("#resultOverlay");
const targetAd = document.querySelector("#targetAd");
const squadKicker = document.querySelector("#squadKicker");
const pointer = document.querySelector(".pointer");
const canvas = document.querySelector("#wheelCanvas");
const ctx = canvas.getContext("2d");

if (squadKicker) {
  squadKicker.textContent = squadName;
}

const themeKeys = [
  "acid",
  "zap",
  "cyan",
  "banana",
  "bad-blue",
  "alert",
  "page-bg",
  "bg-a",
  "bg-b",
  "bg-c",
  "button-edge",
  "hover-edge",
  "input-bg",
  "input-corner",
  "input-smudge",
  "input-shadow",
  "kicker-bg",
  "title-a",
  "title-b",
  "title-shadow-a",
  "title-shadow-b",
  "title-shadow-c",
  "sticker-bg",
  "panel-left",
  "panel-right",
  "panel-edge",
  "badge-bg",
  "badge-text",
  "spin-a",
  "spin-b",
  "spin-c",
  "spin-d",
  "spin-e",
  "canvas-a",
  "canvas-b",
  "canvas-c",
  "canvas-d",
  "canvas-e",
  "canvas-f",
  "winner-bg",
  "winner-shadow-a",
  "winner-shadow-b",
  "status-bg",
  "status-shadow",
  "list-bg",
  "picked-latest",
  "lore-bg",
  "lore-a",
  "lore-b",
  "lore-c",
  "lore-d",
  "overlay-bg",
  "overlay-card",
  "overlay-accent",
  "overlay-second",
  "overlay-third"
];

const appThemes = [
  {
    vars: ["#c6d96f", "#b34a7d", "#88c7c2", "#eadb67", "#4b62a3", "#c45532", "#b9c58e", "#9e8c91", "#d4b153", "#4f8a7b", "#7fb083", "#b34a7d", "#efe278", "rgba(255, 255, 255, 0.28)", "rgba(155, 98, 138, 0.24)", "rgba(105, 145, 95, 0.55)", "#d8cc72", "#cf663c", "#eadb67", "#c6d96f", "#4b62a3", "#b34a7d", "#c7d98a", "#d98dbb", "#9ecc92", "#eadb67", "#50396d", "#f7f0b0", "#b7382e", "#e6ce58", "#4f8a7b", "#8d74b7", "#c997b3", "#c997b3", "#e5d575", "#9eb77f", "#79b5bd", "#8d74b7", "#d77855", "#4b62a3", "#eadb67", "#88b37f", "#e9d871", "#87a76e", "#eadb67", "#c7799e", "#b7d0cf", "#eadb67", "#d9a1b7", "#cbd889", "#d7c0e5", "#d7c0e5", "#eadb67", "#b34a7d", "#7fb8b2", "#c45532"],
    wheel: ["#c45532", "#e7d46f", "#8fbd76", "#5d78aa", "#bc7ca0", "#b88347", "#82b9b1", "#c6cf82", "#7f6aa4", "#e1adc0", "#587d66", "#d59d7a"]
  },
  {
    vars: ["#e2c365", "#7a516d", "#7db9c7", "#d2ea8e", "#39455f", "#9d6542", "#cbc2a2", "#8ea1a4", "#d6b470", "#b9a0c1", "#b88952", "#7d4d77", "#d7eca3", "rgba(40, 35, 50, 0.10)", "rgba(128, 79, 112, 0.23)", "rgba(119, 84, 47, 0.42)", "#a7c6cb", "#7d405b", "#d8ec8f", "#d7a752", "#3f5c70", "#bd8eaf", "#e5bf79", "#a7c1de", "#c4b578", "#b17986", "#5d473f", "#f3e8a6", "#6d8e9a", "#d7b557", "#b48faa", "#9b7144", "#d4e8ad", "#c1a1bd", "#e0c472", "#7f9f8e", "#8ab7c1", "#b48faa", "#a76d4a", "#7e596f", "#e2d682", "#9bbbb7", "#d7ca86", "#ac8260", "#d3c47c", "#9bb9d2", "#b9cbbc", "#d8ca70", "#b792ad", "#d3dfa4", "#a7c2c9", "#c3b0d5", "#d7c471", "#85506e", "#8bb6be", "#a86f4d"],
    wheel: ["#6d8e9a", "#d7b557", "#b48faa", "#9b7144", "#d4e8ad", "#8ab7c1", "#c47763", "#798c57", "#dbc590", "#9f6d95"]
  },
  {
    vars: ["#d4a835", "#885f99", "#abcbd0", "#f0dba0", "#45516f", "#bd6745", "#d6c0a8", "#c89b82", "#9fb782", "#6d8d9e", "#c78d72", "#916096", "#f1dfa6", "rgba(255, 255, 255, 0.18)", "rgba(94, 66, 120, 0.26)", "rgba(122, 80, 56, 0.39)", "#ead3b4", "#bd6745", "#d4a835", "#b3c97a", "#4b6381", "#8b6aa4", "#c9b767", "#d5a2ba", "#b5c7a0", "#c8a75c", "#3f4b68", "#f4e5b0", "#bd6745", "#d6bd6b", "#6d8d9e", "#8b6aa4", "#d5a2ba", "#d2a9bd", "#e1c771", "#b0bf8f", "#9dc7c6", "#8d76a9", "#c98160", "#45516f", "#d4a835", "#93b39b", "#ead777", "#c78860", "#e0cd79", "#c58daa", "#c5d2b8", "#ead777", "#d5a2ba", "#c8d37e", "#c3d6d9", "#d2bed8", "#cdbed0", "#e5c66d", "#8b6aa4", "#9dc7c6", "#bd6745"],
    wheel: ["#bd6745", "#ead777", "#93b39b", "#45516f", "#c58daa", "#c78860", "#9dc7c6", "#8b6aa4", "#c8d37e", "#d2bed8"]
  },
  {
    vars: ["#b9cf91", "#a44d54", "#8eb4b0", "#f0c766", "#243e5d", "#db8357", "#aebba8", "#765d6d", "#c9d29a", "#d08b72", "#8f7845", "#a44d54", "#f5d88a", "rgba(0, 0, 0, 0.08)", "rgba(62, 86, 119, 0.2)", "rgba(75, 91, 62, 0.48)", "#d8b8c1", "#a44d54", "#f0c766", "#b9cf91", "#243e5d", "#8b6d9b", "#b4c374", "#dcb4a1", "#b8cbbb", "#da9e61", "#243e5d", "#f6e6b5", "#8e6f59", "#f0c766", "#8eb4b0", "#ba7a9a", "#dcb4a1", "#ba7a9a", "#f0c766", "#aebf88", "#8eb4b0", "#8b6d9b", "#db8357", "#243e5d", "#f0c766", "#b4c374", "#e8d184", "#8eb4b0", "#f0c766", "#dcb4a1", "#c5d0c1", "#e8d184", "#d8b8c1", "#c9d29a", "#bfd8d4", "#cdb8dc", "#d8b8c1", "#f0c766", "#a44d54", "#8eb4b0", "#db8357"],
    wheel: ["#f0c766", "#243e5d", "#dcb4a1", "#8eb4b0", "#a44d54", "#c9d29a", "#8b6d9b", "#db8357", "#aebba8", "#8e6f59"]
  },
  {
    vars: ["#ccd8a1", "#8f5c7d", "#9cc0bd", "#e0bd57", "#59607e", "#a34e38", "#dad0b2", "#b5a085", "#8fae9b", "#caa8be", "#9a9f6b", "#7e5274", "#e8d36e", "rgba(255,255,255,0.20)", "rgba(94, 64, 72, 0.23)", "rgba(96, 102, 66, 0.52)", "#c9bfdc", "#a34e38", "#e0bd57", "#ccd8a1", "#59607e", "#8f5c7d", "#d7c17c", "#b6c3df", "#d6a2a2", "#9cc0bd", "#4e5065", "#f1e6bd", "#a34e38", "#ccd8a1", "#9cc0bd", "#8f5c7d", "#e0bd57", "#b6c3df", "#d7c17c", "#a8bd8d", "#9cc0bd", "#8f5c7d", "#a34e38", "#4e5065", "#e0bd57", "#9cc0bd", "#e4cf79", "#8fae9b", "#d7c17c", "#d6a2a2", "#c6d0bd", "#e4cf79", "#d6a2a2", "#ccd8a1", "#c1d7d3", "#c9bfdc", "#d6a2a2", "#e0bd57", "#8f5c7d", "#9cc0bd", "#a34e38"],
    wheel: ["#a34e38", "#e0bd57", "#9cc0bd", "#59607e", "#ccd8a1", "#8f5c7d", "#d6a2a2", "#8fae9b", "#b6c3df", "#d7c17c"]
  }
];

let activeWheelColors = wheelColors.slice();
appThemes.forEach((theme) => {
  theme.vars = theme.vars.slice(0, themeKeys.length);
});

const labelModes = [
  { name: "classic", weight: 20 },
  { name: "allAligned", weight: 15 },
  { name: "upsideDown", weight: 10 },
  { name: "mixedFlips", weight: 14 },
  { name: "horizontal", weight: 12 },
  { name: "screenLocked", weight: 12 },
  { name: "stairStep", weight: 10 },
  { name: "nearlyRadial", weight: 7 }
];

let state = {
  picked: [],
  history: [],
  soundOn: true,
  rotation: 0,
  themeIndex: 0,
  pointerAngle: POINTER_ANGLE
};

let canvasSize = 720;
let isSpinning = false;
let displayedWheelNames = null;
let pointerAngle = POINTER_ANGLE;
let lastPointerIndex = -1;
let lastTickAt = 0;
let audioContext = null;
let spinSound = null;
let targetAdDismissed = false;
let pendingThemeSeed = null;
let labelProfile = chooseLabelProfile();
let isRemoving = false;
let removalRunId = 0;
let overlayKind = "none";
let pendingSendoff = false;
let pendingSendoffThemeSeed = null;
let pendingRemovalEffects = false;
let pendingRemovalIntensity = 0;
let visualSliceState = new Map();
let crashOverlay = null;

function contentText(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function contentList(value, fallback) {
  const list = Array.isArray(value) ? value : [];
  const cleaned = list
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return cleaned.length ? cleaned : fallback.slice();
}

function contentAdList(value, fallback) {
  const list = Array.isArray(value) ? value : [];
  const cleaned = list.map((item) => {
    const ad = item && typeof item === "object" ? item : {};
    return {
      eyebrow: contentText(ad.eyebrow, "Sponsored"),
      target: contentText(ad.target, "the team"),
      headline: contentText(ad.headline, "Need a better standup order?"),
      body: contentText(ad.body, "The wheel rotates names and keeps the meeting moving."),
      product: contentText(ad.product, "Spinny Wheel"),
      cta: contentText(ad.cta, "Spin again"),
      lore: contentText(ad.lore, "THE WHEEL NEEDS TEAM CONTENT")
    };
  });
  return cleaned.length ? cleaned : fallback.map((ad) => ({ ...ad }));
}

function loadState() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    saved = null;
  }

  if (!saved) {
    peopleInput.value = fallbackPeople.join("\n");
    applyTheme(state.themeIndex);
    return;
  }

  peopleInput.value = typeof saved.peopleText === "string"
    ? saved.peopleText
    : fallbackPeople.join("\n");
  state.picked = Array.isArray(saved.picked) ? saved.picked : [];
  state.history = Array.isArray(saved.history) ? saved.history : [];
  state.soundOn = saved.soundOn !== false;
  state.rotation = Number.isFinite(saved.rotation) ? saved.rotation : 0;
  state.themeIndex = normalizeThemeIndex(Number.isInteger(saved.themeIndex) ? saved.themeIndex : 0);
  state.pointerAngle = Number.isFinite(saved.pointerAngle) ? saved.pointerAngle : POINTER_ANGLE;
  setPointerAngle(state.pointerAngle);
  visualSliceState = deserializeVisualSliceState(saved.visualSliceState);
  applyTheme(state.themeIndex);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      peopleText: peopleInput.value,
      picked: state.picked,
      history: state.history,
      soundOn: state.soundOn,
      rotation: state.rotation,
      themeIndex: state.themeIndex,
      pointerAngle: state.pointerAngle,
      visualSliceState: serializeVisualSliceState()
    }));
  } catch {
    // Storage is optional; the wheel still works for the current session.
  }
}

function normalizeName(name) {
  return name.trim().replace(/\s+/g, " ");
}

function rosterFromInput() {
  const seen = new Set();
  return peopleInput.value
    .split(/\r?\n/)
    .map(normalizeName)
    .filter(Boolean)
    .filter((name) => {
      const key = name.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function getRemaining(roster = rosterFromInput()) {
  const picked = new Set(state.picked);
  return roster.filter((name) => !picked.has(name));
}

function syncPickedToRoster() {
  const roster = new Set(rosterFromInput());
  state.picked = state.picked.filter((name) => roster.has(name));
  state.history = state.history.filter((name) => roster.has(name));
}

function randomUnit() {
  if (globalThis.crypto && globalThis.crypto.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return values[0] / 4294967296;
  }
  return Math.random();
}

function randomBetween(min, max) {
  return min + (max - min) * randomUnit();
}

function randomInt(max) {
  return Math.floor(randomUnit() * max);
}

function normalizeAngle(angle) {
  return ((angle % TAU) + TAU) % TAU;
}

function applyTheme(index) {
  const theme = appThemes[normalizeThemeIndex(index)];
  themeKeys.forEach((key, keyIndex) => {
    document.documentElement.style.setProperty(`--${key}`, theme.vars[keyIndex]);
  });
  activeWheelColors = theme.wheel.slice();
}

function parseColor(value) {
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const expanded = hex.length === 3
      ? hex.split("").map((character) => character + character).join("")
      : hex;
    const number = Number.parseInt(expanded, 16);
    return {
      r: (number >> 16) & 255,
      g: (number >> 8) & 255,
      b: number & 255,
      a: 1
    };
  }

  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (!match) return { r: 0, g: 0, b: 0, a: 1 };

  const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
  return {
    r: parts[0] || 0,
    g: parts[1] || 0,
    b: parts[2] || 0,
    a: Number.isFinite(parts[3]) ? parts[3] : 1
  };
}

function mixColor(from, to, progress) {
  const start = parseColor(from);
  const end = parseColor(to);
  const r = Math.round(start.r + (end.r - start.r) * progress);
  const g = Math.round(start.g + (end.g - start.g) * progress);
  const b = Math.round(start.b + (end.b - start.b) * progress);
  const a = start.a + (end.a - start.a) * progress;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}

function applyBlendedTheme(fromIndex, toIndex, progress) {
  const fromTheme = appThemes[normalizeThemeIndex(fromIndex)];
  const toTheme = appThemes[normalizeThemeIndex(toIndex)];
  themeKeys.forEach((key, keyIndex) => {
    document.documentElement.style.setProperty(
      `--${key}`,
      mixColor(fromTheme.vars[keyIndex], toTheme.vars[keyIndex], progress)
    );
  });

  const maxWheelColors = Math.max(fromTheme.wheel.length, toTheme.wheel.length);
  activeWheelColors = Array.from({ length: maxWheelColors }, (_, index) => {
    return mixColor(
      fromTheme.wheel[index % fromTheme.wheel.length],
      toTheme.wheel[index % toTheme.wheel.length],
      progress
    );
  });
}

function normalizeThemeIndex(index) {
  return ((index % appThemes.length) + appThemes.length) % appThemes.length;
}

function nextThemeIndex(seedName) {
  const nameWeight = Array.from(seedName).reduce((total, character) => {
    return total + character.charCodeAt(0);
  }, 0);
  const jump = 1 + ((nameWeight + randomInt(appThemes.length - 1)) % (appThemes.length - 1));
  return normalizeThemeIndex(state.themeIndex + jump);
}

function advanceTheme(seedName) {
  state.themeIndex = nextThemeIndex(seedName);
  applyTheme(state.themeIndex);
}

function setPointerAngle(angle) {
  pointerAngle = angle;
  state.pointerAngle = angle;
  const cssAngle = (angle - POINTER_ANGLE) * 180 / Math.PI;
  pointer.style.setProperty("--pointer-angle", `${cssAngle}deg`);
}

function setPointerRadius() {
  pointer.style.setProperty("--pointer-radius", `${canvasSize * 0.495}px`);
}

function clearDisplayedWheel(resetPointer = false) {
  displayedWheelNames = null;
  if (resetPointer) setPointerAngle(POINTER_ANGLE);
}

function abortRemovalAnimation() {
  if (!isRemoving) return;
  removalRunId += 1;
  isRemoving = false;
  applyTheme(state.themeIndex);
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeOutQuart(value) {
  return 1 - Math.pow(1 - value, 4);
}

function easeOutBack(value) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
}

function nameHash(name) {
  let hash = 2166136261;
  for (let i = 0; i < name.length; i += 1) {
    hash ^= name.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function defaultWheelWeight(name, index) {
  const hash = nameHash(`${index}:${name.toLocaleLowerCase()}`);
  return 1 + ((hash % 1000) / 999 - 0.5) * 0.12;
}

function hasCompleteVisualSliceState(names) {
  return names.length > 1 && names.every((name) => visualSliceState.has(name));
}

function serializeVisualSliceState() {
  return Array.from(visualSliceState.entries()).map(([name, slice]) => ({
    name,
    weight: slice.weight,
    colorIndex: slice.colorIndex,
    labelIndex: slice.labelIndex
  }));
}

function deserializeVisualSliceState(value) {
  if (!Array.isArray(value)) return new Map();
  const nextState = new Map();
  value.forEach((entry) => {
    if (!entry || typeof entry.name !== "string" || !Number.isFinite(entry.weight)) return;
    nextState.set(entry.name, {
      weight: Math.max(0.0001, entry.weight),
      colorIndex: Number.isInteger(entry.colorIndex) ? entry.colorIndex : 0,
      labelIndex: Number.isInteger(entry.labelIndex) ? entry.labelIndex : 0
    });
  });
  return nextState;
}

function resetVisualSliceState() {
  visualSliceState = new Map();
}

function setVisualSliceStateFromSlices(slices) {
  visualSliceState = new Map();
  slices.forEach((slice, index) => {
    if (slice.width <= 0.0005 || slice.alpha <= 0.01) return;
    visualSliceState.set(slice.name, {
      weight: slice.width,
      colorIndex: slice.colorIndex ?? index,
      labelIndex: slice.labelIndex ?? index
    });
  });
}

function wheelSlices(names) {
  if (!names.length) return [];
  if (names.length === 1) {
    return [{ name: names[0], start: 0, end: TAU, width: TAU }];
  }

  const useVisualState = hasCompleteVisualSliceState(names);
  const rawWeights = names.map((name, index) => {
    return useVisualState
      ? visualSliceState.get(name).weight
      : defaultWheelWeight(name, index);
  });
  const totalWeight = rawWeights.reduce((total, weight) => total + weight, 0);
  let cursor = 0;

  return names.map((name, index) => {
    const visualState = useVisualState ? visualSliceState.get(name) : null;
    const width = index === names.length - 1
      ? TAU - cursor
      : TAU * rawWeights[index] / totalWeight;
    const start = cursor;
    const end = start + width;
    cursor = end;
    return {
      name,
      start,
      end,
      width,
      colorIndex: visualState?.colorIndex ?? index,
      labelIndex: visualState?.labelIndex ?? index
    };
  });
}

function slicesFromWidths(names, widths, templateSlices = []) {
  const totalWidth = widths.reduce((total, width) => total + Math.max(0, width), 0) || 1;
  let cursor = 0;

  return names.map((name, index) => {
    const width = index === names.length - 1
      ? TAU - cursor
      : TAU * Math.max(0, widths[index]) / totalWidth;
    const start = cursor;
    const end = start + width;
    cursor = end;
    return {
      name,
      start,
      end,
      width,
      colorIndex: templateSlices[index]?.colorIndex ?? templateSlices[index]?.labelIndex ?? index,
      labelIndex: templateSlices[index]?.labelIndex ?? index,
      originalColorIndex: templateSlices[index]?.originalColorIndex ?? templateSlices[index]?.colorIndex ?? index,
      finalColorIndex: templateSlices[index]?.finalColorIndex ?? templateSlices[index]?.colorIndex ?? index,
      alpha: templateSlices[index]?.alpha ?? 1
    };
  });
}

function interpolateSlice(fromSlice, toSlice, progress) {
  const start = fromSlice.start + (toSlice.start - fromSlice.start) * progress;
  const end = fromSlice.end + (toSlice.end - fromSlice.end) * progress;
  const targetMetadata = progress >= 0.999;
  return {
    name: fromSlice.name,
    start,
    end,
    width: Math.max(0, end - start),
    colorIndex: targetMetadata
      ? toSlice.colorIndex ?? fromSlice.colorIndex ?? toSlice.labelIndex ?? fromSlice.labelIndex
      : fromSlice.colorIndex ?? toSlice.colorIndex ?? fromSlice.labelIndex ?? toSlice.labelIndex,
    labelIndex: toSlice.labelIndex ?? fromSlice.labelIndex,
    originalColorIndex: fromSlice.originalColorIndex ?? toSlice.originalColorIndex,
    finalColorIndex: toSlice.finalColorIndex ?? fromSlice.finalColorIndex,
    alpha: fromSlice.alpha ?? toSlice.alpha ?? 1
  };
}

function interpolateSlicesByName(fromSlices, toSlices, progress) {
  const fromByName = new Map(fromSlices.map((slice) => [slice.name, slice]));
  return toSlices.map((toSlice, index) => {
    const fromSlice = fromByName.get(toSlice.name) || toSlice;
    return interpolateSlice(
      fromSlice,
      {
        ...toSlice,
        colorIndex: toSlice.colorIndex ?? index,
        labelIndex: toSlice.labelIndex ?? index
      },
      progress
    );
  });
}

function angleInSlice(slices, index, ratio) {
  const slice = slices[index];
  return slice.start + slice.width * ratio;
}

function sampleWeightedSliceLanding(slices) {
  if (!slices.length) return { index: -1, ratio: 0.5 };

  const targetAngle = randomBetween(0, TAU);
  const index = slices.findIndex((slice) => {
    return targetAngle >= slice.start && targetAngle < slice.end;
  });
  const safeIndex = index >= 0 ? index : slices.length - 1;
  const slice = slices[safeIndex];
  const ratio = slice.width > 0
    ? (targetAngle - slice.start) / slice.width
    : 0.5;

  return {
    index: safeIndex,
    ratio: Math.max(0.001, Math.min(0.999, ratio))
  };
}

function fitCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvasSize = Math.max(320, Math.round(rect.width));
  canvas.width = Math.round(canvasSize * dpr);
  canvas.height = Math.round(canvasSize * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  setPointerRadius();
  drawWheel(displayedWheelNames || getRemaining(), state.rotation);
}

function drawWheel(names, rotation, customSlices = null, labelAnimation = null) {
  const size = canvasSize;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.44;
  const hubRadius = Math.max(38, size * 0.082);

  ctx.clearRect(0, 0, size, size);
  drawScribbleBackdrop(size);

  const slices = customSlices || wheelSlices(names);

  if (!slices.length) {
    drawEmptyWheel(cx, cy, radius);
    return;
  }

  const drawScreenLockedLabels = labelProfile.mode === "screenLocked";
  const drawCircularFinalLabel = slices.length === 1 && !labelAnimation;
  const hiddenLabelIndexes = labelAnimation?.hiddenIndexes || null;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  slices.forEach((sliceInfo, index) => {
    const { name, start, end, width } = sliceInfo;
    const colorIndex = sliceInfo.colorIndex ?? index;
    const labelIndex = sliceInfo.labelIndex ?? index;
    const alpha = sliceInfo.alpha ?? 1;

    if (width <= 0.0005 || alpha <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = sliceInfo.fillStyle || activeWheelColors[colorIndex % activeWheelColors.length];
    ctx.fill();
    ctx.lineWidth = Math.max(4, size * 0.009);
    ctx.strokeStyle = "#050505";
    ctx.stroke();

    drawSliceCrud(labelIndex, start, end, radius, size);
    if (!drawCircularFinalLabel && !drawScreenLockedLabels && width > 0.035 && !hiddenLabelIndexes?.has(index)) {
      drawSliceText(
        sliceDisplayLabel(name, slices.length, labelProfile),
        start + width / 2,
        radius,
        width,
        size,
        labelIndex,
        labelProfile,
        slices.length === 1
      );
    }
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, TAU);
  ctx.lineWidth = Math.max(9, size * 0.02);
  ctx.strokeStyle = "#050505";
  ctx.stroke();

  if (drawCircularFinalLabel) {
    drawCircularWheelText(
      sliceDisplayLabel(slices[0].name, slices.length, labelProfile),
      radius,
      size,
      slices[0].labelIndex ?? 0
    );
  }

  ctx.restore();

  if (drawScreenLockedLabels && !drawCircularFinalLabel) {
    drawScreenLockedSliceText(
      slices,
      rotation,
      cx,
      cy,
      radius,
      size,
      labelProfile,
      hiddenLabelIndexes
    );
  }

  if (labelAnimation) {
    drawSwapLabelAnimation(
      labelAnimation,
      rotation,
      cx,
      cy,
      radius,
      size,
      labelProfile,
      drawScreenLockedLabels,
      slices.length
    );
  }

  drawHub(cx, cy, hubRadius, size);
  drawOuterPixels(cx, cy, radius, size);
}

function drawScribbleBackdrop(size) {
  ctx.save();
  ctx.fillStyle = "#d8d486";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 22; i += 1) {
    const x = (i * 181) % size;
    const y = (i * 73) % size;
    const w = size * (0.038 + pseudo(i, 31) * 0.07);
    const h = size * (0.018 + pseudo(i, 32) * 0.05);
    ctx.fillStyle = i % 2 ? "rgba(92, 69, 133, 0.24)" : "rgba(177, 93, 72, 0.22)";
    ctx.fillRect(x, y, w, h);
  }

  for (let i = 0; i < 52; i += 1) {
    ctx.fillStyle = i % 3 === 0 ? "#7fb8b2" : i % 3 === 1 ? "#b86c91" : "#25202a";
    const x = (i * 97) % size;
    const y = (i * 151) % size;
    const block = size * (i % 4 === 0 ? 0.024 : 0.014);
    ctx.fillRect(x, y, block, block);
  }
  ctx.restore();
}

function pseudo(index, salt) {
  const value = Math.sin(index * 999 + salt * 313) * 10000;
  return value - Math.floor(value);
}

function weightedLabelMode() {
  const total = labelModes.reduce((sum, mode) => sum + mode.weight, 0);
  let cursor = randomBetween(0, total);
  for (const mode of labelModes) {
    cursor -= mode.weight;
    if (cursor <= 0) return mode.name;
  }
  return labelModes[0].name;
}

function chooseLabelProfile(stage = null) {
  const openingNormal = Boolean(stage?.openingNormal);
  const intensity = stage?.intensity || 0;
  const mode = openingNormal ? "classic" : weightedLabelMode();
  return {
    mode,
    finalTemplate: finalWheelLabels[randomInt(finalWheelLabels.length)],
    seed: randomInt(1000000),
    globalTilt: openingNormal ? 0 : randomBetween(-0.22 - intensity * 0.12, 0.22 + intensity * 0.12),
    alignedAngle: openingNormal ? 0 : randomBetween(-0.16, 0.16),
    radiusShift: openingNormal ? 0 : randomBetween(-0.035, 0.045),
    wobble: openingNormal ? 0.015 : randomBetween(0.02, 0.13 + intensity * 0.08),
    flipBias: randomUnit() < 0.5 ? 0 : Math.PI
  };
}

function labelPseudo(profile, index, salt) {
  return pseudo(index + profile.seed, salt);
}

function sliceDisplayLabel(name, sliceCount, profile) {
  if (sliceCount === 1) {
    return profile.finalTemplate.replace("{name}", name);
  }
  return name;
}

function circularDistance(a, b, count) {
  const distance = Math.abs(a - b);
  return Math.min(distance, count - distance);
}

function chooseRemovalProfile(names, winnerIndex, intensity = 0) {
  const count = names.length;
  const left = (winnerIndex - 1 + count) % count;
  const right = (winnerIndex + 1) % count;
  const modes = [
    "leftBites",
    "rightBites",
    "neighbourMouth",
    "nonNeighboursSteal",
    "oppositeSide",
    "randomClump",
    "singleThief",
    "richGetRicher",
    "alternatingTax"
  ];
  const mode = modes[randomInt(modes.length)];
  let consumers = [];

  if (mode === "leftBites") {
    consumers = [left];
  } else if (mode === "rightBites") {
    consumers = [right];
  } else if (mode === "neighbourMouth") {
    consumers = left === right ? [left] : [left, right];
  } else if (mode === "singleThief") {
    const possible = names
      .map((_, index) => index)
      .filter((index) => index !== winnerIndex);
    consumers = [possible[randomInt(possible.length)]];
  } else if (mode === "richGetRicher") {
    const widest = names
      .map((_, index) => ({ index, width: index === winnerIndex ? -1 : wheelSlices(names)[index].width }))
      .sort((a, b) => b.width - a.width)[0];
    consumers = [widest.index];
  } else if (mode === "nonNeighboursSteal") {
    consumers = names
      .map((_, index) => index)
      .filter((index) => index !== winnerIndex && circularDistance(index, winnerIndex, count) > 1);
  } else if (mode === "oppositeSide") {
    const maximumDistance = Math.max(...names.map((_, index) => circularDistance(index, winnerIndex, count)));
    consumers = names
      .map((_, index) => index)
      .filter((index) => index !== winnerIndex && circularDistance(index, winnerIndex, count) === maximumDistance);
  } else if (mode === "randomClump") {
    consumers = names
      .map((_, index) => index)
      .filter((index) => index !== winnerIndex && randomUnit() < 0.42);
  } else if (mode === "alternatingTax") {
    consumers = names
      .map((_, index) => index)
      .filter((index) => index !== winnerIndex && index % 2 === winnerIndex % 2);
  } else {
    consumers = names
      .map((_, index) => index)
      .filter((index) => index !== winnerIndex);
  }

  if (!consumers.length) {
    consumers = names
      .map((_, index) => index)
      .filter((index) => index !== winnerIndex);
  }

  return {
    mode,
    consumers,
    duration: randomBetween(940 + intensity * 80, 1180 + intensity * 170),
    split: randomBetween(0.56, 0.75),
    wobble: randomBetween(0.01 + intensity * 0.012, 0.035 + intensity * 0.052),
    collapseSkew: randomBetween(-0.16 - intensity * 0.22, 0.16 + intensity * 0.22),
    biasPower: randomBetween(2.1 + intensity * 0.7, 4.6 + intensity * 1.7),
    jackpotOrder: randomInt(Math.max(1, consumers.length)),
    jackpotBoost: randomBetween(2.4 + intensity, 6.2 + intensity * 2.4),
    seed: randomInt(1000000)
  };
}

function consumeTargetSlices(beforeNames, beforeSlices, winnerIndex, profile) {
  const winnerWidth = beforeSlices[winnerIndex].width;
  const widths = beforeSlices.map((slice) => slice.width);
  const weights = profile.consumers.map((index, order) => {
    const raw = 0.08 + pseudo(profile.seed + index, order + 91) * 0.92;
    const jackpot = order === profile.jackpotOrder ? profile.jackpotBoost : 1;
    return Math.pow(raw, profile.biasPower) * jackpot;
  });
  const totalWeight = weights.reduce((total, weight) => total + weight, 0) || 1;

  widths[winnerIndex] = 0;
  profile.consumers.forEach((index, order) => {
    widths[index] += winnerWidth * weights[order] / totalWeight;
  });

  return slicesFromWidths(beforeNames, widths, beforeSlices);
}

function removalSlicesAt(plan, progress) {
  const eased = progress >= 1
    ? 1
    : Math.max(
      0,
      Math.min(
        1,
        easeInOutCubic(progress)
          + Math.sin(progress * Math.PI * 4.5) * plan.profile.wobble * Math.pow(1 - progress, 1.45)
      )
    );
  const themeProgress = easeInOutCubic(progress);
  const withRemovalColor = (slice) => {
    const fromIndex = slice.originalColorIndex ?? slice.colorIndex ?? slice.labelIndex ?? 0;
    const toIndex = slice.finalColorIndex ?? slice.colorIndex ?? slice.labelIndex ?? 0;
    return {
      ...slice,
      fillStyle: mixColor(
        plan.fromTheme.wheel[fromIndex % plan.fromTheme.wheel.length],
        plan.toTheme.wheel[toIndex % plan.toTheme.wheel.length],
        themeProgress
      )
    };
  };

  return plan.beforeSlices.map((slice, index) => {
    const target = plan.consumeSlices[index];
    const collapseBonus = index === plan.winnerIndex
      ? Math.sin(eased * Math.PI) * plan.profile.collapseSkew * slice.width
      : 0;
    const animated = interpolateSlice(
      slice,
      {
        ...target,
        start: target.start + collapseBonus,
        end: target.end + collapseBonus
      },
      eased
    );
    animated.alpha = index === plan.winnerIndex ? Math.max(0, 1 - eased * 1.25) : 1;
    return withRemovalColor(animated);
  });
}

function startRemovalAnimation(winnerName, themeSeed, intensity = 0) {
  const beforeNames = displayedWheelNames ? displayedWheelNames.slice() : [];
  const winnerIndex = beforeNames.indexOf(winnerName);
  const afterNames = beforeNames.filter((name) => name !== winnerName);

  if (winnerIndex < 0 || beforeNames.length < 2 || !afterNames.length) {
    clearDisplayedWheel();
    return false;
  }

  const fromThemeIndex = state.themeIndex;
  const toThemeIndex = themeSeed ? nextThemeIndex(themeSeed) : fromThemeIndex;
  const fromTheme = appThemes[fromThemeIndex];
  const toTheme = appThemes[toThemeIndex];
  const beforeSlices = wheelSlices(beforeNames).map((slice, index) => ({
    ...slice,
    colorIndex: slice.colorIndex ?? index,
    labelIndex: slice.labelIndex ?? index,
    originalColorIndex: slice.colorIndex ?? index,
    finalColorIndex: Math.max(0, afterNames.indexOf(slice.name))
  }));
  const profile = chooseRemovalProfile(beforeNames, winnerIndex, intensity);
  const consumeSlices = consumeTargetSlices(beforeNames, beforeSlices, winnerIndex, profile);
  consumeSlices.forEach((slice) => {
    const finalIndex = afterNames.indexOf(slice.name);
    if (finalIndex < 0) return;
    slice.colorIndex = finalIndex;
    slice.labelIndex = finalIndex;
    slice.finalColorIndex = finalIndex;
  });
  const consumeSurvivorSlices = consumeSlices.filter((slice) => slice.name !== winnerName);
  const plan = {
    beforeSlices,
    consumeSlices,
    consumeSurvivorSlices,
    fromTheme,
    toTheme,
    profile,
    winnerIndex
  };
  const runId = removalRunId + 1;
  removalRunId = runId;
  isRemoving = true;
  render();

  let startTime = null;
  function frame(timestamp) {
    if (runId !== removalRunId) return;
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(1, elapsed / profile.duration);
    applyBlendedTheme(fromThemeIndex, toThemeIndex, easeInOutCubic(progress));
    const slices = removalSlicesAt(plan, progress);
    drawWheel(beforeNames, state.rotation, slices);

    if (progress < 1) {
      requestAnimationFrame(frame);
      return;
    }

    isRemoving = false;
    setVisualSliceStateFromSlices(consumeSurvivorSlices);
    clearDisplayedWheel();
    state.themeIndex = toThemeIndex;
    applyTheme(state.themeIndex);
    render();
  }

  requestAnimationFrame(frame);
  return true;
}

function drawSliceCrud(index, start, end, radius, size) {
  const slice = end - start;
  ctx.save();

  for (let i = 0; i < 3; i += 1) {
    const angle = start + slice * (0.18 + pseudo(index, i) * 0.64);
    const distance = radius * (0.28 + pseudo(index + i, 4) * 0.54);
    const block = size * (0.018 + pseudo(index, i + 8) * 0.018);
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(distance, 0);
    ctx.rotate(pseudo(index, i + 11) * Math.PI);
    ctx.fillStyle = i % 2 ? "rgba(255, 255, 255, 0.72)" : "rgba(0, 0, 0, 0.82)";
    ctx.fillRect(-block / 2, -block / 2, block * 1.4, block);
    ctx.restore();
  }

  ctx.restore();
}

function drawEmptyWheel(cx, cy, radius) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(state.rotation);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, TAU);
  ctx.fillStyle = "#c6c6c6";
  ctx.fill();
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#050505";
  ctx.stroke();

  for (let i = 0; i < 18; i += 1) {
    ctx.rotate(TAU / 18);
    ctx.fillStyle = i % 2 ? "#b86c91" : "#e2cf66";
    ctx.fillRect(radius * 0.2, -8, radius * 0.68, 16);
  }
  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${Math.max(30, canvasSize * 0.07)}px Arial Black, Impact, sans-serif`;
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#050505";
  ctx.fillStyle = "#b63f31";
  ctx.strokeText("EMPTY", cx, cy);
  ctx.fillText("EMPTY", cx, cy);
  ctx.restore();
}

function shortestAngleDelta(fromAngle, toAngle) {
  const delta = normalizeAngle(toAngle - fromAngle);
  return delta > Math.PI ? delta - TAU : delta;
}

function drawWheelLabel(label, fontSize, maxWidth, size, fillStyle, alpha = 1) {
  ctx.globalAlpha *= alpha;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${fontSize}px Comic Sans MS, Arial Black, Impact, sans-serif`;
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(5, size * 0.008);
  ctx.strokeStyle = "#050505";
  ctx.fillStyle = "#ffffff";
  ctx.strokeText(label, 0, 0, maxWidth);
  ctx.fillStyle = fillStyle;
  ctx.fillText(label, 0, 0, maxWidth);
}

function textWidthForFont(label, fontSize) {
  ctx.save();
  ctx.font = `900 ${fontSize}px Comic Sans MS, Arial Black, Impact, sans-serif`;
  const width = ctx.measureText(label).width;
  ctx.restore();
  return width;
}

function drawCircularWheelText(labelText, radius, size, index) {
  const label = labelText.toUpperCase();
  if (!label) return;

  const ringRadius = radius * 0.68;
  const maxArc = TAU * 0.9;
  const maxFontSize = Math.max(18, Math.min(34, radius * 0.108));
  const minFontSize = Math.max(12, Math.min(17, radius * 0.054));
  const maxTextWidth = ringRadius * maxArc;
  const measuredWidth = textWidthForFont(label, maxFontSize);
  const fontSize = Math.max(
    minFontSize,
    Math.min(maxFontSize, maxFontSize * maxTextWidth / Math.max(1, measuredWidth))
  );
  const letterSpacing = Math.max(2.5, fontSize * 0.12);
  const letters = Array.from(label);
  const advances = letters.map((letter) => textWidthForFont(letter, fontSize) + letterSpacing);
  const totalArc = Math.min(
    maxArc,
    advances.reduce((total, advance) => total + advance, 0) / ringRadius
  );
  let cursor = -Math.PI / 2 - totalArc / 2;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${fontSize}px Comic Sans MS, Arial Black, Impact, sans-serif`;
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(5, size * 0.008);
  ctx.strokeStyle = "#050505";
  ctx.fillStyle = index % 2 ? "#fffef4" : "#eadb67";

  letters.forEach((letter, letterIndex) => {
    const advance = advances[letterIndex] / ringRadius;
    const angle = cursor + advance / 2;
    cursor += advance;
    if (letter === " ") return;

    ctx.save();
    ctx.translate(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius);
    ctx.rotate(angle + Math.PI / 2);
    ctx.strokeText(letter, 0, 0);
    ctx.fillText(letter, 0, 0);
    ctx.restore();
  });

  ctx.restore();
}

function sliceLabelLayout(
  sliceInfo,
  index,
  rotation,
  cx,
  cy,
  radius,
  size,
  profile,
  screenLocked,
  sliceCount,
  nameOverride = null
) {
  const labelIndex = sliceInfo.labelIndex ?? index;
  const isFinalLabel = sliceCount === 1;
  const label = sliceDisplayLabel(nameOverride ?? sliceInfo.name, sliceCount, profile).toUpperCase();
  const fontSize = isFinalLabel
    ? Math.max(15, Math.min(30, radius * 0.095))
    : Math.max(11, Math.min(24, radius * sliceInfo.width * 0.24));
  const maxWidth = isFinalLabel
    ? Math.max(120, radius * 1.26)
    : Math.max(42, radius * (screenLocked ? 0.76 : 0.78));
  const angle = sliceInfo.start + sliceInfo.width / 2;
  const fillStyle = (screenLocked ? index : labelIndex) % 2 ? "#fffef4" : "#eadb67";

  if (screenLocked) {
    const screenAngle = angle + rotation;
    const distance = radius * (0.58 + profile.radiusShift + (labelPseudo(profile, labelIndex, 33) - 0.5) * 0.05);
    const jitter = (labelPseudo(profile, labelIndex, 34) - 0.5) * 0.18;
    const flip = labelPseudo(profile, labelIndex, 35) > 0.82 ? Math.PI : 0;
    return {
      label,
      x: cx + Math.cos(screenAngle) * distance,
      y: cy + Math.sin(screenAngle) * distance,
      rotation: profile.alignedAngle + jitter + flip,
      fontSize,
      maxWidth,
      fillStyle
    };
  }

  const angleWobble = (labelPseudo(profile, labelIndex, 22) - 0.5) * profile.wobble;
  const textRadius = radius * (
    (isFinalLabel ? 0.52 : 0.57)
    + profile.radiusShift
    + (labelPseudo(profile, labelIndex, 23) - 0.5) * 0.06
  );
  const placementAngle = rotation + angle + angleWobble;
  return {
    label,
    x: cx + Math.cos(placementAngle) * textRadius,
    y: cy + Math.sin(placementAngle) * textRadius,
    rotation: placementAngle + labelRotationForSlice(angle, labelIndex, profile),
    fontSize,
    maxWidth,
    fillStyle
  };
}

function drawSwapLabelAnimation(
  animation,
  rotation,
  cx,
  cy,
  radius,
  size,
  profile,
  screenLocked,
  sliceCount
) {
  const progress = Math.max(0, Math.min(1, animation.progress));
  const eased = easeInOutCubic(progress);
  const lift = Math.sin(progress * Math.PI) * size * 0.018;

  animation.items.forEach((item) => {
    const fromLayout = sliceLabelLayout(
      item.fromSlice,
      item.fromIndex,
      rotation,
      cx,
      cy,
      radius,
      size,
      profile,
      screenLocked,
      sliceCount,
      item.name
    );
    const toLayout = sliceLabelLayout(
      item.toSlice,
      item.toIndex,
      rotation,
      cx,
      cy,
      radius,
      size,
      profile,
      screenLocked,
      sliceCount,
      item.name
    );
    const x = fromLayout.x + (toLayout.x - fromLayout.x) * eased;
    const y = fromLayout.y + (toLayout.y - fromLayout.y) * eased - lift;
    const labelRotation = fromLayout.rotation + shortestAngleDelta(fromLayout.rotation, toLayout.rotation) * eased;
    const fontSize = fromLayout.fontSize + (toLayout.fontSize - fromLayout.fontSize) * eased;
    const maxWidth = fromLayout.maxWidth + (toLayout.maxWidth - fromLayout.maxWidth) * eased;
    const fillStyle = eased < 0.5 ? fromLayout.fillStyle : toLayout.fillStyle;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(labelRotation);
    drawWheelLabel(
      fromLayout.label,
      fontSize,
      maxWidth,
      size,
      fillStyle,
      0.86 + Math.sin(progress * Math.PI) * 0.14
    );
    ctx.restore();
  });
}

function drawSliceText(labelText, angle, radius, slice, size, index, profile, isFinalLabel = false) {
  ctx.save();
  const angleWobble = (labelPseudo(profile, index, 22) - 0.5) * profile.wobble;
  const textRadius = radius * (
    (isFinalLabel ? 0.52 : 0.57)
    + profile.radiusShift
    + (labelPseudo(profile, index, 23) - 0.5) * 0.06
  );
  const labelRotation = labelRotationForSlice(angle, index, profile);

  ctx.rotate(angle + angleWobble);
  ctx.translate(textRadius, 0);
  ctx.rotate(labelRotation);

  const fontSize = isFinalLabel
    ? Math.max(15, Math.min(30, radius * 0.095))
    : Math.max(11, Math.min(24, radius * slice * 0.24));
  const label = labelText.toUpperCase();
  const maxWidth = isFinalLabel
    ? Math.max(120, radius * 1.26)
    : Math.max(42, radius * 0.78);

  drawWheelLabel(label, fontSize, maxWidth, size, index % 2 ? "#fffef4" : "#eadb67");
  ctx.restore();
}

function labelRotationForSlice(angle, index, profile) {
  const jitter = (labelPseudo(profile, index, 24) - 0.5) * 0.18;
  if (profile.mode === "upsideDown") return Math.PI * 1.5 + jitter;
  if (profile.mode === "mixedFlips") {
    return Math.PI / 2 + jitter + (labelPseudo(profile, index, 25) > 0.56 ? Math.PI : 0);
  }
  if (profile.mode === "allAligned") return -angle + profile.alignedAngle;
  if (profile.mode === "horizontal") return -angle + profile.flipBias + profile.alignedAngle * 0.5;
  if (profile.mode === "stairStep") {
    const step = TAU / 8;
    return Math.round((angle + profile.globalTilt) / step) * step - angle + jitter * 0.35;
  }
  if (profile.mode === "nearlyRadial") return profile.globalTilt + jitter * 0.45;
  return Math.PI / 2 + profile.globalTilt * 0.3 + jitter;
}

function drawScreenLockedSliceText(
  slices,
  rotation,
  cx,
  cy,
  radius,
  size,
  profile,
  hiddenLabelIndexes = null
) {
  slices.forEach((sliceInfo, index) => {
    const labelIndex = sliceInfo.labelIndex ?? index;
    const alpha = sliceInfo.alpha ?? 1;
    if (sliceInfo.width <= 0.035 || alpha <= 0.01 || hiddenLabelIndexes?.has(index)) return;

    const angle = sliceInfo.start + sliceInfo.width / 2;
    const screenAngle = angle + rotation;
    const distance = radius * (0.58 + profile.radiusShift + (labelPseudo(profile, labelIndex, 33) - 0.5) * 0.05);
    const x = cx + Math.cos(screenAngle) * distance;
    const y = cy + Math.sin(screenAngle) * distance;
    const isFinalLabel = slices.length === 1;
    const label = sliceDisplayLabel(sliceInfo.name, slices.length, profile).toUpperCase();
    const fontSize = isFinalLabel
      ? Math.max(15, Math.min(30, radius * 0.095))
      : Math.max(11, Math.min(24, radius * sliceInfo.width * 0.24));
    const maxWidth = isFinalLabel
      ? Math.max(120, radius * 1.26)
      : Math.max(42, radius * 0.76);
    const jitter = (labelPseudo(profile, labelIndex, 34) - 0.5) * 0.18;
    const flip = labelPseudo(profile, labelIndex, 35) > 0.82 ? Math.PI : 0;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(profile.alignedAngle + jitter + flip);
    drawWheelLabel(label, fontSize, maxWidth, size, index % 2 ? "#fffef4" : "#eadb67");
    ctx.restore();
  });
}

function drawHub(cx, cy, radius, size) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.fillStyle = "#eadb67";
  ctx.fill();
  ctx.lineWidth = Math.max(6, size * 0.012);
  ctx.strokeStyle = "#050505";
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${Math.max(17, size * 0.035)}px Arial Black, Impact, sans-serif`;
  ctx.fillStyle = "#9b4876";
  ctx.strokeStyle = "#050505";
  ctx.lineWidth = Math.max(3, size * 0.005);
  ctx.strokeText("???", cx, cy + 1);
  ctx.fillText("???", cx, cy + 1);
  ctx.restore();
}

function drawOuterPixels(cx, cy, radius, size) {
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 34; i += 1) {
    const angle = i * TAU / 34;
    const markerRadius = radius + size * 0.025 + (i % 3) * 2;
    ctx.save();
    ctx.rotate(angle);
    ctx.fillStyle = i % 2 ? "#050505" : "#fff";
    ctx.fillRect(markerRadius, -size * 0.008, size * 0.026, size * 0.016);
    ctx.restore();
  }
  ctx.restore();
}

function renderTargetedAd() {
  if (targetAdDismissed) return;

  const ad = chooseTargetedAd();
  targetAd.replaceChildren();

  const top = document.createElement("div");
  const label = document.createElement("span");
  const adChoices = document.createElement("span");
  const headline = document.createElement("div");
  const body = document.createElement("p");
  const footer = document.createElement("div");
  const product = document.createElement("span");
  const cta = document.createElement("button");
  const close = document.createElement("button");

  top.className = "target-ad-top";
  label.textContent = `${ad.eyebrow} · for ${ad.target}`;
  adChoices.className = "ad-choices";
  adChoices.textContent = "AdChoices";
  top.append(label, adChoices);

  headline.className = "target-ad-headline";
  headline.textContent = ad.headline;

  body.textContent = ad.body;

  footer.className = "target-ad-footer";
  product.className = "target-ad-product";
  product.textContent = ad.product;
  cta.type = "button";
  cta.className = "target-ad-cta";
  cta.textContent = ad.cta;
  footer.append(product, cta);

  close.type = "button";
  close.className = "target-ad-close";
  close.setAttribute("aria-label", "Dismiss sponsored ad");
  close.textContent = "x";
  close.addEventListener("click", () => {
    targetAdDismissed = true;
    targetAd.hidden = true;
  });

  targetAd.hidden = false;
  targetAd.append(top, headline, body, footer, close);
}

function render() {
  syncPickedToRoster();

  const roster = rosterFromInput();
  const remaining = getRemaining(roster);
  const picked = state.picked;

  remainingCount.textContent = `${remaining.length} LEFT`;
  spinButton.disabled = isSpinning || isRemoving || remaining.length === 0;
  resetButton.disabled = isSpinning || isRemoving || picked.length === 0;
  undoButton.disabled = isSpinning || isRemoving || state.history.length === 0;
  soundButton.textContent = state.soundOn ? "SOUND ON" : "SOUND OFF";
  soundButton.setAttribute("aria-pressed", String(state.soundOn));

  renderTargetedAd();
  drawWheel(displayedWheelNames || remaining, state.rotation);
  saveState();
}

function currentPointerIndexFromSlices(slices, rotation, activePointerAngle = pointerAngle) {
  if (!slices.length) return -1;
  const wheelAngleAtPointer = normalizeAngle(activePointerAngle - rotation);
  const index = slices.findIndex((slice) => {
    return wheelAngleAtPointer >= slice.start && wheelAngleAtPointer < slice.end;
  });
  return index >= 0 ? index : slices.length - 1;
}

function currentPointerIndex(names, rotation, activePointerAngle = pointerAngle) {
  if (!names.length) return -1;
  return currentPointerIndexFromSlices(wheelSlices(names), rotation, activePointerAngle);
}

function slicesWithSlotNames(names, slotSlices) {
  return slotSlices.map((slice, index) => ({
    ...slice,
    name: names[index],
    colorIndex: slice.colorIndex ?? index,
    labelIndex: slice.labelIndex ?? index,
    originalColorIndex: slice.originalColorIndex ?? slice.colorIndex ?? index,
    finalColorIndex: slice.finalColorIndex ?? slice.colorIndex ?? index,
    alpha: slice.alpha ?? 1
  }));
}

function elasticBoundarySlices(slices, selectedIndex, progress, direction = 1) {
  if (slices.length < 2 || selectedIndex < 0) return slices;

  const result = slices.map((slice) => ({ ...slice }));
  const pulse = Math.sin(Math.max(0, Math.min(1, progress)) * Math.PI);
  if (pulse <= 0.0001) return result;

  const selected = result[selectedIndex];
  const boundaryAfterSelected = selectedIndex < result.length - 1;
  const neighbourIndex = boundaryAfterSelected
    ? selectedIndex + 1
    : selectedIndex - 1;
  const neighbour = result[neighbourIndex];
  const maximumShift = Math.min(selected.width, neighbour.width) * 0.18;
  const shift = maximumShift * pulse * direction;

  if (boundaryAfterSelected) {
    selected.end += shift;
    selected.width += shift;
    neighbour.start += shift;
    neighbour.width -= shift;
  } else {
    neighbour.end += shift;
    neighbour.width += shift;
    selected.start += shift;
    selected.width -= shift;
  }

  result.forEach((slice) => {
    slice.width = Math.max(0.001, slice.width);
  });
  return result;
}

function ensureAudio() {
  if (!state.soundOn) return null;
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function makeNoiseBuffer(audio, seconds) {
  const bufferSize = Math.floor(audio.sampleRate * seconds);
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    channel[i] = randomUnit() * 2 - 1;
  }
  return buffer;
}

function startSpinSound(profile) {
  const audio = ensureAudio();
  if (!audio || spinSound) return;

  spinSound = {
    kind: "clicks",
    gain: null,
    nodes: [],
    nextPulseAt: audio.currentTime,
    polarity: randomUnit() < 0.5 ? -1 : 1,
    accentEvery: 3 + randomInt(5),
    pulseCount: 0
  };
}

function playSpinBlip(kind, speed, progress) {
  const audio = ensureAudio();
  if (!audio) return;

  const now = audio.currentTime;
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();
  const volume = kind === "rattle" || kind === "printer" ? 0.055 : 0.04;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

  if (kind === "rattle" || kind === "coin") {
    const noise = audio.createBufferSource();
    noise.buffer = makeNoiseBuffer(audio, 0.04);
    filter.type = kind === "coin" ? "highpass" : "bandpass";
    filter.frequency.setValueAtTime(kind === "coin" ? 1800 : 650 + speed * 5, now);
    filter.Q.setValueAtTime(kind === "coin" ? 9 : 2.4, now);
    noise.connect(filter).connect(gain).connect(audio.destination);
    noise.start(now);
    noise.stop(now + 0.052);
    return;
  }

  const osc = audio.createOscillator();
  const accent = spinSound && spinSound.pulseCount % spinSound.accentEvery === 0;
  const pitchBase = kind === "beeps" ? 260 : kind === "printer" ? 120 : 190;
  const pitch = pitchBase + Math.min(900, speed * (kind === "beeps" ? 8 : 3))
    + (accent ? 170 : 0)
    + Math.sin(progress * 31) * 28;

  osc.type = kind === "printer" ? "square" : "triangle";
  osc.frequency.setValueAtTime(Math.max(60, pitch), now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(45, pitch * 0.62), now + 0.038);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.052);
}

function pulseSpacing(kind, speed, progress) {
  const speedFactor = Math.max(0, Math.min(1, speed / 38));
  const slowDown = progress * 0.08;
  if (kind === "quiet") return 0.22 + slowDown;
  if (kind === "softClicks") return 0.095 - speedFactor * 0.045 + slowDown;
  if (kind === "beeps") return 0.13 - speedFactor * 0.065 + slowDown;
  if (kind === "printer") return 0.07 - speedFactor * 0.035 + slowDown * 0.4;
  if (kind === "coin") return 0.16 - speedFactor * 0.06 + slowDown;
  return 0.09 - speedFactor * 0.04 + slowDown * 0.6;
}

function updateSpinSound(speed, progress) {
  if (!spinSound || !audioContext) return;
}

function stopSpinSound() {
  if (!spinSound || !audioContext) return;

  const sound = spinSound;
  const now = audioContext.currentTime;
  if (sound.gain) {
    sound.gain.gain.cancelScheduledValues(now);
    sound.gain.gain.setValueAtTime(Math.max(sound.gain.gain.value, 0.0001), now);
    sound.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  }
  sound.nodes.forEach((node) => {
    try {
      node.stop(now + 0.14);
    } catch {
      // The node may already have been stopped by a short one-shot profile.
    }
  });
  spinSound = null;
}

function playTick(speed) {
  const audio = ensureAudio();
  if (!audio) return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  const pitch = 170 + Math.min(950, speed * 19);
  osc.type = "square";
  osc.frequency.setValueAtTime(pitch, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(80, pitch * 0.58), now + 0.035);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(pitch * 1.4, now);
  filter.Q.setValueAtTime(8, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

  osc.connect(filter).connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.052);
}

function playClack() {
  const audio = ensureAudio();
  if (!audio) return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(92, now);
  osc.frequency.exponentialRampToValueAtTime(42, now + 0.12);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.095, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

function slowdownTimeScale(slowdown = 1) {
  return Math.min(3.4, Math.max(1, slowdown));
}

function slowdownPitchScale(slowdown = 1) {
  return 1 / Math.sqrt(slowdownTimeScale(slowdown));
}

function playArcadeSlide(intensity = 0.5, slowdown = 1) {
  const audio = ensureAudio();
  if (!audio) return;

  const now = audio.currentTime;
  const pitchScale = slowdownPitchScale(slowdown);
  const timeScale = Math.min(2.2, slowdownTimeScale(slowdown));
  const steps = [220, 277, 330, 415, 554];
  steps.forEach((frequency, index) => {
    const start = now + index * 0.045 * timeScale;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(frequency * (1 + intensity * 0.18) * pitchScale, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.045 + intensity * 0.03, start + 0.008 * timeScale);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.055 * timeScale);
    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + 0.07 * timeScale);
  });
}

function playDoorCreak(intensity = 0.5, slowdown = 1) {
  const audio = ensureAudio();
  if (!audio) return;

  const now = audio.currentTime;
  const pitchScale = slowdownPitchScale(slowdown);
  const timeScale = Math.min(2.8, slowdownTimeScale(slowdown));
  const noise = audio.createBufferSource();
  const filter = audio.createBiquadFilter();
  const gain = audio.createGain();
  const osc = audio.createOscillator();
  const oscGain = audio.createGain();

  noise.buffer = makeNoiseBuffer(audio, 0.42 * timeScale);
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(720 * pitchScale, now);
  filter.frequency.exponentialRampToValueAtTime((130 + intensity * 80) * pitchScale, now + 0.36 * timeScale);
  filter.Q.setValueAtTime(14, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.04 + intensity * 0.03, now + 0.04 * timeScale);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42 * timeScale);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime((87 + intensity * 24) * pitchScale, now);
  osc.frequency.exponentialRampToValueAtTime(51 * pitchScale, now + 0.34 * timeScale);
  oscGain.gain.setValueAtTime(0.0001, now);
  oscGain.gain.exponentialRampToValueAtTime(0.025 + intensity * 0.02, now + 0.06 * timeScale);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38 * timeScale);

  noise.connect(filter).connect(gain).connect(audio.destination);
  osc.connect(oscGain).connect(audio.destination);
  noise.start(now);
  noise.stop(now + 0.45 * timeScale);
  osc.start(now);
  osc.stop(now + 0.42 * timeScale);
}

function playBoing(intensity = 0.5, slowdown = 1) {
  const audio = ensureAudio();
  if (!audio) return;

  const now = audio.currentTime;
  const pitchScale = slowdownPitchScale(slowdown);
  const timeScale = Math.min(2.6, slowdownTimeScale(slowdown));
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime((120 + intensity * 80) * pitchScale, now);
  osc.frequency.exponentialRampToValueAtTime((720 + intensity * 260) * pitchScale, now + 0.08 * timeScale);
  osc.frequency.exponentialRampToValueAtTime(180 * pitchScale, now + 0.24 * timeScale);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08 + intensity * 0.04, now + 0.012 * timeScale);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.27 * timeScale);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.3 * timeScale);
}

function playGlitchPop(intensity = 0.5, slowdown = 1) {
  const audio = ensureAudio();
  if (!audio) return;

  const now = audio.currentTime;
  const pitchScale = slowdownPitchScale(slowdown);
  const timeScale = Math.min(2.1, slowdownTimeScale(slowdown));
  for (let i = 0; i < 4; i += 1) {
    const start = now + i * 0.026 * timeScale;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = i % 2 ? "triangle" : "square";
    osc.frequency.setValueAtTime((180 + randomInt(720) + intensity * 220) * pitchScale, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.04 + intensity * 0.025, start + 0.004 * timeScale);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.035 * timeScale);
    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + 0.04 * timeScale);
  }
}

function playFakeoutCue(profile, cue = "start", kind = "nudge", slowdown = 1) {
  if (profile.openingNormal) return;
  const intensity = profile.intensity || 0;
  if (cue === "hold") {
    if (randomUnit() < 0.22) playGlitchPop(intensity * 0.45, slowdown);
    return;
  }

  if (kind === "pointer") {
    (randomUnit() < 0.62 ? playDoorCreak : playArcadeSlide)(intensity, slowdown);
  } else if (kind === "bounce") {
    playBoing(intensity, slowdown);
  } else if (kind === "swap") {
    playGlitchPop(intensity + 0.2, slowdown);
  } else if (kind === "droop") {
    playDoorCreak(intensity + 0.12, slowdown);
  } else if (kind === "elastic") {
    playBoing(intensity + 0.18, slowdown);
  } else {
    (randomUnit() < 0.68 ? playArcadeSlide : playGlitchPop)(intensity, slowdown);
  }
}

function playTinyCheer() {
  const audio = ensureAudio();
  if (!audio) return;

  const now = audio.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((frequency, index) => {
    const start = now + index * 0.055;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = index % 2 ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(frequency, start);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.18, start + 0.12);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.045, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + 0.2);
  });

  const bufferSize = Math.floor(audio.sampleRate * 0.34);
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    channel[i] = (randomUnit() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = audio.createBufferSource();
  const filter = audio.createBiquadFilter();
  const gain = audio.createGain();
  noise.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.setValueAtTime(900, now);
  gain.gain.setValueAtTime(0.0001, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.04, now + 0.07);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  noise.connect(filter).connect(gain).connect(audio.destination);
  noise.start(now + 0.02);
  noise.stop(now + 0.38);
}

function openingNormalSpinCount(rosterSize) {
  if (rosterSize <= 2) return 0;
  if (rosterSize <= 4) return 1;
  if (rosterSize <= 7) return 2;
  return 3;
}

function lateSpinWindow(rosterSize) {
  return Math.min(4, Math.max(2, Math.ceil(rosterSize * 0.34)));
}

function chooseRoundStage(rosterSize, pickedBefore, remainingBefore) {
  const openingCount = openingNormalSpinCount(rosterSize);
  const spinNumber = pickedBefore + 1;
  const openingNormal = spinNumber === 1;
  const lateWindow = lateSpinWindow(rosterSize);
  const lateProgress = remainingBefore <= lateWindow
    ? (lateWindow - remainingBefore + 1) / lateWindow
    : 0;
  const postOpeningSpins = Math.max(1, rosterSize - openingCount);
  const postOpeningProgress = Math.max(0, spinNumber - openingCount) / postOpeningSpins;
  const intensity = openingNormal
    ? 0
    : Math.max(lateProgress, postOpeningProgress);

  return {
    openingNormal,
    openingCount,
    spinNumber,
    intensity: Math.max(0, Math.min(1, intensity))
  };
}

function weightedEffectChoice(candidates) {
  const totalWeight = candidates.reduce((sum, candidate) => sum + candidate.weight, 0);
  let cursor = randomBetween(0, totalWeight);
  for (const candidate of candidates) {
    cursor -= candidate.weight;
    if (cursor <= 0) return candidate.kind;
  }
  return candidates[0].kind;
}

function chooseFakeoutKind(count, existingEffects = []) {
  const existingKinds = new Set(existingEffects.map((effect) => effect.kind));
  const previousKind = existingEffects[existingEffects.length - 1]?.kind;
  const canMovePointer = count > 1
    && !existingKinds.has("pointer")
    && !existingKinds.has("swap")
    && !existingKinds.has("droop");
  const canSwapNames = count > 1 && !existingKinds.has("swap") && !existingKinds.has("pointer");
  const canDroop = !existingKinds.has("droop") && !existingKinds.has("pointer");
  let candidates = [
    { kind: "nudge", weight: 23 },
    { kind: "bounce", weight: 20 }
  ];

  if (canMovePointer) candidates.push({ kind: "pointer", weight: 22 });
  if (canSwapNames) candidates.push({ kind: "swap", weight: 26 });
  if (canDroop) candidates.push({ kind: "droop", weight: 19 });
  if (count > 2 && !existingKinds.has("elastic")) candidates.push({ kind: "elastic", weight: 18 });
  if (previousKind && candidates.length > 1) {
    candidates = candidates.filter((candidate) => candidate.kind !== previousKind);
  }

  return weightedEffectChoice(candidates);
}

function chooseExtraActionSlowdown(effectIndex) {
  const lateEffectBonus = Math.min(0.08, effectIndex * 0.025);
  if (randomUnit() < 0.12 + lateEffectBonus) {
    return randomBetween(2.05, 3.15);
  }
  if (randomUnit() < 0.025) {
    return randomBetween(3.15, 3.8);
  }
  return randomBetween(1.12, 1.34);
}

function sampleFakeoutEffects(spinNumber, count) {
  if (spinNumber <= 1 || count <= 1) return [];

  const effects = [];
  let probability = Math.min(0.96, ((spinNumber - 1) / spinNumber) + 0.22);
  const maxEffects = 7;

  while (effects.length < maxEffects && randomUnit() < probability) {
    let kind = chooseFakeoutKind(count, effects);
    const slowdown = chooseExtraActionSlowdown(effects.length);
    const holdSlowdown = 1 + (slowdown - 1) * 0.55;
    const baseHoldMs = randomBetween(
      effects.length === 0 ? 300 : 140,
      effects.length === 0 ? 560 : 310
    );
    const baseMoveMs = randomBetween(520, 880);
    effects.push({
      kind,
      slowdown,
      holdMs: baseHoldMs * Math.min(2.1, holdSlowdown),
      moveMs: baseMoveMs * slowdown
    });
    probability *= 0.58;
  }

  return effects;
}

function chooseSpinProfile(count, stage = { openingNormal: false, intensity: 0 }) {
  if (stage.openingNormal) {
    const mainDuration = randomBetween(4300, 5900);
    return {
      normal: true,
      fakeout: false,
      effects: [],
      lateWobble: false,
      pointerTrick: false,
      swapTrick: false,
      droopTrick: false,
      elasticTrick: false,
      duration: mainDuration,
      mainDuration,
      extraSpins: 4 + randomInt(3),
      pointerStart: 0.84,
      intensity: 0,
      effectScale: 0,
      openingNormal: true
    };
  }

  const intensity = stage.intensity;
  const effects = sampleFakeoutEffects(stage.spinNumber, count);
  const fakeout = effects.length > 0;
  const normal = !fakeout;
  const effectScale = normal ? 0.22 + intensity * 0.25 : 0.74 + intensity * 0.86;
  const extraSpinRange = normal ? 3 : 4 + Math.floor(intensity * 5);
  const pointerTrick = effects.some((effect) => effect.kind === "pointer");
  const swapTrick = effects.some((effect) => effect.kind === "swap");
  const droopTrick = effects.some((effect) => effect.kind === "droop");
  const elasticTrick = effects.some((effect) => effect.kind === "elastic");
  const mainDuration = normal
    ? randomBetween(4600, 6400)
    : randomBetween(4700 + intensity * 350, 6500 + intensity * 800);
  const effectDuration = effects.reduce((total, effect) => total + effect.holdMs + effect.moveMs, 0);

  return {
    normal,
    fakeout,
    effects,
    lateWobble: effects.some((effect) => effect.kind === "bounce"),
    pointerTrick,
    swapTrick,
    droopTrick,
    elasticTrick,
    duration: mainDuration + effectDuration,
    mainDuration,
    extraSpins: (normal ? 5 : 7) + randomInt(extraSpinRange),
    pointerStart: randomBetween(0.74 - intensity * 0.08, 0.89),
    intensity,
    effectScale,
    openingNormal: false
  };
}

function chooseApparentIndex(winnerIndex, count) {
  if (count < 2) return winnerIndex;
  const minimumOffset = Math.max(1, Math.floor(count / 3));
  const offset = minimumOffset + randomInt(Math.max(1, count - minimumOffset));
  return (winnerIndex + offset) % count;
}

function winnerPhrase(name) {
  const template = winnerPhrases[randomInt(winnerPhrases.length)];
  return template.replace("{name}", name);
}

function randomSendoffMessage() {
  return sendoffMessages[randomInt(sendoffMessages.length)];
}

function personKey(value) {
  return normalizeName(value).toLocaleLowerCase();
}

function isAdForName(ad, name) {
  const target = personKey(ad.target);
  const person = personKey(name);
  return person === target || person.startsWith(`${target} `);
}

function adForName(name) {
  const matches = targetedAds.filter((ad) => isAdForName(ad, name));
  return matches.length ? matches[randomInt(matches.length)] : null;
}

function loreForName(name) {
  return adForName(name)?.lore || squadLore[randomInt(squadLore.length)];
}

function chooseTargetedAd() {
  const roster = rosterFromInput();
  const rosterAds = targetedAds.filter((ad) => roster.some((name) => isAdForName(ad, name)));
  const choices = rosterAds.length ? rosterAds : targetedAds;
  return choices[randomInt(choices.length)];
}

function showResultOverlay(name) {
  const variant = randomInt(5);
  const card = document.createElement("div");
  const kicker = document.createElement("div");
  const nameText = document.createElement("div");
  const subtitle = document.createElement("div");
  const lore = document.createElement("div");

  card.className = `overlay-card variant-${variant}`;
  card.style.setProperty("--overlay-tilt", `${randomBetween(-9, 9).toFixed(2)}deg`);
  card.style.setProperty("--overlay-skew", `${randomBetween(-7, 7).toFixed(2)}deg`);

  kicker.className = "overlay-kicker";
  kicker.textContent = winnerBadges[randomInt(winnerBadges.length)];

  nameText.className = "overlay-name";
  nameText.textContent = name;
  nameText.style.setProperty("--name-tilt", `${randomBetween(-7, 7).toFixed(2)}deg`);

  subtitle.className = "overlay-subtitle";
  subtitle.textContent = winnerPhrase(name);

  lore.className = "overlay-lore";
  lore.textContent = loreForName(name);

  card.append(kicker, nameText, subtitle, lore);

  const junkCount = 8 + randomInt(7);
  for (let i = 0; i < junkCount; i += 1) {
    const junk = document.createElement("span");
    junk.className = "overlay-junk";
    junk.style.setProperty("--junk-left", `${randomBetween(-3, 94).toFixed(1)}%`);
    junk.style.setProperty("--junk-top", `${randomBetween(-6, 91).toFixed(1)}%`);
    junk.style.setProperty("--junk-size", `${randomBetween(18, 68).toFixed(0)}px`);
    junk.style.setProperty("--junk-rot", `${randomBetween(-38, 38).toFixed(1)}deg`);
    junk.style.setProperty("--junk-color", [
      "var(--overlay-accent)",
      "var(--overlay-second)",
      "var(--overlay-third)",
      "var(--lore-a)",
      "var(--lore-b)",
      "var(--lore-c)"
    ][randomInt(6)]);
    card.append(junk);
  }

  resultOverlay.replaceChildren(card);
  resultOverlay.hidden = false;
  resultOverlay.classList.remove("show");
  resultOverlay.offsetWidth;
  resultOverlay.classList.add("show");
  overlayKind = "winner";
}

function showSendoffOverlay(themeSeed) {
  const variant = randomInt(5);
  const card = document.createElement("div");
  const kicker = document.createElement("div");
  const message = document.createElement("div");
  const subtitle = document.createElement("div");
  const lore = document.createElement("div");

  card.className = `overlay-card sendoff-card variant-${variant}`;
  card.style.setProperty("--overlay-tilt", `${randomBetween(-7, 7).toFixed(2)}deg`);
  card.style.setProperty("--overlay-skew", `${randomBetween(-5, 5).toFixed(2)}deg`);

  kicker.className = "overlay-kicker sendoff-kicker";
  kicker.textContent = sendoffStamps[randomInt(sendoffStamps.length)];

  message.className = "overlay-name sendoff-message";
  message.textContent = randomSendoffMessage();
  message.style.setProperty("--name-tilt", `${randomBetween(-5, 5).toFixed(2)}deg`);

  subtitle.className = "overlay-subtitle sendoff-subtitle";
  subtitle.textContent = sendoffSubtitles[randomInt(sendoffSubtitles.length)];

  lore.className = "overlay-lore sendoff-lore";
  lore.textContent = squadLore[randomInt(squadLore.length)];

  card.append(kicker, message, subtitle, lore);

  const junkCount = 16 + randomInt(14);
  for (let i = 0; i < junkCount; i += 1) {
    const junk = document.createElement("span");
    junk.className = "overlay-junk sendoff-junk";
    junk.style.setProperty("--junk-left", `${randomBetween(-7, 98).toFixed(1)}%`);
    junk.style.setProperty("--junk-top", `${randomBetween(-8, 96).toFixed(1)}%`);
    junk.style.setProperty("--junk-size", `${randomBetween(14, 86).toFixed(0)}px`);
    junk.style.setProperty("--junk-rot", `${randomBetween(-56, 56).toFixed(1)}deg`);
    junk.style.setProperty("--junk-color", [
      "var(--overlay-accent)",
      "var(--overlay-second)",
      "var(--overlay-third)",
      "var(--lore-a)",
      "var(--lore-b)",
      "var(--lore-c)",
      "var(--spin-b)"
    ][randomInt(7)]);
    card.append(junk);
  }

  pendingSendoffThemeSeed = themeSeed;
  resultOverlay.replaceChildren(card);
  resultOverlay.hidden = false;
  resultOverlay.classList.remove("show");
  resultOverlay.offsetWidth;
  resultOverlay.classList.add("show");
  overlayKind = "sendoff";
  setTimeout(playTinyCheer, 40);
}

function clearFakeCrash() {
  if (crashOverlay) {
    crashOverlay.remove();
    crashOverlay = null;
  }
  document.body.classList.remove("app-crashed");
}

function fakeCrash() {
  clearFakeCrash();
  document.body.classList.add("app-crashed");

  const crash = document.createElement("div");
  const windowBox = document.createElement("div");
  const title = document.createElement("div");
  const message = document.createElement("pre");
  const reboot = document.createElement("button");

  crash.className = "fake-crash";
  windowBox.className = "fake-crash-window";
  title.className = "fake-crash-title";
  title.textContent = "WHEEL.EXE HAS STOPPED BEING A WEBSITE";
  message.className = "fake-crash-message";
  message.textContent = crashMessages.join("\n");
  reboot.type = "button";
  reboot.className = "fake-crash-reboot";
  reboot.textContent = "REBOOT WHEEL.EXE";
  reboot.addEventListener("click", () => {
    clearFakeCrash();
    resetRound();
  });

  windowBox.append(title, message, reboot);
  crash.append(windowBox);
  document.body.append(crash);
  crashOverlay = crash;
  playGlitchPop(1);
  setTimeout(() => playDoorCreak(0.9), 120);
}

function hideResultOverlay() {
  if (resultOverlay.hidden) return;
  const closingKind = overlayKind;
  resultOverlay.hidden = true;
  resultOverlay.classList.remove("show");
  resultOverlay.replaceChildren();
  overlayKind = "none";

  if (closingKind === "sendoff") {
    if (pendingSendoffThemeSeed) {
      const themeSeed = pendingSendoffThemeSeed;
      pendingSendoffThemeSeed = null;
      advanceTheme(themeSeed);
      render();
    }
    fakeCrash();
    return;
  }

  if (pendingThemeSeed) {
    const themeSeed = pendingThemeSeed;
    pendingThemeSeed = null;
    if (pendingSendoff) {
      pendingSendoff = false;
      showSendoffOverlay(themeSeed);
      return;
    }
    if (pendingRemovalEffects && startRemovalAnimation(themeSeed, themeSeed, pendingRemovalIntensity)) {
      pendingRemovalEffects = false;
      pendingRemovalIntensity = 0;
      return;
    }
    pendingRemovalEffects = false;
    pendingRemovalIntensity = 0;
    clearDisplayedWheel();
    advanceTheme(themeSeed);
    render();
  }
}

function spin() {
  if (isSpinning || isRemoving) return;

  syncPickedToRoster();
  const roster = rosterFromInput();
  const remaining = getRemaining(roster);
  if (!remaining.length) {
    render();
    return;
  }

  hideResultOverlay();
  if (isRemoving) return;
  clearDisplayedWheel(true);
  const stage = chooseRoundStage(roster.length, state.picked.length, remaining.length);
  labelProfile = chooseLabelProfile(stage);
  ensureAudio();
  const basePointerAngle = pointerAngle;

  const profile = chooseSpinProfile(remaining.length, stage);
  startSpinSound(profile);
  const slices = wheelSlices(remaining);
  const sampledLanding = sampleWeightedSliceLanding(slices);
  const winnerIndex = sampledLanding.index;
  const winner = remaining[winnerIndex];
  const slotBaseSlices = slicesWithSlotNames(remaining, slices);
  let currentWheelNames = remaining.slice();
  let namesSwapped = false;
  let finalWinner = winner;
  const currentSlotSlices = () => slicesWithSlotNames(currentWheelNames, slotBaseSlices);
  const pointerIndexForCurrentWheel = (rotation, activePointerAngle = pointerAngle, customSlices = null) => {
    const slicesForPointer = customSlices || (namesSwapped ? currentSlotSlices() : wheelSlices(currentWheelNames));
    return currentPointerIndexFromSlices(slicesForPointer, rotation, activePointerAngle);
  };
  const slicesForCurrentWheel = () => namesSwapped ? currentSlotSlices() : wheelSlices(currentWheelNames);
  const selectedNameAtPointer = (rotation, activePointerAngle = pointerAngle, customSlices = null) => {
    const index = pointerIndexForCurrentWheel(rotation, activePointerAngle, customSlices);
    return currentWheelNames[index] || currentWheelNames[0] || finalWinner;
  };
  const swapLabelAnimationForEffect = (effect, progress) => {
    if (!effect.swapAnimation) return null;
    return {
      ...effect.swapAnimation,
      progress
    };
  };
  const applyNameSwap = (effect, rotation, activePointerAngle = pointerAngle) => {
    if (effect.swapApplied || currentWheelNames.length < 2) return;
    const slotSlices = currentSlotSlices();
    const selectedIndex = currentPointerIndexFromSlices(slotSlices, rotation, activePointerAngle);
    if (selectedIndex < 0) return;
    const swapCandidates = currentWheelNames
      .map((_, index) => index)
      .filter((index) => index !== selectedIndex);
    if (!swapCandidates.length) return;
    const swapIndex = swapCandidates[randomInt(swapCandidates.length)];
    const selectedName = currentWheelNames[selectedIndex];
    const swapName = currentWheelNames[swapIndex];
    effect.swapAnimation = {
      hiddenIndexes: new Set([selectedIndex, swapIndex]),
      items: [
        {
          name: selectedName,
          fromIndex: selectedIndex,
          toIndex: swapIndex,
          fromSlice: slotBaseSlices[selectedIndex],
          toSlice: slotBaseSlices[swapIndex]
        },
        {
          name: swapName,
          fromIndex: swapIndex,
          toIndex: selectedIndex,
          fromSlice: slotBaseSlices[swapIndex],
          toSlice: slotBaseSlices[selectedIndex]
        }
      ]
    };
    currentWheelNames[selectedIndex] = swapName;
    currentWheelNames[swapIndex] = selectedName;
    finalWinner = currentWheelNames[selectedIndex];
    namesSwapped = true;
    effect.swapApplied = true;
    effect.swapSelectedIndex = selectedIndex;
    effect.swapOtherIndex = swapIndex;
  };
  const prepareDroopEffect = (effect, rotation, activePointerAngle) => {
    if (effect.droopPrepared) return;
    const pointerSlices = slicesForCurrentWheel();
    const selectedIndex = currentPointerIndexFromSlices(pointerSlices, rotation, activePointerAngle);
    const selectedSlice = pointerSlices[selectedIndex];
    const angleAtPointer = normalizeAngle(activePointerAngle - rotation);
    const direction = randomUnit() < 0.5 ? -1 : 1;
    const neighbourIndex = direction > 0
      ? (selectedIndex + 1) % pointerSlices.length
      : (selectedIndex - 1 + pointerSlices.length) % pointerSlices.length;
    const neighbour = pointerSlices[neighbourIndex] || selectedSlice;
    const distanceToBoundary = direction > 0
      ? selectedSlice.end - angleAtPointer
      : angleAtPointer - selectedSlice.start;
    const overshoot = Math.min(
      neighbour.width * randomBetween(0.22, 0.48 + profile.intensity * 0.16),
      0.16 + profile.intensity * 0.28
    );
    effect.droopMagnitude = direction * (Math.max(0.012, distanceToBoundary) + overshoot);
    effect.droopPrepared = true;
  };
  const winnerSlice = slices[winnerIndex];
  const winnerLandingRatio = sampledLanding.ratio;
  const apparentIndex = profile.pointerTrick
    ? chooseApparentIndex(winnerIndex, remaining.length)
    : winnerIndex;
  const wheelLandingRatio = profile.pointerTrick
    ? randomBetween(0.42, 0.58)
    : winnerLandingRatio;
  const targetAngle = angleInSlice(slices, apparentIndex, wheelLandingRatio);
  const winnerTargetAngle = angleInSlice(slices, winnerIndex, winnerLandingRatio);
  const equivalentTarget = normalizeAngle(basePointerAngle - targetAngle);
  const normalizedStart = normalizeAngle(state.rotation);
  const forwardToTarget = normalizeAngle(equivalentTarget - normalizedStart);
  const startRotation = state.rotation;
  const endRotation = startRotation + forwardToTarget + profile.extraSpins * TAU;
  const totalDelta = endRotation - startRotation;
  const duration = profile.duration;
  let pointerDelta = 0;

  if (profile.pointerTrick) {
    pointerDelta = normalizeAngle(endRotation + winnerTargetAngle - basePointerAngle);
    if (pointerDelta > Math.PI) pointerDelta -= TAU;
    if (Math.abs(pointerDelta) < 0.55) {
      pointerDelta += pointerDelta >= 0 ? TAU : -TAU;
    }
  }

  let effectCursor = profile.mainDuration || duration;
  const effectPlans = (profile.effects || []).map((effect, index) => {
    const isWheelEffect = effect.kind === "nudge" || effect.kind === "bounce" || effect.kind === "elastic";
    const direction = randomUnit() < 0.5 ? -1 : 1;
    const neighbourIndex = direction > 0
      ? (winnerIndex + 1) % slices.length
      : (winnerIndex - 1 + slices.length) % slices.length;
    const neighbourSlice = slices[neighbourIndex] || winnerSlice;
    const distanceToBoundary = direction > 0
      ? winnerSlice.end - winnerTargetAngle
      : winnerTargetAngle - winnerSlice.start;
    const boundaryOvershoot = Math.min(
      neighbourSlice.width * randomBetween(0.2 + profile.intensity * 0.08, 0.46 + profile.intensity * 0.18),
      0.14 + profile.intensity * 0.34
    );
    const delta = isWheelEffect
      ? direction * (Math.max(0.012, distanceToBoundary) + boundaryOvershoot)
      : 0;
    const wobble = effect.kind === "bounce"
      ? Math.min(
        winnerSlice.width * randomBetween(0.12, 0.3 + profile.intensity * 0.18) * profile.effectScale,
        0.2 + profile.intensity * 0.24
      )
      : 0;
    const startHold = effectCursor;
    const startMove = startHold + effect.holdMs;
    const endMove = startMove + effect.moveMs;
    effectCursor = endMove;
    return {
      ...effect,
      index,
      delta,
      wobble,
      droopMagnitude: 0,
      droopPrepared: false,
      elasticDirection: randomUnit() < 0.5 ? -1 : 1,
      elasticIndex: null,
      phase: randomBetween(-0.8, 0.8),
      startHold,
      startMove,
      endMove,
      holdCuePlayed: false,
      moveCuePlayed: false,
      pointerCuePlayed: false
    };
  });
  const stagedRotation = endRotation - effectPlans.reduce((total, effect) => total + effect.delta, 0);

  isSpinning = true;
  lastPointerIndex = pointerIndexForCurrentWheel(state.rotation, basePointerAngle);
  lastTickAt = 0;
  render();

  let startTime = null;
  let previousRotation = startRotation;
  let previousFrameTime = 0;

  function frame(timestamp) {
    if (!startTime) {
      startTime = timestamp;
      previousFrameTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(1, elapsed / duration);
    let rotation;
    let pointerOffset = 0;
    let activeElasticEffect = null;
    let activeSwapAnimation = null;

    if (profile.fakeout) {
      if (elapsed < profile.mainDuration) {
        const mainProgress = Math.min(1, elapsed / profile.mainDuration);
        rotation = startRotation + (stagedRotation - startRotation) * easeOutQuart(mainProgress);
      } else {
        rotation = stagedRotation;
        for (const effect of effectPlans) {
          if (elapsed < effect.startHold) break;

          if (elapsed < effect.startMove) {
            if (!effect.holdCuePlayed) {
              effect.holdCuePlayed = true;
              playFakeoutCue(profile, "hold", effect.kind, effect.slowdown);
            }
            break;
          }

          if (elapsed < effect.endMove) {
            const localProgress = Math.min(1, (elapsed - effect.startMove) / effect.moveMs);
            const ease = effect.kind === "bounce"
              ? easeOutBack(localProgress)
              : easeInOutCubic(localProgress);
            const wobble = effect.kind === "bounce"
              ? Math.sin(localProgress * Math.PI * 2.15 + effect.phase)
                * effect.wobble
                * Math.pow(1 - localProgress, 2.15)
              : 0;
            const activePointerAngle = basePointerAngle + pointerOffset;
            if (effect.kind === "swap") {
              applyNameSwap(effect, rotation, activePointerAngle);
              activeSwapAnimation = swapLabelAnimationForEffect(effect, localProgress);
            }
            if (effect.kind === "elastic" && effect.elasticIndex === null) {
              effect.elasticIndex = pointerIndexForCurrentWheel(rotation, activePointerAngle);
            }
            if (effect.kind === "droop") {
              prepareDroopEffect(effect, rotation, activePointerAngle);
            }
            rotation += effect.delta * ease + wobble;
            if (effect.kind === "pointer") {
              const pointerEase = localProgress >= 1 ? 1 : easeOutBack(localProgress);
              const pointerJitter = localProgress > 0 && localProgress < 1
                ? Math.sin(localProgress * Math.PI * 9) * 0.025 * (1 - localProgress)
                : 0;
              pointerOffset += pointerDelta * pointerEase + pointerJitter;
            }
            if (effect.kind === "droop") {
              const droopEase = localProgress >= 1 ? 1 : easeOutBack(localProgress);
              const sag = Math.sin(localProgress * Math.PI * 2.4) * 0.028 * (1 - localProgress);
              pointerOffset += effect.droopMagnitude * droopEase + sag;
            }
            if (effect.kind === "elastic") activeElasticEffect = { effect, progress: localProgress };
            if (!effect.moveCuePlayed) {
              effect.moveCuePlayed = true;
              playFakeoutCue(profile, "start", effect.kind, effect.slowdown);
            }
            break;
          }

          rotation += effect.delta;
          if (effect.kind === "pointer") pointerOffset += pointerDelta;
          if (effect.kind === "droop") {
            prepareDroopEffect(effect, rotation, basePointerAngle + pointerOffset);
            pointerOffset += effect.droopMagnitude;
          }
          if (effect.kind === "swap") applyNameSwap(effect, rotation, basePointerAngle + pointerOffset);
        }
      }
    } else {
      const eased = profile.normal ? easeOutCubic(progress) : easeOutQuart(progress);
      rotation = progress >= 1
        ? endRotation
        : startRotation + totalDelta * eased;
    }

    if (progress >= 1) rotation = endRotation;

    const dt = Math.max(16, timestamp - previousFrameTime);
    const speed = Math.abs(rotation - previousRotation) / (dt / 1000);
    state.rotation = rotation;

    setPointerAngle(basePointerAngle + pointerOffset);

    updateSpinSound(speed, progress);
    const slotSlices = namesSwapped ? currentSlotSlices() : null;
    let drawSlices = slotSlices;
    if (activeElasticEffect && activeElasticEffect.effect.elasticIndex !== null) {
      drawSlices = elasticBoundarySlices(
        drawSlices || wheelSlices(currentWheelNames),
        activeElasticEffect.effect.elasticIndex,
        activeElasticEffect.progress,
        activeElasticEffect.effect.elasticDirection
      );
    }
    drawWheel(currentWheelNames, state.rotation, drawSlices, activeSwapAnimation);

    const indexAtPointer = pointerIndexForCurrentWheel(state.rotation, pointerAngle, drawSlices);
    if (indexAtPointer !== lastPointerIndex) {
      const inTerminalTickWindow = progress >= 0.992 || elapsed >= duration - 140;
      if (!inTerminalTickWindow && speed > 0.08 && timestamp - lastTickAt > 18) {
        playTick(speed);
        lastTickAt = timestamp;
      }
      lastPointerIndex = indexAtPointer;
    }

    previousRotation = rotation;
    previousFrameTime = timestamp;

    if (progress < 1) {
      requestAnimationFrame(frame);
      return;
    }

    const finalSlices = slicesForCurrentWheel();
    finalWinner = selectedNameAtPointer(state.rotation, pointerAngle, finalSlices);
    if (namesSwapped) {
      setVisualSliceStateFromSlices(currentSlotSlices());
    }
    finishSpin(finalWinner, currentWheelNames, profile);
  }

  requestAnimationFrame(frame);
}

function finishSpin(winner, wheelNames, profile = null) {
  state.rotation = normalizeAngle(state.rotation);
  displayedWheelNames = wheelNames.slice();
  state.picked.push(winner);
  state.history.unshift(winner);
  isSpinning = false;
  pendingThemeSeed = winner;
  pendingSendoff = wheelNames.length === 1;
  pendingRemovalEffects = !pendingSendoff;
  pendingRemovalIntensity = pendingRemovalEffects ? (profile?.intensity || 0) : 0;

  stopSpinSound();
  playClack();
  setTimeout(playTinyCheer, 80);
  showResultOverlay(winner);
  render();
}

resultOverlay.addEventListener("click", hideResultOverlay);

function resetRound() {
  if (isSpinning) return;
  clearFakeCrash();
  abortRemovalAnimation();
  resetVisualSliceState();
  clearDisplayedWheel(true);
  state.picked = [];
  state.history = [];
  pendingThemeSeed = null;
  pendingSendoff = false;
  pendingSendoffThemeSeed = null;
  pendingRemovalEffects = false;
  pendingRemovalIntensity = 0;
  hideResultOverlay();
  render();
}

function undoPick() {
  if (isSpinning || !state.history.length) return;
  clearFakeCrash();
  abortRemovalAnimation();
  resetVisualSliceState();
  clearDisplayedWheel(true);
  const [name] = state.history.splice(0, 1);
  const index = state.picked.lastIndexOf(name);
  if (index >= 0) state.picked.splice(index, 1);
  pendingThemeSeed = null;
  pendingSendoff = false;
  pendingSendoffThemeSeed = null;
  pendingRemovalEffects = false;
  pendingRemovalIntensity = 0;
  hideResultOverlay();
  render();
}

function toggleSound() {
  state.soundOn = !state.soundOn;
  if (!state.soundOn && audioContext) {
    stopSpinSound();
    audioContext.suspend();
  }
  render();
}

function handlePeopleInputEdit() {
  if (isSpinning) return;
  clearFakeCrash();
  abortRemovalAnimation();
  resetVisualSliceState();
  clearDisplayedWheel(true);
  state.picked = [];
  state.history = [];
  targetAdDismissed = false;
  pendingThemeSeed = null;
  pendingSendoff = false;
  pendingSendoffThemeSeed = null;
  pendingRemovalEffects = false;
  pendingRemovalIntensity = 0;
  hideResultOverlay();
  render();
}

peopleInput.addEventListener("input", handlePeopleInputEdit);
peopleInput.addEventListener("change", handlePeopleInputEdit);

spinButton.addEventListener("click", spin);
resetButton.addEventListener("click", resetRound);
undoButton.addEventListener("click", undoPick);
soundButton.addEventListener("click", toggleSound);

document.addEventListener("keydown", (event) => {
  const wantsSpin = (event.metaKey || event.ctrlKey) && event.key === "Enter";
  if (wantsSpin) {
    event.preventDefault();
    spin();
    return;
  }

  if (event.key === "Escape") {
    hideResultOverlay();
  }
});

window.addEventListener("resize", fitCanvas);

loadState();
fitCanvas();
render();
