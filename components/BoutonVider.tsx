"use client";
import { useState } from "react";
import { BOUTON_PETIT } from "@/lib/styles";
import { useSacoche } from "@/stores/sacoche";

// Deux clics pour vider : le premier demande confirmation, le second agit.
export default function BoutonVider() {
  const nombre = useSacoche((etat) => etat.equipe.length);
  const vider = useSacoche((etat) => etat.vider);
  const [aConfirmer, setAConfirmer] = useState(false);

  if (nombre === 0) return null;
  return (
    <button
      onClick={() => {
        if (aConfirmer) vider();
        setAConfirmer(!aConfirmer);
      }}
      onBlur={() => setAConfirmer(false)}
      className={BOUTON_PETIT}
    >
      {aConfirmer ? <span className="text-accent">Confirmer</span> : "Vider la sacoche"}
    </button>
  );
}
