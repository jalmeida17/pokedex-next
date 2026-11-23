"use client";
import GrillePokemons from "@/components/GrillePokemons";
import SqueletteGrille from "@/components/SqueletteGrille";
import { useEstHydrate } from "@/hooks/useEstHydrate";
import { usePokemons } from "@/hooks/usePokemons";
import { useFavoris } from "@/stores/favoris";

// Les favoris vivent dans le navigateur : le chargement se fait donc côté client.
export default function ListeFavoris() {
  const noms = useFavoris((etat) => etat.noms);
  const hydrate = useEstHydrate(useFavoris);
  const { pokemons, etat } = usePokemons(noms);

  if (etat === "erreur") {
    return (
      <p
        role="alert"
        className="rounded-2xl border border-dashed border-trait-fort px-6 py-16 text-center text-sm text-texte-2"
      >
        Impossible de charger vos favoris. Vérifiez votre connexion, puis rechargez la page.
      </p>
    );
  }
  if (!hydrate || etat === "chargement") {
    return <SqueletteGrille nombre={Math.max(noms.length, 6)} />;
  }
  return (
    <GrillePokemons pokemons={pokemons} vide="Aucun favori pour le moment, l'étoile d'une carte en ajoute un" />
  );
}
