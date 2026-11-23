import BoutonHasard from "./BoutonHasard";
import BoutonTheme from "./BoutonTheme";
import Marque from "./Marque";

// L'en-tête n'existe que sur téléphone : le logo et deux boutons.
// Sur écran large, c'est BarreLaterale qui porte la navigation.
export default function EnTete() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-trait bg-fond/85 px-4 backdrop-blur-md sm:px-6 lg:hidden">
      <Marque />
      <div className="flex items-center gap-1">
        <BoutonHasard variante="icone" />
        <BoutonTheme />
      </div>
    </header>
  );
}
