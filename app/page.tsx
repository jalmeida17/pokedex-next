import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import BarreRecherche, { CLASSES_CHAMP } from "@/components/BarreRecherche";
import FiltreTypes, { CLASSES_BOUTON_FILTRE } from "@/components/FiltreTypes";
import GrillePokemons from "@/components/GrillePokemons";
import Pagination from "@/components/Pagination";
import SqueletteGrille from "@/components/SqueletteGrille";
import TitrePage from "@/components/TitrePage";
import { recupererNomsParType, recupererPlusieurs, recupererTousLesNoms } from "@/lib/pokeapi";
import { ICONE } from "@/lib/styles";
import { TYPES } from "@/lib/types";

type Props = {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
};

const PAR_PAGE = 24;
const BARRE = "mb-6 flex gap-2 lg:hidden [&>*:first-child]:min-w-0 [&>*:first-child]:flex-1";

// La coque (titre) s'affiche tout de suite ; les résultats arrivent ensuite, derrière un squelette.
// Sur écran large, la recherche et les types sont dans la colonne de gauche (BarreLaterale) ;
// sur téléphone, ils sont ici, au-dessus de la grille.
export default function Accueil({ searchParams }: Props) {
  return (
    <>
      <TitrePage titre="Pokédex" exposant="1 025">
        Tous les Pokémon, leurs types, leurs statistiques et leurs évolutions
      </TitrePage>

      {/* La recherche et le filtre lisent l'adresse : Suspense affiche d'abord leur version inerte. */}
      <Suspense
        fallback={
          <div className={BARRE}>
            <div>
              <input disabled placeholder="Rechercher" aria-label="Rechercher un Pokémon" className={CLASSES_CHAMP} />
            </div>
            <button disabled className={CLASSES_BOUTON_FILTRE}>
              Type
              <ChevronDown {...ICONE} className="text-texte-3" />
            </button>
          </div>
        }
      >
        <div className={BARRE}>
          <BarreRecherche />
          <FiltreTypes />
        </div>
      </Suspense>

      <Suspense
        fallback={
          <>
            <div className="mb-4 h-7" />
            <SqueletteGrille />
          </>
        }
      >
        <Resultats searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Resultats({ searchParams }: Props) {
  const { q = "", type = "", page = "1" } = await searchParams;
  const typeActif = type in TYPES ? type : "";

  // 1. Tous les noms (ou ceux du type), 2. filtre par texte, 3. découpe de la page.
  let noms = typeActif ? await recupererNomsParType(typeActif) : await recupererTousLesNoms();
  const texte = q.trim().toLowerCase();
  if (texte) noms = noms.filter((nom) => nom.includes(texte));

  const nombrePages = Math.max(1, Math.ceil(noms.length / PAR_PAGE));
  const pageCourante = Math.min(Math.max(1, Number(page) || 1), nombrePages);
  const visibles = noms.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE);
  // Seuls les 24 Pokémon de la page sont chargés en détail.
  const pokemons = await recupererPlusieurs(visibles);

  return (
    <>
      {/* Le compte, les filtres en cours, et un lien pour tout réafficher. */}
      <div className="mb-4 flex min-h-7 flex-wrap items-center gap-x-3 gap-y-2">
        <p className="font-mono text-[13px] leading-5 tabular-nums text-texte-3" role="status">
          {noms.length.toLocaleString("fr-FR")} Pokémon
          {typeActif && ` · ${TYPES[typeActif].libelle}`}
          {texte && ` · « ${texte} »`}
        </p>
        {(typeActif || texte) && (
          <Link
            href="/"
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-trait bg-carte px-2 text-[13px] text-texte-2 transition-colors duration-150 ease-doux hover:bg-releve hover:text-texte"
          >
            <X {...ICONE} size={14} />
            Tout afficher
          </Link>
        )}
      </div>
      <GrillePokemons pokemons={pokemons} vide="Aucun Pokémon ne correspond à cette recherche" />
      <Pagination page={pageCourante} nombrePages={nombrePages} q={q} type={typeActif} />
    </>
  );
}
