import type {
  IssueStatus,
  IssueStatusOverrides,
} from "../model/domain";
import { getIssueDataSource } from "./store";

export type { IssueStatusOverrides } from "../model/domain";

export interface IssueStatusStore {
  list(): Promise<IssueStatusOverrides>;
  set(issueId: string, status: IssueStatus): Promise<void>;
}

let adapterPromise: Promise<IssueStatusStore> | null = null;

async function loadAdapter(): Promise<IssueStatusStore> {
  if (getIssueDataSource() === "local") {
    const { localIssueStatusStore } = await import("./status-store.local");
    return localIssueStatusStore;
  }

  const { firebaseIssueStatusStore } = await import(
    "./status-store.firebase"
  );
  return firebaseIssueStatusStore;
}

async function getAdapter() {
  adapterPromise ??= loadAdapter();
  return adapterPromise;
}

export const issueStatusStore: IssueStatusStore = {
  async list() {
    return (await getAdapter()).list();
  },
  async set(issueId, status) {
    return (await getAdapter()).set(issueId, status);
  },
};
