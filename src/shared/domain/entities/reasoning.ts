import { FactReasoning } from '../value-objects/fact-reasoning.vo';
import { ReasoningSummary } from '../value-objects/reasoning-summary.vo';

export class Reasoning {
    constructor(
        private readonly id: string,
        private readonly summary: ReasoningSummary,
        private readonly content: FactReasoning,
        private readonly createdAt: Date,
        private readonly updatedAt: Date,
        private readonly verificationId?: string | null,
        private readonly factId?: string | null,
    ) {
        if (!id) throw new Error('El ID del razonamiento es obligatorio.');

        if (!summary) throw new Error('El resumen es obligatorio.');

        if (!content)
            throw new Error('El contenido del razonamiento es obligatorio.');

        if (!createdAt) throw new Error('La fecha de creación es obligatoria.');

        if (!updatedAt)
            throw new Error('La fecha de modificación es obligatoria.');
    }

    getId(): string {
        return this.id;
    }

    getSummary(): ReasoningSummary {
        return this.summary;
    }

    getContent(): FactReasoning {
        return this.content;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getVerificationId(): string | null | undefined {
        return this.verificationId;
    }

    getFactId(): string | null | undefined {
        return this.factId;
    }
}
