"use client";

import { useState } from "react";
import { Check, Copy, Mail, Phone } from "lucide-react";
import PageLayout from "../components/ui/PageLayout";
import styles from "./ContactsPage.module.css";

export default function ContactsPage() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      window.setTimeout(() => setCopiedEmail(null), 2200);
    } catch {
      window.prompt("Copiez l’adresse email :", email);
    }
  };

  const emailAction = (email: string) => (
    <button
      className={styles.action}
      type="button"
      onClick={() => void copyEmail(email)}
    >
      {copiedEmail === email ? (
        <Check aria-hidden="true" size={16} strokeWidth={2} />
      ) : (
        <Copy aria-hidden="true" size={16} strokeWidth={2} />
      )}
      <span>{email}</span>
      <small>{copiedEmail === email ? "Copié" : "Copier"}</small>
    </button>
  );

  return (
    <PageLayout title="Contacts utiles" narrow>
      <section aria-label="Contacts utiles">
        <div className={styles.grid}>
          <article className={styles.card}>
            <p>Concierges</p>
            <h2>Gheorghe Alexe</h2>
            <div className={styles.actions}>
              <a className={styles.action} href="tel:+41765242650">
                <Phone aria-hidden="true" size={16} strokeWidth={2} />
                <span>+41 76 524 26 50</span>
              </a>
              <a
                className={styles.action}
                href="mailto:galexe704@gmail.com"
              >
                <Mail aria-hidden="true" size={16} strokeWidth={2} />
                <span>Écrire un e-mail</span>
              </a>
              {emailAction("galexe704@gmail.com")}
            </div>

            <h2>Ion Cristi Palanita</h2>
            <div className={styles.actions}>
              <a
                className={styles.action}
                href="mailto:ioncristipalanita@gmail.com"
              >
                <Mail aria-hidden="true" size={16} strokeWidth={2} />
                <span>Écrire un e-mail</span>
              </a>
              {emailAction("ioncristipalanita@gmail.com")}
            </div>

            <h2>Numéros de remplacement</h2>
            <div className={styles.actions}>
              <a className={styles.action} href="tel:+41786314519">
                <Phone aria-hidden="true" size={16} strokeWidth={2} />
                <span>+41 78 631 45 19</span>
                <small>Appeler</small>
              </a>
              <a className={styles.action} href="tel:+41764517372">
                <Phone aria-hidden="true" size={16} strokeWidth={2} />
                <span>+41 76 451 73 72</span>
                <small>Appeler</small>
              </a>
            </div>
            <small className={styles.fallbackNote}>
              Numéros de conciergerie partagés par un voisin, à essayer si les
              contacts principaux ne répondent pas.
            </small>
          </article>

          <article className={`${styles.card} ${styles.emergency}`}>
            <p>De Rham — urgences</p>
            <h2>Service d’urgence</h2>
            <div className={styles.actions}>
              <a className={styles.action} href="tel:0582111111">
                <Phone aria-hidden="true" size={16} strokeWidth={2} />
                <span>058 211 11 11</span>
              </a>
            </div>
            <small className={styles.hours}>
              Du lundi au vendredi. Redirigé vers le service d’urgence le
              week-end.
            </small>
          </article>
        </div>

        <p className={styles.note}>
          En cas d’urgence vitale, appelez directement le 144.
        </p>
      </section>
    </PageLayout>
  );
}
