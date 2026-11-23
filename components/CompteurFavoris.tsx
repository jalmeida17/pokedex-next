"use client";
import { useFavoris } from "@/stores/favoris";

// Le sélecteur ne renvoie que le nombre : le composant ne se redessine
// que si ce nombre change.
export default function CompteurFavoris() {
  const nombre = useFavoris((etat) => etat.noms.length);
  if (nombre === 0) return null;
  return (
    <span className="font-mono text-xs tabular-nums text-texte-3">
      {nombre}
      <span className="sr-only"> en favori</span>
    </span>
  );
}
