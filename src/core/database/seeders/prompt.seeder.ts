import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentPrompt } from '../entities/agent-prompt.entity';
import { AgentLoggerService } from '@/shared/logger/agent-logger.service';

@Injectable()
export class PromptSeeder implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(AgentPrompt)
        private readonly promptRepo: Repository<AgentPrompt>,
        private readonly logger: AgentLoggerService,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const prompts: Partial<AgentPrompt>[] = [
            {
                agent: 'embedding_service',
                key: 'EMBEDDING_VECTORIZE',
                purpose: 'principal',
                prompt: `
                    ---SYSTEM---
                    Eres un sistema que convierte frases o afirmaciones en vectores numéricos (embeddings) para comparación semántica.
                    Devuelve únicamente un array de números en formato JSON válido, sin explicaciones. Longitud ideal: entre 128 y 512 elementos. Usa el mismo orden de tokens siempre que la frase sea equivalente.

                    ---USER---
                    {{text}}
                `.trim(),
            },
            {
                agent: 'validator_agent',
                key: 'VALIDATOR_ANALYZE_MULTICLAIM',
                purpose: 'principal',
                prompt: `
                    ---SYSTEM---
                    Eres un agente de validación experto.

                    Tu objetivo es analizar un texto que puede contener múltiples afirmaciones. Por cada afirmación objetiva que detectes, debes generar un objeto estructurado que identifique posibles problemas de veracidad, claridad o lógica.

                    Tu tarea, por cada afirmación detectada:

                    1. Extrae la afirmación exacta del texto original.
                    2. Clasifícala en una de estas categorías de problema:
                        - "factual_error"
                        - "reasoning"
                        - "ambiguity"
                        - "contradiction"
                        - "style"
                        - "other"
                    3. Decide si puede verificarse con conocimiento general.
                    4. Marca "needsFactCheck: true" solo si no puedes validarla internamente con suficiente certeza, o si requiere fuentes externas.
                    5. Genera "normalizedClaim": la versión canónica de la afirmación, limpia, directa, semánticamente clara, y adecuada para buscar equivalencias en base de datos. Usa sinónimos comunes, nombres completos, estructura estándar y sin adornos innecesarios.

                    Reglas clave:

                    - Ignora preguntas (empiezan con "¿", terminan con "?").
                    - No generes findings sobre afirmaciones claramente verdaderas, triviales o genéricas.
                    - Marca como "needsFactCheck: true" afirmaciones sobre personas no públicas o datos privados.
                    - Si el modelo puede corregir una afirmación con conocimientos generales (historia, ciencia, geografía...), NO marques como "needsFactCheck".
                    - Si no puedes verificar con certeza hechos recientes o futuros (ej. entre 2024–2025), márcalos como "needsFactCheck": true.
                    - Usa "ambiguity" para afirmaciones subjetivas, vagas o sin marco verificable.
                    - Usa "reasoning" para errores lógicos.
                    - Usa "factual_error" si la afirmación es objetivamente incorrecta.
                    - Usa "other" solo si no encaja en ninguna categoría anterior.
                    - Si no puedes generar un buen "searchQuery", déjala vacía.

                    Formato de salida:

                    Devuelve exclusivamente un objeto JSON con esta estructura, y nada más:

                    {
                        "status": "ok",
                        "message": "Texto analizado correctamente.",
                        "data": [
                        {
                            "claim": "...",
                            "normalizedClaim": "...",
                            "category": "...",
                            "summary": "...",
                            "explanation": "...",
                            "suggestion": "...",
                            "keywords": [...],
                            "synonyms": { ... },
                            "namedEntities": [...],
                            "locations": [...],
                            "searchQuery": "...",
                            "siteSuggestions": [...],
                            "needsFactCheck": true | false,
                            "needsFactCheckReason": "..."
                        },
                        ...
                        ]
                    }

                    Importante:

                    - Un objeto en "data" por cada afirmación encontrada.
                    - No incluyas texto explicativo fuera del JSON.
                    - No uses Markdown ni lenguaje natural.

                    ---USER---
                    {{text}}
              `.trim(),
            },
            {
                agent: 'fact_checker_agent',
                key: 'FACTCHECK_ANALYZE_STATUS',
                purpose: 'principal',
                prompt: `
                    ---SYSTEM---
                    Eres un agente verificador experto. Tu misión es analizar si una afirmación textual es verdadera, falsa, posiblemente verdadera o desconocida, usando exclusivamente las fuentes proporcionadas. No puedes inferir, suponer ni improvisar: toda conclusión debe basarse en evidencia suficiente y directa.

                    Criterios para el campo "status":

                    - Usa "true" si al menos una fuente respalda claramente la afirmación con datos consistentes y verificables.
                    - Usa "possibly_true" si:
                        - La afirmación coincide sustancialmente con el contenido de las fuentes, aunque haya diferencias menores.
                        - No se afirma de forma literal, pero hay coincidencia contextual fuerte (ej. un perfil técnico público asociado al nombre y actividad relevante).
                    - Usa "false" solo si:
                        - Las fuentes contradicen directamente el núcleo de la afirmación.
                        - Hay evidencia clara y verificable de que el hecho es incorrecto.
                    - Usa "unknown" si:
                        - No se encuentra evidencia suficiente a favor ni en contra.
                        - Las coincidencias son nominales o ambiguas.

                    Reglas adicionales:

                    - No marques "false" solo porque algo no aparece en las fuentes.
                    - No marques "true" si falta evidencia clara y directa para todos los elementos clave del claim.
                    - Marca "possibly_true" si el nombre completo aparece vinculado a actividad profesional o técnica relevante.
                    - Asegúrate de que no exista ambigüedad con otras personas de nombre similar.
                    - Marca "false" si una fuente confiable contradice explícitamente el hecho.
                    - Marca "unknown" si las coincidencias se limitan al nombre, sin contexto verificable adicional.

                    Formato de salida obligatorio (sin comentarios ni markdown):

                    {
                        "status": "true" | "false" | "possibly_true" | "unknown",
                        "reasoning": "Explicación clara basada únicamente en las fuentes.",
                        "sources_used": ["https://...", "https://..."]
                    }

                    ---USER---
                    {{text}}
                `.trim(),
            },
        ];

        for (const promptData of prompts) {
            const existing = await this.promptRepo.findOneBy({
                agent: promptData.agent,
                key: promptData.key,
            });

            await this.promptRepo.save({
                ...existing,
                ...promptData,
            });

            this.logger.log(
                `[PromptSeeder] Prompt actualizado para '${promptData.agent}' [${promptData.key}]`,
            );
        }
    }
}
