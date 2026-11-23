"use client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { useRaccourci } from "@/hooks/useRaccourci";
import { useRappelTemporise } from "@/hooks/useRappelTemporise";
import { ICONE } from "@/lib/styles";

export const CLASSES_CHAMP =
  "h-11 w-full rounded-[10px] border border-trait bg-carte pl-10 pr-24 text-[15px] placeholder:text-texte-3 transition-[border-color,box-shadow] duration-150 ease-doux focus:border-trait-fort focus:outline-none focus:ring-4 focus:ring-texte/5";

// La recherche est rangée dans l'adresse (?q=…) : elle se partage,
// survit au rechargement, et c'est le serveur qui filtre.
export default function BarreRecherche() {
  const router = useRouter();
  const chemin = usePathname();
  const parametres = useSearchParams();
  const [texte, setTexte] = useState(parametres.get("q") ?? "");
  const [enAttente, demarrer] = useTransition();
  const champ = useRef<HTMLInputElement>(null);

  // On attend 300 ms sans frappe avant de changer l'adresse.
  const naviguer = useRappelTemporise((valeur: string) => {
    const suivants = new URLSearchParams(parametres.toString());
    if (valeur) suivants.set("q", valeur);
    else suivants.delete("q");
    suivants.delete("page"); // une nouvelle recherche repart de la page 1
    // replace : le bouton Précédent revient à l'écran d'avant, pas à chaque lettre.
    demarrer(() => router.replace(`${chemin}?${suivants.toString()}`));
  });

  // La touche « / » place le curseur dans la recherche.
  const viser = useCallback(() => champ.current?.focus(), []);
  useRaccourci("/", viser);

  return (
    <div className="relative">
      <Search {...ICONE} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-texte-3" />
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
        className={CLASSES_CHAMP}
      />
      <span
        aria-live="polite"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-texte-3"
      >
        {enAttente ? (
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
