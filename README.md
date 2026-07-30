# Résidence du Chêne Renens

Application web communautaire pour suivre les problèmes concrets de la
résidence, compter les foyers concernés et partager une synthèse avec la
gérance.

Le site est public, sans compte utilisateur. Il ne publie aucun code d’accès et
n’affiche jamais les numéros d’appartement.

## Fonctionnalités

- catalogue recherchable et filtrable des problèmes ;
- détail partageable avec une URL directe ;
- statuts `En cours` et `Résolu` ;
- signalement « Je suis concerné·e » par bâtiment ;
- total et ventilation des foyers concernés ;
- synthèse copiable pour WhatsApp ou e-mail ;
- informations pratiques et contacts utiles ;
- thème clair ou sombre automatique selon la saison.

## Architecture

Le vocabulaire métier est documenté dans [CONTEXT.md](./CONTEXT.md). Les choix
structurants sont conservés dans [docs/adr](./docs/adr).

```text
app/
├── components/
│   ├── ui/                     Primitives UI partagées
│   └── AppMenu.tsx             Navigation partagée
├── features/issues/
│   ├── components/             Rendu et styles CSS Modules
│   ├── hooks/                  Orchestration React
│   ├── model/                  Catalogue et règles métier
│   └── data/                   Registres et adaptateurs
├── contacts/
├── infos-pratiques/
└── page.tsx                    Entrée du suivi
```

Le développement utilise des données locales par défaut. La production utilise
Firebase. Les deux adaptateurs satisfont la même interface ; le rendu ne connaît
pas leur implémentation.

Les créations et corrections de fond passent par pull request.

## Développement local

Pré-requis : Node.js 22 ou plus récent.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000).

`NEXT_PUBLIC_ISSUE_DATA_SOURCE=local` isole complètement le développement de
Firebase. Les signalements de démonstration et ceux ajoutés localement sont
stockés dans le navigateur sous la clé `residence-dev-concern-reports`. Les
surcharges de statut locales utilisent `residence-dev-status-overrides`.

Pour tester volontairement Firebase en local :

```bash
NEXT_PUBLIC_ISSUE_DATA_SOURCE=firebase npm run dev
```

Cette commande lit et écrit les données de production. Ne l’utilisez que
délibérément.

## Modifier le catalogue

Les problèmes se trouvent dans
[`app/features/issues/model/catalogue.ts`](./app/features/issues/model/catalogue.ts).

Chaque entrée contient :

- un identifiant stable en minuscules avec tirets ;
- un titre, un résumé et des détails factuels ;
- une catégorie ;
- un statut `active` ou `resolved` ;
- la date approximative de première mention ;
- les foyers déjà connus avant la mise en ligne.

N’ajoutez jamais un nom de locataire, un numéro d’appartement, un code d’accès
ou une copie brute des conversations WhatsApp.

## Vérifications

```bash
npm run check
```

Cette commande exécute ESLint, les tests du domaine et le build de production.

## Sauvegarde Firestore

```bash
npm run db:snapshot
```

Cette commande met à jour le fichier versionné
`data/firestore-snapshot.json` avec uniquement `residence_issue_reports` et
`residence_issue_statuses`. L’historique Git permet ainsi de retrouver les
états précédents. Un workflow GitHub exécute aussi cette sauvegarde à chaque
push sur `main` et conserve le fichier produit comme artefact pendant 90
jours. Les autres collections de la base partagée ne sont jamais lues.

## Firebase

La configuration web Firebase dans `app/lib/firebase.ts` est publique par
conception. La sécurité repose sur les règles Firestore, pas sur la
dissimulation de cette configuration.

L’extrait minimal des règles nécessaires se trouve dans
[`docs/firestore-residence.rules`](./docs/firestore-residence.rules). Il
autorise :

- la lecture des signalements ;
- la création d’un signalement au format attendu ;
- la lecture et la mise à jour contrainte des statuts ;
- aucune modification ou suppression des signalements depuis le navigateur.

Le projet Firebase étant partagé avec d’autres applications, ce dépôt conserve
uniquement l’extrait propre à la résidence. Il sert de référence lors d’une
future modification des règles déjà déployées.

## Déploiement Vercel

Le dépôt utilise Next.js sans configuration de build personnalisée.

1. Importer le dépôt dans Vercel.
2. Conserver le preset `Next.js`.
3. Définir `NEXT_PUBLIC_ISSUE_DATA_SOURCE=firebase`.
4. Déployer.

Chaque pull request peut utiliser une Preview Vercel. Les previews configurées
avec `local` restent isolées de la production.

## Contributions et sécurité

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour proposer une modification et

Le checkpoint d’analyse versionné se trouve dans
[`data/whatsapp-analysis-checkpoint.json`](./data/whatsapp-analysis-checkpoint.json).
Il permet de reprendre une future extraction au dernier message traité. Les
exports WhatsApp bruts, captures et autres données de travail restent dans
`.local/`, qui est ignoré par Git.

## Licence

Aucune licence de réutilisation n’est accordée pour le moment. Le code est
visible afin de faciliter la collaboration entre locataires.
