# Changelog

> ℹ This changelog is written in English to comply with international development standards and ensure compatibility with CI/CD tools.
> All user-facing documentation and API responses (e.g., Swagger) are available in Spanish.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.6.0-beta] – 2025‑04‑28

> Refactored the FactCheckerAgent with clean hexagonal architecture, structured factual verification, and improved traceability.

### Added

- Full rewrite of `FactCheckerAgent` into layered hexagonal architecture with strict separation of concerns.
- New use-case orchestration via `VerifyFactUseCaseWrite`:
    - Multi-source retrieval (Brave, Google, Fallback)
    - Structured search result preprocessing
    - LLM-based factual analysis using GPT‑4o
    - Dynamic reasoning generation
    - Semantic confidence scoring
- StructuredSearchPreview entity created for every factual verification request.
- `AgentVerification` entities now correctly linked to `AgentFact` and reasoning.
- Updated database entities:
    - LowerCamelCase in TypeScript.
    - Snake_case in SQL columns.
- Endpoint structure fully refactored for clarity and REST semantics:
    - `POST /facts/verify`
    - `GET /facts/verifications/:id`

### Changed

- Normalized entity relations:
    - All relations explicitly defined with `@JoinColumn`, `@ManyToOne`, `@OneToOne`, etc.
    - Ensured `reasoning_id` and `fact_id` are never NULL.
- FactCheckerAgent now emits `FACTUAL_VERIFICATION_RESULT` events with normalized payloads.
- Improved search services integration (Brave, Google, Fallback) with structured preprocessing.
- Modularized repository layer for `AgentVerification`.

### Fixed

- `AgentFindingSearchContext.findingId` is now properly populated at creation.
- SearchResults array persists correctly and is retrieved with each Finding.
- AgentVerification reasoning is now consistently linked and retrievable.

### Removed

- Legacy fallback search logic embedded in FactCheckerAgent.
- Deprecated intermediate search result formats.

## [0.5.0-beta] – 2025‑04‑25

> Refactored the ValidatorAgent with clean hexagonal architecture, semantic deduplication, and traceable factual validation flow.

### Added

- Full rewrite of `ValidatorAgent` into layered hexagonal architecture with strict separation of concerns.
- New use-case orchestration via `VerifyClaimUseCaseWrite`:
    - Normalization (via LLM)
    - Embedding generation
    - Semantic deduplication
    - Conditional fact creation
    - Reasoning handling
- CQRS-style folder structure (`application/use-cases/{read,write}`).
- Semantic deduplication via OpenAI embeddings (`cosineSimilarity` against stored findings).
- `relatedFactId` field in `AgentFinding` to reuse existing `AgentFact` if semantically matched.
- `AgentFindingSearchContext` is created when validation status is `fact_checking`.
- Endpoint structure fully refactored for clarity, traceability, and REST semantics:
    - `POST /validators/analyze`
    - `GET /validators/facts/:id`
    - `GET /validators/findings/:id`
    - `GET /validators/findings/by-claim?text=...`
    - `GET /validators/findings`

### Changed

- `AgentFact.claim` removed; normalized claims are now stored and owned only by `AgentFinding`.
- Replaced 1:1 relation between `AgentFact` and `AgentFinding` with 1:N (one fact → many findings).
- `findByNormalizedClaim()` deprecated in favor of embedding similarity checks.
- Validation is now semantic and modular: if a claim matches an existing fact (by embedding), the fact is reused.
- Reasoning is only generated and attached if a new fact is created.
- Repositories restructured for domain mapping (`toDomainEntity`, `toOrmEntity`).
- Environment variables updated:
    - `EMBEDDING_SIMILARITY_THRESHOLD` introduced for deduplication.
    - Removed legacy normalized-claim logic.

### Removed

- Legacy embedding comparison logic based on `normalizedClaim`.
- Deprecated logic around deterministic claim equality via plain string match.
- Unused or partially migrated entities (`AgentSource`, `AgentLog`, `AgentEvent`) are temporarily removed.
- Old `VerifyClaimService` logic (imperative and non-modular).

### Testing

- Not implemented in this version. This is a beta refactor preparing for stable CI/CD and integration tests.

### Documentation

- Swagger docs updated with the new endpoints.
- Full documentation update will follow after `FactCheckerAgent` modularization is completed.

---

## [1.0.0] – 2025‑04‑19

> Initial release of the full pipeline: `ValidatorAgent` + `FactCheckerAgent` with semantic normalization and factual reasoning.

### Added

- `ValidatorAgent` for analyzing and evaluating factual claims.
- `FactCheckerAgent` for verifying facts using real sources (Brave, Google, NewsAPI).
- Semantic normalization using OpenAI embeddings.
- Full traceability in the database with TypeORM.
- REST endpoints documented with Swagger UI (`/api-docs`).
- Modular documentation split into separate files (in Spanish).
- `mkdocs.yml` configuration with structured navigation and Material theme.
- Interactive documentation integration (Swagger + Postman collection).
- Endpoint `POST /facts/claim` for retrieving previously verified facts.
- Endpoint `GET /facts/verifications/last` for latest factual verification with full traceability.
- DTO `AgentFactDto` with strict exposure control (`@Exclude/@Expose`).
- Canonical claim normalization using internal `normalizeClaim()` helper.
- `sourcesRetrieved` and `sourcesUsed` saved in `AgentVerification`.
- Automatic inclusion of `reasoning`, `sources_used` and `sources_retrieved` in public API.

---

## Links

[0.6.0-beta]: https://github.com/davidlosasgonzalez/veriqo-server/releases/tag/v0.6.0-beta
[0.5.0-beta]: https://github.com/davidlosasgonzalez/veriqo-server/releases/tag/v0.5.0-beta
[1.0.0]: https://github.com/davidlosasgonzalez/veriqo-server/releases/tag/v1.0.0
