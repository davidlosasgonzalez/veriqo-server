export class ReasoningSummary {
    private readonly value: string;

    constructor(text: string) {
        const trimmed = text?.trim();

        if (!trimmed) {
            throw new Error(
                'El resumen del razonamiento no puede estar vacío.',
            );
        }

        if (trimmed.length < 5) {
            throw new Error('El resumen debe tener al menos 5 caracteres.');
        }

        if (trimmed.length > 200) {
            throw new Error('El resumen no puede superar los 200 caracteres.');
        }

        this.value = trimmed;
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ReasoningSummary): boolean {
        return this.value === other.getValue();
    }

    public toString(): string {
        return this.value;
    }
}
