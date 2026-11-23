import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import EnTete from "@/components/EnTete";
import HydratationStores from "@/components/HydratationStores";
import PiedDePage from "@/components/PiedDePage";
import { CLE_THEME } from "@/lib/theme";
import "./globals.css";

// Geist pour l'interface, Geist Mono pour les numéros et les chiffres.
const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Exécuté avant le premier affichage : applique le thème choisi par l'utilisateur,
// pour que la page ne clignote pas du clair au sombre (ou l'inverse) au chargement.
const SCRIPT_THEME = `try{var t=localStorage.getItem("${CLE_THEME}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata: Metadata = {
  title: { default: "Pokédex", template: "%s · Pokédex" },
  description: "Les 1 025 Pokémon, leurs types et leurs statistiques.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : le script ci-dessous peut ajouter data-theme avant React.
    <html
      lang="fr"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script>{SCRIPT_THEME}</script>
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-30 focus:rounded-lg focus:bg-texte focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-inverse"
        >
          Aller au contenu
        </a>
        <HydratationStores />
        <EnTete />
        <main id="contenu" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </main>
        <PiedDePage />
      </body>
    </html>
  );
}
