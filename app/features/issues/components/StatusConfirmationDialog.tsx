"use client";

import { Button } from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import {
  statusLabels,
  type Issue,
  type IssueStatus,
} from "../model/domain";
import styles from "./StatusConfirmationDialog.module.css";

type StatusConfirmationDialogProps = {
  issue: Issue;
  nextStatus: IssueStatus;
  isUpdating: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function StatusConfirmationDialog({
  issue,
  nextStatus,
  isUpdating,
  error,
  onCancel,
  onConfirm,
}: StatusConfirmationDialogProps) {
  return (
    <Modal
      className={styles.dialog}
      descriptionId="status-confirmation-description"
      elevated
      onClose={onCancel}
      role="alertdialog"
      titleId="status-confirmation-title"
    >
        <h2 id="status-confirmation-title">Changer le statut ?</h2>
        <p id="status-confirmation-description">
          Passer « {issue.title} » à <strong>{statusLabels[nextStatus]}</strong>.
        </p>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <Button
            data-modal-autofocus
            variant="secondary"
            disabled={isUpdating}
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            disabled={isUpdating}
            onClick={onConfirm}
          >
            {isUpdating ? "Mise à jour…" : "Confirmer"}
          </Button>
        </div>
    </Modal>
  );
}
