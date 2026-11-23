import Image from "next/image";
import Link from "next/link";
import type { Pokemon } from "@/types/pokemon";
import { formaterNumero } from "@/lib/types";
import BadgeType from "./BadgeType";
import BoutonFavori from "./BoutonFavori";
import BoutonSacoche from "./BoutonSacoche";

// Une carte = une vignette neutre où l'illustration porte seule la couleur,
// puis le numéro, le nom et les types en dessous.
export default function CartePokemon({ pokemon }: { pokemon: Pokemon }) {
  const numero = formaterNumero(pokemon.id);

  return (
    <article className="group relative">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-releve transition-colors duration-150 ease-doux group-hover:bg-releve-2">
        <Image
          src={pokemon.image}
          alt=""
          width={240}
          height={240}
          sizes="(min-width: 1024px) 170px, (min-width: 768px) 23vw, (min-width: 640px) 30vw, 45vw"
          className="absolute inset-0 size-full object-contain p-4"
        />
      </div>

      {/* Les boutons passent au-dessus du lien qui couvre toute la carte. */}
      <div className="absolute right-2 top-2 z-10 flex gap-1">
        <BoutonFavori nom={pokemon.nom} />
        <BoutonSacoche pokemon={pokemon} compact />
      </div>

      <div className="px-1 pt-3">
        <p className="font-mono text-xs tabular-nums text-texte-3">{numero}</p>
        <h2 className="mt-0.5 text-[15px] font-medium capitalize leading-5">
          <Link
            href={`/pokemon/${pokemon.nom}`}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            {pokemon.nom}
          </Link>
        </h2>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
          {pokemon.types.map((type) => (
            <BadgeType key={type} type={type} />
          ))}
        </div>
      </div>
    </article>
  );
}
