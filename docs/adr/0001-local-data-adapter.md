# ADR-0001 — Isoler le développement avec un adaptateur local

- Statut : accepté
- Date : 2026-07-30

## Contexte

Le prototype utilisait directement Firebase depuis la page principale. Toute
session locale lisait et pouvait modifier les données de production.

## Décision

Le registre des signalements définit une interface unique avec deux
adaptateurs :

- `local` pour le développement, avec des données de démonstration stockées
  dans le navigateur ;
- `firebase` pour la production.

Sans configuration explicite, le développement choisit `local` et la production
choisit `firebase`. La variable `NEXT_PUBLIC_ISSUE_DATA_SOURCE` permet de rendre
le choix explicite.

## Conséquences

- Le développement courant ne dépend plus du réseau ni de Firebase.
- Les signalements de test ne polluent plus la production.
- Les tests peuvent vérifier le contrat de l’adaptateur local.
- Une preview Vercel doit définir la source `local` si elle doit rester isolée.
