import { Module } from '@nestjs/common';

import { BraveSearchService } from './services/brave-search.service';
import { FallbackSearchService } from './services/fallback-search.service';
import { GoogleSearchService } from './services/google-search.service';
import { NewsSearchService } from './services/news-search.service';
import { StructuredPreviewService } from './services/structured-preview.service';

@Module({
    providers: [
        BraveSearchService,
        GoogleSearchService,
        NewsSearchService,
        FallbackSearchService,
        StructuredPreviewService,
    ],
    exports: [
        BraveSearchService,
        GoogleSearchService,
        NewsSearchService,
        FallbackSearchService,
        StructuredPreviewService,
    ],
})
export class SearchModule {}
