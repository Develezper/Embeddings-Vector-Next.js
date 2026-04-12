import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

const EMBEDDING_MODEL = "gemini-embedding-001";

let embeddingModel: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null =
  null;

function getEmbeddingModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Configura GEMINI_API_KEY en el servidor para generar embeddings con Gemini.",
    );
  }

  if (!embeddingModel) {
    const genAI = new GoogleGenerativeAI(apiKey);
    embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  }

  return embeddingModel;
}

export function getEmbeddingModelName() {
  return EMBEDDING_MODEL;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const normalizedText = text.trim();

  if (!normalizedText) {
    throw new Error("Debes enviar un texto para generar el embedding.");
  }

  const result = await getEmbeddingModel().embedContent(normalizedText);
  return result.embedding.values;
}
