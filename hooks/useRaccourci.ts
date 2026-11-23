"use client";
import { useEffect } from "react";

// Déclenche l'action quand la touche est pressée, sauf pendant une saisie.
// L'action doit être stable (useCallback), sinon l'écouteur est reposé à chaque affichage.
export function useRaccourci(touche: string, action: () => void) {
  useEffect(() => {
    const ecouter = (evenement: KeyboardEvent) => {
      const cible = evenement.target as HTMLElement;
      if (evenement.key !== touche || cible.tagName === "INPUT" || cible.tagName === "TEXTAREA") return;
      evenement.preventDefault();
      action();
    };
    window.addEventListener("keydown", ecouter);
    return () => window.removeEventListener("keydown", ecouter);
  }, [touche, action]);
}
