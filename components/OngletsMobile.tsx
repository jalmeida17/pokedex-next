"use client";
import { Backpack, LayoutGrid, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CompteurFavoris from "./CompteurFavoris";
import CompteurSacoche from "./CompteurSacoche";

const ONGLETS = [
  { href: "/", libelle: "Pokédex", Icone: LayoutGrid, compte: null },
  { href: "/favoris", libelle: "Favoris", Icone: Star, compte: <CompteurFavoris /> },
  { href: "/sacoche", libelle: "Sacoche", Icone: Backpack, compte: <CompteurSacoche /> },
];

// Sur téléphone, la navigation est une barre d'onglets en bas de l'écran, sous le pouce.
export default function OngletsMobile() {
  const chemin = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-trait bg-fond/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      {ONGLETS.map(({ href, libelle, Icone, compte }) => {
        const actif = href === "/" ? chemin === "/" || chemin.startsWith("/pokemon") : chemin.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={actif ? "page" : undefined}
            className={`flex h-14 flex-col items-center justify-center gap-1 text-[11px] transition-colors duration-150 ease-doux ${
              actif ? "font-medium text-texte" : "text-texte-3"
            }`}
          >
            <Icone size={18} strokeWidth={actif ? 2 : 1.5} aria-hidden />
            <span className="flex items-center gap-1">
              {libelle}
              {compte}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
