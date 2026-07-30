import { matchesSearchText } from "../../../lib/search";

export type IssueStatus = "active" | "resolved";

export type KnownConcern = {
  building: string | null;
  count: number;
};

export type Issue = {
  id: string;
  title: string;
  summary: string;
  details: string;
  category: string;
  status: IssueStatus;
  firstMentionedAt: string;
  knownConcerns: KnownConcern[];
};

export type ConcernReport = {
  id: string;
  issueId: string;
  building: string;
};

export type ConcernStats = {
  total: number;
  breakdown: Record<string, number>;
};

export type StatusFilter = "all" | IssueStatus;
export type IssueStatusOverrides = Record<string, IssueStatus>;

export const isIssueStatus = (value: unknown): value is IssueStatus =>
  value === "active" || value === "resolved";

export const statusLabels: Record<IssueStatus, string> = {
  active: "En cours",
  resolved: "Résolu",
};

export const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "Tous", value: "all" },
  { label: "En cours", value: "active" },
  { label: "Résolus", value: "resolved" },
];

export const applyStatusOverrides = (
  issues: Issue[],
  overrides: IssueStatusOverrides,
) =>
  issues.map((issue) => ({
    ...issue,
    status: overrides[issue.id] ?? issue.status,
  }));

export const normalizeBuilding = (value: string) =>
  value.trim().replace(/\s+/g, " ").toUpperCase();

export const isTwoDigitNumericInput = (value: string) =>
  /^\d{0,2}$/.test(value);

export function filterIssues(
  issues: Issue[],
  search: string,
  statusFilter: StatusFilter,
) {
  return issues.filter((issue) => {
    const matchesStatus =
      statusFilter === "all" || issue.status === statusFilter;
    const matchesSearch = matchesSearchText(
      [issue.title, issue.summary, issue.details, issue.category].join(" "),
      search,
    );

    return matchesStatus && matchesSearch;
  });
}

export function countIssuesByStatus(issues: Issue[]) {
  return {
    all: issues.length,
    active: issues.filter((issue) => issue.status === "active").length,
    resolved: issues.filter((issue) => issue.status === "resolved").length,
  };
}

export function getConcernStats(
  issue: Issue,
  reports: ConcernReport[],
): ConcernStats {
  const breakdown: Record<string, number> = {};

  issue.knownConcerns.forEach(({ building, count }) => {
    const label = building ? `Bâtiment ${building}` : "Bâtiment non précisé";
    breakdown[label] = (breakdown[label] ?? 0) + count;
  });

  reports
    .filter((report) => report.issueId === issue.id)
    .forEach((report) => {
      const label = `Bâtiment ${report.building}`;
      breakdown[label] = (breakdown[label] ?? 0) + 1;
    });

  return {
    total: Object.values(breakdown).reduce((sum, count) => sum + count, 0),
    breakdown,
  };
}

export const formatIssueDate = (date: string) =>
  new Intl.DateTimeFormat("fr-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Zurich",
  }).format(new Date(`${date}T12:00:00+02:00`));

export const formatIssueMonth = (date: string) =>
  new Intl.DateTimeFormat("fr-CH", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Zurich",
  }).format(new Date(`${date}T12:00:00+02:00`));

export function buildIssueSummary(
  issue: Issue,
  reports: ConcernReport[],
  date = new Date(),
) {
  const stats = getConcernStats(issue, reports);
  const buildingLines = Object.entries(stats.breakdown)
    .sort(([a], [b]) => a.localeCompare(b, "fr", { numeric: true }))
    .map(([label, count]) => `• ${label} : ${count}`)
    .join("\n");

  return [
    `Résidence du Chêne Renens — ${issue.title}`,
    `${stats.total} foyer${stats.total > 1 ? "s" : ""} concerné${stats.total > 1 ? "s" : ""} au total`,
    buildingLines,
    `Mise à jour : ${new Intl.DateTimeFormat("fr-CH", {
      dateStyle: "long",
    }).format(date)}`,
  ].join("\n\n");
}

type RandomValuesProvider = {
  getRandomValues<T extends ArrayBufferView | null>(array: T): T;
  randomUUID?: () => string;
};

export function createReportId(
  randomProvider: RandomValuesProvider = globalThis.crypto,
) {
  if (randomProvider.randomUUID) return randomProvider.randomUUID();

  const bytes = randomProvider.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

const sha256Constants = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
  0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
  0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
  0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
  0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
  0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
  0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
  0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
  0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
] as const;

const rotateRight = (value: number, amount: number) =>
  (value >>> amount) | (value << (32 - amount));

function hashWithPortableSha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const paddedLength = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLength);
  const view = new DataView(padded.buffer);
  const bitLength = bytes.length * 8;

  padded.set(bytes);
  padded[bytes.length] = 0x80;
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x1_0000_0000));
  view.setUint32(paddedLength - 4, bitLength >>> 0);

  const state = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];
  const words = new Uint32Array(64);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getUint32(offset + index * 4);
    }
    for (let index = 16; index < 64; index += 1) {
      const previous15 = words[index - 15];
      const previous2 = words[index - 2];
      const sigma0 =
        rotateRight(previous15, 7) ^
        rotateRight(previous15, 18) ^
        (previous15 >>> 3);
      const sigma1 =
        rotateRight(previous2, 17) ^
        rotateRight(previous2, 19) ^
        (previous2 >>> 10);
      words[index] =
        (words[index - 16] + sigma0 + words[index - 7] + sigma1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = state;
    for (let index = 0; index < 64; index += 1) {
      const sum1 =
        rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temporary1 =
        (h + sum1 + choice + sha256Constants[index] + words[index]) >>> 0;
      const sum0 =
        rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temporary2 = (sum0 + majority) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temporary1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temporary1 + temporary2) >>> 0;
    }

    state[0] = (state[0] + a) >>> 0;
    state[1] = (state[1] + b) >>> 0;
    state[2] = (state[2] + c) >>> 0;
    state[3] = (state[3] + d) >>> 0;
    state[4] = (state[4] + e) >>> 0;
    state[5] = (state[5] + f) >>> 0;
    state[6] = (state[6] + g) >>> 0;
    state[7] = (state[7] + h) >>> 0;
  }

  return state
    .map((word) => word.toString(16).padStart(8, "0"))
    .join("");
}

export async function hashApartment(
  value: string,
  cryptoProvider: Pick<Crypto, "subtle"> | null = globalThis.crypto,
) {
  if (!cryptoProvider?.subtle) return hashWithPortableSha256(value);

  const bytes = new TextEncoder().encode(value);
  const digest = await cryptoProvider.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
