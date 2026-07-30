import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { issues } from "../model/catalogue";
import { isIssueStatus } from "../model/domain";
import type {
  IssueStatusOverrides,
  IssueStatusStore,
} from "./status-store";

export const firebaseIssueStatusStore: IssueStatusStore = {
  async list() {
    const snapshot = await getDocs(collection(db, "residence_issue_statuses"));

    return snapshot.docs.reduce<IssueStatusOverrides>((statuses, document) => {
      const status = document.data().status;
      if (
        issues.some((issue) => issue.id === document.id) &&
        isIssueStatus(status)
      ) {
        statuses[document.id] = status;
      }
      return statuses;
    }, {});
  },
  async set(issueId, status) {
    await setDoc(doc(db, "residence_issue_statuses", issueId), {
      issueId,
      status,
      updatedAt: serverTimestamp(),
    });
  },
};
