---
Version: 1.1.0
Status: APPROVED
Owner: Lead Architect
Dependencies: [00-project-dna.md]
---

# 01 - Architecture Principles

## History
| Version | Date       | Author         | Changes                                                                                  |
| :------ | :--------- | :------------- | :--------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-08-04 | Lead Architect | Initial Draft                                                                            |
| 1.1.0   | 2026-08-04 | Lead Architect | Refined CQRS-lite, Added Dependency Rules, Layer Responsibilities, Principle Priorities, Evolution Rules |

---

## Purpose
This document is the **Constitution** of the platform. It defines the unyielding rules for how code is structured, how data flows, and how logic is separated. When disputes arise during Implementation Specifications, or when AI agents generate new modules, this document serves as the absolute authority to resolve them.

---

## Scope
This document governs all backend and frontend architectural patterns, module structures, layer boundaries, and dependency flows within the Intelligen Hirelinks Platform monorepo.

---

## Rules

### Tier 1: Architecture Laws (Non-Negotiable)

#### 1. Vertical Slicing (Feature-First)
We explicitly **ban** horizontal layer grouping. There will be no global `controllers/`, `services/`, or `repositories/` directories spanning multiple domains. A feature must contain everything it needs to execute within its own directory.

#### 2. Architecture Evolution Rules
Architectural changes must **never** happen implicitly during a sprint. If a new pattern, tool, or structural change is required, it must only be introduced via an **Architecture Decision Record (ADR)** in the `18-architecture-decisions/` directory, reviewed, and approved before implementation.

#### 3. Strict Layer Responsibilities
To prevent bloated code and context bleed, layers have strict boundaries:
*   **Controller**: 
    *   *Responsibilities*: Parses HTTP requests, executes structural validation (e.g., Zod), invokes the appropriate Service (or Repository for simple queries), formats the standard HTTP response.
    *   *Anti-Responsibilities*: Absolutely no business logic, no raw database queries, no 3rd-party API calls.
*   **Service**:
    *   *Responsibilities*: Executes business logic, enforces authorization rules, handles complex data orchestration, triggers events, and coordinates Repositories.
    *   *Anti-Responsibilities*: Absolutely no knowledge of HTTP requests/responses, no setting HTTP status codes.
*   **Repository** (Optional):
    *   *Responsibilities*: Encapsulates all database abstractions and Mongoose operations. Should only be used for complex domains with significant database interactions. Simple modules do not require a repository layer.
    *   *Anti-Responsibilities*: No business logic, no HTTP knowledge.

#### 4. Dependency Rules
Dependencies must flow strictly inward. Circular dependencies or lateral feature-to-feature dependencies are forbidden.
*   **Allowed Flow**: `Module/Feature` → `Engine` → `Core` → `Infrastructure`
*   **Forbidden Flow**: An Engine must **never** import a Module or Feature. A Core utility must **never** import an Engine. Modules should avoid importing other Modules unless mediated through a designated shared API layer.

---

### Tier 2: Strong Recommendations

#### 1. CQRS-lite (Command Query Responsibility Segregation)
Read operations (Queries) and write operations (Commands) are handled differently.

*   **Queries**: Simple queries may bypass the Service layer and go straight from the Controller to the Repository **ONLY WHEN**:
    *   No business rules exist.
    *   No authorization rules exist (e.g., it is a public endpoint).
    *   No caching strategy exists.
    *   No audit logging is required.
    *   No domain policies exist.
    *   *Otherwise, the query must flow through the Service layer.*
*   **Commands**: All writes, updates, and deletes **must** pass through the Service layer.

#### 2. AI-Friendly Development Constraints
*   **Self-Contained Logic**: By utilizing Vertical Slices, the AI context window remains focused on a single directory.
*   **Single Source of Truth**: Zod schemas serve as the single source of truth for both runtime validation and static TypeScript types (`z.infer`).
*   **Deterministic Output**: Every endpoint must conform strictly to the agreed `API Standards`.

---

### Tier 3: Optional Patterns

#### 1. AHA (Avoid Hasty Abstractions) over Dogmatic DRY
"Do Not Repeat Yourself" (DRY) is a guideline, not a religion. We prefer slight duplication (AHA) over premature coupling. 
If the Admin CMS and Public Website both need a `User` type, define them separately in their respective slices. Only merge them into a shared package if they are explicitly proven to change synchronously.

---

## Examples

### Good vs. Bad Vertical Slicing
**BAD** (Horizontal Layering - Forbidden):
```text
src/
  controllers/
    blog.controller.ts
  services/
    blog.service.ts
```
**GOOD** (Vertical Slicing - Required):
```text
src/
  modules/
    blog/
      blog.controller.ts
      blog.service.ts
      blog.schema.ts
```
*(Note: The frontend uses the `features/` directory for vertical slicing, while the backend uses `modules/`)*

### Good vs. Bad CQRS-lite Query
**BAD** (Unnecessary pass-through):
A public endpoint to get all active categories, with no auth or business rules, where the Controller calls `CategoryService.getAll()` which literally only calls `CategoryRepository.getAll()`.
**GOOD**:
The Controller directly calls `CategoryRepository.getAll()`.

---

## Related Documents
*   `00-project-dna.md`
*   `07-module-blueprint.md`
*   `18-architecture-decisions/`

---

## Future Considerations
As the platform scales to support multi-project deployments, the Dependency Rules (specifically Feature-to-Feature communication) may require an Event Bus or strict internal API boundaries to prevent monolithic coupling. Any such change will require an ADR.
