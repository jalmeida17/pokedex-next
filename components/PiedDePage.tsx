export default function PiedDePage() {
  return (
    <footer className="border-t border-trait">
      <p className="mx-auto max-w-[84rem] px-4 py-6 text-[13px] text-texte-3 sm:px-6 lg:px-10">
        Données de la{" "}
        <a
          href="https://pokeapi.co"
          className="text-texte-2 underline decoration-trait-fort underline-offset-4 transition-colors duration-150 ease-doux hover:text-texte"
        >
          PokéAPI
        </a>{" "}
        · Projet de cours Next.js
      </p>
    </footer>
  );
}
