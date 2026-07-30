import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { issues } from "../model/catalogue";
import type { ConcernReport } from "../model/domain";
import type { IssueReportStore, NewConcernReport } from "./store";

export const firebaseIssueReportStore: IssueReportStore = {
  async list() {
    const snapshot = await getDocs(collection(db, "residence_issue_reports"));

    return snapshot.docs
      .map((document) => ({
        id: document.id,
        ...(document.data() as Omit<ConcernReport, "id">),
      }))
      .filter((report) =>
        issues.some((issue) => issue.id === report.issueId),
      );
  },
  async add(report: NewConcernReport) {
    const reference = doc(db, "residence_issue_reports", report.id);

    await setDoc(reference, {
      issueId: report.issueId,
      building: report.building,
      apartmentHash: report.apartmentHash,
      createdAt: serverTimestamp(),
    });

    return {
      id: reference.id,
      issueId: report.issueId,
      building: report.building,
    };
  },
};
