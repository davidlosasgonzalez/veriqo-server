import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { average } from '../utils/math/average';
import { AgentLog } from '@/core/database/entities/agent-log.entity';
import { SearchEngineUsed } from '@/shared/types/search-engine-used.type';

/**
 * Servicio de logging técnico de actividad de los agentes de IA.
 * Registra prompts, resultados, modelos y métricas de búsqueda.
 */
@Injectable()
export class AgentLoggerService extends Logger {
    constructor(
        @InjectRepository(AgentLog)
        private readonly agentLogRepo: Repository<AgentLog>,
    ) {
        super();
    }

    /**
     * Crea y guarda un log técnico generado por un agente.
     *
     * @param agentName Nombre del agente (ej. ValidatorAgent)
     * @param model Nombre del modelo LLM usado
     * @param inputPrompt Prompt enviado al modelo
     * @param outputResult Respuesta generada por el modelo
     * @param tokensInput Tokens consumidos en entrada
     * @param tokensOutput Tokens generados en salida
     * @param options Opcionales: motor de búsqueda, query, resultados
     */
    async create(
        agentName: string,
        model: string,
        inputPrompt: string,
        outputResult: string,
        tokensInput: number,
        tokensOutput: number,
        options?: {
            searchQuery?: string;
            engineUsed?: SearchEngineUsed;
            totalResults?: number;
        },
    ): Promise<void> {
        const log = this.agentLogRepo.create({
            agentName,
            model,
            inputPrompt,
            outputResult,
            tokensInput,
            tokensOutput,
            searchQuery: options?.searchQuery,
            engineUsed: options?.engineUsed,
            totalResults: options?.totalResults,
        });

        await this.agentLogRepo.save(log);
    }

    /**
     * Devuelve todos los logs registrados por los agentes, ordenados por fecha descendente.
     */
    async findAll(): Promise<AgentLog[]> {
        return this.agentLogRepo.find({
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Genera un resumen estadístico del uso de motores de búsqueda y promedio de resultados.
     */
    async getStats(): Promise<{
        totalLogs: number;
        engines: Record<string, number>;
        averageResults: Record<string, number>;
    }> {
        const logs = await this.agentLogRepo.find();

        const summary = {
            totalLogs: logs.length,
            engines: {
                brave: logs.filter((log) => log.engineUsed === 'brave').length,
                google: logs.filter((log) => log.engineUsed === 'google')
                    .length,
                newsapi: logs.filter((log) => log.engineUsed === 'newsapi')
                    .length,
                fallback: logs.filter((log) => log.engineUsed === 'fallback')
                    .length,
                unknown: logs.filter((log) => !log.engineUsed).length,
            },
            averageResults: {
                brave: average(
                    logs
                        .filter((l) => l.engineUsed === 'brave')
                        .map((l) => l.totalResults ?? 0),
                ),
                google: average(
                    logs
                        .filter((l) => l.engineUsed === 'google')
                        .map((l) => l.totalResults ?? 0),
                ),
                newsapi: average(
                    logs
                        .filter((l) => l.engineUsed === 'newsapi')
                        .map((l) => l.totalResults ?? 0),
                ),
                fallback: average(
                    logs
                        .filter((l) => l.engineUsed === 'fallback')
                        .map((l) => l.totalResults ?? 0),
                ),
                unknown: average(
                    logs
                        .filter((l) => !l.engineUsed)
                        .map((l) => l.totalResults ?? 0),
                ),
            },
        };

        return summary;
    }
}
