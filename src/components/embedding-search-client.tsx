"use client";

import { useState, useTransition } from "react";
import type { EmbedApiError, EmbedApiSuccess } from "@/types/embedding";

const QUICK_QUERIES = [
  "dashboard de ventas para retail",
  "reporte mensual de clientes y facturacion",
  "optimizacion de procesos en logistica",
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

function getRelevanceLabel(score: number) {
  if (score >= 0.9) {
    return "Muy relacionado";
  }

  if (score >= 0.75) {
    return "Relacionado";
  }

  if (score >= 0.55) {
    return "Puede servir";
  }

  return "Coincidencia baja";
}

export default function EmbeddingSearchClient() {
  const [query, setQuery] = useState(QUICK_QUERIES[0]);
  const [response, setResponse] = useState<EmbedApiSuccess | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function runSearch(nextQuery: string) {
    const normalizedQuery = nextQuery.trim();

    if (!normalizedQuery) {
      setError("Escribe una palabra o frase antes de consultar.");
      setResponse(null);
      return;
    }

    setQuery(normalizedQuery);
    setError(null);

    startTransition(async () => {
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
        setRecentQueries((prev) => {
          const next = [normalizedQuery, ...prev.filter((item) => item !== normalizedQuery)];
          return next.slice(0, 5);
        });
      } catch (caughtError) {
        setResponse(null);
        setError(getErrorMessage(caughtError));
      }
    });
  }

  const strongestMatch = response?.results[0] ?? null;
  const totalResults = response?.results.length ?? 0;

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-[color:var(--border)] bg-[var(--panel)] p-6 shadow-[0_24px_60px_rgba(10,26,21,0.08)] backdrop-blur">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Explora
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
              Describe lo que estas buscando
            </h2>
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
                className="min-h-28 w-full rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent-soft)]"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ejemplo: necesito ideas para mejorar soporte al cliente"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {QUICK_QUERIES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:border-[color:var(--accent)] hover:bg-[var(--accent-soft)]"
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
                {isPending ? "Buscando..." : "Buscar"}
              </button>
              <button
                type="button"
                className="rounded-full border border-[color:var(--border)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[color:var(--accent)]"
                onClick={() => {
                  setQuery("");
                  setResponse(null);
                  setError(null);
                }}
              >
                Limpiar
              </button>
              <span className="text-sm text-[var(--muted)]">
                {isPending ? "Estamos revisando coincidencias..." : "Listo para buscar"}
              </span>
            </div>
          </form>

          {error ? (
            <div className="rounded-2xl border border-[#f4b2a2] bg-[#fff1ec] px-4 py-3 text-sm text-[#8f2d17]">
              {error}
            </div>
          ) : null}

          {recentQueries.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Busquedas recientes
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {recentQueries.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1 text-xs text-[var(--foreground)]"
                    onClick={() => runSearch(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>

      <div className="grid gap-4">
        <article className="rounded-3xl border border-[color:var(--border)] bg-[#122117] p-6 text-[#f6f1e8] shadow-[0_24px_60px_rgba(10,26,21,0.12)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#adc7bc]">
                Resultado destacado
              </p>
              <h3 className="mt-2 text-xl font-semibold">
                {strongestMatch?.title ?? "Sin resultados aun"}
              </h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f7d7cb]">
              {strongestMatch ? getRelevanceLabel(strongestMatch.score) : "--"}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#d7e4de]">
            {strongestMatch?.text ??
              "Cuando consultes, aqui veras el documento mas cercano."}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/[0.08] p-3">
              <p className="text-xs text-[#adc7bc]">Tema</p>
              <p className="mt-1 text-sm font-semibold">
                {strongestMatch?.category ?? "--"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.08] p-3">
              <p className="text-xs text-[#adc7bc]">Resultados</p>
              <p className="mt-1 text-sm font-semibold">
                {totalResults}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.08] p-3">
              <p className="text-xs text-[#adc7bc]">Tu busqueda</p>
              <p className="mt-1 text-sm font-semibold">
                {response?.query ?? "--"}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-[color:var(--border)] bg-[var(--panel)] p-6 shadow-[0_24px_60px_rgba(10,26,21,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                Resultados
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                Coincidencias encontradas
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {response
                  ? `${totalResults} opciones para revisar`
                  : "Aqui apareceran las opciones mas cercanas a tu busqueda"}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {response?.results.length ? (
              response.results.map((result, index) => (
                <article
                  key={result.id}
                  className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-[var(--muted)]">
                        Opcion {index + 1}
                      </p>
                      <h4 className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                        {result.title}
                      </h4>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {result.category}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                      {getRelevanceLabel(result.score)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {result.text}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-white/50 px-4 py-6 text-sm text-[var(--muted)]">
                Aun no hay resultados. Ejecuta una consulta para ver el ranking.
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
