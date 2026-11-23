import type { Statistique } from "@/types/pokemon";

const LIBELLES_STATS: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Attaque spé.",
  "special-defense": "Défense spé.",
  speed: "Vitesse",
};
const MAXIMUM = 255; // la plus haute statistique de base possible

// Les barres prennent la couleur du type (variable --type posée par la fiche).
// La meilleure statistique ressort : barre pleine, libellé et chiffre en gras.
export default function BarresStats({ stats }: { stats: Statistique[] }) {
  const meilleure = Math.max(...stats.map((stat) => stat.valeur));

  return (
    <dl className="grid gap-3.5">
      {stats.map((stat) => {
        const enTete = stat.valeur === meilleure;
        return (
          <div key={stat.nom} className="grid grid-cols-[5.75rem_2.25rem_1fr] items-center gap-3">
            <dt className={`text-sm ${enTete ? "font-medium text-texte" : "text-texte-2"}`}>
              {LIBELLES_STATS[stat.nom] ?? stat.nom}
            </dt>
            <dd className="col-span-2 grid grid-cols-subgrid items-center">
              <span className={`text-right font-mono text-sm tabular-nums ${enTete ? "font-semibold" : ""}`}>
                {stat.valeur}
              </span>
              <span aria-hidden className="block h-1.5 overflow-hidden rounded-full bg-releve">
                <span
                  className={`block h-full rounded-full bg-(--type,var(--texte)) ${enTete ? "" : "opacity-55"}`}
                  style={{ width: `${Math.min(100, (stat.valeur / MAXIMUM) * 100)}%` }}
                />
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
