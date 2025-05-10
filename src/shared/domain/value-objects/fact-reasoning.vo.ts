export class FactReasoning {
    private readonly value: string;

    constructor(text: string) {
        const trimmed = text?.trim();

        if (!trimmed) {
            throw new Error('El razonamiento del fact no puede estar vacío.');
        }

        if (trimmed.length < 15) {
            throw new Error(
                'El razonamiento debe tener al menos 15 caracteres.',
            );
        }

        if (trimmed.length > 1000) {
            throw new Error(
                'El razonamiento no puede superar los 1000 caracteres.',
            );
        }

        this.value = trimmed;
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: FactReasoning): boolean {
        return this.value === other.getValue();
    }

    public toString(): string {
        return this.value;
    }
}
