import { statusLabels, type IssueStatus } from "../model/domain";
import styles from "./IssueStatusBadge.module.css";

type IssueStatusBadgeProps = {
  onDoubleClick?: () => void;
  showLabel?: boolean;
  status: IssueStatus;
};

export default function IssueStatusBadge({
  onDoubleClick,
  showLabel = true,
  status,
}: IssueStatusBadgeProps) {
  const className = [
    styles.status,
    styles[status],
    !showLabel ? styles.compact : "",
    onDoubleClick ? styles.interactive : "",
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      <i aria-hidden="true" />
      {showLabel && statusLabels[status]}
    </>
  );

  if (onDoubleClick) {
    return (
      <button
        className={className}
        type="button"
        onDoubleClick={onDoubleClick}
        aria-label={`${statusLabels[status]}. Double-cliquer pour changer le statut`}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={className}
      aria-label={!showLabel ? statusLabels[status] : undefined}
    >
      {content}
    </span>
  );
}
