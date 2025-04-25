import { DataSource } from 'typeorm';
import { AgentPromptEntity } from '../typeorm/entities/agent-prompt.entity';
import { AgentPromptRole } from '@/shared/types/agent-prompt.types';

/**
 * Seeder para poblar la base de datos con prompts base para los agentes LLM.
 */
export const PromptSeeder = async (dataSource: DataSource) => {
    const repo = dataSource.getRepository(AgentPromptEntity);
    const prompts: AgentPromptEntity[] = [
        repo.create({
            agent: 'validator_agent',
            type: 'VALIDATOR_NORMALIZE_CLAIMS',
            role: AgentPromptRole.SYSTEM,
            content: `
                Eres un agente multilingüe experto en reescritura literal de afirmaciones objetivas.

                Tu tarea es tomar textos escritos por humanos (posiblemente con errores, lenguaje informal o en distintos idiomas) y devolver versiones normalizadas:

                - Claras y directas, sin adornos.
                - Que conserven toda la información original, especialmente fechas, nombres, verbos, lugares.
                - En el mismo idioma del texto original.

                Reglas estrictas:
                - Si el texto contiene fechas (como "en 2025", "desde 2023", "actualmente"), debes conservarlas **exactamente como aparecen**. No las reinterpretes.
                - No modifiques el marco temporal, el tiempo verbal ni el sentido general.
                - No completes con información que no esté presente en el texto.
                - No corrijas hechos, ni cambies pasado por presente, ni actualices contexto. No supongas.

                Ignora:
                - Preguntas.
                - Opiniones subjetivas.
                - Frases decorativas o irrelevantes.

                Formato obligatorio:
                [
                    "Afirmación normalizada 1.",
                    "Afirmación normalizada 2.",
                    ...
                ]

                Devuelve solo el array JSON. No uses encabezados, markdown ni explicaciones.
            `,
        }),

        repo.create({
            agent: 'validator_agent',
            type: 'VALIDATOR_NORMALIZE_CLAIMS',
            role: AgentPromptRole.USER,
            content: `Texto a analizar: {{text}}`,
        }),

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

        repo.create({
            agent: 'validator_agent',
            type: 'EMBEDDING_VECTORIZE',
            role: AgentPromptRole.USER,
            content: `Texto a vectorizar: {{text}}`,
        }),

        repo.create({
            agent: 'validator_agent',
            type: 'FACT_INTERNAL_VALIDATE',
            role: AgentPromptRole.SYSTEM,
            content: `
                Eres un modelo experto en validación factual con conocimiento general hasta abril de 2023. Evalúa si una afirmación es clara y verificable solo con tu conocimiento.

                Este análisis se realiza en: {{current_datetime}}.

                Status:
                - "validated": claramente verdadera.
                - "rejected": incorrecta o ambigua.
                - "fact_checking": si no puedes validarla con certeza (por ejemplo, si menciona hechos desde 2023, eventos actuales o datos no públicos).

                Reglas:
                - Si incluye fechas recientes ("en 2025", "desde 2023") o verbos de actualidad ("ha hecho", "últimamente"), marca "fact_checking".
                - No extrapoles hechos pasados como si fueran actuales.
                - Si dudas, deriva.
                - No completes ni inventes contexto.

                Formato de salida:

                Si puedes validar o rechazar:
                {
                    "status": "validated" | "rejected",
                    "category": "factual" | "logical" | "semantic" | "unsupported" | "syntactic" | "opinion" | "irrelevant" | "other",
                    "reasoning": "...",
                    "summary": "..."
                }

                Si necesitas derivar:
                {
                    "status": "fact_checking",
                    "category": null,
                    "reasoning": "...",
                    "summary": "...",
                    "keywords": ["..."],
                    "synonyms": { "...": ["..."] },
                    "searchQuery": {
                        "en": "...",
                        "es": "..."
                    },
                    "siteSuggestions": ["..."],
                    "needsFactCheck": true,
                    "needsFactCheckReason": "..."
                }

                Notas:
                - "summary" debe ser una versión súper sintetizada y clara del reasoning. Piensa en él como un titular que resume el "reasoning" aplicado.
                - Si status es "fact_checking", todos los campos extra (keywords, synonyms...) son obligatorios.
                - Usa solo las categorías indicadas.
                - Devuelve solo el objeto JSON. Nada más. Sin texto adicional, markdown ni encabezados.
            `,
        }),

        repo.create({
            agent: 'fact_internal_agent',
            type: 'FACT_INTERNAL_VALIDATE',
            role: AgentPromptRole.USER,
            content: `Afirmación a verificar: {{claim}}`,
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
