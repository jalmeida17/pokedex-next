import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BadgeType from "@/components/BadgeType";
import BarresStats from "@/components/BarresStats";
import BoutonFavori from "@/components/BoutonFavori";
import BoutonSacoche from "@/components/BoutonSacoche";
import GrillePokemons from "@/components/GrillePokemons";
import {
  recupererEvolutions,
  recupererPlusieurs,
  recupererPokemon,
  recupererTousLesNoms,
} from "@/lib/pokeapi";
import { ICONE } from "@/lib/styles";
import { formaterNumero } from "@/lib/types";

type Props = {
  params: Promise<{ nom: string }>;
};

// Les 151 premiers Pokémon sont générés au build ; les autres à la première visite.
export async function generateStaticParams() {
  const noms = await recupererTousLesNoms();
  return noms.slice(0, 151).map((nom) => ({ nom }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nom } = await params;
  const pokemon = await recupererPokemon(nom);
  if (!pokemon) return { title: "Pokémon introuvable" };

  const titre = pokemon.nom.charAt(0).toUpperCase() + pokemon.nom.slice(1);
  return {
    title: titre,
    description: `${titre} : types, statistiques et évolutions.`,
    openGraph: { images: [pokemon.image] },
  };
}

const GRILLE_FICHE = "grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12";

export default function PageFiche({ params }: Props) {
  return (
    <>
      <Link
        href="/"
        className="mb-6 inline-flex h-8 items-center gap-2 text-sm text-texte-2 transition-colors duration-150 ease-doux hover:text-texte"
      >
        <ArrowLeft {...ICONE} />
        Tous les Pokémon
      </Link>
      <Suspense fallback={<SqueletteFiche />}>
        <Fiche params={params} />
      </Suspense>
    </>
  );
}

async function Fiche({ params }: Props) {
  const { nom } = await params;
  const pokemon = await recupererPokemon(nom);
  // null = l'API a répondu 404 : page « introuvable ». Une panne lève une erreur → error.tsx.
  if (!pokemon) notFound();

  const evolutions = await recupererPlusieurs(await recupererEvolutions(pokemon.id));

  return (
    <article className="animate-entree motion-reduce:animate-none">
      <div className={GRILLE_FICHE}>
        {/* La vignette reste neutre : l'illustration porte seule la couleur. */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-releve">
          <Image
            src={pokemon.image}
            alt={`Illustration de ${pokemon.nom}`}
            width={475}
            height={475}
            sizes="(min-width: 768px) 480px, 100vw"
            loading="eager"
            className="absolute inset-0 size-full object-contain p-8 sm:p-12"
          />
        </div>

        <div className="md:py-2">
          <p className="font-mono text-sm tabular-nums text-texte-3">{formaterNumero(pokemon.id)}</p>
          <h1 className="mt-1 text-4xl font-medium capitalize tracking-tight sm:text-5xl">{pokemon.nom}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <BadgeType key={type} type={type} encadre />
            ))}
          </div>

          <dl className="mt-6 flex gap-10">
            <div>
              <dt className="text-[13px] text-texte-3">Taille</dt>
              <dd className="mt-0.5 text-lg tabular-nums">{pokemon.taille.toLocaleString("fr-FR")} m</dd>
            </div>
            <div>
              <dt className="text-[13px] text-texte-3">Poids</dt>
              <dd className="mt-0.5 text-lg tabular-nums">{pokemon.poids.toLocaleString("fr-FR")} kg</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center gap-2">
            <BoutonSacoche pokemon={pokemon} />
            <BoutonFavori nom={pokemon.nom} grand />
          </div>

          <section className="mt-10 border-t border-trait pt-8">
            <h2 className="mb-4 text-sm font-medium">Statistiques de base</h2>
            <BarresStats stats={pokemon.stats} />
          </section>
        </div>
      </div>

      {evolutions.length > 1 && (
        <section className="mt-12 border-t border-trait pt-8">
          <h2 className="mb-6 text-xl font-medium tracking-tight">Évolutions</h2>
          <GrillePokemons pokemons={evolutions} />
        </section>
      )}
    </article>
  );
}

function SqueletteFiche() {
  return (
    <div className={`${GRILLE_FICHE} animate-pulse`} aria-busy="true" aria-label="Chargement de la fiche">
      <div className="aspect-square rounded-2xl bg-releve" />
      <div className="md:py-2">
        <div className="h-4 w-12 rounded bg-releve" />
        <div className="mt-3 h-10 w-2/3 rounded-lg bg-releve" />
        <div className="mt-4 h-7 w-32 rounded-lg bg-releve" />
        <div className="mt-8 h-10 w-56 rounded-[10px] bg-releve" />
        <div className="mt-10 h-56 rounded-2xl bg-releve" />
      </div>
    </div>
  );
}
