"use client";
import { useMemo } from "react";
import { useSacoche } from "@/stores/sacoche";

// Les types présents dans la sacoche, sans doublon.
export function useTypesCouverts(): string[] {
  const equipe = useSacoche((etat) => etat.equipe);
  return useMemo(() => [...new Set(equipe.flatMap((membre) => membre.types))], [equipe]);
}
