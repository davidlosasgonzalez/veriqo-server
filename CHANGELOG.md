# 📋 Changelog

> ℹ This changelog is written in English to comply with international development standards and ensure compatibility with CI/CD tools. All user-facing documentation and API responses (e.g., Swagger) are available in Spanish.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## \[0.7.1-beta] – 2025-05-10

> Full remodularization of Veriqo backend following Clean Architecture, DDD, and CQRS principles. No new features introduced; this refactor focused exclusively on structure, maintainability, and professional modular boundaries.

### Refactor Highlights

- **Advanced modularization** across `shared`, `validator-agent`, `fact-checker-agent`, and `core` layers.
- **Strict separation of concerns** between domain, application, infrastructure, and presentation.
- **Use case orchestration** clearly split into `read` and `write` per CQRS.
- **Value Objects, Entities, DTOs and ORM Entities** aligned and normalized.
- **Token-based dependency injection** applied for all infrastructure services.
- **Logger standardization**: all `console.*` replaced with `Logger` from NestJS.

### Modules normalized

- `shared/event-bus`: clean `EventBusService` and event handler modules (`factual-check-required`, `factual-verification-result`).
- `shared/infrastructure/database/modules`: separate persistence modules for `Fact`, `Finding`, `Reasoning`, `Verification`.
- `shared/llm`: LLM orchestration and logging via `LlmRouterService`.
- `shared/search`: search fallback logic fully modular (Brave > Google > NewsAPI).
- `shared/presentation`: all pipes, filters, mappers, DTOs isolated and typed.

### Cleanup

- Removed unused controllers, legacy services, intermediate abstractions.
- Replaced all `any` and unsafe casts with properly typed DTOs and Enums.
- Updated all entity relationships to use `@OneToMany`, `@OneToOne`, `@ManyToOne` with explicit `@JoinColumn` and cascade where required.
- Aligned naming conventions: file names in kebab-case, classes in PascalCase, domain folders in singular.

### Documentation

- Full rewrite of all markdown files:

    - `README.md`
    - `docs/overview.md`
    - `docs/architecture/agents.md`
    - `docs/setup/env-variables.md`
    - `docs/flows/validation-to-factcheck.md`
    - `docs/api/{core,facts,validators}.md`

- Added Mermaid diagrams and new endpoint tables per module.

### Notes

> This level of modularization is not required for a small project like Veriqo. However, it was implemented as an architectural exercise to align the system with professional backend standards, including bounded contexts, event-driven processing, and hexagonal layering.

## [0.7.0-beta] – 2025-04-30

> Final modularization of the core system. Unified `CoreController`, added technical metrics and dynamic search fallbacks.

### Added

- New `CoreController` with modular endpoints:

    - `GET /core/logs`: view all LLM execution logs.
    - `GET /core/prompts`: list all prompt templates in the system.
    - `GET /core/stats`: return factual verification metrics.
    - `GET /core/metrics`: return technical server-level metrics.

- `AgentLogEntity` and `AgentPromptEntity` reintroduced with clean structure and full traceability.
- Search fallback logic:

    - If Brave Search returns `429 Too Many Requests`, fallback to Google.
    - If Google fails, fallback to NewsAPI.

- Integrated [Bottleneck](https://www.npmjs.com/package/bottleneck) for throttling and respecting external API rate limits.
- Entity relations enhanced and normalized with:

    - `@OneToMany`, `@OneToOne`, `@ManyToOne` using explicit `@JoinColumn`.
    - Full cascade and referential integrity across reasoning, verification, fact and finding.

- Swagger and DTOs updated to reflect new relations, with `@Expose/@Exclude` and strict typing.
- `AgentFindingRepository.findById()` now loads nested `verifications.reasoning` for consistent DTO hydration.

### Changed

- Reimplemented `waitForFact = true` in `POST /validators/analyze`. The request now blocks **until the factual verification completes**, with **no artificial timeout**.
- `AgentVerificationRepository.save()` now ensures all reasoning and `factId` relations are fully loaded before returning.
- `mapToDto()` functions for `AgentFact` and `AgentVerification` now correctly hydrate nested reasoning DTOs.
- All `GET /validators/facts/:id` and `GET /validators/findings/:id` endpoints now return enriched DTOs with reasoning if available.

### Fixed

- Resolved inconsistency where `reasoning` was `null` in responses, even though it existed in database.
- Fixed `factId` not being assigned in `AgentVerification` entities.

### Documentation

- Markdown documentation updated to reflect all architectural and functional changes after agent modularization.
- Changelog extended with version `0.7.0-beta` covering all recent enhancements.

[0.7.0-beta]: https://github.com/davidlosasgonzalez/veriqo-server/releases/tag/v0.7.0-beta
