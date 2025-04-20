# 📄 Changelog

> ℹ️ This changelog is written in English to comply with international development standards and ensure compatibility with CI/CD tools.
> All user-facing documentation and API responses (e.g., Swagger) are available in Spanish.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Support for analyzing multiple claims in a single prompt (`ValidatorAgent`)
- Input length limit defined by `VALIDATOR_MAX_INPUT_CHARS` (recommended: 3000)
- Validation now emits separate events for each claim needing factual verification
- Structured Search Previews system:
    - `StructuredSearchPreview` entity for enriched factual context
    - Utility `preprocessSearchPreview` for domain, language, sourceType and date extraction
    - Type `RawSearchResult` to standardize search result inputs
    - Service `StructuredPreviewService` to transform raw results into previews
- Integrated structured previews into `VerifyClaimService`
- Prompt formatting now includes domain, published date, title, and snippet for each source
- New documentation examples in `README.md` to demonstrate multi-claim usage
- Initial `CHANGELOG.md` based on Keep a Changelog format

## [1.0.0] – 2025‑04‑19

### Added

- `ValidatorAgent` for analyzing and evaluating factual claims
- `FactCheckerAgent` for verifying facts using real sources (Brave, Google, NewsAPI)
- Semantic normalization using OpenAI embeddings
- Full traceability in the database with TypeORM
- REST endpoints documented with Swagger UI (`/api-docs`)
- Modular documentation split into separate files (in Spanish)
- `mkdocs.yml` configuration with structured navigation and Material theme
- Interactive documentation integration (Swagger + Postman collection)
- Endpoint `POST /facts/claim` for retrieving previously verified facts
- Endpoint `GET /facts/verifications/last` for latest factual verification with full traceability
- DTO `AgentFactDto` with strict exposure control (`@Exclude/@Expose`)
- Canonical claim normalization using internal `normalizeClaim()` helper
- `sourcesRetrieved` and `sourcesUsed` saved in `AgentVerification`
- Automatic inclusion of `reasoning`, `sources_used` and `sources_retrieved` in public API

### Removed

- Redundant `sources` property from `AgentFact` and `AgentVerification`
- `@ManyToOne` relationship to `AgentSource` (replaced by explicit `verificationId`)

### Fixed

- Removed `embedding` field from all public API responses
- Fixed `class-validator` rejections on hidden properties
- Fixed MySQL syntax error on `array` by using `simple-array` instead
- Removed duplicated `findByNormalizedClaim()` in `AgentFactService`

[Unreleased]: https://github.com/davidlosasgonzalez/veriqo-server/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/davidlosasgonzalez/veriqo-server/releases/tag/v1.0.0

git
