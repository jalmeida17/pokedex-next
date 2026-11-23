"use client";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { couleurType } from "@/lib/types";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

// L'équipe (la sacoche), toujours visible en bas de la colonne de gauche :
// six emplacements, comme l'équipe du dresseur dans le jeu. Un clic ouvre la fiche.
export default function EquipeLaterale() {
  const equipe = useSacoche((etat) => etat.equipe);
  const emplacements = Array.from({ length: TAILLE_SACOCHE }, (_, i) => equipe[i]);

  return (
    <section aria-label="Mon équipe" className="mt-auto border-t border-trait px-2 pt-4">
      <Link
        href="/sacoche"
        className="mb-3 flex items-center justify-between text-[13px] text-texte-2 transition-colors duration-150 ease-doux hover:text-texte"
      >
        Mon équipe
        <span className="font-mono text-xs tabular-nums text-texte-3">
          {equipe.length}/{TAILLE_SACOCHE}
        </span>
      </Link>
      <ul className="grid grid-cols-3 gap-2">
        {emplacements.map((membre, i) => (
          <li key={membre?.id ?? `libre-${i}`}>
            {membre ? (
              <Link
                href={`/pokemon/${membre.nom}`}
                title={membre.surnom || membre.nom}
                aria-label={`Voir la fiche de ${membre.nom}`}
                style={{ "--type": couleurType(membre.types[0]) } as CSSProperties}
                className="teinte-type relative block aspect-square overflow-hidden rounded-lg transition-shadow duration-200 ease-doux hover:shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--type)_60%,transparent)]"
              >
                <Image
                  src={membre.image}
                  alt=""
                  width={96}
                  height={96}
                  sizes="72px"
                  className="absolute inset-0 size-full object-contain p-1"
                />
              </Link>
            ) : (
              <span aria-hidden className="block aspect-square rounded-lg border border-dashed border-trait-fort" />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
