import { Reasoning } from './reasoning';

export class Verification {
    constructor(
        private readonly id: string,
        private readonly engineUsed: string | null,
        private readonly confidence: number | null,
        private readonly sourcesRetrieved: string[],
        private readonly sourcesUsed: string[],
        private readonly isOutdated: boolean,
        private readonly createdAt: Date,
        private readonly updatedAt: Date,
        private readonly reasoning: Reasoning | null = null,
        private factId?: string | null,
    ) {
        if (!id) throw new Error('La verificación requiere un ID.');

        if (!createdAt || !updatedAt) throw new Error('Fechas inválidas.');
    }

    getId(): string {
        return this.id;
    }

    getEngineUsed(): string | null {
        return this.engineUsed;
    }

    getConfidence(): number | null {
        return this.confidence;
    }

    getSourcesRetrieved(): string[] {
        return this.sourcesRetrieved;
    }

    getSourcesUsed(): string[] {
        return this.sourcesUsed;
    }

    getIsOutdated(): boolean {
        return this.isOutdated;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getReasoning(): Reasoning | null {
        return this.reasoning;
    }

    getFactId(): string | null | undefined {
        return this.factId;
    }

    unsetFactId(): void {
        this.factId = undefined;
    }
}
