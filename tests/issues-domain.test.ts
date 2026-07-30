import assert from "node:assert/strict";
import test from "node:test";
import { issues } from "../app/features/issues/model/catalogue";
import {
  applyStatusOverrides,
  buildIssueSummary,
  createReportId,
  countIssuesByStatus,
  filterIssues,
  getConcernStats,
  hashApartment,
  type ConcernReport,
} from "../app/features/issues/model/domain";
import { createLocalIssueReportStore } from "../app/features/issues/data/store.local";
import { createLocalIssueStatusStore } from "../app/features/issues/data/status-store.local";

test("le catalogue utilise des identifiants uniques et des données valides", () => {
  const ids = new Set(issues.map((issue) => issue.id));

  assert.equal(ids.size, issues.length);
  for (const issue of issues) {
    assert.match(issue.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(issue.firstMentionedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(issue.title.length > 0);
    assert.ok(issue.details.length > 0);
    assert.ok(
      issue.knownConcerns.every((concern) => concern.count >= 0),
    );
  }
});

test("la recherche ignore les accents et couvre les détails", () => {
  const ventilation = filterIssues(issues, "defaillante intermittence", "all");
  const resolved = filterIssues(issues, "", "resolved");

  assert.deepEqual(
    ventilation.map((issue) => issue.id),
    ["vmc-pannes"],
  );
  assert.ok(resolved.length > 0);
  assert.ok(resolved.every((issue) => issue.status === "resolved"));
});

test("les compteurs de statut couvrent tout le catalogue", () => {
  const counts = countIssuesByStatus(issues);

  assert.equal(counts.active + counts.resolved, counts.all);
  assert.equal(counts.all, issues.length);
});

test("les identifiants et le hash fonctionnent sans contexte HTTPS", async () => {
  const randomValuesOnly = {
    getRandomValues<T extends ArrayBufferView | null>(array: T): T {
      if (array instanceof Uint8Array) {
        array.forEach((_, index) => {
          array[index] = index;
        });
      }
      return array;
    },
  };

  assert.match(
    createReportId(randomValuesOnly),
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
  assert.equal(
    await hashApartment("abc", null),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  );
});

test("une surcharge remplace uniquement le statut du catalogue", () => {
  const original = issues.find((issue) => issue.id === "vmc-pannes");
  assert.ok(original);

  const [overridden] = applyStatusOverrides(
    [original],
    { [original.id]: "resolved" },
  );

  assert.equal(overridden.status, "resolved");
  assert.equal(overridden.title, original.title);
  assert.equal(original.status, "active");
});

test("les signalements sont agrégés par bâtiment", () => {
  const issue = issues.find((candidate) => candidate.id === "vmc-pannes");
  assert.ok(issue);

  const reports: ConcernReport[] = [
    { id: "a", issueId: issue.id, building: "24" },
    { id: "b", issueId: issue.id, building: "24" },
    { id: "c", issueId: issue.id, building: "26" },
  ];
  const stats = getConcernStats(issue, reports);

  assert.equal(stats.total, 4);
  assert.equal(stats.breakdown["Bâtiment 24"], 2);
  assert.equal(stats.breakdown["Bâtiment 26"], 1);
  assert.equal(stats.breakdown["Bâtiment non précisé"], 1);
});

test("la synthèse reprend le total et la ventilation", () => {
  const issue = issues.find((candidate) => candidate.id === "vmc-pannes");
  assert.ok(issue);

  const summary = buildIssueSummary(
    issue,
    [{ id: "a", issueId: issue.id, building: "24" }],
    new Date("2026-07-30T12:00:00+02:00"),
  );

  assert.match(summary, /2 foyers concernés au total/);
  assert.match(summary, /Bâtiment 24 : 1/);
  assert.match(summary, /Bâtiment non précisé : 1/);
});

test("l’adaptateur local respecte l’interface du registre", async () => {
  const values = new Map<string, string>();
  const storage = {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  };
  const store = createLocalIssueReportStore(storage);

  await store.add({
    id: "new-report",
    issueId: "vmc-pannes",
    building: "24",
    apartmentHash: null,
  });
  const reports = await store.list();

  assert.ok(reports.some((report) => report.id === "new-report"));
  assert.ok(
    reports.every(
      (report) => !("apartmentHash" in report),
    ),
  );
});

test("l’adaptateur local isole les surcharges de statut", async () => {
  const values = new Map<string, string>();
  const storage = {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  };
  const store = createLocalIssueStatusStore(storage);

  await store.set("vmc-pannes", "resolved");

  assert.deepEqual(await store.list(), { "vmc-pannes": "resolved" });
});
