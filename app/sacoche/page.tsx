import type { Metadata } from "next";
import ContenuSacoche from "@/components/ContenuSacoche";

export const metadata: Metadata = {
  title: "Ma sacoche",
  description: "Votre équipe de six Pokémon.",
};

export default function PageSacoche() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Ma sacoche</h1>
        <p className="mt-2 text-[15px] text-texte-2">Une équipe de six Pokémon, chacun avec son surnom</p>
      </div>
      <ContenuSacoche />
    </>
  );
}
