import type { ConcernReport } from "../model/domain";

export type NewConcernReport = ConcernReport & {
  apartmentHash: string | null;
};

export interface IssueReportStore {
  list(): Promise<ConcernReport[]>;
  add(report: NewConcernReport): Promise<ConcernReport>;
}

export type IssueDataSource = "firebase" | "local";

export function getIssueDataSource(): IssueDataSource {
  const configuredSource = process.env.NEXT_PUBLIC_ISSUE_DATA_SOURCE;

  if (configuredSource === "firebase" || configuredSource === "local") {
    return configuredSource;
  }

  return process.env.NODE_ENV === "production" ? "firebase" : "local";
}

let adapterPromise: Promise<IssueReportStore> | null = null;

async function loadAdapter(): Promise<IssueReportStore> {
  if (getIssueDataSource() === "local") {
    const { localIssueReportStore } = await import("./store.local");
    return localIssueReportStore;
  }

  const { firebaseIssueReportStore } = await import("./store.firebase");
  return firebaseIssueReportStore;
}

async function getAdapter() {
  adapterPromise ??= loadAdapter();
  return adapterPromise;
}

export const issueReportStore: IssueReportStore = {
  async list() {
    return (await getAdapter()).list();
  },
  async add(report) {
    return (await getAdapter()).add(report);
  },
};
