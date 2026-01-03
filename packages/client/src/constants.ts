import { IPageMeta } from "./components/MetaTags";

export const siteUrl = "https://monopoly-money.nitratine.net";

export const bankName = "Banco";
export const freeParkingName = "Parada Libre";

export const routePaths = {
  home: "/",
  join: "/join",
  newGame: "/new-game",
  funds: "/funds",
  bank: "/bank",
  history: "/history",
  settings: "/settings",
  help: "/help"
};

export const pageMeta: Record<string, IPageMeta> = {
  [routePaths.home]: {
    titlePrefix: "",
    description:
      "Monopoly Money te ayuda a gestionar tus finanzas en una partida de Monopoly desde el navegador.",
    index: true
  },
  [routePaths.join]: {
    titlePrefix: "Unirse al Juego",
    description: "Únete a una partida de Monopoly Money",
    index: true
  },
  [routePaths.newGame]: {
    titlePrefix: "Nuevo Juego",
    description: "Crea una nueva partida de Monopoly Money",
    index: true
  },
  [routePaths.funds]: {
    titlePrefix: "Gestionar Fondos",
    index: false
  },
  [routePaths.bank]: {
    titlePrefix: "Banco",
    index: false
  },
  [routePaths.history]: {
    titlePrefix: "Historial",
    index: false
  },
  [routePaths.settings]: {
    titlePrefix: "Configuración",
    index: false
  },
  [routePaths.help]: {
    titlePrefix: "Ayuda",
    index: false
  }
};
