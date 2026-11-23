import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { TOTAL_POKEMONS } from "@/lib/pokeapi";
import { ICONE } from "@/lib/styles";

type Props = {
  id: number; // le numéro du Pokémon affiché
  noms: string[]; // tous les noms, dans l'ordre du Pokédex : noms[0] est le n° 1
};

const CASE = "h-7 min-w-9 items-center justify-center rounded-md px-1.5 font-mono text-xs tabular-nums";
const FLECHE =
  "inline-flex size-7 items-center justify-center rounded-md text-texte-2 transition-colors duration-150 ease-doux hover:bg-carte hover:text-texte";

// La bande de numéros en haut de la fiche : les quatre Pokémon d'avant, celui affiché,
// les quatre d'après, et une flèche de chaque côté. On feuillette le Pokédex sans revenir à la liste.
export default function BandeNumeros({ id, noms }: Props) {
  const numeros = Array.from({ length: 9 }, (_, i) => id - 4 + i).filter((n) => n >= 1 && n <= TOTAL_POKEMONS);
  const adresse = (numero: number) => `/pokemon/${noms[numero - 1]}`;

  return (
    <nav aria-label="Pokémon voisins" className="flex items-center gap-0.5">
      {id > 1 && (
        <Link href={adresse(id - 1)} aria-label={`Précédent : ${noms[id - 2]}`} className={FLECHE}>
          <ChevronLeft {...ICONE} />
        </Link>
      )}
      {numeros.map((numero) => {
        const ici = numero === id;
        // Sur téléphone, on ne garde que deux numéros de chaque côté.
        const proche = Math.abs(numero - id) <= 2;
        return (
          <Link
            key={numero}
            href={adresse(numero)}
            aria-current={ici ? "page" : undefined}
            aria-label={`N° ${numero} : ${noms[numero - 1]}`}
            title={noms[numero - 1]}
            className={`${CASE} ${proche ? "inline-flex" : "hidden sm:inline-flex"} transition-colors duration-150 ease-doux ${
              ici ? "bg-texte font-semibold text-inverse" : "text-texte-3 hover:bg-carte hover:text-texte"
            }`}
          >
            {String(numero).padStart(3, "0")}
          </Link>
        );
      })}
      {id < TOTAL_POKEMONS && (
        <Link href={adresse(id + 1)} aria-label={`Suivant : ${noms[id]}`} className={FLECHE}>
          <ChevronRight {...ICONE} />
        </Link>
      )}
    </nav>
  );
}
