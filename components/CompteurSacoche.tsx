"use client";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

// « 5/6 » : le nombre de Pokémon dans la sacoche, pour l'exposant du titre.
export default function CompteurSacoche() {
  const nombre = useSacoche((etat) => etat.equipe.length);
  return (
    <>
      <span aria-hidden>
        {nombre}/{TAILLE_SACOCHE}
      </span>
      <span className="sr-only">
        {nombre} sur {TAILLE_SACOCHE}
      </span>
    </>
  );
}
