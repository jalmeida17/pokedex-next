"use client";
import { useCallback, useEffect, useRef } from "react";

// Renvoie une version « temporisée » du rappel : il ne part que si
// aucun nouvel appel n'arrive pendant le délai (utile pour la recherche).
export function useRappelTemporise<A extends unknown[]>(rappel: (...args: A) => void, delai = 300) {
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dernierRappel = useRef(rappel);

  useEffect(() => {
    dernierRappel.current = rappel; // toujours la version la plus récente
  });

  useEffect(() => {
    return () => {
      if (minuteur.current) clearTimeout(minuteur.current); // nettoyage à la disparition
    };
  }, []);

  return useCallback(
    (...args: A) => {
      if (minuteur.current) clearTimeout(minuteur.current);
      minuteur.current = setTimeout(() => dernierRappel.current(...args), delai);
    },
    [delai]
  );
}
