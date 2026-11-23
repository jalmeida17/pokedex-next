import type { Sensibilite } from "@/lib/pokeapi";
import BadgeType from "./BadgeType";

const SIGNES: Record<number, string> = { 4: "×4", 2: "×2", 0.5: "×½", 0.25: "×¼", 0: "×0" };

// Les forces et faiblesses du Pokémon, en trois groupes selon le multiplicateur de dégâts reçus.
export default function Sensibilites({ sensibilites }: { sensibilites: Sensibilite[] }) {
  const groupes = [
    { titre: "Faible contre", types: sensibilites.filter((s) => s.facteur > 1) },
    { titre: "Résiste à", types: sensibilites.filter((s) => s.facteur > 0 && s.facteur < 1) },
    { titre: "Insensible à", types: sensibilites.filter((s) => s.facteur === 0) },
  ].filter((groupe) => groupe.types.length > 0);

  return (
    <dl className="grid gap-4">
      {groupes.map((groupe) => (
        <div key={groupe.titre}>
          <dt className="mb-2 text-[13px] text-texte-3">{groupe.titre}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {groupe.types.map(({ type, facteur }) => (
              <span
                key={type}
                className="inline-flex h-7 items-center gap-2 rounded-lg border border-trait bg-carte pl-2.5 pr-2"
              >
                <BadgeType type={type} />
                <span className="font-mono text-xs tabular-nums text-texte-3">{SIGNES[facteur] ?? `×${facteur}`}</span>
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
