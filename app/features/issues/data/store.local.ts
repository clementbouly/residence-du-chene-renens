import type { ConcernReport } from "../model/domain";
import type { IssueReportStore, NewConcernReport } from "./store";

const LOCAL_REPORTS_KEY = "residence-dev-concern-reports";

const demoReports: ConcernReport[] = [
  { id: "demo-vmc-24", issueId: "vmc-pannes", building: "24" },
  { id: "demo-vmc-26", issueId: "vmc-pannes", building: "26" },
  {
    id: "demo-hot-water-24",
    issueId: "eau-chaude-coupure-soir",
    building: "24",
  },
  {
    id: "demo-parking-26",
    issueId: "nuisances-nocturnes-parking",
    building: "26",
  },
];

type LocalStorageAdapter = Pick<Storage, "getItem" | "setItem">;

const isConcernReport = (value: unknown): value is ConcernReport => {
  if (!value || typeof value !== "object") return false;
  const report = value as Partial<ConcernReport>;

  return (
    typeof report.id === "string" &&
    typeof report.issueId === "string" &&
    typeof report.building === "string"
  );
};

function readReports(storage: LocalStorageAdapter): ConcernReport[] {
  const storedReports = storage.getItem(LOCAL_REPORTS_KEY);
  if (!storedReports) return demoReports;

  try {
    const reports = JSON.parse(storedReports);
    return Array.isArray(reports) && reports.every(isConcernReport)
      ? reports
      : demoReports;
  } catch {
    return demoReports;
  }
}

function writeReports(
  storage: LocalStorageAdapter,
  reports: ConcernReport[],
) {
  storage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(reports));
}

export function createLocalIssueReportStore(
  storage: LocalStorageAdapter,
): IssueReportStore {
  return {
    async list() {
      return readReports(storage);
    },
    async add(report: NewConcernReport) {
      const publicReport: ConcernReport = {
        id: report.id,
        issueId: report.issueId,
        building: report.building,
      };
      const reports = [
        ...readReports(storage).filter(
          (candidate) => candidate.id !== report.id,
        ),
        publicReport,
      ];

      writeReports(storage, reports);
      return publicReport;
    },
  };
}

let browserStore: IssueReportStore | null = null;

function getBrowserStore() {
  browserStore ??= createLocalIssueReportStore(window.localStorage);
  return browserStore;
}

export const localIssueReportStore: IssueReportStore = {
  async list() {
    return getBrowserStore().list();
  },
  async add(report) {
    return getBrowserStore().add(report);
  },
};
