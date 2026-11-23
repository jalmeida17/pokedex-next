import Link from "next/link";
import { Suspense } from "react";
import BoutonHasard from "./BoutonHasard";
import BoutonTheme from "./BoutonTheme";
import CompteurFavoris from "./CompteurFavoris";
import IndicateurSacoche from "./IndicateurSacoche";
import LienNav from "./LienNav";

// Les liens affichés tant que la page courante n'est pas connue.
const LIEN_SIMPLE = "inline-flex h-8 items-center rounded-lg px-2 text-sm text-texte-2 sm:px-3";

export default function EnTete() {
  return (
    <header className="sticky top-0 z-20 border-b border-trait bg-fond/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-[17px] font-semibold tracking-tight">
          <Marque />
          {/* Sur un petit téléphone, le glyphe seul laisse la place aux boutons. */}
          <span className="max-[430px]:sr-only">Pokédex</span>
        </Link>
        <nav aria-label="Navigation principale" className="flex items-center gap-1">
          {/* usePathname dépend de l'adresse : Suspense garde l'en-tête pré-rendu. */}
          <Suspense
            fallback={
              <>
                <Link href="/favoris" className={LIEN_SIMPLE}>
                  Favoris
                </Link>
                <Link href="/sacoche" className={LIEN_SIMPLE}>
                  Sacoche
                </Link>
              </>
            }
          >
            <LienNav href="/" className="hidden sm:inline-flex">
              Tous
            </LienNav>
            <LienNav href="/favoris">
              Favoris <CompteurFavoris />
            </LienNav>
            <LienNav href="/sacoche">
              Sacoche <IndicateurSacoche />
            </LienNav>
          </Suspense>
          <span aria-hidden className="mx-1 hidden h-4 w-px bg-trait-fort sm:block" />
          <BoutonHasard />
          <BoutonTheme />
        </nav>
      </div>
    </header>
  );
}

// Le logo : un glyphe plat, d'une seule couleur.
function Marque() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
      className="text-accent"
    >
      <circle cx="10" cy="10" r="8" />
      <path d="M2 10h5m6 0h5" />
      <circle cx="10" cy="10" r="3" />
    </svg>
  );
}
