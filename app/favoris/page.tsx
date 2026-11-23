import type { Metadata } from "next";
import CompteurFavoris from "@/components/CompteurFavoris";
import ListeFavoris from "@/components/ListeFavoris";
import TitrePage from "@/components/TitrePage";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Les Pokémon que vous avez marqués d'une étoile.",
};

// La page reste un composant serveur (pour le titre) ; la liste est un composant client.
export default function PageFavoris() {
  return (
    <>
      <TitrePage titre="Favoris" exposant={<CompteurFavoris />}>
        Les Pokémon marqués d’une étoile, gardés dans ce navigateur
      </TitrePage>
      <ListeFavoris />
    </>
  );
}
