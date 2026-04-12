import EmbeddingSearchClient from "@/components/embedding-search-client";

const WORKSHOP_FLOW = [
  {
    title: "1. Cliente React",
    description:
      "Captura la consulta, hace un POST a la API y presenta los resultados con estados de carga y error.",
  },
  {
    title: "2. API Route",
    description:
      "Recibe el texto, genera el embedding con Gemini y compara el vector contra un dataset de ejemplo.",
  },
  {
    title: "3. Ranking semántico",
    description:
      "La similitud de coseno ordena los documentos desde la coincidencia más cercana hasta la más lejana.",
  },
];

const ARCHITECTURE_LAYERS = [
  "src/components/embedding-search-client.tsx: cliente TS/React que consume /api/embed",
  "src/app/api/embed/route.ts: controlador backend que expone la búsqueda semántica",
  "src/services/aiService.ts: integración con Gemini para generar embeddings",
  "src/data/mockDatabase.ts: dataset de ejemplo cacheado para comparar resultados",
];

export default function Home() {
  return (
    <div className="relative flex flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(255,122,89,0.25),transparent_45%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(61,182,163,0.2),transparent_65%)] blur-3xl" />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-10 lg:px-10 lg:py-12">
        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-8">
            <div className="inline-flex w-fit items-center rounded-full border border-[color:var(--border)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm backdrop-blur">
              Next.js 16 · React 19 · Gemini embeddings
            </div>

            <div className="space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-[var(--muted)]">
                Taller de búsqueda semántica
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight text-[var(--foreground)] sm:text-6xl">
                Cliente en TypeScript y React para consumir el backend de
                embeddings sin exponer secretos.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
                La interfaz ahora sí está pensada para el taller: captura la
                consulta del usuario, consume la ruta <code>/api/embed</code>,
                muestra el ranking semántico y deja visible el payload que
                regresa el backend.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {WORKSHOP_FLOW.map((step) => (
                <article
                  key={step.title}
                  className="rounded-[28px] border border-[color:var(--border)] bg-[var(--panel)] p-5 shadow-[0_16px_50px_rgba(10,26,21,0.06)] backdrop-blur"
                >
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[32px] border border-[color:var(--border)] bg-[#122117] p-6 text-[#f6f1e8] shadow-[0_24px_80px_rgba(10,26,21,0.12)]">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#adc7bc]">
              Arquitectura revisada
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Capas alineadas con el README
            </h2>
            <p className="mt-4 text-base leading-7 text-[#d7e4de]">
              Dejamos la separación entre cliente, controlador, servicio de IA
              y datos mock para que el flujo del taller sea fácil de explicar y
              de extender.
            </p>

            <div className="mt-6 space-y-3">
              {ARCHITECTURE_LAYERS.map((layer) => (
                <div
                  key={layer}
                  className="rounded-[22px] bg-white/[0.08] px-4 py-3 text-sm leading-6 text-[#f6f1e8]"
                >
                  {layer}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-[#d7e4de]">
              Consejo del taller: el navegador habla solo con la API interna y
              la API interna es la que conversa con Gemini. Así evitamos exponer
              la <code className="text-[#f7d7cb]">GEMINI_API_KEY</code>.
            </div>
          </aside>
        </section>

        <EmbeddingSearchClient />
      </main>
    </div>
  );
}
