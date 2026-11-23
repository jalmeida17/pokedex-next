"use client";
import { Star } from "lucide-react";
import { BOUTON_ICONE, ICONE, ICONE_GRANDE, ICONE_NEUTRE, ICONE_PETITE } from "@/lib/styles";
import { useFavoris } from "@/stores/favoris";

type Props = {
  nom: string;
  grand?: boolean; // 40 px, à côté d'un bouton de la fiche
};

export default function BoutonFavori({ nom, grand = false }: Props) {
  const actif = useFavoris((etat) => etat.noms.includes(nom));
  const basculer = useFavoris((etat) => etat.basculer);

  return (
    <button
      onClick={() => basculer(nom)}
      aria-pressed={actif}
      aria-label={actif ? `Retirer ${nom} des favoris` : `Ajouter ${nom} aux favoris`}
      className={`${BOUTON_ICONE} ${grand ? ICONE_GRANDE : ICONE_PETITE} ${actif ? "text-accent" : ICONE_NEUTRE}`}
    >
      {/* L'étoile pleine en accent : c'est la sélection de l'utilisateur. */}
      <Star {...ICONE} fill={actif ? "currentColor" : "none"} />
    </button>
  );
}
