"use client";
import { Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BOUTON_ICONE, ICONE, ICONE_NEUTRE, ICONE_PETITE } from "@/lib/styles";
import type { Pokemon } from "@/types/pokemon";

type Props = {
  variante: "ligne" | "icone"; // une ligne de la colonne de gauche, ou un bouton carré sur téléphone
};

const LIGNE =
  "flex h-8 w-full items-center gap-2 rounded-lg px-2 text-sm text-texte-2 transition-colors duration-150 ease-doux hover:bg-releve hover:text-texte disabled:cursor-wait disabled:opacity-60 sm:px-3";

// Appelle notre propre route d'API, puis ouvre la fiche du Pokémon tiré.
export default function BoutonHasard({ variante }: Props) {
  const router = useRouter();
  const [etat, setEtat] = useState<"pret" | "tirage" | "erreur">("pret");

  const tirer = async () => {
    setEtat("tirage");
    try {
      const reponse = await fetch("/api/aleatoire");
      if (!reponse.ok) throw new Error("Tirage impossible");
      const pokemon = (await reponse.json()) as Pokemon;
      router.push(`/pokemon/${pokemon.nom}`);
      setEtat("pret");
    } catch {
      setEtat("erreur");
    }
  };

  const libelle = etat === "tirage" ? "Tirage…" : etat === "erreur" ? "Réessayer" : "Au hasard";

  return (
    <button
      onClick={tirer}
      disabled={etat === "tirage"}
      aria-label={variante === "icone" ? libelle : undefined}
      className={variante === "ligne" ? LIGNE : `${BOUTON_ICONE} ${ICONE_PETITE} ${ICONE_NEUTRE}`}
    >
      <Shuffle {...ICONE} />
      {variante === "ligne" && libelle}
    </button>
  );
}
