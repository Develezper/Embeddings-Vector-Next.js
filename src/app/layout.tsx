import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Embeddings Vector Workshop",
  description:
    "Cliente en TypeScript y React que consume una API backend de embeddings con Next.js y Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
