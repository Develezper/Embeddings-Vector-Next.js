import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Embeddings Vector Search",
  description:
    "Interfaz en React para probar busqueda semantica con Next.js y Gemini.",
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
