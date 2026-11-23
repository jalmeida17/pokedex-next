"use client";
import { useEffect } from "react";
import { useFavoris } from "@/stores/favoris";
import { useSacoche } from "@/stores/sacoche";

// Relit le localStorage après le premier affichage : le serveur et le navigateur
// rendent d'abord la même chose (stores vides), donc pas d'erreur d'hydratation.
export default function HydratationStores() {
  useEffect(() => {
    useFavoris.persist.rehydrate();
    useSacoche.persist.rehydrate();
  }, []);
  return null;
}
