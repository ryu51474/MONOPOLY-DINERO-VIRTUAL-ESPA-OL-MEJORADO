import { IGameStatePlayer } from "@monopoly-money/game-state";
import { routePaths } from "./constants";

export const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export const sortPlayersByName = (players: IGameStatePlayer[]) =>
  players.slice().sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

// Cute animal emojis for players (kept consistent with AvatarSelector)
export const PLAYER_ANIMAL_EMOJIS = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔",
  "🐧", "🐦", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗",
  "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟"
];

// Get a deterministic animal emoji based on playerId
export const getPlayerEmoji = (playerId: string): string => {
  let hash = 0;
  for (let i = 0; i < playerId.length; i++) {
    hash = ((hash << 5) - hash) + playerId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return PLAYER_ANIMAL_EMOJIS[Math.abs(hash) % PLAYER_ANIMAL_EMOJIS.length];
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

// gtag.js integration

interface WindowWithGTag extends Window {
  gtag: ((...args: any) => void) | undefined;
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
