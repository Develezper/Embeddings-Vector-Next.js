import { NextResponse } from "next/server";
import { getMockEmbeddings } from "@/data/mockDatabase";
import { cosineSimilarity } from "@/lib/utils";
import {
  generateEmbedding,
  getEmbeddingModelName,
} from "@/services/aiService";
import type { EmbedApiError, EmbedApiSuccess } from "@/types/embedding";

export const runtime = "nodejs";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Ocurrió un error inesperado al generar embeddings.";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: unknown };
    const query =
      typeof body.query === "string" ? body.query.trim().replace(/\s+/g, " ") : "";

    if (!query) {
      return NextResponse.json<EmbedApiError>(
        { error: "Debes enviar un texto en el campo `query`." },
        { status: 400 },
      );
    }

    const [queryVector, database] = await Promise.all([
      generateEmbedding(query),
      getMockEmbeddings(),
    ]);

    const results = database
      .map((item) => {
        const score = cosineSimilarity(queryVector, item.vector);

        return {
          id: item.id,
          title: item.title,
          category: item.category,
          text: item.text,
          score,
          similarity: `${(score * 100).toFixed(2)}%`,
        };
      })
      .sort((left, right) => right.score - left.score);

    return NextResponse.json<EmbedApiSuccess>({
      query,
      model: getEmbeddingModelName(),
      dimensions: queryVector.length,
      documentsAnalyzed: database.length,
      generatedAt: new Date().toISOString(),
      results,
    });
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("Embedding Error:", error);

    return NextResponse.json<EmbedApiError>(
      { error: message },
      { status: 500 },
    );
  }
}
