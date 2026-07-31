"use client";

import { useState } from "react";
import {
  Bike,
  Check,
  CircleDollarSign,
  Copy,
  DoorOpen,
  ExternalLink,
  LampCeiling,
  Recycle,
  ShieldCheck,
  Sparkles,
  TrafficCone,
  type LucideIcon,
} from "lucide-react";
import PageLayout from "../components/ui/PageLayout";
import { SearchField } from "../components/ui/SearchField";
import { matchesSearchText } from "../lib/search";
import styles from "./PracticalInformationPage.module.css";

type PracticalItem = {
  copy?: {
    label: string;
    value: string;
  };
  featured?: boolean;
  Icon: LucideIcon;
  id: string;
  link?: {
    href: string;
    label: string;
  };
  note?: string;
  paragraphs: string[];
  tag: string;
  title: string;
};

const practicalItems: PracticalItem[] = [
  {
    id: "interphone-nom-ouverture",
    Icon: DoorOpen,
    tag: "Accès",
    title: "Nom et ouverture sur l’interphone",
    paragraphs: [
      "Pour demander l’ajout de votre nom sur l’interphone, écrivez à l’adresse Electrophase affichée ci-dessous en indiquant votre numéro d’appartement.",
      "D’après la communication de la gérance et les essais de voisins, le bouton astérisque ouvre la porte de sa propre entrée. Le bouton avec une clé pourrait commander les deux portes reliées au même système.",
    ],
    copy: {
      label: "g.campo@electrophase.ch",
      value: "g.campo@electrophase.ch",
    },
    note: "Informations partagées le 31 juillet 2026. Sur certaines entrées, le mécanisme d’ouverture ne fonctionne pas encore.",
  },
  {
    id: "plafonnier",
    Icon: LampCeiling,
    tag: "Éclairage",
    title: "Installer un plafonnier",
    featured: true,
    paragraphs: [
      "Les supports au plafond ne ressemblent pas toujours aux fixations habituelles. Des voisins ont fixé leur luminaire sur la grille grise, à côté des deux trous, sans percer directement le béton.",
      "Une griffe de lampe Max Hauri a aussi été proposée comme piste. Sa compatibilité dépend toutefois du plafonnier et n’a pas encore été confirmée pour tous les modèles.",
    ],
    link: {
      href: "https://www.galaxus.ch/fr/s14/product/max-hauri-griffe-de-lampe-eclairage-accessoires-42378091",
      label: "Voir la griffe de lampe",
    },
    note: "Conseil partagé entre voisins le 30 juillet 2026. En cas de doute, demandez une validation avant de percer le plafond.",
  },
  {
    id: "local-velos",
    Icon: Bike,
    tag: "Mobilité",
    title: "Local à vélos",
    paragraphs: [
      "Le local à vélos se trouve au fond du parking, au niveau -1.",
    ],
  },
  {
    id: "paiement-loyer",
    Icon: CircleDollarSign,
    tag: "Loyer",
    title: "Paiements suivants",
    paragraphs: [
      "D’après les échanges entre voisins, le même QR code que celui du premier paiement doit être réutilisé. Vérifiez toujours les communications de la gérance avant un versement.",
    ],
  },
  {
    id: "decheterie-compost",
    Icon: Recycle,
    tag: "Déchets",
    title: "Déchèterie et compost",
    paragraphs: [
      "La carte de déchèterie est normalement envoyée par la Ville de Renens après l’emménagement. Aucun conteneur à compost n’a encore été identifié dans la résidence.",
    ],
  },
  {
    id: "parquet",
    Icon: Sparkles,
    tag: "Logement",
    title: "Parquet fragile",
    paragraphs: [
      "Le parquet se raye facilement. Protégez les pieds des meubles et évitez de les faire glisser pendant l’emménagement.",
    ],
  },
  {
    id: "reamenagement-rue",
    Icon: TrafficCone,
    tag: "Voirie",
    title: "Réaménagement de la rue du Chêne",
    paragraphs: [
      "Dans une réponse du 16 juin 2026, la Ville de Renens indiquait qu’un réaménagement de la rue était à l’étude. Une limitation provisoire à 30 km/h était également examinée, mais le crédit, les procédures et le calendrier définitif restaient à confirmer.",
    ],
  },
];

const garageSearchContent = [
  "Accès",
  "Code du garage",
  "Espace De Rham",
  "Communications de ma gérance",
].join(" ");

const getSearchContent = (item: PracticalItem) =>
  [
    item.tag,
    item.title,
    ...item.paragraphs,
    item.copy?.label,
    item.link?.label,
    item.note,
  ]
    .filter(Boolean)
    .join(" ");

export default function PracticalInformation() {
  const [search, setSearch] = useState("");
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      window.setTimeout(() => setCopiedValue(null), 2200);
    } catch {
      window.prompt("Copiez cette information :", value);
    }
  };
  const showGarageInformation = matchesSearchText(
    garageSearchContent,
    search,
  );
  const visibleItems = practicalItems.filter((item) =>
    matchesSearchText(getSearchContent(item), search),
  );
  const hasResults = showGarageInformation || visibleItems.length > 0;

  return (
    <PageLayout
      title="Infos pratiques"
      titleId="practical-title"
      headerContent={
        <SearchField
          ariaLabel="Rechercher une information pratique"
          value={search}
          onValueChange={setSearch}
          placeholder="Rechercher une information"
        />
      }
    >
      <section aria-labelledby="practical-title">
        <div className={styles.heading}>
          <h1 id="practical-title">Infos pratiques</h1>
        </div>

        <div className={styles.intro}>
          <p className={styles.kicker}>Résidence du Chêne · Renens</p>
        </div>

        {showGarageInformation && (
          <aside className={styles.privacyCard}>
            <span className={styles.icon} aria-hidden="true">
              <ShieldCheck size={20} strokeWidth={2} />
            </span>
            <div>
              <strong>Code du garage</strong>
              <p>
                Le code n’est jamais publié ici. Retrouvez-le dans votre espace
                De Rham, rubrique « Communications de ma gérance », dans la
                communication «&nbsp;AVIS AUX LOCATAIRES - Divers
                informations&nbsp;».
              </p>
              <a
                href="https://derham.tayo.cloud/home"
                target="_blank"
                rel="noreferrer"
              >
                Ouvrir l’espace De Rham
                <ExternalLink aria-hidden="true" size={15} strokeWidth={2} />
              </a>
            </div>
          </aside>
        )}

        {visibleItems.length > 0 && (
          <div className={styles.grid}>
            {visibleItems.map(
              ({
                copy,
                featured,
                Icon,
                id,
                link,
                note,
                paragraphs,
                tag,
                title,
              }) => (
                <article
                  className={`${styles.card}${
                    featured ? ` ${styles.featured}` : ""
                  }`}
                  key={id}
                >
                  <span className={styles.icon} aria-hidden="true">
                    <Icon size={featured ? 21 : 20} strokeWidth={2} />
                  </span>
                  <div>
                    <span className={styles.tag}>{tag}</span>
                    <h2>{title}</h2>
                    {paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {copy && (
                      <button
                        className={styles.copyButton}
                        type="button"
                        onClick={() => void copyToClipboard(copy.value)}
                        aria-label={`Copier ${copy.label}`}
                      >
                        {copiedValue === copy.value ? (
                          <Check
                            aria-hidden="true"
                            size={15}
                            strokeWidth={2.2}
                          />
                        ) : (
                          <Copy
                            aria-hidden="true"
                            size={15}
                            strokeWidth={2.2}
                          />
                        )}
                        <span>{copy.label}</span>
                        <span
                          className={styles.copyStatus}
                          aria-live="polite"
                        >
                          {copiedValue === copy.value ? "Copié" : "Copier"}
                        </span>
                      </button>
                    )}
                    {link && (
                      <a
                        className={styles.resourceLink}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                        <ExternalLink
                          aria-hidden="true"
                          size={15}
                          strokeWidth={2}
                        />
                      </a>
                    )}
                    {note && <small>{note}</small>}
                  </div>
                </article>
              ),
            )}
          </div>
        )}

        {!hasResults && (
          <div className={styles.empty} role="status">
            <strong>Aucune information trouvée</strong>
            <p>Essayez avec un autre mot-clé.</p>
          </div>
        )}

        <p className={styles.disclaimer}>
          Informations issues des échanges du groupe, mises à jour le 31
          juillet 2026. Elles peuvent évoluer et ne remplacent pas les
          communications officielles de la gérance.
        </p>
      </section>
    </PageLayout>
  );
}
