"use client";

import { AnimatePresence, m } from "motion/react";
import { ChevronRight } from "lucide-react";
import AppMenu from "../../../components/AppMenu";
import { SearchField } from "../../../components/ui/SearchField";
import {
  getConcernStats,
  statusFilters,
  type ConcernReport,
  type Issue,
  type StatusFilter,
} from "../model/domain";
import IssueStatusBadge from "./IssueStatusBadge";
import styles from "./IssueList.module.css";

type IssueListProps = {
  issues: Issue[];
  reports: ConcernReport[];
  search: string;
  statusFilter: StatusFilter;
  statusCounts: Record<StatusFilter, number>;
  onOpenIssue: (issue: Issue) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: StatusFilter) => void;
};

export default function IssueList({
  issues,
  reports,
  search,
  statusFilter,
  statusCounts,
  onOpenIssue,
  onSearchChange,
  onStatusFilterChange,
}: IssueListProps) {
  return (
    <section className={styles.tracker} aria-labelledby="issues-title">
      <header className={styles.toolbar}>
        <AppMenu />
        <SearchField
          ariaLabel="Rechercher un problème"
          value={search}
          onValueChange={onSearchChange}
          placeholder="Rechercher un problème ou une catégorie"
        />
      </header>

      <div className={styles.heading}>
        <h1 id="issues-title">Problèmes signalés</h1>
      </div>

      <div
        className={styles.filters}
        role="group"
        aria-label="Filtrer les problèmes par état"
      >
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            className={[
              styles.filter,
              filter.value === "active" ? styles.filterActive : "",
              filter.value === "resolved" ? styles.filterResolved : "",
              statusFilter === filter.value ? styles.filterSelected : "",
            ]
              .filter(Boolean)
              .join(" ")}
            type="button"
            aria-pressed={statusFilter === filter.value}
            onClick={() => onStatusFilterChange(filter.value)}
          >
            <span>{filter.label}</span>
            <b>{statusCounts[filter.value]}</b>
          </button>
        ))}
      </div>

      <div className={styles.list}>
        <AnimatePresence initial={false} mode="popLayout">
          {issues.map((issue) => {
            const concernStats = getConcernStats(issue, reports);

            return (
              <m.article
                className={styles.card}
                key={issue.id}
                layout="position"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <button
                  className={styles.trigger}
                  type="button"
                  onClick={() => onOpenIssue(issue)}
                  aria-haspopup="dialog"
                >
                  <span className={styles.content}>
                    <span className={styles.meta}>
                      <IssueStatusBadge status={issue.status} />
                      <span className={styles.category}>{issue.category}</span>
                    </span>
                    <strong>{issue.title}</strong>
                  </span>
                  <span className={styles.count}>
                    <b>{concernStats.total}</b>
                    <small>foyer{concernStats.total === 1 ? "" : "s"}</small>
                  </span>
                  <span className={styles.symbol} aria-hidden="true">
                    <ChevronRight size={20} strokeWidth={2} />
                  </span>
                </button>
              </m.article>
            );
          })}
        </AnimatePresence>
      </div>

      {!issues.length && (
        <div className={styles.empty}>
          <strong>Aucun problème trouvé</strong>
          <p>
            {search
              ? "Essayez avec un autre mot-clé."
              : "Aucun problème ne correspond à cet état."}
          </p>
        </div>
      )}
    </section>
  );
}
