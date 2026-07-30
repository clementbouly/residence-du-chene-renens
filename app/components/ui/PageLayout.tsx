import type { ReactNode } from "react";
import AppMenu from "../AppMenu";
import styles from "./PageLayout.module.css";

type PageLayoutProps = {
  children: ReactNode;
  headerContent?: ReactNode;
  narrow?: boolean;
  title: string;
  titleId?: string;
};

export default function PageLayout({
  children,
  headerContent,
  narrow = false,
  title,
  titleId,
}: PageLayoutProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <AppMenu />
        <div className={styles.headerContent}>
          {headerContent ?? <h1 id={titleId}>{title}</h1>}
        </div>
      </header>
      <main
        className={`${styles.content}${narrow ? ` ${styles.narrow}` : ""}`}
      >
        {children}
      </main>
    </div>
  );
}
