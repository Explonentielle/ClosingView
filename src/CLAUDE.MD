# CLAUDE.md — Instructions pour Claude Code

## Contexte du projet

Application web **SaaS** frontend-only développée avec **React + Supabase**.
Le client a fourni une maquette réalisée sur **Lovable** (repo Git récupéré).
L'objectif est de **compléter les features manquantes** et de **refactoriser le code existant** pour le rendre propre, maintenable et production-ready.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | React (Vite) |
| UI | shadcn/ui + Tailwind CSS |
| Backend / BDD | Supabase (Auth, Database, Storage) |
| Langage | TypeScript (souple) |
| Tests | Aucun pour l'instant |

---

## Conventions de code

### TypeScript
- TypeScript **souple** : typer les props, les retours de fonctions et les réponses Supabase.
- Préférer `interface` pour les shapes de données, `type` pour les unions/aliases.
- Éviter `any` sauf cas justifié avec un commentaire `// TODO: typer`.

### Composants React
- **Un composant = un fichier**.
- Nommage en **PascalCase** pour les composants, **camelCase** pour les hooks et utilitaires.
- Extraire la logique dans des **custom hooks** (`use*.ts`) pour garder les composants légers.

### Styling — règle fondamentale du refacto
Lors de tout refacto, **aucun style ne doit rester dans le JSX** :
- Tout `style={{...}}` inline est **interdit** — le supprimer systématiquement.
- Les classes Tailwind simples restent dans le JSX.
- Les classes Tailwind complexes, conditionnelles ou réutilisables sont extraites dans un fichier **`MonComposant.styles.ts`** colocalisé, en utilisant `cva` et `cn`.

```
components/[feature]/
├── MonComposant.tsx
└── MonComposant.styles.ts
```

### Supabase
- Toutes les requêtes Supabase passent par des **fonctions dédiées** dans `src/services/`.
- Ne jamais appeler Supabase directement dans un composant UI.
- Gérer systématiquement les cas d'erreur (`if (error) ...`).

### Structure des fichiers
```
src/
├── components/
│   ├── ui/                    # Composants shadcn/ui (ne pas modifier)
│   └── [feature]/
│       ├── MonComposant.tsx
│       └── MonComposant.styles.ts
├── hooks/                     # Custom hooks réutilisables
├── lib/
│   ├── supabase.ts            # Client Supabase
│   └── utils.ts               # cn() et utilitaires généraux
├── services/                  # Fonctions d'accès aux données Supabase
└── types/                     # Types et interfaces globaux
```

---

## Workflow de développement

### Priorités dans l'ordre
1. **Compléter les features manquantes** identifiées par rapport à la maquette Lovable.
2. **Refactoriser** le code existant (styles inline, logique dans les composants, duplications).
3. Maintenir la **cohérence visuelle** avec la maquette d'origine.

### Règles de refacto
- Procéder **feature par feature**.
- Extraire systématiquement les styles du JSX (voir règle styling ci-dessus).
- Conserver le comportement existant — pas de régression visuelle ou fonctionnelle.
- Supprimer le code mort, les imports inutilisés, les `console.log` de debug.
- Décomposer les composants de plus de **150 lignes**.

---

## Ce que Claude NE doit PAS faire

- Laisser des `style={{...}}` dans le JSX après un refacto.
- Modifier les fichiers dans `components/ui/` (shadcn/ui générés).
- Appeler Supabase directement dans un composant UI.
- Introduire une librairie externe sans validation explicite.
- Écrire des tests (hors scope pour l'instant).

---

## Réponses attendues de Claude

- Expliquer **brièvement** ce qui est fait et pourquoi.
- Signaler si une approche alternative serait meilleure.
- Si une information manque, **poser la question** avant de coder.