import { ChevronDown, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Pokemon } from "@/types/pokemon";
import { ICONE } from "@/lib/styles";
import { couleurType, formaterNumero } from "@/lib/types";

type Props = {
  etapes: Pokemon[][]; // une liste de Pokémon par étape : [[base], [évolutions], [évolutions finales]]
  courant: number; // le numéro du Pokémon dont on regarde la fiche
};

// La chaîne d'évolution : une étape après l'autre, reliées par un trait et une flèche.
// Sur grand écran (xl), elle est verticale, dans la colonne de droite de la fiche ;
// en dessous, elle est horizontale, sous les autres blocs.
// Le Pokémon de la fiche est cerné à la couleur de son type.
// Quand une étape a plus de deux Pokémon (Évoli), ils sont rangés en grille, en plus petit.
export default function ChaineEvolution({ etapes, courant }: Props) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4 xl:flex-col xl:gap-2">
      {etapes.map((etape, i) => {
        const nombreux = etape.length > 2;
        return (
          <li key={i} className="flex items-center gap-2 sm:gap-4 xl:flex-col xl:gap-2">
            {i > 0 && (
              <span aria-hidden className="flex items-center text-texte-3 xl:flex-col">
                <span className="hidden h-px w-8 bg-trait-fort sm:block lg:w-14 xl:h-4 xl:w-px" />
                <ChevronRight {...ICONE} className="shrink-0 sm:-ml-1.5 xl:hidden" />
                <ChevronDown {...ICONE} className="-mt-1.5 hidden shrink-0 xl:block" />
              </span>
            )}
            <ul className={`grid gap-3 ${nombreux ? "grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 xl:gap-2" : ""}`}>
              {etape.map((pokemon) => (
                <li key={pokemon.id}>
                  <Etape pokemon={pokemon} ici={pokemon.id === courant} petit={nombreux} />
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

// Un Pokémon de la chaîne : sa vignette teintée, son numéro et son nom dessous.
function Etape({ pokemon, ici, petit }: { pokemon: Pokemon; ici: boolean; petit: boolean }) {
  return (
    <Link
      href={`/pokemon/${pokemon.nom}`}
      aria-current={ici ? "page" : undefined}
      style={{ "--type": couleurType(pokemon.types[0]) } as CSSProperties}
      className={`group block text-center ${petit ? "w-[4.5rem] sm:w-24 xl:w-[3.875rem]" : "w-20 sm:w-28"}`}
    >
      <span
        className={`teinte-type relative block aspect-square overflow-hidden rounded-2xl transition-shadow duration-200 ease-doux ${
          ici
            ? "shadow-[inset_0_0_0_2px_color-mix(in_oklab,var(--type)_75%,transparent)]"
            : "group-hover:shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--type)_60%,transparent)]"
        }`}
      >
        <Image
          src={pokemon.image}
          alt=""
          width={160}
          height={160}
          sizes="112px"
          className="absolute inset-0 size-full object-contain p-2"
        />
      </span>
      <span className="encre-type mt-2 block font-mono text-xs tabular-nums">{formaterNumero(pokemon.id)}</span>
      <span
        className={`block truncate capitalize transition-colors duration-150 ease-doux ${petit ? "text-sm xl:text-xs" : "text-sm"} ${
          ici ? "font-medium" : "text-texte-2 group-hover:text-texte"
        }`}
      >
        {pokemon.nom}
      </span>
    </Link>
  );
}
