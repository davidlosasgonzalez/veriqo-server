import { FindingSearchContext } from '../../../agents/validator-agent/domain/entities/finding-search-context';

import { AgentPrompt } from './agent-prompt';

export class AgentLog {
    constructor(
        private readonly id: string,
        private readonly agentName: string,
        private readonly model: string,
        private readonly inputPrompt: string,
        private readonly outputResult: string,
        private readonly tokensInput: number,
        private readonly tokensOutput: number,
        private readonly createdAt: Date,
        private readonly elapsedTime?: number | null,
        private readonly prompt?: AgentPrompt | null,
        private readonly searchContext?: FindingSearchContext | null,
    ) {
        if (!id) throw new Error('El ID del log es obligatorio.');

        if (!agentName) throw new Error('El nombre del agente es obligatorio.');

        if (!model) throw new Error('El modelo utilizado es obligatorio.');

        if (!inputPrompt)
            throw new Error('El prompt de entrada es obligatorio.');

        if (!outputResult)
            throw new Error('El resultado de salida es obligatorio.');

        if (tokensInput < 0)
            throw new Error('Los tokens de entrada no pueden ser negativos.');

        if (tokensOutput < 0)
            throw new Error('Los tokens de salida no pueden ser negativos.');

        if (!createdAt) throw new Error('La fecha de creación es obligatoria.');
    }

    getId() {
        return this.id;
    }

    getAgentName() {
        return this.agentName;
    }

    getModel() {
        return this.model;
    }

    getInputPrompt() {
        return this.inputPrompt;
    }

    getOutputResult() {
        return this.outputResult;
    }

    getTokensInput() {
        return this.tokensInput;
    }

    getTokensOutput() {
        return this.tokensOutput;
    }

    getElapsedTime() {
        return this.elapsedTime;
    }

    getPrompt() {
        return this.prompt;
    }

    getSearchContext() {
        return this.searchContext;
    }

    getCreatedAt() {
        return this.createdAt;
    }
}
