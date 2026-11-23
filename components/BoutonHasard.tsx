"use client";
import { Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BOUTON_PETIT, ICONE } from "@/lib/styles";
import type { Pokemon } from "@/types/pokemon";

// Appelle notre propre route d'API, puis ouvre la fiche du Pokémon tiré.
export default function BoutonHasard() {
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

  return (
    <button onClick={tirer} disabled={etat === "tirage"} className={`${BOUTON_PETIT} max-sm:w-8 max-sm:px-0`}>
      <Shuffle {...ICONE} />
      <span className="max-sm:sr-only">
        {etat === "tirage" ? "Tirage…" : etat === "erreur" ? "Réessayer" : "Au hasard"}
      </span>
    </button>
  );
}
