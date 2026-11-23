"use client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { useRaccourci } from "@/hooks/useRaccourci";
import { useRappelTemporise } from "@/hooks/useRappelTemporise";
import { ICONE } from "@/lib/styles";

const CHAMP =
  "w-full border border-trait bg-carte placeholder:text-texte-3 transition-[border-color,box-shadow] duration-150 ease-doux focus:border-trait-fort focus:outline-none focus:ring-4 focus:ring-texte/5";

// Deux tailles : la grande dans la page (téléphone), la compacte dans la colonne de gauche.
export const CLASSES_CHAMP = `${CHAMP} h-11 rounded-[10px] pl-10 pr-24 text-[15px]`;
const CLASSES_CHAMP_COMPACT = `${CHAMP} h-9 rounded-lg pl-9 pr-9 text-sm`;

// La recherche est rangée dans l'adresse de l'accueil (/?q=…) : elle se partage,
// survit au rechargement, et c'est le serveur qui filtre.
export default function BarreRecherche({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const chemin = usePathname();
  const parametres = useSearchParams();
  const surAccueil = chemin === "/";
  const [texte, setTexte] = useState(surAccueil ? (parametres.get("q") ?? "") : "");
  const [enAttente, demarrer] = useTransition();
  const champ = useRef<HTMLInputElement>(null);

  // On attend 300 ms sans frappe avant de changer l'adresse.
  const naviguer = useRappelTemporise((valeur: string) => {
    // Depuis une fiche ou les favoris, la recherche ramène à l'accueil.
    const suivants = new URLSearchParams(surAccueil ? parametres.toString() : "");
    if (valeur) suivants.set("q", valeur);
    else suivants.delete("q");
    suivants.delete("page"); // une nouvelle recherche repart de la page 1
    const requete = suivants.toString();
    const adresse = requete ? `/?${requete}` : "/";
    // Sur l'accueil, replace : le bouton Précédent revient à l'écran d'avant, pas à chaque lettre.
    demarrer(() => (surAccueil ? router.replace(adresse) : router.push(adresse)));
  });

  // La touche « / » place le curseur dans la recherche.
  const viser = useCallback(() => champ.current?.focus(), []);
  useRaccourci("/", viser);

  return (
    <div className="relative">
      <Search
        {...ICONE}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-texte-3 ${compact ? "left-3" : "left-3.5"}`}
      />
      <input
        ref={champ}
        type="search"
        value={texte}
        onChange={(e) => {
          setTexte(e.target.value);
          naviguer(e.target.value);
        }}
        placeholder="Rechercher"
        aria-label="Rechercher un Pokémon"
        className={compact ? CLASSES_CHAMP_COMPACT : CLASSES_CHAMP}
      />
      <span
        aria-live="polite"
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[13px] text-texte-3 ${compact ? "right-2" : "right-3"}`}
      >
        {enAttente && !compact ? (
          "Recherche…"
        ) : texte ? null : (
          <kbd
            aria-hidden
            className="hidden h-5 min-w-5 place-items-center rounded-[5px] border border-trait-fort bg-fond px-1 font-mono text-[11px] sm:grid"
          >
            /
          </kbd>
        )}
      </span>
    </div>
  );
}
