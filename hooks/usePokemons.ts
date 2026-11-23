"use client";
import { useEffect, useState } from "react";
import { chargerPokemon } from "@/lib/pokeapi-client";
import type { Pokemon } from "@/types/pokemon";

type Etat = "chargement" | "pret" | "erreur";

type Resultat = { cle: string; pokemons: Pokemon[]; erreur: boolean };

// Charge une liste de Pokémon côté navigateur et renvoie la liste et son état.
// L'état est déduit du résultat : pas de setState synchrone dans l'effet.
export function usePokemons(noms: string[]): { pokemons: Pokemon[]; etat: Etat } {
  const cle = noms.join(",");
  const [resultat, setResultat] = useState<Resultat>({ cle: "", pokemons: [], erreur: false });

  useEffect(() => {
    let annule = false;
    const demandes = cle ? cle.split(",") : [];
    Promise.all(demandes.map((nom) => chargerPokemon(nom)))
      .then((resultats) => {
        if (annule) return;
        const pokemons = resultats.filter((p): p is Pokemon => p !== null);
        setResultat({ cle, pokemons, erreur: false });
      })
      .catch(() => {
        if (!annule) setResultat({ cle, pokemons: [], erreur: true });
      });
    return () => {
      annule = true;
    };
  }, [cle]);

  // Un favori retiré : tout est déjà chargé, inutile de repasser par « chargement ».
  const pokemons = resultat.pokemons.filter((p) => noms.includes(p.nom));
  const complet = resultat.cle === cle || pokemons.length === noms.length;
  const etat: Etat = resultat.erreur && resultat.cle === cle ? "erreur" : complet ? "pret" : "chargement";

  return { pokemons, etat };
}
