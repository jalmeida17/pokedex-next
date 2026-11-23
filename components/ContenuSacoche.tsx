"use client";
import { Plus, X } from "lucide-react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import BadgeType from "@/components/BadgeType";
import BoutonVider from "@/components/BoutonVider";
import { useEstHydrate } from "@/hooks/useEstHydrate";
import { useTypesCouverts } from "@/hooks/useTypesCouverts";
import { BOUTON_ICONE, ICONE, ICONE_NEUTRE, ICONE_PETITE } from "@/lib/styles";
import { couleurType, formaterNumero } from "@/lib/types";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

const GRILLE = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3";

export default function ContenuSacoche() {
  const equipe = useSacoche((etat) => etat.equipe);
  const retirer = useSacoche((etat) => etat.retirer);
  const renommer = useSacoche((etat) => etat.renommer);
  const hydrate = useEstHydrate(useSacoche);
  const typesCouverts = useTypesCouverts();

  // Avant la lecture du localStorage, on ne sait pas encore ce que contient la sacoche.
  if (!hydrate) {
    return (
      <ul className={`${GRILLE} mt-16 animate-pulse`} aria-busy="true" aria-label="Chargement de la sacoche">
        {Array.from({ length: TAILLE_SACOCHE }, (_, i) => (
          <li key={i} className="h-24 rounded-2xl bg-releve" />
        ))}
      </ul>
    );
  }

  const emplacementsLibres = TAILLE_SACOCHE - equipe.length;

  return (
    <>
      <div className="mb-6 flex min-h-8 flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm text-texte-2">
            <span className="font-mono tabular-nums text-texte">
              {equipe.length}
            </span>{" "}
            sur {TAILLE_SACOCHE} Pokémon
            {typesCouverts.length > 0 &&
              ` · ${typesCouverts.length} type${typesCouverts.length > 1 ? "s" : ""} couvert${typesCouverts.length > 1 ? "s" : ""}`}
          </p>
          {typesCouverts.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {typesCouverts.map((type) => (
                <BadgeType key={type} type={type} />
              ))}
            </div>
          )}
        </div>
        <BoutonVider />
      </div>

      <ul className={GRILLE}>
        {equipe.map((membre) => (
          <li
            key={membre.id}
            style={{ "--type": couleurType(membre.types[0]) } as CSSProperties}
            className="flex items-center gap-3 rounded-2xl border border-trait bg-carte p-2 pr-3"
          >
            <Link
              href={`/pokemon/${membre.nom}`}
              aria-label={`Voir la fiche de ${membre.nom}`}
              className="teinte-type relative size-20 shrink-0 overflow-hidden rounded-lg"
            >
              <Image
                src={membre.image}
                alt=""
                width={96}
                height={96}
                sizes="80px"
                className="absolute inset-0 size-full object-contain p-1.5"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="encre-type px-2 font-mono text-xs tabular-nums">{formaterNumero(membre.id)}</p>
              <input
                value={membre.surnom}
                onChange={(e) => renommer(membre.id, e.target.value)}
                placeholder={membre.nom}
                maxLength={12}
                aria-label={`Surnom de ${membre.nom}`}
                className="h-7 w-full rounded-md bg-transparent px-2 text-[15px] font-medium capitalize placeholder:text-texte transition-colors duration-150 ease-doux hover:bg-releve focus:bg-releve focus:outline-none focus:placeholder:text-texte-3"
              />
              <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 px-2">
                {membre.types.map((type) => (
                  <BadgeType key={type} type={type} />
                ))}
              </div>
            </div>
            <button
              onClick={() => retirer(membre.id)}
              aria-label={`Retirer ${membre.nom} de la sacoche`}
              className={`${BOUTON_ICONE} ${ICONE_PETITE} ${ICONE_NEUTRE}`}
            >
              <X {...ICONE} />
            </button>
          </li>
        ))}

        {Array.from({ length: emplacementsLibres }, (_, i) => (
          <li key={`libre-${i}`}>
            <Link
              href="/"
              className="flex h-24 items-center justify-center gap-2 rounded-2xl border border-dashed border-trait-fort text-sm text-texte-3 transition-colors duration-150 ease-doux hover:bg-releve hover:text-texte"
            >
              <Plus {...ICONE} />
              Emplacement libre
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
