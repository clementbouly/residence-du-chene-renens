# ADR-0002 — Utiliser Next.js standard sur Vercel

- Statut : accepté
- Date : 2026-07-30

## Contexte

Le dépôt provenait d’un squelette multi-cible comprenant vinext, Cloudflare
Workers, OpenAI Sites, D1 et Drizzle. L’application réelle est déployée sur
Vercel et utilise Firebase.

## Décision

Le projet utilise les commandes Next.js standard et le preset Next.js de
Vercel. Le build de production utilise Webpack pour rester déterministe dans
les environnements où Turbopack ne peut pas ouvrir ses processus auxiliaires.

Les modules Cloudflare, Sites, D1, Drizzle et leurs exemples sont supprimés.

## Conséquences

- Le dépôt présente une seule cible de déploiement.
- L’installation contient moins de dépendances.
- Le build Vercel et le build local suivent le même chemin.
- Une migration vers une autre plateforme nécessitera un nouvel ADR.
