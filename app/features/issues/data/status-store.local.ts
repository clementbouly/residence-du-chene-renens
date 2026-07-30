import { issues } from "../model/catalogue";
import { isIssueStatus } from "../model/domain";
import type {
  IssueStatusOverrides,
  IssueStatusStore,
} from "./status-store";

const LOCAL_STATUSES_KEY = "residence-dev-status-overrides";

type LocalStorageAdapter = Pick<Storage, "getItem" | "setItem">;

function readStatuses(storage: LocalStorageAdapter): IssueStatusOverrides {
  const storedStatuses = storage.getItem(LOCAL_STATUSES_KEY);
  if (!storedStatuses) return {};

  try {
    const parsed: unknown = JSON.parse(storedStatuses);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([issueId, status]) =>
          issues.some((issue) => issue.id === issueId) &&
          isIssueStatus(status),
      ),
    );
  } catch {
    return {};
  }
}

export function createLocalIssueStatusStore(
  storage: LocalStorageAdapter,
): IssueStatusStore {
  return {
    async list() {
      return readStatuses(storage);
    },
    async set(issueId, status) {
      const statuses = readStatuses(storage);
      storage.setItem(
        LOCAL_STATUSES_KEY,
        JSON.stringify({ ...statuses, [issueId]: status }),
      );
    },
  };
}

let browserStore: IssueStatusStore | null = null;

function getBrowserStore() {
  browserStore ??= createLocalIssueStatusStore(window.localStorage);
  return browserStore;
}

export const localIssueStatusStore: IssueStatusStore = {
  async list() {
    return getBrowserStore().list();
  },
  async set(issueId, status) {
    return getBrowserStore().set(issueId, status);
  },
};
