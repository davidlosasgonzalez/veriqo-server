import { env } from '@/config/env/env.config';

export class ClaimText {
    private readonly value: string;

    constructor(text: string) {
        const trimmed = text?.trim();
        const maxLength = env.VALIDATOR_MAX_INPUT_CHARS;

        if (!trimmed) {
            throw new Error('ClaimText no puede estar vacío.');
        }

        if (trimmed.length < 10) {
            throw new Error('ClaimText debe tener al menos 10 caracteres.');
        }

        if (trimmed.length > maxLength) {
            throw new Error(
                `ClaimText no puede superar los ${maxLength} caracteres.`,
            );
        }

        this.value = trimmed;
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ClaimText): boolean {
        return this.value === other.getValue();
    }

    public toString(): string {
        return this.value;
    }
}
