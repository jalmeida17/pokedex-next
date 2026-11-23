import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Pokemon } from "@/types/pokemon";
import { couleurType, formaterNumero, TYPES } from "@/lib/types";
import BoutonFavori from "./BoutonFavori";
import BoutonSacoche from "./BoutonSacoche";
import IconeType from "./IconeType";

// Une carte = une vignette teintée par le type du Pokémon, avec son numéro en haut
// et les logos de ses types en bas, puis le nom et les types écrits en dessous.
export default function CartePokemon({ pokemon }: { pokemon: Pokemon }) {
  const type = { "--type": couleurType(pokemon.types[0]) } as CSSProperties;

  return (
    <article style={type} className="group relative">
      {/* Au survol : un filet à la couleur du type cerne la vignette, et le Pokémon s'avance un peu. */}
      <div
        className="teinte-type relative aspect-square overflow-hidden rounded-xl transition-shadow duration-200 ease-doux
                   group-hover:shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--type)_60%,transparent)]"
      >
        <p className="encre-type absolute left-3 top-2.5 font-mono text-xs tabular-nums">
          {formaterNumero(pokemon.id)}
        </p>
        <Image
          src={pokemon.image}
          alt=""
          width={240}
          height={240}
          sizes="(min-width: 1024px) 170px, (min-width: 768px) 23vw, (min-width: 640px) 30vw, 45vw"
          className="absolute inset-0 size-full object-contain px-4 pb-3 pt-9 transition-transform duration-300 ease-doux group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute bottom-2.5 left-2.5 flex gap-1">
          {pokemon.types.map((type) => (
            <IconeType key={type} type={type} taille="m" />
          ))}
        </div>
      </div>

      {/* Les boutons passent au-dessus du lien qui couvre toute la carte. */}
      <div className="absolute right-2 top-2 z-10 flex gap-1">
        <BoutonFavori nom={pokemon.nom} />
        <BoutonSacoche pokemon={pokemon} compact />
      </div>

      <div className="px-1 pt-2.5">
        <h2 className="text-[15px] font-medium capitalize leading-5">
          <Link
            href={`/pokemon/${pokemon.nom}`}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            {pokemon.nom}
          </Link>
        </h2>
        <p className="mt-0.5 text-[13px] leading-5 text-texte-2">
          {pokemon.types.map((type) => TYPES[type]?.libelle ?? type).join(" · ")}
        </p>
      </div>
    </article>
  );
}
