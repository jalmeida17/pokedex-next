import Link from "next/link";

// Le logo : un « P » blanc dans un carré arrondi rouge, dont la boucle est un anneau
// avec un point au centre (le bouton d'une Poké Ball). Il ramène à l'accueil.
// Le même dessin sert d'icône d'onglet : app/icon.svg.
export default function Marque() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden className="shrink-0">
        <rect width="24" height="24" rx="6.5" className="fill-accent" />
        <g fill="none" stroke="#fff" strokeLinecap="round">
          <path d="M8.3 7v10.5" strokeWidth="2.6" />
          <circle cx="13" cy="10.2" r="3.9" strokeWidth="2.4" />
        </g>
        <circle cx="13" cy="10.2" r="1.25" fill="#fff" />
      </svg>
      Pokédex
    </Link>
  );
}
