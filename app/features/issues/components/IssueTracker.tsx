"use client";

import {
  AnimatePresence,
  domMax,
  LazyMotion,
  MotionConfig,
} from "motion/react";
import IssueDialog from "./IssueDialog";
import IssueList from "./IssueList";
import StatusConfirmationDialog from "./StatusConfirmationDialog";
import { useIssueTracker } from "../hooks/use-issue-tracker";
import styles from "./IssueTracker.module.css";

export default function IssueTracker() {
  const tracker = useIssueTracker();
  const { actions } = tracker;
  const activeIssue = tracker.activeIssue;

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.8 }}
      >
        <main className={styles.shell}>
          <IssueList
            issues={tracker.visibleIssues}
            reports={tracker.reports}
            search={tracker.search}
            statusFilter={tracker.statusFilter}
            statusCounts={tracker.statusCounts}
            onOpenIssue={actions.openIssue}
            onSearchChange={actions.setSearch}
            onStatusFilterChange={actions.setStatusFilter}
          />

          <AnimatePresence>
            {activeIssue && tracker.activeConcernStats && (
              <IssueDialog
                isMobile={tracker.isMobile}
                issue={activeIssue}
                stats={tracker.activeConcernStats}
                state={{
                  apartment: tracker.apartment,
                  building: tracker.building,
                  copied: tracker.copiedIssueId === activeIssue.id,
                  feedback: tracker.feedback,
                  hasLocalConcern: tracker.hasLocalConcern,
                  isSubmitting: tracker.isSubmitting,
                  shareLinkCopied: tracker.shareLinkCopied,
                  showConcernForm: tracker.showConcernForm,
                }}
                actions={{
                  onApartmentChange: actions.setApartment,
                  onBuildingChange: actions.setBuilding,
                  onClose: actions.closeIssue,
                  onCopySummary: () => void actions.copySummary(activeIssue),
                  onFeedbackChange: actions.setFeedback,
                  onRequestStatusChange: actions.requestStatusChange,
                  onShare: () => void actions.shareIssue(activeIssue),
                  onShowConcernFormChange: actions.setShowConcernForm,
                  onSubmit: actions.submitConcern,
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeIssue && tracker.statusChangeTarget && (
              <StatusConfirmationDialog
                issue={activeIssue}
                nextStatus={tracker.statusChangeTarget}
                isUpdating={tracker.isUpdatingStatus}
                error={tracker.statusUpdateError}
                onCancel={actions.cancelStatusChange}
                onConfirm={() => void actions.confirmStatusChange()}
              />
            )}
          </AnimatePresence>
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
