import type { Metadata } from "next";
import {
  seasonalThemeSchedule,
  THEME_STORAGE_KEY,
} from "./lib/theme";
import "./globals.css";

const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(
    productionDomain ? `https://${productionDomain}` : "http://localhost:3000",
  ),
  title: "Résidence du Chêne Renens — Suivi des problèmes",
  description:
    "Les problèmes signalés dans la résidence, leur suivi et le nombre de foyers concernés par bâtiment.",
  applicationName: "Résidence du Chêne Renens",
  openGraph: {
    title: "Résidence du Chêne Renens",
    description:
      "Les problèmes de la résidence, suivis collectivement au même endroit.",
    locale: "fr_CH",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "Résidence du Chêne Renens — suivi collectif des problèmes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Résidence du Chêne Renens",
    description:
      "Les problèmes de la résidence, suivis collectivement au même endroit.",
    images: ["/og.png"],
  },
};

const themeInitializationScript = `
(() => {
  const schedule = ${JSON.stringify(seasonalThemeSchedule)};
  const storedMode = localStorage.getItem("${THEME_STORAGE_KEY}");
  const mode = ["auto", "light", "dark"].includes(storedMode) ? storedMode : "auto";
  const now = new Date();
  const month = schedule[now.getMonth()];
  const minutes = now.getHours() * 60 + now.getMinutes();
  const theme = mode === "auto"
    ? (minutes < month.lightAt || minutes >= month.darkAt ? "dark" : "light")
    : mode;

  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.style.colorScheme = theme;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
