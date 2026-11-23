import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Pokemon } from "@/types/pokemon";

export const TAILLE_SACOCHE = 6;

export type Membre = Pick<Pokemon, "id" | "nom" | "image" | "types"> & { surnom: string };

type EtatSacoche = {
  equipe: Membre[];
  ajouter: (pokemon: Pokemon) => void;
  retirer: (id: number) => void;
  renommer: (id: number, surnom: string) => void;
  vider: () => void;
};

// Les règles métier vivent ici, pas dans les boutons :
// six Pokémon au maximum, jamais deux fois le même.
export const useSacoche = create<EtatSacoche>()(
  persist(
    (set) => ({
      equipe: [],
      ajouter: (pokemon) =>
        set((etat) => {
          const dejaPresent = etat.equipe.some((membre) => membre.id === pokemon.id);
          if (dejaPresent || etat.equipe.length >= TAILLE_SACOCHE) return etat;
          const { id, nom, image, types } = pokemon;
          return { equipe: [...etat.equipe, { id, nom, image, types, surnom: "" }] };
        }),
      retirer: (id) =>
        set((etat) => ({ equipe: etat.equipe.filter((membre) => membre.id !== id) })),
      renommer: (id, surnom) =>
        set((etat) => ({
          equipe: etat.equipe.map((membre) => (membre.id === id ? { ...membre, surnom } : membre)),
        })),
      vider: () => set({ equipe: [] }),
    }),
    { name: "pokedex-sacoche", skipHydration: true }
  )
);
