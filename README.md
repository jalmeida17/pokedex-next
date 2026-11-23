# Pokédex

Un Pokédex des 1 025 Pokémon, construit avec **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS 4** et **Zustand**. Les données viennent de la [PokéAPI](https://pokeapi.co), publique et sans clé.

**En ligne : [pokedex-next-sand.vercel.app](https://pokedex-next-sand.vercel.app)**

## Fonctionnalités

- **Liste paginée** : 24 Pokémon par page, avec illustration, numéro et types.
- **Recherche et filtre par type**, rangés dans l'adresse (`/?q=char&type=fire&page=2`) : un lien se partage et survit au rechargement.
- **Fiche détaillée** (`/pokemon/pikachu`) : taille, poids, statistiques en barres, chaîne d'évolution.
- **Favoris** (`/favoris`) et **sacoche** (`/sacoche`) avec Zustand, conservés dans le navigateur. La sacoche accepte six Pokémon au maximum, sans doublon, avec un surnom par membre.
- **Au hasard** : un bouton qui appelle la route d'API maison `/api/aleatoire`.
- États de **chargement** (squelettes), d'**erreur** (bouton « Réessayer ») et page **404**.
- Responsive, thème sombre automatique, navigation au clavier (touche `/` pour la recherche).

## Interface

Un catalogue calme, où **la couleur dit le type** : chaque Pokémon porte la couleur de son premier type sur sa vignette, son numéro et ses barres de statistiques. Le reste de l'interface est neutre.

- **Structure** : sur écran large, une colonne fixe à gauche porte toute la navigation (recherche, pages, les 18 types, et l'équipe de six toujours visible en bas) ; la page ne montre que le contenu. Sur téléphone : un en-tête, le contenu, et une barre d'onglets en bas.
- **Fiche** : un bandeau à la couleur du type, quatre chiffres clés, puis les statistiques et la chaîne d'évolution côte à côte.
- **Couleurs** : une rampe de gris, trois rôles de texte, un accent rare (le rouge du Pokédex), déclarés en variables CSS dans `app/globals.css`. Le thème sombre ne change que ces variables, aucun composant n'a de variante `dark:`.
- **Teinte par type** : la variable `--type` est posée sur la carte ou la fiche ; les utilitaires `teinte-type` et `encre-type` s'en servent.
- **Titres** : un grand titre par page, avec son compte en petit à côté (`components/TitrePage.tsx`).
- **Typographie** : Geist pour l'interface, Geist Mono pour les numéros et les chiffres.
- **Types** : le logo officiel de chaque type (symbole blanc sur un disque de sa couleur), dans les vignettes, la fiche et les filtres.
- **Boutons** : les styles sont écrits une fois dans `lib/styles.ts`. Icônes [lucide](https://lucide.dev), une taille et une épaisseur.
- **Mouvement** : une seule courbe, des survols en changement de surface, une entrée discrète du contenu.

La direction suit la méthode [unslop](https://github.com/heydamir/unslop) de Damir Sokolovsky (CC BY 4.0).

## Crédits

- Données et illustrations : [PokéAPI](https://pokeapi.co).
- Logos des types : [pokemon-type-svg-icons](https://github.com/duiker101/pokemon-type-svg-icons), copiés dans `public/types/`.
- Pokémon et les noms des Pokémon sont des marques de Nintendo. Projet scolaire, sans but commercial.

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:3000
```

Avant de publier :

```bash
npm run lint     # signale les erreurs de code
npm run build    # construit la version de production
npm start        # la lance en local
```

Le build pré-génère les fiches des 151 premiers Pokémon : il a besoin d'un accès à Internet.

## Organisation du code

| Dossier | Rôle |
|---|---|
| `app/` | Les pages (un dossier = une adresse), le layout, `loading`, `error`, `not-found`, la route d'API |
| `components/` | Les composants d'interface ; ceux qui commencent par `"use client"` s'exécutent dans le navigateur |
| `lib/` | La couche d'accès aux données (`pokeapi.ts` côté serveur, avec cache ; `pokeapi-client.ts` côté navigateur) et la conversion des types |
| `types/` | Les types TypeScript : `PokemonApi` (réponse brute) et `Pokemon` (type de l'application) |
| `stores/` | Les stores Zustand : favoris et sacoche, avec leurs règles |
| `hooks/` | Les hooks personnalisés : `usePokemons`, `useRappelTemporise`, `useRaccourci`, `useEstHydrate`, `useTypesCouverts` |

## Choix techniques

- **Composants serveur par défaut** : les données sont chargées sur le serveur et mises en cache un jour (`"use cache"` + `cacheLife("days")`). Seuls les éléments interactifs sont des composants client.
- **`Suspense`** : la coque de la page s'affiche tout de suite, les résultats arrivent ensuite.
- **404 ou panne** : la couche de données renvoie `null` pour un Pokémon introuvable (page 404) et lève une erreur pour une panne de l'API (page d'erreur).
- **Hydratation** : les stores démarrent vides (`skipHydration`) puis relisent le `localStorage` après le premier affichage, pour que le serveur et le navigateur rendent la même chose.
