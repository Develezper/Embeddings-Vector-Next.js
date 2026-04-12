# Embeddings Vector Next.js

Este proyecto es una aplicacion hecha con Next.js que permite probar una busqueda semantica usando embeddings de Gemini.

La idea principal es simple: el usuario escribe una frase en el front, la app envia esa consulta al backend, el backend genera un embedding con Gemini y luego compara ese vector contra un conjunto de textos de ejemplo. Al final, la interfaz muestra cuales textos se parecen mas a lo que el usuario quiso decir, aunque no usen exactamente las mismas palabras.

## Que hace este proyecto

- ofrece una interfaz sencilla para escribir una consulta
- envia la consulta a una ruta interna del proyecto
- genera embeddings en el servidor usando `GEMINI_API_KEY`
- compara la consulta con un dataset de ejemplo
- devuelve un ranking de resultados ordenados por similitud

## Como funciona

El flujo general es este:

1. El usuario escribe una frase en el front.
2. El cliente envia un `POST` a `src/app/api/embed/route.ts`.
3. El servidor genera el embedding de la consulta con Gemini.
4. El servidor compara ese vector con los embeddings del dataset local.
5. La app muestra el resultado mas cercano y el resto de coincidencias.

## Estructura principal

- `src/app/page.tsx`: pagina principal
- `src/components/embedding-search-client.tsx`: interfaz donde el usuario hace la busqueda
- `src/app/api/embed/route.ts`: endpoint interno que procesa la consulta
- `src/services/aiService.ts`: integracion con Gemini
- `src/data/mockDatabase.ts`: textos de ejemplo usados para comparar
- `src/lib/utils.ts`: utilidad para calcular similitud de coseno

## Requisitos

- Bun
- Node.js 20 o superior
- una clave valida en `GEMINI_API_KEY`

## Como ejecutarlo

1. Instala dependencias:

```bash
bun install
```

2. Crea tu archivo `.env` y agrega:

```env
GEMINI_API_KEY=tu_api_key
```

3. Inicia el proyecto:

```bash
bun run dev
```

4. Abre en el navegador:

```txt
http://localhost:3000
```

## Scripts utiles

```bash
bun run dev
bun run lint
bun run build
bun run start
```
