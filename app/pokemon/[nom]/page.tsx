import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Suspense } from "react";
import BadgeType from "@/components/BadgeType";
import BandeNumeros from "@/components/BandeNumeros";
import BarresStats from "@/components/BarresStats";
import BoutonFavori from "@/components/BoutonFavori";
import BoutonSacoche from "@/components/BoutonSacoche";
import CasesStats from "@/components/CasesStats";
import ChaineEvolution from "@/components/ChaineEvolution";
import Sensibilites from "@/components/Sensibilites";
import {
  recupererEspece,
  recupererEvolutions,
  recupererPlusieurs,
  recupererPokemon,
  recupererSensibilites,
  recupererTousLesNoms,
  TOTAL_POKEMONS,
} from "@/lib/pokeapi";
import { ICONE } from "@/lib/styles";
import { couleurType, formaterNumero } from "@/lib/types";

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

const BLOC = "rounded-2xl border border-trait bg-carte p-5 sm:p-6";
const TITRE_BLOC = "text-sm font-medium";

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

// La fiche :
// - à gauche, la carte du Pokémon (aplat de la couleur du type), puis « À propos » et « Forces et faiblesses » ;
// - à droite, la chaîne d'évolution, verticale et sans cadre (seulement si le Pokémon évolue).
//   Elle se loge dans la marge libre à droite de la page (classe deborde-a-droite, dans globals.css) :
//   sur un écran large, la carte garde la même largeur avec ou sans elle.
// Sur un écran plus étroit que 1 280 px, la chaîne passe dessous, à l'horizontale.
async function Fiche({ params }: Props) {
  const { nom } = await params;
  const pokemon = await recupererPokemon(nom);
  // null = l'API a répondu 404 : page « introuvable ». Une panne lève une erreur → error.tsx.
  if (!pokemon) notFound();

  // Quatre appels indépendants, lancés en même temps.
  const [espece, nomsParEtape, sensibilites, tousLesNoms] = await Promise.all([
    recupererEspece(pokemon.id),
    recupererEvolutions(pokemon.id),
    recupererSensibilites(pokemon.types),
    recupererTousLesNoms(),
  ]);
  const etapes = await Promise.all(nomsParEtape.map((noms) => recupererPlusieurs(noms)));
  const evolue = etapes.flat().length > 1;

  // --type : la couleur du premier type, qui donne l'aplat de la carte.
  const type = { "--type": couleurType(pokemon.types[0]) } as CSSProperties;
  const total = pokemon.stats.reduce((somme, stat) => somme + stat.valeur, 0);

  return (
    <article
      style={type}
      className={`grid animate-entree gap-x-5 gap-y-8 motion-reduce:animate-none ${
        evolue ? "deborde-a-droite xl:grid-cols-[minmax(0,1fr)_8.25rem]" : ""
      }`}
    >
      <div className="grid min-w-0 gap-4">
        {/*
          La carte du Pokémon. « @container » : les classes « @2xl: », « @4xl: » et « @5xl: » plus bas
          dépendent de la largeur de la carte elle-même, pas de celle de l'écran. Elle reste ainsi
          un rectangle couché, qu'il y ait ou non la colonne des évolutions à côté :
          - carte d'au moins 896 px (@4xl) : trois colonnes, identité, Pokémon, statistiques en barres ;
          - de 672 à 895 px (@2xl) : deux colonnes, et les statistiques en une rangée de cases dessous ;
          - plus étroite (téléphone) : tout s'empile.
        */}
        <header className="aplat-type @container relative overflow-hidden rounded-3xl">
          {/* .sur-aplat : tout ce qui suit s'affiche en blanc sur la couleur du type. */}
          <div className="sur-aplat">
            {/* Le nom japonais en très grand, derrière le Pokémon. */}
            {espece?.nomJa && (
              <span
                aria-hidden
                lang="ja"
                className="pointer-events-none absolute left-1/2 top-52 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(4rem,8vw,6.5rem)] font-black leading-none text-white/12 @2xl:left-3/4 @4xl:left-1/2 @4xl:top-[46%]"
              >
                {espece.nomJa}
              </span>
            )}

            {/* Les formes spéciales (au-delà de 1 025) n'ont pas de voisins dans le Pokédex. */}
            <div className="relative z-10 flex min-h-15 items-center justify-center px-4 pt-4">
              {pokemon.id <= TOTAL_POKEMONS && <BandeNumeros id={pokemon.id} noms={tousLesNoms} />}
            </div>

            {espece?.region && (
              <p className="absolute left-3 top-1/2 hidden -translate-y-1/2 rotate-180 text-xs text-texte-3 [writing-mode:vertical-rl] @4xl:block">
                Région : {espece.region}
              </p>
            )}

            <div className="grid items-center gap-x-6 gap-y-6 px-6 pb-8 pt-2 sm:px-10 sm:pb-10 @2xl:grid-cols-2 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,18rem)_minmax(0,1fr)] @4xl:pl-14 @5xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)_minmax(0,1fr)] @5xl:gap-x-10">
              {/* Le Pokémon. Son image est plus grande que sa case : avec trois colonnes,
                  elle descend sous le bord de la carte, qui la coupe. */}
              <div className="relative @2xl:order-2">
                <div className="relative mx-auto mb-[8%] aspect-square w-full max-w-[22rem] @4xl:mb-0">
                  <Image
                    src={pokemon.image}
                    alt={`Illustration de ${pokemon.nom}`}
                    width={475}
                    height={475}
                    sizes="(min-width: 1280px) 500px, (min-width: 640px) 400px, 100vw"
                    loading="eager"
                    className="absolute left-1/2 top-0 size-[112%] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_12px_24px_rgb(0_0_0/0.25)] @4xl:size-[128%]"
                  />
                </div>
              </div>

              {/* L'identité : numéro, nom, types, mensurations, actions. */}
              <div className="relative z-10 @2xl:order-1">
                <p className="text-sm text-texte-2">
                  <span className="font-mono tabular-nums">{formaterNumero(pokemon.id)}</span>
                  {espece?.nomFr && ` · ${espece.nomFr}`}
                </p>
                <h1 className="mt-1 text-5xl font-medium capitalize leading-none tracking-[-0.04em] [overflow-wrap:anywhere] @5xl:text-6xl">
                  {pokemon.nom}
                </h1>
                <div className="mt-5 flex flex-wrap gap-2">
                  {pokemon.types.map((type) => (
                    <BadgeType key={type} type={type} encadre />
                  ))}
                </div>
                <dl className="mt-5 grid gap-1 text-sm text-texte-2">
                  <div className="flex gap-2">
                    <dt>Taille :</dt>
                    <dd className="tabular-nums text-texte">{pokemon.taille.toLocaleString("fr-FR")} m</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>Poids :</dt>
                    <dd className="tabular-nums text-texte">{pokemon.poids.toLocaleString("fr-FR")} kg</dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <BoutonSacoche pokemon={pokemon} />
                  <BoutonFavori nom={pokemon.nom} grand />
                </div>
              </div>

              {/* Les statistiques, dans la carte. Avec trois colonnes, le bloc reste étroit,
                  calé contre le bord droit : des barres courtes se lisent mieux que des barres très longues. */}
              <section className="relative z-10 @2xl:order-3 @2xl:col-span-2 @4xl:col-span-1 @4xl:w-full @4xl:max-w-[16.5rem] @4xl:justify-self-end">
                <div className="mb-3 flex items-baseline justify-between gap-4 @4xl:mb-4">
                  <h2 className={TITRE_BLOC}>Statistiques de base</h2>
                  <p className="text-[13px] text-texte-3">
                    Total <span className="font-mono font-medium tabular-nums text-texte">{total}</span>
                  </p>
                </div>
                {/* Deux présentations des mêmes chiffres : des barres quand il y a une colonne pour elles,
                    des cases sinon. */}
                <div className="hidden @4xl:block">
                  <BarresStats stats={pokemon.stats} />
                </div>
                <div className="@4xl:hidden">
                  <CasesStats stats={pokemon.stats} />
                </div>
              </section>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className={BLOC}>
            <h2 className={`${TITRE_BLOC} mb-4`}>À propos</h2>
            {espece?.description ? (
              <p className="max-w-prose text-[15px] leading-relaxed text-texte-2">{espece.description}</p>
            ) : (
              <p className="text-sm text-texte-2">Pas de description en français pour ce Pokémon</p>
            )}
            {espece?.categorie && (
              <p className="mt-4 text-[13px] text-texte-3">
                Catégorie : <span className="text-texte">{espece.categorie}</span>
              </p>
            )}
          </section>

          <section className={BLOC}>
            <h2 className={`${TITRE_BLOC} mb-4`}>Forces et faiblesses</h2>
            <Sensibilites sensibilites={sensibilites} />
          </section>
        </div>
      </div>

      {/* Un Pokémon qui n'évolue pas n'a pas de colonne « Évolutions ». */}
      {evolue && (
        <aside aria-label="Évolutions" className="xl:sticky xl:top-10 xl:self-start">
          <h2 className={`${TITRE_BLOC} mb-4 xl:text-center`}>Évolutions</h2>
          <ChaineEvolution etapes={etapes} courant={pokemon.id} />
        </aside>
      )}
    </article>
  );
}

function SqueletteFiche() {
  return (
    <div className="grid animate-pulse gap-4" aria-busy="true" aria-label="Chargement de la fiche">
      <div className="h-[28rem] rounded-3xl bg-releve" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-48 rounded-2xl bg-releve" />
        <div className="h-48 rounded-2xl bg-releve" />
      </div>
    </div>
  );
}
