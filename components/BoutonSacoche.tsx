"use client";
import { Check, Plus } from "lucide-react";
import {
  BOUTON_ICONE,
  BOUTON_ICONE_PLEIN,
  BOUTON_PRIMAIRE,
  BOUTON_SECONDAIRE,
  ICONE,
  ICONE_NEUTRE,
  ICONE_PETITE,
} from "@/lib/styles";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";
import type { Pokemon } from "@/types/pokemon";

type Props = {
  pokemon: Pokemon;
  compact?: boolean; // version carrée, pour les cartes de la liste
};

// Le bouton n'applique aucune règle : il affiche l'état, le store décide.
export default function BoutonSacoche({ pokemon, compact = false }: Props) {
  const dedans = useSacoche((etat) => etat.equipe.some((m) => m.id === pokemon.id));
  const pleine = useSacoche((etat) => etat.equipe.length >= TAILLE_SACOCHE);
  const ajouter = useSacoche((etat) => etat.ajouter);
  const retirer = useSacoche((etat) => etat.retirer);

  if (dedans) {
    return (
      <button
        onClick={() => retirer(pokemon.id)}
        aria-label={compact ? `Retirer ${pokemon.nom} de la sacoche` : undefined}
        className={compact ? BOUTON_ICONE_PLEIN : BOUTON_SECONDAIRE}
      >
        <Check {...ICONE} />
        {!compact && "Dans la sacoche"}
      </button>
    );
  }
  return (
    <button
      onClick={() => ajouter(pokemon)}
      disabled={pleine}
      aria-label={
        compact ? (pleine ? "Sacoche pleine" : `Ajouter ${pokemon.nom} à la sacoche`) : undefined
      }
      className={compact ? `${BOUTON_ICONE} ${ICONE_PETITE} ${ICONE_NEUTRE}` : BOUTON_PRIMAIRE}
    >
      <Plus {...ICONE} />
      {!compact && (pleine ? "Sacoche pleine" : "Ajouter à la sacoche")}
    </button>
  );
}
