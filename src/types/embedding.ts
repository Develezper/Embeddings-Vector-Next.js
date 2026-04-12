export type EmbeddingMatch = {
  id: string;
  title: string;
  category: string;
  text: string;
  score: number;
  similarity: string;
};

export type EmbedApiSuccess = {
  query: string;
  model: string;
  dimensions: number;
  documentsAnalyzed: number;
  generatedAt: string;
  results: EmbeddingMatch[];
};

export type EmbedApiError = {
  error: string;
};
