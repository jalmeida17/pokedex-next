"use client";
import { useSyncExternalStore } from "react";

type StorePersistant = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (rappel: () => void) => () => void;
  };
};

// Vaut false sur le serveur et tant que le store n'a pas relu le localStorage.
// Évite d'afficher « liste vide » avant de connaître le vrai contenu.
export function useEstHydrate(store: StorePersistant): boolean {
  return useSyncExternalStore(
    (rappel) => store.persist.onFinishHydration(rappel),
    () => store.persist.hasHydrated(),
    () => false
  );
}
