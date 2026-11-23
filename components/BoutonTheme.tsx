"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { BOUTON_ICONE, ICONE, ICONE_NEUTRE, ICONE_PETITE } from "@/lib/styles";

// Passe du thème clair au thème sombre. L'icône montre le thème vers lequel on va.
export default function BoutonTheme() {
  const { theme, basculer } = useTheme();
  const versClair = theme === "dark";

  return (
    <button
      onClick={basculer}
      aria-label={versClair ? "Passer au thème clair" : "Passer au thème sombre"}
      className={`${BOUTON_ICONE} ${ICONE_PETITE} ${ICONE_NEUTRE}`}
    >
      {versClair ? <Sun {...ICONE} /> : <Moon {...ICONE} />}
    </button>
  );
}
