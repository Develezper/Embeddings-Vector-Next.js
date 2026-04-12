import EmbeddingSearchClient from "@/components/embedding-search-client";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--muted)]">
          Buscador inteligente
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Encuentra resultados mas cercanos a tu idea
        </h1>
        <p className="text-base leading-7 text-[var(--muted)]">
          Escribe lo que necesitas y revisa las coincidencias mas relevantes en
          una vista clara y sencilla.
        </p>
      </header>

      <EmbeddingSearchClient />
    </main>
  );
}
