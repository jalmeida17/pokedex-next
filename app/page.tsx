import { ChevronDown } from "lucide-react";
import { Suspense } from "react";
import BarreRecherche, { CLASSES_CHAMP } from "@/components/BarreRecherche";
import FiltreTypes, { CLASSES_BOUTON_FILTRE } from "@/components/FiltreTypes";
import GrillePokemons from "@/components/GrillePokemons";
import Pagination from "@/components/Pagination";
import SqueletteGrille from "@/components/SqueletteGrille";
import { recupererNomsParType, recupererPlusieurs, recupererTousLesNoms } from "@/lib/pokeapi";
import { ICONE } from "@/lib/styles";
import { TYPES } from "@/lib/types";

type Props = {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
};

const PAR_PAGE = 24;
const BARRE = "flex gap-2 [&>*:first-child]:min-w-0 [&>*:first-child]:flex-1";

// La coque (titre, recherche, filtre) s'affiche tout de suite ;
// les résultats arrivent ensuite, derrière un squelette.
export default function Accueil({ searchParams }: Props) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Pokédex</h1>
        <p className="mt-2 text-[15px] text-texte-2">
          1 025 Pokémon, leurs types, leurs statistiques et leurs évolutions
        </p>
      </div>

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
          <div className="mt-8">
            <div className="mb-4 h-5" />
            <SqueletteGrille />
          </div>
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
      <p className="mb-4 mt-8 font-mono text-[13px] leading-5 tabular-nums text-texte-3" role="status">
        {noms.length.toLocaleString("fr-FR")} Pokémon
        {typeActif && ` · ${TYPES[typeActif].libelle}`}
      </p>
      <GrillePokemons pokemons={pokemons} vide="Aucun Pokémon ne correspond à cette recherche" />
      <Pagination page={pageCourante} nombrePages={nombrePages} q={q} type={typeActif} />
    </>
  );
}
