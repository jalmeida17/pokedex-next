"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { TYPES } from "@/lib/types";
import IconeType from "./IconeType";

// Les 18 types, toujours visibles dans la colonne de gauche, sur deux colonnes.
// Ce sont des liens vers l'accueil : le type choisi vit dans l'adresse (?type=…).
// Cliquer sur le type actif le retire.
export default function TypesLateral() {
  const chemin = usePathname();
  const parametres = useSearchParams();
  const surAccueil = chemin === "/";
  const type = surAccueil ? (parametres.get("type") ?? "") : "";
  const typeActif = type in TYPES ? type : "";

  // Depuis l'accueil on garde la recherche en cours ; depuis une autre page on repart de zéro.
  const adresse = (suivant: string) => {
    const suivants = new URLSearchParams(surAccueil ? parametres.toString() : "");
    if (suivant === typeActif) suivants.delete("type");
    else suivants.set("type", suivant);
    suivants.delete("page");
    const requete = suivants.toString();
    return requete ? `/?${requete}` : "/";
  };

  return (
    <nav aria-label="Filtrer par type">
      <p className="mb-2 px-2 text-[13px] text-texte-3">Types</p>
      <ul className="grid grid-cols-2 gap-0.5">
        {Object.entries(TYPES).map(([cle, style]) => {
          const actif = cle === typeActif;
          return (
            <li key={cle}>
              <Link
                href={adresse(cle)}
                aria-current={actif ? "true" : undefined}
                className={`flex h-7 items-center gap-2 rounded-md px-2 text-[13px] transition-colors duration-150 ease-doux ${
                  actif ? "bg-releve font-medium text-texte" : "text-texte-2 hover:bg-releve hover:text-texte"
                }`}
              >
                <IconeType type={cle} />
                {style.libelle}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
