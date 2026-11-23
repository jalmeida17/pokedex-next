import type { Metadata } from "next";
import Link from "next/link";
import { BOUTON_PRIMAIRE } from "@/lib/styles";

export const metadata: Metadata = { title: "Page introuvable" };

export default function Introuvable() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="font-mono text-[13px] text-texte-3">404</p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight">Ce Pokémon s’est enfui</h1>
      <p className="mb-6 mt-2 text-[15px] text-texte-2">La page demandée n’existe pas</p>
      <Link href="/" className={BOUTON_PRIMAIRE}>
        Retour au Pokédex
      </Link>
    </div>
  );
}
