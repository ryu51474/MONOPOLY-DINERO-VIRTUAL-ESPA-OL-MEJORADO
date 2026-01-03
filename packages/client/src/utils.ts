import { IGameStatePlayer } from "@monopoly-money/game-state";
import { routePaths } from "./constants";

export const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export const sortPlayersByName = (players: IGameStatePlayer[]) =>
  players.slice().sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

// Cute animal emojis for players (kept consistent with AVATAR_COLORS map)
export const PLAYER_ANIMAL_EMOJIS = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔",
  "🐧", "🐦", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗",
  "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟"
];

// Color mapping for each emoji (matches AvatarSelector colors)
export const AVATAR_COLORS: Record<string, string> = {
  "🐶": "#8B4513", // dog
  "🐱": "#FF6B6B", // cat
  "🐭": "#A0A0A0", // mouse
  "🐹": "#E8A0BF", // hamster (similar to rabbit pink)
  "🐰": "#FFB6C1", // rabbit
  "🦊": "#FF6B35", // fox
  "🐻": "#8B4513", // bear
  "🐼": "#2C3E50", // panda
  "🐨": "#7F8C8D", // koala
  "🐯": "#E74C3C", // tiger
  "🦁": "#F39C12", // lion
  "🐮": "#D5D8DC", // cow
  "🐷": "#FFB6C1", // pig
  "🐸": "#4CAF50", // frog (green)
  "🐵": "#8B4513", // monkey
  "🐔": "#FFB6C1", // chicken (pink-ish)
  "🐧": "#34495E", // penguin
  "🐦": "#87CEEB", // bird (sky blue)
  "🦆": "#4682B4", // duck (steel blue)
  "🦅": "#CD853F", // eagle (brown)
  "🦉": "#6B5B95", // owl (purple)
  "🦇": "#4A4A4A", // bat (dark gray)
  "🐺": "#696969", // wolf (dim gray)
  "🐗": "#8B4513", // boar (brown)
  "🦄": "#DDA0DD", // unicorn (plum)
  "🐝": "#FFD700", // bee (gold)
  "🐛": "#90EE90", // caterpillar (light green)
  "🦋": "#FF69B4", // butterfly (hot pink)
  "🐌": "#D2B48C", // snail (tan)
  "🐞": "#DC143C", // ladybug (crimson)
  "🐜": "#2F4F4F", // ant (dark slate gray)
  "🦟": "#778899", // mosquito (light slate gray)
};

// Get color for a player's emoji
export const getPlayerEmojiColor = (emoji: string): string => {
  return AVATAR_COLORS[emoji] || "#888888"; // Default gray if not found
};

// Get a deterministic animal emoji based on playerId
// This function is DETERMINISTIC: the same playerId will ALWAYS return the same emoji
// This is critical for multi-device consistency - all devices must see the same emoji for each player
export const getPlayerEmoji = (playerId: string): string => {
  let hash = 0;
  for (let i = 0; i < playerId.length; i++) {
    hash = ((hash << 5) - hash) + playerId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return PLAYER_ANIMAL_EMOJIS[Math.abs(hash) % PLAYER_ANIMAL_EMOJIS.length];
};

// Convenience function to get emoji with color for a player
export const getPlayerEmojiWithColor = (playerId: string): { emoji: string; color: string } => {
  const emoji = getPlayerEmoji(playerId);
  return { emoji, color: getPlayerEmojiColor(emoji) };
};

// Get unique emojis for all players to avoid duplicates
// DEPRECATED: This function recalculates from scratch each time, causing emojis to change
// when new players join. Use assignPlayerEmojis instead for persistent assignments.
export const getUniquePlayerEmojis = (players: IGameStatePlayer[]): Map<string, string> => {
  return assignPlayerEmojis(players);
};

// Assign emojis to players with persistent mapping
// Existing players keep their emojis, new players get random ones
export const assignPlayerEmojis = (
  players: IGameStatePlayer[],
  existingEmojis?: Map<string, string>
): Map<string, string> => {
  const emojiMap = new Map<string, string>(existingEmojis);
  const usedEmojis = new Set<string>(existingEmojis?.values());
  
  // First, preserve existing assignments and track used emojis
  for (const emoji of emojiMap.values()) {
    usedEmojis.add(emoji);
  }
  
  // Get available emojis (not yet used)
  const availableEmojis = PLAYER_ANIMAL_EMOJIS.filter(e => !usedEmojis.has(e));
  
  // Shuffle available emojis for truly random selection
  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const shuffledAvailable = shuffleArray(availableEmojis);
  let availableIndex = 0;
  
  // Assign emojis to new players only (existing ones already in map)
  for (const player of players) {
    if (!emojiMap.has(player.playerId)) {
      // New player - assign a random available emoji
      if (availableIndex < shuffledAvailable.length) {
        const emoji = shuffledAvailable[availableIndex];
        emojiMap.set(player.playerId, emoji);
        usedEmojis.add(emoji);
        availableIndex++;
      } else {
        // All emojis used, use hash-based assignment as fallback
        let hash = 0;
        for (let i = 0; i < player.playerId.length; i++) {
          hash = ((hash << 5) - hash) + player.playerId.charCodeAt(i);
          hash = hash & hash;
        }
        const emoji = PLAYER_ANIMAL_EMOJIS[Math.abs(hash) % PLAYER_ANIMAL_EMOJIS.length];
        emojiMap.set(player.playerId, emoji);
      }
    }
  }
  
  return emojiMap;
};

// Format player name with emoji - short names get emoji at start AND end
export const formatPlayerName = (name: string, emoji: string): string => {
  if (name.length <= 5) {
    return `${emoji} ${name} ${emoji}`;
  }
  return `${emoji} ${name}`;
};

// Get player display name with emoji for use in UI
export const getPlayerDisplayName = (name: string, playerId: string): string => {
  const emoji = getPlayerEmoji(playerId);
  return formatPlayerName(name, emoji);
};

// ===== LocalStorage-based emoji persistence =====

/**
 * Get player emojis from localStorage for a specific game
 * This ensures emojis remain consistent across tab switches, refreshes, etc.
 */
export const getPlayerEmojisFromStorage = (gameId: string): Map<string, string> => {
  try {
    const stored = localStorage.getItem(`game_${gameId}_emojis`);
    if (stored) {
      const parsed: Record<string, string> = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    }
  } catch {
    console.warn('Failed to load emojis from localStorage');
  }
  return new Map();
};

/**
 * Save player emojis to localStorage for a specific game
 */
export const savePlayerEmojisToStorage = (gameId: string, emojis: Map<string, string>): void => {
  try {
    const obj: Record<string, string> = {};
    emojis.forEach((value, key) => {
      obj[key] = value;
    });
    localStorage.setItem(`game_${gameId}_emojis`, JSON.stringify(obj));
  } catch {
    console.warn('Failed to save emojis to localStorage');
  }
};

/**
 * Get the last processed event index from localStorage
 * This prevents reprocessing events when tab regains focus
 */
export const getLastProcessedEventIndex = (gameId: string): number => {
  try {
    const stored = localStorage.getItem(`game_${gameId}_lastEventIndex`);
    if (stored) {
      return parseInt(stored, 10);
    }
  } catch {
    console.warn('Failed to load last event index from localStorage');
  }
  return -1;
};

/**
 * Save the last processed event index to localStorage
 */
export const saveLastProcessedEventIndex = (gameId: string, index: number): void => {
  try {
    localStorage.setItem(`game_${gameId}_lastEventIndex`, String(index));
  } catch {
    console.warn('Failed to save last event index to localStorage');
  }
};

/**
 * Get the set of event timestamps that have had sounds played from localStorage
 * This prevents sounds from being replayed when switching tabs
 */
export const getProcessedSoundEvents = (gameId: string): Set<string> => {
  try {
    const stored = localStorage.getItem(`game_${gameId}_soundEvents`);
    if (stored) {
      const parsed: string[] = JSON.parse(stored);
      return new Set(parsed);
    }
  } catch {
    console.warn('Failed to load sound events from localStorage');
  }
  return new Set<string>();
};

/**
 * Save the set of event timestamps that have had sounds played to localStorage
 */
export const saveProcessedSoundEvents = (gameId: string, events: Set<string>): void => {
  try {
    localStorage.setItem(`game_${gameId}_soundEvents`, JSON.stringify(Array.from(events)));
  } catch {
    console.warn('Failed to save sound events to localStorage');
  }
};

// gtag.js integration

interface WindowWithGTag extends Window {
  gtag: ((...args: unknown[]) => void) | undefined;
}

const getWindowWithGTag = () => {
  return window as unknown as WindowWithGTag;
};

// These events are purely here for me to understand how the application is used

const tryToTrackGAEvent = (eventName: string, eventParams?: object) => {
  if (getWindowWithGTag().gtag !== undefined) {
    if (eventParams !== undefined) {
      getWindowWithGTag().gtag!("event", eventName, eventParams);
    } else {
      getWindowWithGTag().gtag!("event", eventName);
    }
  }
};

export const trackPageView = () =>
  tryToTrackGAEvent("page_view", {
    page_location: window.location.origin + window.location.pathname,
    page_path: window.location.pathname,
    page_title: document.title
  });

export const trackUnexpectedServerDisconnection = () =>
  tryToTrackGAEvent("Unexpected server disconnection", {
    event_category: "Network",
    non_interaction: true
  });

export const trackGameCreated = () => tryToTrackGAEvent("Game created");

export const trackGameJoined = () => tryToTrackGAEvent("Game joined");

export const trackGameCodeClick = () => tryToTrackGAEvent("Game code clicked");

export const trackInitialisedPlayerBalances = (amount: number) =>
  tryToTrackGAEvent("Initialised player balances", { initialisedAmount: amount });

export const trackFreeParkingDisabled = () => tryToTrackGAEvent("Free parking disabled");

export const trackFreeParkingEnabled = () => tryToTrackGAEvent("Free parking enabled");

export const trackNewPlayersNotAllowed = () => tryToTrackGAEvent("New players not allowed");

export const trackNewPlayersAllowed = () => tryToTrackGAEvent("New players allowed");

export const trackEndGame = () => tryToTrackGAEvent("Ended game");

const queryStringGameIdName = "gameId";

export const getGameIdFromQueryString = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get(queryStringGameIdName);
  return gameId;
};

export const getShareGameLink = (gameId: string) => {
  return `${window.location.origin}${routePaths.join}?${queryStringGameIdName}=${gameId}`;
};
