"use client";

import { AnimatePresence, m } from "motion/react";
import { Check, Share2, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import {
  formatIssueDate,
  formatIssueMonth,
  type ConcernStats,
  type Issue,
} from "../model/domain";
import ConcernPanel, {
  type ConcernPanelActions,
  type ConcernPanelState,
} from "./ConcernPanel";
import IssueStatusBadge from "./IssueStatusBadge";
import styles from "./IssueDialog.module.css";

type IssueDialogProps = {
  isMobile: boolean;
  issue: Issue;
  stats: ConcernStats;
  state: ConcernPanelState & {
    feedback: string;
    shareLinkCopied: boolean;
  };
  actions: ConcernPanelActions & {
    onClose: () => void;
    onRequestStatusChange: () => void;
    onShare: () => void;
  };
};

export default function IssueDialog({
  isMobile,
  issue,
  stats,
  state,
  actions,
}: IssueDialogProps) {
  const {
    feedback,
    shareLinkCopied,
  } = state;
  const {
    onClose,
    onRequestStatusChange,
    onShare,
  } = actions;

  return (
    <Modal
      className={styles.dialog}
      draggable={isMobile}
      onClose={onClose}
      sheetOnMobile
      titleId="issue-dialog-title"
    >
        <div className={styles.toolbar}>
          <Button
            variant="secondary"
            size="compact"
            onClick={onShare}
            aria-label="Partager ce problème"
          >
            {shareLinkCopied ? (
              <Check aria-hidden="true" size={17} strokeWidth={2} />
            ) : (
              <Share2 aria-hidden="true" size={17} strokeWidth={2} />
            )}
            <span>{shareLinkCopied ? "Lien copié" : "Partager"}</span>
          </Button>
          <Button
            data-modal-autofocus
            variant="secondary"
            size="icon"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </Button>
        </div>

        <div className={styles.heading}>
          <span className={styles.meta}>
            <IssueStatusBadge
              status={issue.status}
              onDoubleClick={onRequestStatusChange}
            />
            <span className={styles.category}>{issue.category}</span>
          </span>
          <time
            className={styles.date}
            dateTime={issue.firstMentionedAt}
            title={`Première mention le ${formatIssueDate(issue.firstMentionedAt)}`}
          >
            {formatIssueMonth(issue.firstMentionedAt)}
          </time>
        </div>

        <h2 id="issue-dialog-title">{issue.title}</h2>
        <p className={styles.summary}>{issue.details}</p>

        <div className={styles.concernSummary}>
          <div className={styles.total}>
            <span>Foyers concernés</span>
            <strong>{stats.total}</strong>
          </div>
          <div className={styles.breakdown}>
            {Object.entries(stats.breakdown).length ? (
              Object.entries(stats.breakdown)
                .sort(([a], [b]) =>
                  a.localeCompare(b, "fr", { numeric: true }),
                )
                .map(([label, count]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{count}</strong>
                  </div>
                ))
            ) : (
              <p>Le bâtiment n’est pas encore précisé.</p>
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {feedback && (
            <m.p
              className={styles.feedback}
              role="status"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              {feedback}
            </m.p>
          )}
        </AnimatePresence>

        <ConcernPanel state={state} actions={actions} />
    </Modal>
  );
}
