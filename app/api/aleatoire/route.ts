import { connection, NextResponse } from "next/server";
import { recupererPokemon, TOTAL_POKEMONS } from "@/lib/pokeapi";

// GET /api/aleatoire : renvoie un Pokémon tiré au hasard, en JSON.
export async function GET() {
  // Attendre une vraie requête : sans cela, le tirage serait figé au build.
  await connection();
  const id = Math.floor(Math.random() * TOTAL_POKEMONS) + 1;
  const pokemon = await recupererPokemon(String(id));
  if (!pokemon) {
    return NextResponse.json({ erreur: "Pokémon introuvable" }, { status: 404 });
  }
  return NextResponse.json(pokemon);
}
