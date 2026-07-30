# Contexte du domaine

## Résidence

La Résidence du Chêne à Renens regroupe plusieurs bâtiments et logements. Le
site aide les locataires à partager une vue commune des problèmes concrets qui
touchent la résidence.

## Problème

Un **problème** est une situation concrète, datée et actionnable concernant la
résidence. Il possède un titre, une description, une catégorie et un statut
`En cours` ou `Résolu`.

Le catalogue des problèmes est maintenu dans le dépôt. Une création ou une
correction de fond passe par une pull request et une revue de code. En
production, une **surcharge de statut** peut remplacer le statut du catalogue
sans modifier le reste du problème.

## Signalement de foyer

Un **signalement de foyer** indique qu’un foyer est concerné par un problème.
Il contient le problème concerné, le numéro du bâtiment et, lorsque
l’appartement est fourni, uniquement son empreinte non réversible.

Les visiteurs peuvent ajouter un signalement de foyer depuis le site. Les
totaux publics sont regroupés par bâtiment et n’affichent jamais les numéros
d’appartement.

## Registre des signalements

Le **registre des signalements** fournit au site les signalements de foyer. Il
utilise un adaptateur local en développement et un adaptateur Firebase en
production.

## Registre des statuts

Le **registre des statuts** fournit les surcharges de statut. Il utilise, comme
le registre des signalements, un adaptateur local en développement et un
adaptateur Firebase en production.

## Données locales

Les **données locales** sont un jeu de démonstration isolé de Firebase. Elles
permettent de développer et tester les parcours sans lire ni modifier les
données de production.
