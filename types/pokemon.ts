// Types de l'application : ce que les composants manipulent.
export type Statistique = {
  nom: string;
  valeur: number;
};

export type Pokemon = {
  id: number;
  nom: string;
  image: string;
  types: string[];
  taille: number; // en mètres
  poids: number; // en kilogrammes
  stats: Statistique[];
};

// Type « brut » : la forme exacte de la réponse de la PokéAPI.
export type PokemonApi = {
  id: number;
  name: string;
  height: number; // en décimètres
  weight: number; // en hectogrammes
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: { other: { "official-artwork": { front_default: string | null } } };
};
