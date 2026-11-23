"use client";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

// Dans le lien « Sacoche » : six pastilles, une pleine par Pokémon de l'équipe.
// Sur téléphone, la place manque : un simple « 5/6 » les remplace.
export default function IndicateurSacoche() {
  const nombre = useSacoche((etat) => etat.equipe.length);
  return (
    <>
      <span aria-hidden className="hidden items-center gap-[3px] sm:flex">
        {Array.from({ length: TAILLE_SACOCHE }, (_, i) => (
          <span
            key={i}
            className={`size-1.5 rounded-full transition-colors duration-150 ease-doux ${
              i < nombre ? "bg-texte" : "bg-trait-fort"
            }`}
          />
        ))}
      </span>
      <span aria-hidden className="font-mono text-xs tabular-nums text-texte-3 sm:hidden">
        {nombre}/{TAILLE_SACOCHE}
      </span>
      <span className="sr-only">
        {nombre} Pokémon sur {TAILLE_SACOCHE}
      </span>
    </>
  );
}
