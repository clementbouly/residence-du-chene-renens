import type { Issue } from "./domain";

export type {
  Issue,
  IssueStatus,
  KnownConcern,
} from "./domain";

export const issues: Issue[] = [
  {
    id: "interphones-entrees-defaillants",
    title: "Interphones défaillants dans plusieurs entrées",
    summary:
      "Des habitants n’entendent pas les appels ou ne peuvent pas ouvrir la porte depuis leur logement.",
    details:
      "Le problème est signalé aux entrées 19, 26 et 28. Dans certains logements, la sonnerie ne produit aucun son malgré le nom affiché ; dans d’autres, la commande d’ouverture ne fonctionne pas. Un électricien a indiqué que le mécanisme d’ouverture de l’entrée 28 n’était pas encore opérationnel.",
    category: "Accès",
    status: "active",
    firstMentionedAt: "2026-07-31",
    knownConcerns: [{ building: "19", count: 1 }],
  },
  {
    id: "fissures-murs-progressives",
    title: "Fissures progressives sur certains murs",
    summary:
      "Des fissures semblent apparaître et s’agrandir progressivement dans au moins un logement.",
    details:
      "Une personne constate une évolution de semaine en semaine et cherche à savoir si d’autres appartements sont concernés. Le signalement ne précise pas encore les pièces touchées ni les bâtiments concernés.",
    category: "Bâtiment",
    status: "active",
    firstMentionedAt: "2026-07-31",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "plans-travail-cuisine-taches",
    title: "Plans de travail de cuisine qui se tachent facilement",
    summary:
      "Le plan de travail clair marque rapidement, notamment avec le thé ou le café.",
    details:
      "Certaines traces s’incrustent et sont difficiles à enlever, au point que des foyers utilisent parfois de la javel. La question d’un défaut de traitement du plan de travail lié aux travaux reste ouverte, et un contrôle par la gérance pourrait être demandé.",
    category: "Équipement",
    status: "active",
    firstMentionedAt: "2026-07-30",
    knownConcerns: [],
  },
  {
    id: "eau-chaude-coupure-soir",
    title: "Coupures récurrentes d’eau chaude",
    summary:
      "L’eau chaude devient indisponible à différents moments dans certains logements.",
    details:
      "Des coupures ont été constatées en fin de soirée ainsi que le matin du 31 juillet, notamment au bâtiment 20. Plusieurs habitants ont ouvert ou prévoient d’ouvrir un ticket. À 9h01, le concierge indiquait qu’une intervention était en cours pour le bâtiment 20 uniquement, sans information sur les autres bâtiments ni confirmation durable de résolution.",
    category: "Eau",
    status: "active",
    firstMentionedAt: "2026-07-30",
    knownConcerns: [{ building: "24", count: 1 }],
  },
  {
    id: "vmc-pannes",
    title: "VMC défaillante dans plusieurs appartements",
    summary:
      "Des bouches d’extraction et d’arrivée d’air ne fonctionnent pas, ou seulement par intermittence.",
    details:
      "Le problème touche notamment les salles de bain et semble concerner plusieurs étages. La centrale aurait été contrôlée, mais les appartements concernés n’ont pas tous été visités et certains signalements durent depuis plusieurs mois.",
    category: "Ventilation",
    status: "active",
    firstMentionedAt: "2026-07-30",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "serrures-caves-difficiles",
    title: "Portes des caves très difficiles à ouvrir",
    summary:
      "Plusieurs habitants peinent à ouvrir ou fermer les portes d’accès aux caves.",
    details:
      "Des serrures ou cylindres semblent mal réglés dans plusieurs bâtiments. Certaines clés doivent être forcées et un foyer indique ne plus pouvoir accéder à sa cave.",
    category: "Accès",
    status: "active",
    firstMentionedAt: "2026-07-29",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "nuisances-nocturnes-parking",
    title: "Nuisances sonores nocturnes près du parking",
    summary:
      "Des discussions et rassemblements tardifs perturbent régulièrement le sommeil des habitants.",
    details:
      "Plusieurs foyers entendent des personnes parler ou faire du bruit jusque tard dans la nuit, près du parking et de l’établissement voisin.",
    category: "Nuisances",
    status: "active",
    firstMentionedAt: "2026-07-28",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "nuisances-parking-motos-balcons",
    title: "Bruit du parking motos face aux balcons",
    summary:
      "Les démarrages de scooters et motos dérangent les logements donnant directement sur leur stationnement.",
    details:
      "Le parking motos situé dans l’angle arrondi, face à certains balcons, génère des nuisances sonores tôt le matin et tard le soir. Le bruit est particulièrement présent dans les chambres proches lorsque les fenêtres sont ouvertes.",
    category: "Nuisances",
    status: "active",
    firstMentionedAt: "2026-07-30",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "absence-bennes-compost",
    title: "Aucune benne à compost disponible",
    summary:
      "Les habitants ne trouvent pas de conteneur destiné aux déchets compostables.",
    details:
      "Plusieurs foyers ont cherché un point de collecte dans la résidence sans le trouver. La question de son emplacement ou de son installation reste ouverte.",
    category: "Déchets",
    status: "active",
    firstMentionedAt: "2026-07-27",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "souris-rats-parties-communes",
    title: "Souris et rats autour de la résidence",
    summary:
      "Des rongeurs sont vus fréquemment près des travaux, des terrasses et des parties communes.",
    details:
      "Plusieurs habitants signalent des observations répétées, parfois quotidiennes ou nocturnes. Une intervention de dératisation a été évoquée, sans résultat durable confirmé.",
    category: "Salubrité",
    status: "active",
    firstMentionedAt: "2026-07-25",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "finitions-appartements-sans-suivi",
    title: "Défauts de finition sans suivi dans les appartements",
    summary:
      "Des retouches et défauts signalés à la livraison restent sans intervention planifiée.",
    details:
      "Les exemples mentionnés comprennent une prise Ethernet non raccordée, un interrupteur cassé, des fissures autour d’une fenêtre et des finitions de peinture incomplètes.",
    category: "Travaux",
    status: "active",
    firstMentionedAt: "2026-07-25",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "fuites-caves-24-26",
    title: "Fuites d’eau dans les caves des bâtiments 24 et 26",
    summary:
      "Une infiltration d’eau avait été signalée dans les sous-sols des deux bâtiments.",
    details:
      "Des fuites avaient été constatées au niveau -2 du bâtiment 24 et au niveau -1 du bâtiment 26. Le problème est désormais indiqué comme résolu.",
    category: "Eau",
    status: "resolved",
    firstMentionedAt: "2026-07-25",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "acces-principal-pmr-poussettes",
    title: "Accès principal impraticable avec une poussette",
    summary:
      "La pente et l’état de l’accès principal empêchent certains habitants de l’utiliser en sécurité.",
    details:
      "Des foyers avec poussette doivent passer par le garage ou une autre entrée. La situation pose également une question d’accessibilité pour les personnes à mobilité réduite.",
    category: "Accessibilité",
    status: "active",
    firstMentionedAt: "2026-07-28",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "bornes-recharge-absentes",
    title: "Bornes de recharge absentes sur des places louées",
    summary:
      "Des places de parking ont été louées avec une borne annoncée, mais celle-ci n’est pas installée.",
    details:
      "Deux foyers signalent cette différence entre la prestation annoncée et l’équipement disponible. Une compensation a été obtenue dans un cas, tandis qu’une autre demande reste sans réponse.",
    category: "Parking",
    status: "active",
    firstMentionedAt: "2026-07-28",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "chauffage-sol-anormal",
    title: "Chauffage au sol actif à des endroits inattendus",
    summary:
      "Le sol chauffe par endroits alors que le chauffage ne devrait pas être nécessaire.",
    details:
      "Le phénomène a notamment été constaté dans des salles de bain et des zones d’entrée. Son origine et son caractère normal restent à confirmer.",
    category: "Chauffage",
    status: "active",
    firstMentionedAt: "2026-07-28",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "debris-metalliques-parking",
    title: "Clous et débris métalliques autour du parking",
    summary:
      "Des éléments métalliques liés au chantier restent au sol près du parking et des poubelles.",
    details:
      "Des habitants signalent des clous ou morceaux métalliques susceptibles d’endommager les pneus et de blesser. Le nettoyage des abords semble insuffisant.",
    category: "Sécurité",
    status: "active",
    firstMentionedAt: "2026-07-30",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "stores-manquants",
    title: "Stores encore manquants dans certains appartements",
    summary:
      "Certains logements restent sans stores malgré la chaleur et les relances.",
    details:
      "La situation rend les épisodes de forte chaleur difficiles à supporter. Des installations ont eu lieu dans certains appartements, mais tous les logements concernés ne semblent pas équipés.",
    category: "Équipement",
    status: "active",
    firstMentionedAt: "2026-07-29",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "balcons-dangereux",
    title: "Défauts dangereux sur certains balcons",
    summary:
      "Des balcons présentent des débris métalliques, des pointes exposées ou une mauvaise évacuation de l’eau.",
    details:
      "Les signalements évoquent notamment des copeaux métalliques, une pointe de coffrage accessible et de l’eau de pluie qui s’écoule vers le balcon inférieur.",
    category: "Sécurité",
    status: "active",
    firstMentionedAt: "2026-07-30",
    knownConcerns: [{ building: null, count: 1 }],
  },
  {
    id: "parking-entrees-inacheves",
    title: "Sols du parking et des entrées toujours inachevés",
    summary:
      "Les revêtements de sol et plusieurs finitions extérieures ne semblent pas terminés.",
    details:
      "L’état des accès, du parking et des abords donne encore l’impression d’un chantier en cours et complique les déplacements quotidiens.",
    category: "Travaux",
    status: "active",
    firstMentionedAt: "2026-07-28",
    knownConcerns: [{ building: null, count: 1 }],
  },
];
