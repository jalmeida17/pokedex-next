// Couche d'accès aux données, côté serveur.
// Chaque fonction est mise en cache un jour : la PokéAPI change très rarement.
import { cacheLife } from "next/cache";
import type { Pokemon, PokemonApi } from "@/types/pokemon";
import { API, versPokemon } from "./conversion";

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

type Maillon = {
  species: { name: string };
  evolves_to: Maillon[];
};

// Récursion : un maillon, puis tous ceux de ses évolutions.
function aplatir(maillon: Maillon): string[] {
  return [maillon.species.name, ...maillon.evolves_to.flatMap(aplatir)];
}

// Deux appels : l'espèce donne l'adresse de la chaîne, la chaîne donne les noms.
export async function recupererEvolutions(id: number): Promise<string[]> {
  "use cache";
  cacheLife("days");
  const espece = await appeler<{ evolution_chain: { url: string } }>(`/pokemon-species/${id}`);
  if (!espece) return [];
  const chaine = await appeler<{ chain: Maillon }>(espece.evolution_chain.url);
  return chaine ? aplatir(chaine.chain) : [];
}
