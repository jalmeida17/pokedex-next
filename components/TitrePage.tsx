type Props = {
  titre: string;
  exposant?: React.ReactNode; // un compte, en petit et en mono, accroché au titre
  children?: React.ReactNode; // la phrase sous le titre
};

// Le grand titre d'une page, avec son compte en exposant : « Pokédex ¹⁰²⁵ ».
export default function TitrePage({ titre, exposant, children }: Props) {
  return (
    <div className="mb-8 sm:mb-10">
      <h1 className="text-5xl font-medium leading-none tracking-[-0.04em] sm:text-7xl">
        {titre}
        {exposant && (
          <span className="ml-2 inline-block align-top font-mono text-sm font-normal leading-5 tracking-normal tabular-nums text-texte-3 sm:ml-3 sm:mt-1 sm:text-base">
            {exposant}
          </span>
        )}
      </h1>
      {children && <p className="mt-3 max-w-xl text-[15px] text-texte-2 sm:mt-4">{children}</p>}
    </div>
  );
}
