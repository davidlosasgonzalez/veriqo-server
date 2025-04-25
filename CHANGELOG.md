# Changelog

> ℹ This changelog is written in English to comply with international development standards and ensure compatibility with CI/CD tools.
> All user-facing documentation and API responses (e.g., Swagger) are available in Spanish.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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

## [1.0.0] – 2025‑04‑19

> Initial release of the full pipeline: `ValidatorAgent` + `FactCheckerAgent` with semantic normalization and factual reasoning.

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

[0.5.0-beta]: https://github.com/davidlosasgonzalez/veriqo-server/releases/tag/v0.5.0-beta
[1.0.0]: https://github.com/davidlosasgonzalez/veriqo-server/releases/tag/v1.0.0
