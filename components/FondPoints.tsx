"use client";
import { useEffect, useRef } from "react";

// Le fond du site : une trame de points qui s'efface vers le bas,
// et des points rouges qui s'allument autour du curseur.
// Les deux calques sont fixes, derrière tout le contenu (styles dans app/globals.css).
export default function FondPoints() {
  const halo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = halo.current;
    // Pas de curseur sur un écran tactile : la trame seule suffit.
    if (!element || !window.matchMedia("(pointer: fine)").matches) return;

    let image = 0;
    const suivre = (evenement: PointerEvent) => {
      // Une mise à jour par image affichée, pas une par mouvement de souris.
      cancelAnimationFrame(image);
      image = requestAnimationFrame(() => {
        element.style.setProperty("--x", `${evenement.clientX}px`);
        element.style.setProperty("--y", `${evenement.clientY}px`);
        element.style.opacity = "1";
      });
    };
    const quitter = () => {
      element.style.opacity = "0";
    };

    window.addEventListener("pointermove", suivre, { passive: true });
    document.documentElement.addEventListener("pointerleave", quitter);
    return () => {
      cancelAnimationFrame(image);
      window.removeEventListener("pointermove", suivre);
      document.documentElement.removeEventListener("pointerleave", quitter);
    };
  }, []);

  return (
    <>
      <div aria-hidden className="fond-points" />
      <div aria-hidden ref={halo} className="fond-points-halo" />
    </>
  );
}
