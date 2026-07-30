import { statusLabels, type IssueStatus } from "../model/domain";
import styles from "./IssueStatusBadge.module.css";

type IssueStatusBadgeProps = {
  onDoubleClick?: () => void;
  status: IssueStatus;
};

export default function IssueStatusBadge({
  onDoubleClick,
  status,
}: IssueStatusBadgeProps) {
  const className = [
    styles.status,
    styles[status],
    onDoubleClick ? styles.interactive : "",
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      <i aria-hidden="true" />
      {statusLabels[status]}
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

  return <span className={className}>{content}</span>;
}
