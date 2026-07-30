# Contribuer

Les contributions sont bienvenues, en particulier de la part des locataires de
la résidence.

## Avant de commencer

1. Créez une branche depuis `main`.
2. Gardez la modification ciblée.
3. N’ajoutez aucune donnée personnelle ou conversation brute.
4. Exécutez `npm run check`.
5. Ouvrez une pull request expliquant le problème et la modification.

## Ajouter ou modifier un problème

Le catalogue se trouve dans `app/features/issues/model/catalogue.ts`.

- Un problème doit être concret et actionnable.
- Le texte doit rester factuel.
- La date peut être approximative.
- Un nouveau problème part avec au moins un foyer connu uniquement lorsqu’un
  signalement réel existe.
- Un changement du statut par défaut doit être justifié dans la pull request.

## Données interdites

Ne publiez jamais :

- de numéro d’appartement ;
- de nom ou numéro de téléphone d’un locataire ;
- de code de porte ou de garage ;
- d’export ou capture WhatsApp ;
- de clé privée ou de fichier `.env`.

Les coordonnées déjà présentes sur la page Contacts sont des coordonnées de
service destinées aux habitants.

Le checkpoint `data/whatsapp-analysis-checkpoint.json` peut être mis à jour
après une extraction. Il ne doit contenir que les métadonnées et le court
message d’ancrage nécessaires à la prochaine reprise.

## Style et architecture

- Utilisez les termes définis dans `CONTEXT.md`.
- Rangez le code de la feature `issues` dans `components`, `hooks`, `model` ou
  `data` selon son rôle.
- Colocalisez les styles dans un fichier CSS Module près du module React.
- Ajoutez une primitive dans `components/ui` uniquement si elle a plusieurs
  usages réels.
- Préservez les registres des signalements et des statuts, ainsi que leurs
  adaptateurs.
- Ne branchez pas le développement local à Firebase par défaut.
- Documentez les décisions structurantes dans `docs/adr`.
