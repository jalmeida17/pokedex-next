import type { Metadata } from "next";
import ListeFavoris from "@/components/ListeFavoris";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Les Pokémon que vous avez marqués d'une étoile.",
};

// La page reste un composant serveur (pour le titre) ; la liste est un composant client.
export default function PageFavoris() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Mes favoris</h1>
        <p className="mt-2 text-[15px] text-texte-2">Les Pokémon marqués d’une étoile, gardés dans ce navigateur</p>
      </div>
      <ListeFavoris />
    </>
  );
}
