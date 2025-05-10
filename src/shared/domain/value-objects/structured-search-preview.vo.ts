export class StructuredSearchPreview {
    constructor(
        private readonly url: string,
        private readonly title: string,
        private readonly snippet: string,
        private readonly extractedAt: Date,
    ) {
        if (!url) throw new Error('La URL es obligatoria.');

        if (!title) throw new Error('El título es obligatorio.');

        if (!snippet) throw new Error('El snippet es obligatorio.');

        if (!extractedAt)
            throw new Error('La fecha de extracción es obligatoria.');
    }

    getUrl(): string {
        return this.url;
    }

    getTitle(): string {
        return this.title;
    }

    getSnippet(): string {
        return this.snippet;
    }

    getExtractedAt(): Date {
        return this.extractedAt;
    }
}
