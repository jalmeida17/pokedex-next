import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BOUTON_PETIT, ICONE } from "@/lib/styles";

type Props = {
  page: number;
  nombrePages: number;
  q: string;
  type: string;
};

// La page aussi vit dans l'adresse, avec la recherche et le type en cours.
function adresse({ q, type }: Props, page: number) {
  const parametres = new URLSearchParams();
  if (q) parametres.set("q", q);
  if (type) parametres.set("type", type);
  if (page > 1) parametres.set("page", String(page));
  const requete = parametres.toString();
  return requete ? `/?${requete}` : "/";
}

export default function Pagination(props: Props) {
  const { page, nombrePages } = props;
  if (nombrePages <= 1) return null;
  const inactif = `${BOUTON_PETIT} pointer-events-none opacity-40`;

  return (
    <nav
      className="mt-12 flex items-center justify-between border-t border-trait pt-6"
      aria-label="Pagination"
    >
      {page > 1 ? (
        <Link href={adresse(props, page - 1)} className={`${BOUTON_PETIT} pl-2`}>
          <ChevronLeft {...ICONE} />
          Précédent
        </Link>
      ) : (
        <span aria-disabled="true" className={`${inactif} pl-2`}>
          <ChevronLeft {...ICONE} />
          Précédent
        </span>
      )}
      <span className="font-mono text-[13px] tabular-nums text-texte-3" aria-current="page">
        <span className="sr-only">Page </span>
        {page}
        <span aria-hidden> / </span>
        <span className="sr-only"> sur </span>
        {nombrePages}
      </span>
      {page < nombrePages ? (
        <Link href={adresse(props, page + 1)} className={`${BOUTON_PETIT} pr-2`}>
          Suivant
          <ChevronRight {...ICONE} />
        </Link>
      ) : (
        <span aria-disabled="true" className={`${inactif} pr-2`}>
          Suivant
          <ChevronRight {...ICONE} />
        </span>
      )}
    </nav>
  );
}
