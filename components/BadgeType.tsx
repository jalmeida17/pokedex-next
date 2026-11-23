import { TYPES } from "@/lib/types";

type Props = {
  type: string;
  encadre?: boolean; // avec un filet autour, pour la fiche et la sacoche
};

// Un type = une pastille de couleur et son nom. La couleur reste dans la pastille.
export default function BadgeType({ type, encadre = false }: Props) {
  const style = TYPES[type] ?? { libelle: type, classe: "bg-texte-3" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[13px] leading-5 text-texte-2 ${
        encadre ? "h-7 rounded-lg border border-trait bg-carte px-2.5" : ""
      }`}
    >
      <span aria-hidden className={`size-2 shrink-0 rounded-full ${style.classe}`} />
      {style.libelle}
    </span>
  );
}
