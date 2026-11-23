import { Backpack, LayoutGrid, Star } from "lucide-react";
import { Suspense } from "react";
import { ICONE } from "@/lib/styles";
import BarreRecherche from "./BarreRecherche";
import BoutonHasard from "./BoutonHasard";
import BoutonTheme from "./BoutonTheme";
import CompteurFavoris from "./CompteurFavoris";
import EquipeLaterale from "./EquipeLaterale";
import LienNav from "./LienNav";
import Marque from "./Marque";
import TypesLateral from "./TypesLateral";

// La colonne fixe de gauche (écrans larges) : tout ce qui sert à se déplacer et à filtrer
// est ici, la page ne montre que le contenu. En bas, l'équipe reste toujours sous les yeux.
// Sur téléphone, elle est remplacée par EnTete (en haut) et OngletsMobile (en bas).
export default function BarreLaterale() {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-6 overflow-y-auto border-r border-trait bg-fond px-3 py-4 lg:flex">
      <div className="flex items-center justify-between pl-2">
        <Marque />
        <BoutonTheme />
      </div>

      {/* La recherche et les liens lisent l'adresse : Suspense garde la colonne pré-rendue. */}
      <Suspense fallback={<div className="h-9" />}>
        <BarreRecherche compact />
      </Suspense>

      <nav aria-label="Navigation principale" className="grid gap-0.5">
        <Suspense fallback={null}>
          <LienNav href="/" className="flex w-full">
            <LayoutGrid {...ICONE} />
            Tous les Pokémon
          </LienNav>
          <LienNav href="/favoris" className="flex w-full">
            <Star {...ICONE} />
            Favoris
            <span className="ml-auto">
              <CompteurFavoris />
            </span>
          </LienNav>
          <LienNav href="/sacoche" className="flex w-full">
            <Backpack {...ICONE} />
            Sacoche
          </LienNav>
        </Suspense>
        <BoutonHasard variante="ligne" />
      </nav>

      <Suspense fallback={null}>
        <TypesLateral />
      </Suspense>

      <EquipeLaterale />
    </aside>
  );
}
