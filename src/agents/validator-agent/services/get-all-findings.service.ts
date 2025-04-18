import { Injectable } from '@nestjs/common';
import { ValidationFindingDto } from '../dto/validation-finding.dto';
import { AgentFindingService } from '@/shared/facts/services/agent-finding.service';

/**
 * Servicio para recuperar todos los findings generados por el ValidatorAgent.
 */
@Injectable()
export class GetAllFindingsService {
    constructor(private readonly agentFindingService: AgentFindingService) {}

    /**
     * Devuelve todos los findings almacenados en base de datos.
     * Este método no aplica paginación.
     * @returns Lista completa de findings transformados en DTO.
     */
    async execute(): Promise<ValidationFindingDto[]> {
        const all = await this.agentFindingService.findAll();
        return all.map((finding) => finding.mapToDto());
    }
}
