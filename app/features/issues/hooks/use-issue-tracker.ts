"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { issues } from "../model/catalogue";
import {
  applyStatusOverrides,
  buildIssueSummary,
  countIssuesByStatus,
  createReportId,
  filterIssues,
  getConcernStats,
  hashApartment,
  normalizeBuilding,
  type ConcernReport,
  type Issue,
  type IssueStatus,
  type IssueStatusOverrides,
  type StatusFilter,
} from "../model/domain";
import { getIssueDataSource, issueReportStore } from "../data/store";
import { issueStatusStore } from "../data/status-store";

const mobileMediaQuery = "(max-width: 640px)";

const subscribeToMobileViewport = (callback: () => void) => {
  const mediaQuery = window.matchMedia(mobileMediaQuery);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getMobileViewportSnapshot = () =>
  window.matchMedia(mobileMediaQuery).matches;

const getServerMobileViewportSnapshot = () => false;

const concernStorageKey = (issueId: string) =>
  `residence-concerned:${getIssueDataSource()}:${issueId}`;

export function useIssueTracker() {
  const isMobile = useSyncExternalStore(
    subscribeToMobileViewport,
    getMobileViewportSnapshot,
    getServerMobileViewportSnapshot,
  );
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showConcernForm, setShowConcernForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [reports, setReports] = useState<ConcernReport[]>([]);
  const [building, setBuilding] = useState("");
  const [apartment, setApartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [copiedIssueId, setCopiedIssueId] = useState<string | null>(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [hasLocalConcern, setHasLocalConcern] = useState(false);
  const [statusOverrides, setStatusOverrides] =
    useState<IssueStatusOverrides>({});
  const [statusChangeTarget, setStatusChangeTarget] =
    useState<IssueStatus | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState("");

  const loadReports = useCallback(async () => {
    try {
      setReports(await issueReportStore.list());
    } catch {
      setReports([]);
    }
  }, []);

  const loadStatusOverrides = useCallback(async () => {
    try {
      setStatusOverrides(await issueStatusStore.list());
    } catch {
      setStatusOverrides({});
    }
  }, []);

  const closeIssue = useCallback(() => {
    setSelectedIssue(null);
    setShowConcernForm(false);
    setBuilding("");
    setApartment("");
    setFeedback("");
    setHasLocalConcern(false);
    setStatusChangeTarget(null);
    setStatusUpdateError("");

    const url = new URL(window.location.href);
    url.searchParams.delete("issue");
    window.history.replaceState({}, "", url);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void Promise.all([loadReports(), loadStatusOverrides()]);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadReports, loadStatusOverrides]);

  useEffect(() => {
    const syncIssueFromUrl = () => {
      const issueId = new URLSearchParams(window.location.search).get("issue");
      const issue = issues.find((candidate) => candidate.id === issueId) ?? null;

      setSelectedIssue(issue);
      setShowConcernForm(false);
      setFeedback("");
      setHasLocalConcern(
        issue
          ? Boolean(window.localStorage.getItem(concernStorageKey(issue.id)))
          : false,
      );
    };

    const timer = window.setTimeout(syncIssueFromUrl, 0);
    window.addEventListener("popstate", syncIssueFromUrl);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("popstate", syncIssueFromUrl);
    };
  }, []);

  useEffect(() => {
    if (!selectedIssue) return;

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (statusChangeTarget) {
        setStatusChangeTarget(null);
        setStatusUpdateError("");
      } else {
        closeIssue();
      }
    };
    document.addEventListener("keydown", closeWithEscape);

    return () => document.removeEventListener("keydown", closeWithEscape);
  }, [selectedIssue, closeIssue, statusChangeTarget]);

  const effectiveIssues = useMemo(
    () => applyStatusOverrides(issues, statusOverrides),
    [statusOverrides],
  );
  const activeIssue = useMemo(
    () =>
      selectedIssue
        ? {
            ...selectedIssue,
            status:
              statusOverrides[selectedIssue.id] ?? selectedIssue.status,
          }
        : null,
    [selectedIssue, statusOverrides],
  );

  const visibleIssues = useMemo(
    () => filterIssues(effectiveIssues, search, statusFilter),
    [effectiveIssues, search, statusFilter],
  );
  const statusCounts = useMemo(
    () => countIssuesByStatus(effectiveIssues),
    [effectiveIssues],
  );
  const activeConcernStats = useMemo(
    () => (activeIssue ? getConcernStats(activeIssue, reports) : null),
    [activeIssue, reports],
  );

  const openIssue = (issue: Issue) => {
    const url = new URL(window.location.href);
    url.searchParams.set("issue", issue.id);
    window.history.pushState({}, "", url);
    setSelectedIssue(issue);
    setShowConcernForm(false);
    setFeedback("");
    setHasLocalConcern(
      Boolean(window.localStorage.getItem(concernStorageKey(issue.id))),
    );
  };

  const requestStatusChange = () => {
    if (!activeIssue) return;
    setStatusUpdateError("");
    setStatusChangeTarget(
      activeIssue.status === "active" ? "resolved" : "active",
    );
  };

  const cancelStatusChange = () => {
    if (isUpdatingStatus) return;
    setStatusChangeTarget(null);
    setStatusUpdateError("");
  };

  const confirmStatusChange = async () => {
    if (!activeIssue || !statusChangeTarget || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    setStatusUpdateError("");

    try {
      await issueStatusStore.set(activeIssue.id, statusChangeTarget);
      setStatusOverrides((current) => ({
        ...current,
        [activeIssue.id]: statusChangeTarget,
      }));
      setFeedback(
        `Le problème est maintenant « ${
          statusChangeTarget === "resolved" ? "Résolu" : "En cours"
        } ».`,
      );
      setStatusChangeTarget(null);
    } catch {
      setStatusUpdateError(
        "La mise à jour du statut n’a pas abouti. Réessayez.",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const shareIssue = async (issue: Issue) => {
    const url = new URL(window.location.href);
    url.searchParams.set("issue", issue.id);
    const shareData = {
      title: issue.title,
      text: `Résidence du Chêne Renens — ${issue.title}`,
      url: url.toString(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShareLinkCopied(true);
        window.setTimeout(() => setShareLinkCopied(false), 2200);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFeedback("Le partage n’est pas disponible sur cet appareil.");
    }
  };

  const submitConcern = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeIssue || isSubmitting) return;

    const normalizedBuilding = normalizeBuilding(building);
    if (!normalizedBuilding) {
      setFeedback("Indiquez le numéro de votre bâtiment.");
      return;
    }

    const localKey = concernStorageKey(activeIssue.id);
    if (window.localStorage.getItem(localKey)) {
      setHasLocalConcern(true);
      setShowConcernForm(false);
      setFeedback(
        "Votre foyer est déjà enregistré pour ce problème sur cet appareil.",
      );
      return;
    }

    setIsSubmitting(true);
    setFeedback("");

    try {
      const normalizedApartment = apartment.trim().toUpperCase();
      const reportId = normalizedApartment
        ? await hashApartment(
            `${activeIssue.id}|${normalizedBuilding}|${normalizedApartment}`,
          )
        : createReportId();
      const savedReport = await issueReportStore.add({
        id: reportId,
        issueId: activeIssue.id,
        building: normalizedBuilding,
        apartmentHash: normalizedApartment ? reportId : null,
      });

      setReports((current) => [
        ...current.filter((report) => report.id !== savedReport.id),
        savedReport,
      ]);
      window.localStorage.setItem(localKey, savedReport.id);
      setHasLocalConcern(true);
      setShowConcernForm(false);
      setBuilding("");
      setApartment("");
      setFeedback("Merci, votre foyer a bien été ajouté au décompte.");
    } catch {
      setFeedback(
        "L’enregistrement n’a pas abouti. Réessayez dans un instant.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copySummary = async (issue: Issue) => {
    try {
      await navigator.clipboard.writeText(buildIssueSummary(issue, reports));
      setCopiedIssueId(issue.id);
      window.setTimeout(() => setCopiedIssueId(null), 2200);
    } catch {
      setFeedback("La copie automatique n’est pas disponible sur cet appareil.");
    }
  };

  return {
    activeIssue,
    activeConcernStats,
    apartment,
    building,
    copiedIssueId,
    feedback,
    hasLocalConcern,
    isMobile,
    isSubmitting,
    isUpdatingStatus,
    reports,
    search,
    shareLinkCopied,
    showConcernForm,
    statusCounts,
    statusChangeTarget,
    statusFilter,
    statusUpdateError,
    visibleIssues,
    actions: {
      closeIssue,
      cancelStatusChange,
      confirmStatusChange,
      copySummary,
      openIssue,
      requestStatusChange,
      setApartment,
      setBuilding,
      setFeedback,
      setSearch,
      setShowConcernForm,
      setStatusFilter,
      shareIssue,
      submitConcern,
    },
  };
}
