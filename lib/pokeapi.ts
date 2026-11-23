// Couche d'accès aux données, côté serveur.
// Chaque fonction est mise en cache un jour : la PokéAPI change très rarement.
import { cacheLife } from "next/cache";
import type { Pokemon, PokemonApi } from "@/types/pokemon";
import { API, versPokemon } from "./conversion";
import { TYPES } from "./types";

export const TOTAL_POKEMONS = 1025;

// Renvoie null pour un 404 (« introuvable ») et lève une erreur pour le reste (« en panne »).
async function appeler<T>(adresse: string): Promise<T | null> {
  const reponse = await fetch(adresse.startsWith("http") ? adresse : `${API}${adresse}`);
  if (reponse.status === 404) return null;
  if (!reponse.ok) {
    throw new Error(`La PokéAPI a répondu ${reponse.status} pour ${adresse}`);
  }
  return reponse.json() as Promise<T>;
}

export async function recupererPokemon(nom: string): Promise<Pokemon | null> {
  "use cache";
  cacheLife("days");
  const brut = await appeler<PokemonApi>(`/pokemon/${encodeURIComponent(nom.toLowerCase())}`);
  return brut ? versPokemon(brut) : null;
}

// Appels en parallèle ; les Pokémon introuvables sont écartés.
export async function recupererPlusieurs(noms: string[]): Promise<Pokemon[]> {
  const pokemons = await Promise.all(noms.map((nom) => recupererPokemon(nom)));
  return pokemons.filter((p): p is Pokemon => p !== null);
}

export async function recupererTousLesNoms(): Promise<string[]> {
  "use cache";
  cacheLife("days");
  const page = await appeler<{ results: { name: string }[] }>(`/pokemon?limit=${TOTAL_POKEMONS}`);
  if (!page) throw new Error("La liste des Pokémon est introuvable");
  return page.results.map((p) => p.name);
}

// Les noms d'un type, dans l'ordre du Pokédex et limités aux 1 025 Pokémon.
export async function recupererNomsParType(type: string): Promise<string[]> {
  "use cache";
  cacheLife("days");
  const [tous, donnees] = await Promise.all([
    recupererTousLesNoms(),
    appeler<{ pokemon: { pokemon: { name: string } }[] }>(`/type/${type}`),
  ]);
  if (!donnees) return [];
  const duType = new Set(donnees.pokemon.map((p) => p.pokemon.name));
  return tous.filter((nom) => duType.has(nom));
}

// ---------- L'espèce : ce que la PokéAPI sait dire en français ----------

type Traduit = { language: { name: string } };

type EspeceApi = {
  names: (Traduit & { name: string })[];
  genera: (Traduit & { genus: string })[];
  flavor_text_entries: (Traduit & { flavor_text: string })[];
  generation: { name: string }; // « generation-i »
  evolution_chain: { url: string };
};

export type Espece = {
  nomFr: string | null; // « Dracaufeu »
  nomJa: string | null; // « リザードン », affiché en très grand derrière le Pokémon
  categorie: string | null; // « Pokémon Flamme »
  description: string | null; // le texte du Pokédex du jeu le plus récent
  region: string | null; // la région de la génération où le Pokémon est apparu
  chaine: string; // l'adresse de la chaîne d'évolution
};

// La région de chaque génération, avec son nom français.
const REGIONS: Record<string, string> = {
  "generation-i": "Kanto",
  "generation-ii": "Johto",
  "generation-iii": "Hoenn",
  "generation-iv": "Sinnoh",
  "generation-v": "Unys",
  "generation-vi": "Kalos",
  "generation-vii": "Alola",
  "generation-viii": "Galar",
  "generation-ix": "Paldea",
};

export async function recupererEspece(id: number): Promise<Espece | null> {
  "use cache";
  cacheLife("days");
  const brut = await appeler<EspeceApi>(`/pokemon-species/${id}`);
  if (!brut) return null;

  const enFrancais = (entree: Traduit) => entree.language.name === "fr";
  const enJaponais = (entree: Traduit) => entree.language.name === "ja-Hrkt" || entree.language.name === "ja";
  return {
    nomFr: brut.names.find(enFrancais)?.name ?? null,
    nomJa: brut.names.find(enJaponais)?.name ?? null,
    region: REGIONS[brut.generation.name] ?? null,
    categorie: brut.genera.find(enFrancais)?.genus ?? null,
    // Les textes contiennent des retours à la ligne du jeu : on les remplace par des espaces.
    description: brut.flavor_text_entries.filter(enFrancais).at(-1)?.flavor_text.replace(/\s+/g, " ").trim() ?? null,
    chaine: brut.evolution_chain.url,
  };
}

// ---------- Les évolutions ----------

type Maillon = {
  species: { name: string };
  evolves_to: Maillon[];
};

// Récursion : range chaque maillon dans son étape (0 = la forme de base), puis descend dans ses évolutions.
// Évoli donne [[eevee], [vaporeon, jolteon, flareon, …]].
function parEtapes(maillon: Maillon, profondeur = 0, etapes: string[][] = []): string[][] {
  (etapes[profondeur] ??= []).push(maillon.species.name);
  for (const suivant of maillon.evolves_to) parEtapes(suivant, profondeur + 1, etapes);
  return etapes;
}

// Deux appels : l'espèce donne l'adresse de la chaîne, la chaîne donne les noms, étape par étape.
export async function recupererEvolutions(id: number): Promise<string[][]> {
  "use cache";
  cacheLife("days");
  const espece = await recupererEspece(id);
  if (!espece) return [];
  const chaine = await appeler<{ chain: Maillon }>(espece.chaine);
  return chaine ? parEtapes(chaine.chain) : [];
}

// ---------- Les forces et faiblesses ----------

type Relations = "double_damage_from" | "half_damage_from" | "no_damage_from";
type TypeApi = { damage_relations: Record<Relations, { name: string }[]> };

export type Sensibilite = { type: string; facteur: number }; // facteur : 4, 2, 0.5, 0.25 ou 0

// Pour chaque type attaquant, par combien ses dégâts sont multipliés contre un Pokémon de ces types.
// Avec deux types, les facteurs se multiplient : Feu et Vol face à Roche donne 2 × 2 = 4.
export async function recupererSensibilites(types: string[]): Promise<Sensibilite[]> {
  "use cache";
  cacheLife("days");
  const reponses = await Promise.all(types.map((type) => appeler<TypeApi>(`/type/${type}`)));

  const facteurs = new Map<string, number>();
  const appliquer = (attaquants: { name: string }[], facteur: number) => {
    for (const { name } of attaquants) facteurs.set(name, (facteurs.get(name) ?? 1) * facteur);
  };
  for (const reponse of reponses) {
    if (!reponse) continue;
    appliquer(reponse.damage_relations.double_damage_from, 2);
    appliquer(reponse.damage_relations.half_damage_from, 0.5);
    appliquer(reponse.damage_relations.no_damage_from, 0);
  }

  return [...facteurs]
    .map(([type, facteur]) => ({ type, facteur }))
    .filter((sensibilite) => sensibilite.facteur !== 1 && sensibilite.type in TYPES)
    .sort((a, b) => b.facteur - a.facteur);
}
