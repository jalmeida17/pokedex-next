import type { Pokemon } from "@/types/pokemon";
import CartePokemon from "./CartePokemon";

type Props = {
  pokemons: Pokemon[];
  vide?: string; // message affiché quand la liste est vide
};

// De 2 colonnes sur téléphone à 6 sur grand écran : 24 cartes remplissent toujours des lignes entières.
export const CLASSES_GRILLE = "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6";

export default function GrillePokemons({ pokemons, vide = "Aucun Pokémon à afficher" }: Props) {
  if (pokemons.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-trait-fort px-6 py-16 text-center text-sm text-texte-2">
        {vide}
      </p>
    );
  }
  return (
    <ul className={`${CLASSES_GRILLE} animate-entree motion-reduce:animate-none`}>
      {pokemons.map((pokemon) => (
        <li key={pokemon.id}>
          <CartePokemon pokemon={pokemon} />
        </li>
      ))}
    </ul>
  );
}
