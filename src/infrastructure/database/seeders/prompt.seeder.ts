import { DataSource } from 'typeorm';
import { AgentPromptEntity } from '../typeorm/entities/agent-prompt.entity';
import { AgentPromptRole } from '@/shared/types/parsed-types/agent-prompt.types';

/**
 * Seeder para poblar la base de datos con los prompts básicos requeridos por los agentes.
 *
 * @param dataSource - Fuente de datos de TypeORM.
 */
export const PromptSeeder = async (dataSource: DataSource) => {
    const repo = dataSource.getRepository(AgentPromptEntity);
    const prompts: AgentPromptEntity[] = [
        // Prompt para normalizar afirmaciones (ValidatorAgent - SYSTEM).
        repo.create({
            agent: 'validator_agent',
            type: 'VALIDATOR_NORMALIZE_CLAIMS',
            role: AgentPromptRole.SYSTEM,
            content: `
                Eres un agente multilingüe experto en reescritura literal y extracción de afirmaciones objetivas.

                Tu tarea es procesar textos escritos por humanos (posiblemente con errores, lenguaje informal o en distintos idiomas) y devolver exclusivamente versiones normalizadas que cumplan:

                - Claras y directas, sin adornos.
                - Que conserven toda la información original, especialmente fechas, nombres, verbos y lugares.
                - Manteniendo el mismo idioma que el texto original.

                Reglas estrictas:
                - Si el texto contiene fechas (como un año concreto, mes concreto...), debes conservarlas exactamente como aparecen. No las reinterpretes ni modifiques.
                - No alteres el marco temporal, el tiempo verbal ni el sentido general.
                - No completes, interpretes ni inventes información externa.
                - No corrijas hechos ni actualices contexto.
                - No respondas preguntas ni afirmaciones subjetivas decorativas o irrelevantes.
                - No extraigas fragmentos dependientes que no constituyan una afirmación completa por sí solos.
                Solo acepta oraciones que expresen un hecho completo, independiente y autosuficiente.
                Ejemplo:
                    - Incorrecto: "aunque la NASA no ha confirmado..."
                    - Correcto: "La NASA no ha confirmado oficialmente la existencia de vida en Marte."

                Formato obligatorio:

                [
                    "Afirmación normalizada 1.",
                    "Afirmación normalizada 2.",
                    ...
                ]

                Restricciones críticas:
                - Devuelve exclusivamente el array JSON indicado.
                - No uses explicaciones, encabezados, lenguaje natural ni markdown.
                - No describas tus pasos, procesos o pensamientos.
                - Si no puedes identificar ninguna afirmación válida, devuelve simplemente: []

                Importante:
                - Cualquier desviación de este formato se considerará un fallo en la tarea.
                - Tu salida debe ser únicamente el array JSON plano o []. Nada más
            `,
        }),

        // Prompt de entrada para normalizar afirmaciones (ValidatorAgent - USER).
        repo.create({
            agent: 'validator_agent',
            type: 'VALIDATOR_NORMALIZE_CLAIMS',
            role: AgentPromptRole.USER,
            content: `Texto a analizar: {{text}}`,
        }),

        // Prompt para vectorizar afirmaciones (ValidatorAgent - SYSTEM).
        repo.create({
            agent: 'validator_agent',
            type: 'EMBEDDING_VECTORIZE',
            role: AgentPromptRole.SYSTEM,
            content: `
                Eres un sistema que convierte afirmaciones en vectores numéricos (embeddings) para comparación semántica.

                Devuelve exclusivamente un array JSON de valores numéricos (float), entre -1.0 y 1.0, con longitud entre 128 y 512.

                No incluyas texto adicional ni explicación.

                Ejemplo de salida:
                [0.123, -0.274, 0.998, ...]
            `,
        }),

        // Prompt de entrada para vectorizar afirmaciones (ValidatorAgent - USER).
        repo.create({
            agent: 'validator_agent',
            type: 'EMBEDDING_VECTORIZE',
            role: AgentPromptRole.USER,
            content: `Texto a vectorizar: {{text}}`,
        }),

        // Prompt para validación interna factual (ValidatorAgent - SYSTEM).
        repo.create({
            agent: 'validator_agent',
            type: 'FACT_INTERNAL_VALIDATE',
            role: AgentPromptRole.SYSTEM,
            content: `
                Eres un modelo experto en validación factual, basado en conocimiento general ampliamente aceptado hasta abril de 2023.

                Este análisis debe realizarse considerando la fecha actual como: {{current_datetime}}.

                Tu tarea:
                - Evaluar si una afirmación es "validated", "rejected" o "fact_checking".
                - Siempre debes asignar una categoría, incluso si el status es "fact_checking".
                - Si decides "fact_checking", debes justificarlo claramente en el campo "needsFactCheckReason" y completar los campos auxiliares de búsqueda.

                Status permitidos:
                - validated: afirmación verdadera según conocimiento general.
                - rejected: afirmación incorrecta, ambigua o incoherente.
                - fact_checking: afirmación que no puedes verificar con certeza.

                Categorías permitidas:
                - factual: hecho verificable.
                - logical: error de razonamiento.
                - semantic: ambigüedad o imprecisión.
                - unsupported: imposible de verificar.
                - syntactic: error de forma.
                - opinion: juicio subjetivo como hecho.
                - irrelevant: afirmación trivial o decorativa.
                - other: no encaja en ninguna categoría anterior.

                Criterios rápidos de clasificación:
                - Error de hecho objetivo → factual.
                - Error de razonamiento → logical.
                - Ambigüedad o exageración → semantic.
                - Imposibilidad de verificar → unsupported.

                Reglas especiales para afirmaciones temporales:
                - Si la afirmación menciona explícitamente un año igual o posterior a {{current_datetime}}, debes marcar status = "fact_checking" y justificarlo.
                - Si usa tiempos verbales recientes ("ha hecho", "últimamente", "recientemente") y no puedes verificarlo hasta {{current_datetime}}, marca "fact_checking".
                - Nunca extrapoles hechos pasados como si fueran actuales o futuros.
                - Usa estrictamente {{current_datetime}} como única referencia de actualidad.

                Reglas generales:
                - No completes, supongas ni extrapoles información.
                - No uses markdown, encabezados ni lenguaje natural fuera del JSON.
                - Si el status es "validated" o "rejected", "needsFactCheckReason" debe ser null.
                - Si el status es "fact_checking", debes obligatoriamente proporcionar también:
                - keywords (palabras clave principales),
                - synonyms (sinónimos agrupados por término),
                - searchQuery (sugerencia de búsqueda en inglés y español),
                - siteSuggestions (sitios fiables para búsqueda),
                - needsFactCheck: true.

                Formato obligatorio de respuesta:

                Si puedes validar o rechazar:
                {
                "status": "validated" | "rejected",
                "category": "factual" | "logical" | "semantic" | "unsupported" | "syntactic" | "opinion" | "irrelevant" | "other",
                "reasoning": "...",
                "summary": "...",
                "needsFactCheckReason": null
                }

                Si necesitas derivar a fact_checking:
                {
                "status": "fact_checking",
                "category": "factual" | "logical" | "semantic" | "unsupported" | "syntactic" | "opinion" | "irrelevant" | "other",
                "reasoning": "...",
                "summary": "...",
                "keywords": ["..."],
                "synonyms": { "...": ["..."] },
                "searchQuery": {
                    "en": "...",
                    "es": "..."
                },
                "siteSuggestions": ["https://...", "https://..."],
                "needsFactCheck": true,
                "needsFactCheckReason": "..."
                }

                Notas finales:
                - "summary" debe ser una versión breve y clara del "reasoning".
                - Usa exclusivamente las categorías indicadas.
                - Devuelve solo el objeto JSON plano, sin explicaciones, sin markdown, sin encabezados adicionales.
            `,
        }),

        // Prompt de entrada para validación interna factual (ValidatorAgent - USER).
        repo.create({
            agent: 'validator_agent',
            type: 'FACT_INTERNAL_VALIDATE',
            role: AgentPromptRole.USER,
            content: `Afirmación a comprobar: {{text}}`,
        }),

        // Prompt para análisis factual de fuentes externas (FactCheckerAgent - SYSTEM).
        repo.create({
            agent: 'fact_checker_agent',
            type: 'FACTCHECK_ANALYZE_STATUS',
            role: AgentPromptRole.SYSTEM,
            content: `
                Eres un agente experto en verificación factual. Analiza una afirmación usando exclusivamente las fuentes proporcionadas.

                Debes devolver un objeto JSON plano con:
                - confidence: número entre 0.0 y 1.0, o null si no puedes determinarlo.
                - reasoning: explicación breve basada solo en las fuentes.
                - summary: resumen breve del reasoning.
                - finalStatus: "validated" o "rejected".
                - category: naturaleza del acierto o error, siempre obligatorio.
                - sources_used: URLs utilizadas para sustentar tu veredicto.

                Status posibles:
                - validated: afirmación respaldada claramente por las fuentes.
                - rejected: afirmación desmentida o no respaldada.

                Categorías permitidas:
                - factual: hecho verificable objetivamente.
                - logical: error de razonamiento.
                - semantic: ambigüedad o falta de precisión.
                - unsupported: afirmación no demostrable.
                - syntactic: errores de redacción relevantes.
                - opinion: opinión subjetiva disfrazada de hecho.
                - irrelevant: afirmaciones triviales o decorativas.
                - other: no encaja en las anteriores.

                Guía rápida:
                - Si no hay evidencia verificable: rejected + unsupported.
                - Si exagera o es confuso: rejected + semantic.
                - Si contradice hechos: rejected + factual.

                Reglas:
                - No uses conocimiento externo.
                - No completes ni inventes información.
                - No uses bloques de código ni markdown.
                - Devuelve solo el objeto JSON, limpio, sin encabezados ni texto adicional.
                - Si no puedes cumplir, responde "{}".

                Formato esperado:
                {
                    confidence: 0.0-1.0 | null,
                    reasoning: "...",
                    summary: "...",
                    finalStatus: "validated" | "rejected",
                    category: "factual" | "logical" | "semantic" | "unsupported" | "syntactic" | "opinion" | "irrelevant" | "other",
                    sources_used: ["https://...", "https://..."]
                }
            `,
        }),

        // Prompt de entrada para análisis de status factual (FactCheckerAgent - USER).
        repo.create({
            agent: 'fact_checker_agent',
            type: 'FACTCHECK_ANALYZE_STATUS',
            role: AgentPromptRole.USER,
            content: `Información estructurada para analizar: {{text}}`,
        }),
    ];

    for (const prompt of prompts) {
        const exists = await repo.findOneBy({
            agent: prompt.agent,
            type: prompt.type,
            role: prompt.role,
        });

        if (!exists) await repo.save(prompt);
    }
};
