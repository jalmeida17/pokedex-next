// Les styles de boutons, écrits une fois et partagés par tous les composants.
// Rayon 10 pour les contrôles, 8 pour les petits ; un survol = un changement de surface.

const BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 font-medium transition-[background-color,border-color,color,opacity,transform] duration-150 ease-doux active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";

// L'action principale : un aplat de la couleur du texte.
export const BOUTON_PRIMAIRE = `${BASE} h-10 rounded-[10px] bg-texte px-4 text-sm text-inverse hover:opacity-90`;

// Les autres actions : une surface avec un filet.
export const BOUTON_SECONDAIRE = `${BASE} h-10 rounded-[10px] border border-trait bg-carte px-4 text-sm text-texte hover:bg-releve`;

// La même, plus petite, pour l'en-tête et la pagination.
export const BOUTON_PETIT = `${BASE} h-8 rounded-lg border border-trait bg-carte px-3 text-[13px] text-texte hover:bg-releve`;

// Un bouton qui ne contient qu'une icône. La taille et la couleur s'ajoutent à part,
// pour ne jamais avoir deux classes qui se contredisent.
export const BOUTON_ICONE = `${BASE} border border-trait bg-carte hover:bg-releve`;
export const ICONE_PETITE = "size-8 rounded-lg"; // 32 px, sur les cartes
export const ICONE_GRANDE = "size-10 rounded-[10px]"; // 40 px, à côté d'un bouton
export const ICONE_NEUTRE = "text-texte-3 hover:text-texte";

// Le bouton icône d'un état actif : un aplat.
export const BOUTON_ICONE_PLEIN = `${BASE} size-8 rounded-lg bg-texte text-inverse hover:opacity-90`;

// Réglages communs des icônes lucide : une taille, une épaisseur.
export const ICONE = { size: 16, strokeWidth: 1.5, "aria-hidden": true } as const;
