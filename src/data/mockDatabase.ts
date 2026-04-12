import { generateEmbedding } from "@/services/aiService";

export type MockDocument = {
  id: string;
  title: string;
  category: string;
  text: string;
};

export type MockEmbedding = MockDocument & {
  vector: number[];
};

export const MOCK_DOCUMENTS: MockDocument[] = [
  {
    id: "frontend-react",
    title: "Frontend con React y TypeScript",
    category: "Frontend",
    text: "React con TypeScript permite crear interfaces mantenibles con componentes reutilizables y tipado seguro.",
  },
  {
    id: "backend-next",
    title: "Backend en Next.js",
    category: "Backend",
    text: "Las Route Handlers de Next.js reciben peticiones HTTP y pueden exponer una API segura sin filtrar la API key al navegador.",
  },
  {
    id: "gemini-embeddings",
    title: "Embeddings con Gemini",
    category: "IA",
    text: "Gemini transforma una frase en un vector numérico que captura contexto semántico para comparar ideas similares.",
  },
  {
    id: "vector-search",
    title: "Búsqueda semántica",
    category: "Datos",
    text: "La búsqueda semántica compara embeddings con similitud de coseno para recuperar textos relacionados aunque no compartan palabras exactas.",
  },
  {
    id: "ganaderia-salud",
    title: "Cuidados veterinarios",
    category: "Agro",
    text: "La ganadería sostenible requiere control veterinario, buena nutrición y seguimiento del bienestar del ganado.",
  },
  {
    id: "lacteos-vacas",
    title: "Producción de leche",
    category: "Lácteos",
    text: "Las vacas producen leche diariamente y esa materia prima se utiliza para elaborar queso, yogur y otros productos lácteos.",
  },
];

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
