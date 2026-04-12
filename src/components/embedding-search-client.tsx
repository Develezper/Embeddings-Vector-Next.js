"use client";

import { useState, useTransition } from "react";
import type { EmbedApiError, EmbedApiSuccess } from "@/types/embedding";

const SUGGESTED_QUERIES = [
  "cliente React TypeScript para embeddings",
  "productos lácteos hechos con leche de vaca",
  "cómo funciona la similitud de coseno",
];

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "No se pudo completar la consulta en este momento.";
}

function isSuccessPayload(
  payload: EmbedApiSuccess | EmbedApiError,
): payload is EmbedApiSuccess {
  return "results" in payload;
}

export default function EmbeddingSearchClient() {
  const [query, setQuery] = useState(SUGGESTED_QUERIES[0]);
  const [response, setResponse] = useState<EmbedApiSuccess | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestMs, setRequestMs] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function runSearch(nextQuery: string) {
    const normalizedQuery = nextQuery.trim();

    if (!normalizedQuery) {
      setError("Escribe una palabra o frase antes de consultar.");
      setResponse(null);
      setRequestMs(null);
      return;
    }

    setQuery(normalizedQuery);
    setError(null);

    startTransition(async () => {
      const startedAt = performance.now();

      try {
        const apiResponse = await fetch("/api/embed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: normalizedQuery }),
        });

        const payload = (await apiResponse.json()) as
          | EmbedApiSuccess
          | EmbedApiError;

        if (!apiResponse.ok) {
          throw new Error(
            "error" in payload
              ? payload.error
              : "La API respondió con un error inesperado.",
          );
        }

        if (!isSuccessPayload(payload)) {
          throw new Error("La API devolvió un formato inesperado.");
        }

        setResponse(payload);
        setRequestMs(Math.round(performance.now() - startedAt));
      } catch (caughtError) {
        setResponse(null);
        setRequestMs(null);
        setError(getErrorMessage(caughtError));
      }
    });
  }

  const strongestMatch = response?.results[0] ?? null;

  return (
    <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
      <article className="rounded-[32px] border border-[color:var(--border)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(10,26,21,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
              Cliente TS + React
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Consulta la API de embeddings desde el navegador
            </h2>
            <p className="text-base leading-7 text-[var(--muted)]">
              El cliente solo envía texto a <code>/api/embed</code>. La API key
              permanece en el servidor y la respuesta vuelve ordenada por
              similitud semántica.
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              runSearch(query);
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                Consulta
              </span>
              <textarea
                className="min-h-32 w-full rounded-[24px] border border-[color:var(--border)] bg-white/70 px-4 py-4 text-base text-[var(--foreground)] outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent-soft)]"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ejemplo: necesito un cliente React que consuma embeddings"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              {SUGGESTED_QUERIES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="rounded-full border border-[color:var(--border)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[color:var(--accent)] hover:bg-[var(--accent-soft)]"
                  onClick={() => runSearch(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--foreground-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Consultando embeddings..." : "Consultar backend"}
              </button>
              <span className="text-sm text-[var(--muted)]">
                {requestMs ? `Última respuesta: ${requestMs} ms` : "Listo para consultar"}
              </span>
            </div>
          </form>

          {error ? (
            <div className="rounded-[24px] border border-[#f4b2a2] bg-[#fff1ec] px-4 py-3 text-sm text-[#8f2d17]">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4">
              <p className="text-sm text-[var(--muted)]">Endpoint</p>
              <p className="mt-2 font-mono text-sm text-[var(--foreground)]">
                POST /api/embed
              </p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4">
              <p className="text-sm text-[var(--muted)]">Modelo</p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                {response?.model ?? "gemini-embedding-001"}
              </p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4">
              <p className="text-sm text-[var(--muted)]">Dimensiones</p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                {response?.dimensions ?? "Pendiente"}
              </p>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-6">
        <article className="rounded-[32px] border border-[color:var(--border)] bg-[#122117] p-6 text-[#f5f1e8] shadow-[0_24px_80px_rgba(10,26,21,0.12)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#adc7bc]">
                Resultado principal
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                {strongestMatch?.title ?? "Ejecuta una búsqueda para ver coincidencias"}
              </h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-[#f7d7cb]">
              {strongestMatch?.similarity ?? "--"}
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#d7e4de]">
            {strongestMatch?.text ??
              "Aquí verás el documento con mayor similitud semántica respecto a tu consulta."}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[22px] bg-white/[0.08] p-4">
              <p className="text-sm text-[#adc7bc]">Categoría</p>
              <p className="mt-2 text-sm font-semibold">
                {strongestMatch?.category ?? "Sin datos"}
              </p>
            </div>
            <div className="rounded-[22px] bg-white/[0.08] p-4">
              <p className="text-sm text-[#adc7bc]">Documentos analizados</p>
              <p className="mt-2 text-sm font-semibold">
                {response?.documentsAnalyzed ?? 0}
              </p>
            </div>
            <div className="rounded-[22px] bg-white/[0.08] p-4">
              <p className="text-sm text-[#adc7bc]">Consulta</p>
              <p className="mt-2 text-sm font-semibold">
                {response?.query ?? "Pendiente"}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[32px] border border-[color:var(--border)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(10,26,21,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
                Ranking semántico
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                Resultados ordenados por similitud de coseno
              </h3>
            </div>
            {response ? (
              <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1 text-sm text-[var(--muted)]">
                {new Date(response.generatedAt).toLocaleString("es-CO")}
              </span>
            ) : null}
          </div>

          <div className="mt-5 space-y-4">
            {response?.results.length ? (
              response.results.map((result, index) => {
                const scorePercent = Math.max(
                  0,
                  Math.min(100, Number((result.score * 100).toFixed(2))),
                );

                return (
                  <article
                    key={result.id}
                    className="rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-[var(--muted)]">
                          #{index + 1} · {result.category}
                        </p>
                        <h4 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                          {result.title}
                        </h4>
                      </div>
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--foreground)]">
                        {result.similarity}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {result.text}
                    </p>

                    <div className="mt-4 h-2 rounded-full bg-black/[0.08]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),#f6b46c,var(--secondary))]"
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[24px] border border-dashed border-[color:var(--border)] bg-white/50 px-4 py-8 text-sm leading-6 text-[var(--muted)]">
                El ranking aparecerá aquí después de consultar la API.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[32px] border border-[color:var(--border)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(10,26,21,0.08)] backdrop-blur">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
            Payload del backend
          </p>
          <pre className="mt-4 overflow-x-auto rounded-[24px] bg-[#101d18] p-4 text-sm leading-6 text-[#dfe8e3]">
            <code>
              {response
                ? JSON.stringify(response, null, 2)
                : `{
  "query": "cliente React TypeScript para embeddings",
  "results": []
}`}
            </code>
          </pre>
        </article>
      </div>
    </section>
  );
}
