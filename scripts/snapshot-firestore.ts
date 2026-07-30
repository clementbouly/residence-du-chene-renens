import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  collection,
  getDocs,
  terminate,
  Timestamp,
} from "firebase/firestore";
import { db } from "../app/lib/firebase";

const residenceCollections = [
  "residence_issue_reports",
  "residence_issue_statuses",
] as const;

const normalizeFirestoreValue = (value: unknown): unknown => {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(normalizeFirestoreValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        normalizeFirestoreValue(nestedValue),
      ]),
    );
  }
  return value;
};

const createdAt = new Date();
const collections = Object.fromEntries(
  await Promise.all(
    residenceCollections.map(async (collectionName) => {
      const snapshot = await getDocs(collection(db, collectionName));
      const documents = snapshot.docs.map((document) => {
        const data = normalizeFirestoreValue(
          document.data(),
        ) as Record<string, unknown>;

        return {
          id: document.id,
          ...data,
        };
      });

      return [collectionName, documents] as const;
    }),
  ),
);

const outputDirectory = join(process.cwd(), "data");
const outputPath = join(outputDirectory, "firestore-snapshot.json");

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      schemaVersion: 1,
      createdAt: createdAt.toISOString(),
      firebaseProjectId: "qui-choisit",
      collections,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
await terminate(db);

console.log(
  `Snapshot créé : ${outputPath} (${residenceCollections
    .map((name) => `${name}: ${collections[name].length}`)
    .join(", ")})`,
);
