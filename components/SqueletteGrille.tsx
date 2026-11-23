import { CLASSES_GRILLE } from "./GrillePokemons";

// La silhouette des cartes, à la place de la grille pendant le chargement.
export default function SqueletteGrille({ nombre = 24 }: { nombre?: number }) {
  return (
    <ul className={`${CLASSES_GRILLE} animate-pulse`} aria-busy="true" aria-label="Chargement des Pokémon">
      {Array.from({ length: nombre }, (_, i) => (
        <li key={i}>
          <div className="aspect-square rounded-xl bg-releve" />
          <div className="px-1 pt-3">
            <div className="h-3 w-8 rounded bg-releve" />
            <div className="mt-2 h-4 w-24 rounded bg-releve" />
            <div className="mt-2.5 h-3 w-14 rounded bg-releve" />
          </div>
        </li>
      ))}
    </ul>
  );
}
