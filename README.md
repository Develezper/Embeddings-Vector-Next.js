# Embeddings-Vector-Next.js
Implementación de consumo de api gemini para sacar los vectores sea de una palabra u una frase


# Implementación de Vector Embeddings con Gemini e IA

Este proyecto demuestra cómo implementar un sistema de búsqueda semántica utilizando **Vector Embeddings**. Se enfoca en la arquitectura de software, la separación de responsabilidades y el cálculo matemático de similitud.

## 1. Arquitectura del Proyecto

Para este taller, hemos aplicado una arquitectura minimalista en **Next.js** y **TypeScript** para separar las capas de la aplicación:

* **src/services/aiService.ts**: Capa de infraestructura. Contiene la comunicación directa con el SDK de Google Generative AI (Gemini) para transformar texto en vectores.
* **src/lib/utils.ts**: Capa de utilidades. Contiene la lógica matemática pura (Similitud de Coseno).
* **src/data/mockDatabase.ts**: Capa de datos. Simula una base de datos vectorial con registros "quemados" (textos + vectores) para demostraciones deterministas.
* **src/app/api/embed/route.ts**: Controlador (API Route). Orquesta el flujo: recibe la petición, llama al servicio de IA, ejecuta la comparación y retorna los resultados ordenados.

---

## 2. Conceptos Clave

### ¿Qué es un Embedding?
Es una representación numérica (vector) de un concepto. A diferencia de una búsqueda por palabras clave, los embeddings capturan el **contexto semántico**.

### Similitud de Coseno
Es la métrica utilizada para medir qué tan parecidos son dos vectores en un espacio multidimensional. El resultado varía entre **-1** y **1** (donde 1 es identidad total).

**Fórmula Matemática:**

$$\text{similarity} = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$$

Donde:
* $\mathbf{A} \cdot \mathbf{B}$ es el producto punto de los vectores.
* $\|\mathbf{A}\|$ es la magnitud (norma) del vector A.

---

## 3. Guía de Ejercicio en Vivo (Similitud Manual)

Para demostrar la matemática a los estudiantes, se puede realizar este ejemplo simplificado con vectores de 2 dimensiones ($X, Y$).

### Paso a paso del cálculo:

**Vectores:**
* **A (Vaca):** `[1, 2]`
* **B (Queso):** `[1.5, 2.5]`

**1. Producto Punto ($A \cdot B$):**
$(1 \times 1.5) + (2 \times 2.5) = 1.5 + 5 = \mathbf{6.5}$

**2. Magnitud de A ($\|A\|$):**
$\sqrt{1^2 + 2^2} = \sqrt{1 + 4} = \mathbf{2.23}$

**3. Magnitud de B ($\|B\|$):**
$\sqrt{1.5^2 + 2.5^2} = \sqrt{2.25 + 6.25} = \sqrt{8.5} = \mathbf{2.91}$

**4. Resultado Final:**
$6.5 / (2.23 \times 2.91) = 6.5 / 6.48 = \mathbf{1.00}$ (Similitud muy alta)

---

## 4. Flujo de Ejecución del Taller

1.  **Configuración de Entorno**: Crear archivo `.env` con la `GEMINI_API_KEY`.
2.  **Generación de Vectores**: Explicar cómo el SDK de Google transforma un string en un array de 768 números flotantes.
3.  **Búsqueda Semántica**:
    * Enviar una consulta (Query) desde el cliente.
    * Vectorizar la consulta en tiempo real.
    * Comparar contra la `mockDatabase`.
4.  **Visualización**: Exportar los datos generados a archivos `.tsv` para explorarlos visualmente en el **TensorFlow Embedding Projector**.

---

## 5. Requisitos Técnicos

* Node.js 18+
* Next.js 14/15 (App Router)
* Google Generative AI SDK (`@google/generative-ai`)
* TypeScript
