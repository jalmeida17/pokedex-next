// Les 18 types de Pokémon : libellé français et classe de couleur de la pastille.
// Les couleurs elles-mêmes sont déclarées dans app/globals.css (@theme).
export const TYPES: Record<string, { libelle: string; classe: string }> = {
  normal: { libelle: "Normal", classe: "bg-type-normal" },
  fire: { libelle: "Feu", classe: "bg-type-fire" },
  water: { libelle: "Eau", classe: "bg-type-water" },
  electric: { libelle: "Électrik", classe: "bg-type-electric" },
  grass: { libelle: "Plante", classe: "bg-type-grass" },
  ice: { libelle: "Glace", classe: "bg-type-ice" },
  fighting: { libelle: "Combat", classe: "bg-type-fighting" },
  poison: { libelle: "Poison", classe: "bg-type-poison" },
  ground: { libelle: "Sol", classe: "bg-type-ground" },
  flying: { libelle: "Vol", classe: "bg-type-flying" },
  psychic: { libelle: "Psy", classe: "bg-type-psychic" },
  bug: { libelle: "Insecte", classe: "bg-type-bug" },
  rock: { libelle: "Roche", classe: "bg-type-rock" },
  ghost: { libelle: "Spectre", classe: "bg-type-ghost" },
  dragon: { libelle: "Dragon", classe: "bg-type-dragon" },
  dark: { libelle: "Ténèbres", classe: "bg-type-dark" },
  steel: { libelle: "Acier", classe: "bg-type-steel" },
  fairy: { libelle: "Fée", classe: "bg-type-fairy" },
};

// La couleur d'un type sous forme de variable CSS, à poser dans --type.
export function couleurType(type: string | undefined): string {
  return type && type in TYPES ? `var(--color-type-${type})` : "var(--texte-3)";
}

// « #025 » à partir de 25.
export function formaterNumero(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}
