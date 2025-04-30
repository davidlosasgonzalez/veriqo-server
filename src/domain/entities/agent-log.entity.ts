import { AgentFindingSearchContext } from './agent-finding-search-context.entity';
import { AgentPrompt } from './agent-prompt.entity';

/**
 * Representa un log generado por un agente o servicio del sistema.
 */
export class AgentLog {
    /* Identificador único del log. */
    id!: string;

    /* Nombre del agente que generó el log. */
    agentName!: string;

    /* Modelo utilizado (por ejemplo: GPT-4o, Claude 3.5). */
    model!: string;

    /* Prompt de entrada enviado al modelo. */
    inputPrompt!: string;

    /* Resultado generado por el modelo. */
    outputResult!: string;

    /* Tokens de entrada consumidos. */
    tokensInput!: number;

    /* Tokens de salida generados. */
    tokensOutput!: number;

    /* Tiempo total que tardó la operación (en segundos, opcional). */
    elapsedTime?: number | null;

    /* Prompt asociado (opcional). */
    prompt?: AgentPrompt | null;

    /* Contexto de búsqueda asociado (opcional). */
    searchContext?: AgentFindingSearchContext | null;

    /* Fecha de creación del log. */
    createdAt!: Date;
}
