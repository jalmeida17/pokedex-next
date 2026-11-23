import { TYPES } from "@/lib/types";
import IconeType from "./IconeType";

type Props = {
  type: string;
  encadre?: boolean; // avec un filet autour, pour la fiche et la sacoche
};

// Un type = son logo et son nom.
export default function BadgeType({ type, encadre = false }: Props) {
  const libelle = TYPES[type]?.libelle ?? type;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[13px] leading-5 text-texte-2 ${
        encadre ? "h-7 rounded-lg border border-trait bg-carte pl-1.5 pr-2.5" : ""
      }`}
    >
      <IconeType type={type} />
      {libelle}
    </span>
  );
}
