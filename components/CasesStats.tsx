import type { Statistique } from "@/types/pokemon";

const LIBELLES_COURTS: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Att. spé.",
  "special-defense": "Déf. spé.",
  speed: "Vitesse",
};

// Les statistiques en petites cases : la version compacte de BarresStats, pour quand la carte
// de la fiche n'a pas la place d'une troisième colonne. La meilleure statistique a une case plus claire.
// « @2xl: » dépend de la largeur de la carte (requête de conteneur), pas de celle de l'écran :
// six cases sur une rangée dès que la carte fait 672 px, deux rangées de trois en dessous.
export default function CasesStats({ stats }: { stats: Statistique[] }) {
  const meilleure = Math.max(...stats.map((stat) => stat.valeur));

  return (
    <dl className="grid grid-cols-3 gap-2 @2xl:grid-cols-6">
      {stats.map((stat) => {
        const enTete = stat.valeur === meilleure;
        return (
          <div key={stat.nom} className={`rounded-lg px-3 py-2 ${enTete ? "bg-releve" : "bg-carte"}`}>
            <dt className="truncate text-xs text-texte-2">{LIBELLES_COURTS[stat.nom] ?? stat.nom}</dt>
            <dd className={`font-mono text-[15px] tabular-nums ${enTete ? "font-semibold" : "font-medium"}`}>
              {stat.valeur}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
