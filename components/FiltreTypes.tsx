"use client";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ICONE } from "@/lib/styles";
import { TYPES } from "@/lib/types";

export const CLASSES_BOUTON_FILTRE =
  "inline-flex h-11 shrink-0 items-center gap-2 rounded-[10px] border border-trait bg-carte px-3.5 text-[15px] transition-colors duration-150 ease-doux hover:bg-releve disabled:opacity-60";

const LIGNE =
  "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors duration-150 ease-doux hover:bg-releve";

// Un bouton « Type » à côté de la recherche, qui ouvre un menu des 18 types.
// Le menu ne contient que des liens : le type choisi vit dans l'adresse (?type=…),
// l'état local ne sert qu'à savoir si le menu est ouvert.
export default function FiltreTypes() {
  const parametres = useSearchParams();
  const type = parametres.get("type") ?? "";
  const typeActif = type in TYPES ? type : "";

  const [ouvert, setOuvert] = useState(false);
  const racine = useRef<HTMLDivElement>(null);
  const bouton = useRef<HTMLButtonElement>(null);
  const idMenu = useId();

  // Menu ouvert : un clic ailleurs ou la touche Échap le referme.
  useEffect(() => {
    if (!ouvert) return;
    const surPointeur = (evenement: PointerEvent) => {
      if (!racine.current?.contains(evenement.target as Node)) setOuvert(false);
    };
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key !== "Escape") return;
      setOuvert(false);
      bouton.current?.focus();
    };
    document.addEventListener("pointerdown", surPointeur);
    document.addEventListener("keydown", surTouche);
    return () => {
      document.removeEventListener("pointerdown", surPointeur);
      document.removeEventListener("keydown", surTouche);
    };
  }, [ouvert]);

  // Garde la recherche en cours, change le type, repart de la page 1.
  const adresse = (suivant: string) => {
    const suivants = new URLSearchParams(parametres.toString());
    if (suivant) suivants.set("type", suivant);
    else suivants.delete("type");
    suivants.delete("page");
    const requete = suivants.toString();
    return requete ? `/?${requete}` : "/";
  };

  return (
    <div ref={racine} className="relative">
      <button
        ref={bouton}
        onClick={() => setOuvert(!ouvert)}
        aria-expanded={ouvert}
        aria-controls={idMenu}
        className={CLASSES_BOUTON_FILTRE}
      >
        {typeActif ? (
          <>
            <span aria-hidden className={`size-2 rounded-full ${TYPES[typeActif].classe}`} />
            <span className="sr-only">Type : </span>
            {TYPES[typeActif].libelle}
          </>
        ) : (
          "Type"
        )}
        <ChevronDown
          {...ICONE}
          className={`text-texte-3 transition-transform duration-150 ease-doux ${ouvert ? "rotate-180" : ""}`}
        />
      </button>

      {ouvert && (
        <nav
          id={idMenu}
          aria-label="Filtrer par type"
          className="absolute right-0 top-full z-10 mt-2 grid w-[min(20rem,calc(100vw-2rem))] animate-menu grid-cols-2 gap-0.5 rounded-xl border border-trait bg-carte p-1.5 shadow-[0_8px_24px_rgb(0_0_0/0.08)] motion-reduce:animate-none"
        >
          <Link
            href={adresse("")}
            onClick={() => setOuvert(false)}
            aria-current={typeActif ? undefined : "true"}
            className={`${LIGNE} col-span-2 justify-between ${typeActif ? "text-texte-2" : "bg-releve font-medium"}`}
          >
            Tous les types
            {!typeActif && <Check {...ICONE} />}
          </Link>
          <span aria-hidden className="col-span-2 my-1 h-px bg-trait" />
          {Object.entries(TYPES).map(([cle, style]) => {
            const actif = cle === typeActif;
            return (
              <Link
                key={cle}
                href={adresse(cle)}
                onClick={() => setOuvert(false)}
                aria-current={actif ? "true" : undefined}
                className={`${LIGNE} ${actif ? "bg-releve font-medium" : "text-texte-2 hover:text-texte"}`}
              >
                <span aria-hidden className={`size-2 shrink-0 rounded-full ${style.classe}`} />
                <span className="flex-1">{style.libelle}</span>
                {actif && <Check {...ICONE} />}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
