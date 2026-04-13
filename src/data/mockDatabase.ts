import "server-only";
import { generateEmbedding } from "@/services/aiService";
import mockDocuments from "./mockDatabase.json";

export type MockDocument = {
  id: string;
  title: string;
  category: string;
  text: string;
};

export type MockEmbedding = MockDocument & {
  vector: number[];
};

export const MOCK_DOCUMENTS = mockDocuments as MockDocument[];

let mockEmbeddingCache: Promise<MockEmbedding[]> | null = null;

export async function getMockEmbeddings(): Promise<MockEmbedding[]> {
  if (!mockEmbeddingCache) {
    // Cacheamos los embeddings del dataset para no recalcularlos en cada búsqueda.
    mockEmbeddingCache = Promise.all(
      MOCK_DOCUMENTS.map(async (document) => ({
        ...document,
        vector: await generateEmbedding(document.text),
      })),
    ).catch((error: unknown) => {
      mockEmbeddingCache = null;
      throw error;
    });
  }

  return mockEmbeddingCache;
}
