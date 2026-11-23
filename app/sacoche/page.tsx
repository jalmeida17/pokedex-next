import type { Metadata } from "next";
import CompteurSacoche from "@/components/CompteurSacoche";
import ContenuSacoche from "@/components/ContenuSacoche";
import TitrePage from "@/components/TitrePage";

export const metadata: Metadata = {
  title: "Ma sacoche",
  description: "Votre équipe de six Pokémon.",
};

export default function PageSacoche() {
  return (
    <>
      <TitrePage titre="Sacoche" exposant={<CompteurSacoche />}>
        Une équipe de six Pokémon, chacun avec son surnom
      </TitrePage>
      <ContenuSacoche />
    </>
  );
}
