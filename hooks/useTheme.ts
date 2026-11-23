"use client";
import { useCallback, useSyncExternalStore } from "react";
import { CLE_THEME } from "@/lib/theme";

export type Theme = "light" | "dark";

const SYSTEME_SOMBRE = "(prefers-color-scheme: dark)";
const abonnes = new Set<() => void>();

// Le thème réellement affiché : le choix de l'utilisateur, sinon celui du système.
function lireTheme(): Theme {
  const choix = document.documentElement.dataset.theme;
  if (choix === "light" || choix === "dark") return choix;
  return window.matchMedia(SYSTEME_SOMBRE).matches ? "dark" : "light";
}

function sAbonner(rappel: () => void) {
  abonnes.add(rappel);
  const systeme = window.matchMedia(SYSTEME_SOMBRE);
  systeme.addEventListener("change", rappel); // le système change de thème
  return () => {
    abonnes.delete(rappel);
    systeme.removeEventListener("change", rappel);
  };
}

// Renvoie le thème affiché et une fonction pour passer de l'un à l'autre.
// Le thème vit sur <html data-theme="…"> : le CSS de globals.css fait le reste.
export function useTheme(): { theme: Theme; basculer: () => void } {
  // Sur le serveur, on ne connaît pas le thème : « light » par défaut, corrigé après l'hydratation.
  const theme = useSyncExternalStore<Theme>(sAbonner, lireTheme, () => "light");

  const basculer = useCallback(() => {
    const suivant: Theme = lireTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = suivant;
    try {
      localStorage.setItem(CLE_THEME, suivant);
    } catch {
      // Navigation privée : le choix vaut pour cette page seulement.
    }
    abonnes.forEach((rappel) => rappel());
  }, []);

  return { theme, basculer };
}
