"use client";
import { BOUTON_PRIMAIRE } from "@/lib/styles";

// Affiché quand une page lève une erreur (par exemple la PokéAPI en panne).
export default function Erreur({ error, retry }: { error: unknown; retry: () => void }) {
  const message = error instanceof Error ? error.message : "Erreur inconnue";
  return (
    <div className="mx-auto max-w-md py-24 text-center" role="alert">
      <p className="font-mono text-[13px] text-texte-3">Erreur</p>
      <h2 className="mt-2 text-2xl font-medium tracking-tight">Le Pokédex ne répond plus</h2>
      <p className="mb-6 mt-2 text-[15px] text-texte-2">{message}</p>
      <button onClick={() => retry()} className={BOUTON_PRIMAIRE}>
        Réessayer
      </button>
    </div>
  );
}
