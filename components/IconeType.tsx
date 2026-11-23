import { TYPES } from "@/lib/types";

type Props = {
  type: string;
  taille?: "s" | "m" | "l"; // 16, 20 ou 24 px
};

const TAILLES = { s: "size-4", m: "size-5", l: "size-6" };

// Le logo d'un type : son symbole en blanc sur un disque de sa couleur.
// Les 18 symboles sont des fichiers SVG dans public/types/. On s'en sert comme d'un pochoir
// (mask) sur un carré blanc : le dessin prend la forme du symbole, quelle que soit sa couleur d'origine.
// Sur la carte en aplat de la fiche, le disque gagne un contour blanc (variable --anneau-pastille).
export default function IconeType({ type, taille = "s" }: Props) {
  const classe = TYPES[type]?.classe ?? "bg-texte-3";
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center rounded-full ring-1 ring-(--anneau-pastille) ${classe} ${TAILLES[taille]}`}
    >
      {type in TYPES && (
        <span
          className="size-[62%] bg-white"
          style={{
            maskImage: `url(/types/${type}.svg)`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      )}
    </span>
  );
}
