import type { Statistique } from "@/types/pokemon";

const LIBELLES: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Attaque spé.",
  "special-defense": "Défense spé.",
  speed: "Vitesse",
};
const MAXIMUM = 255; // la plus haute statistique de base possible

const LIGNE = "grid grid-cols-[6.5rem_2.5rem_1fr] items-center gap-3";

// Un seul accent dans le graphique : la meilleure statistique. Le reste est neutre.
export default function BarresStats({ stats }: { stats: Statistique[] }) {
  const meilleure = Math.max(...stats.map((stat) => stat.valeur));
  const total = stats.reduce((somme, stat) => somme + stat.valeur, 0);

  return (
    <dl className="grid gap-3">
      {stats.map((stat) => (
        <div key={stat.nom} className={LIGNE}>
          <dt className="text-sm text-texte-2">{LIBELLES[stat.nom] ?? stat.nom}</dt>
          <dd className="col-span-2 grid grid-cols-subgrid items-center">
            <span className="text-right font-mono text-sm tabular-nums">{stat.valeur}</span>
            <span aria-hidden className="block h-1.5 overflow-hidden rounded-full bg-releve">
              <span
                className={`block h-full rounded-full ${stat.valeur === meilleure ? "bg-accent" : "bg-texte"}`}
                style={{ width: `${Math.min(100, (stat.valeur / MAXIMUM) * 100)}%` }}
              />
            </span>
          </dd>
        </div>
      ))}
      <div className={`${LIGNE} mt-1 border-t border-trait pt-3`}>
        <dt className="text-sm text-texte-2">Total</dt>
        <dd className="text-right font-mono text-sm font-medium tabular-nums">{total}</dd>
      </div>
    </dl>
  );
}
