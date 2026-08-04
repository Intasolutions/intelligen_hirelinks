---
Version: 1.1.0
Status: APPROVED
Owner: Lead Architect
Dependencies: []
---

# 00 - Project DNA

## History
| Version | Date       | Author         | Changes                                                                 |
| :------ | :--------- | :------------- | :---------------------------------------------------------------------- |
| 1.0.0   | 2026-08-04 | Lead Architect | Initial Draft                                                           |
| 1.1.0   | 2026-08-04 | Lead Architect | Added Engineering Values, Non-Goals, Scope, Attributes, Success Metrics |

---

## Purpose
The Project DNA document serves as the absolute philosophical and technological foundation of the **Intelligen Hirelinks Platform**. It defines the core identity of the platform, the immutable technology stack, the engineering values that govern decision-making, and the ubiquitous language used by all developers and AI agents. This is the single source of truth for *what* we are building and *why*.

---

## Scope

### Current Scope
*   **Reusable CMS Platform**: A robust, modular foundation capable of managing dynamic public content, admin controls, services, programs, and blogs.
*   **Public Presentation Layer**: A dynamic, SEO-optimized public website consuming the platform.
*   **Core Engines**: Media, SEO, Layout, Settings, and Authentication engines.
*   **AI-Assisted Development Framework**: A codebase structured specifically to ensure AI agents can maintain and extend the platform safely.

### Future Scope
*   **Multi-Project Adaptation**: Using this platform as a boilerplate or foundation for future client projects.
*   **Advanced Analytics**: Deep integration with user tracking and content performance metrics.
*   **Complex Workflows**: Multi-stage approval processes for content publishing.

### Out of Scope (Non-Goals)
To prevent feature creep and architecture bloating, this platform intentionally does **NOT** try to solve:
*   Multi-tenant SaaS CMS (This is a single-tenant platform per deployment).
*   Ecommerce or complex payment gateways.
*   Drag-and-drop Website Builder functionality (e.g., Elementor or Webflow).
*   A 3rd-party Plugin Marketplace.
*   Supporting Multiple Databases (We are strictly coupled to MongoDB).
*   Supporting Multiple Frontend Frameworks (We are strictly coupled to Next.js).

---

## Rules

### 1. Core Technology Stack (Frozen)
The following technologies are the non-negotiable foundation of the platform. No architectural drift is permitted away from these tools:
*   **Frontend**: Next.js (App Router), React, TypeScript, TailwindCSS, shadcn/ui
*   **Backend**: Node.js, Express, TypeScript
*   **Database**: MongoDB Atlas (via Mongoose)
*   **Media**: Cloudinary
*   **Package Manager**: pnpm
*   **Monorepo**: Turborepo
*   **Deployment**: Vercel (Frontend), DigitalOcean (Backend)

### 2. Engineering Values
When making technical decisions, we adhere to the following value hierarchy:
*   **Simplicity** over Cleverness
*   **Explicitness** over Magic
*   **Readability** over Brevity
*   **Convention** over Configuration
*   **Documentation** over Tribal Knowledge
*   **Maintainability** over Premature Optimization

### 3. Quality Attributes
Every architectural decision must advance these specific quality attributes:
*   **Maintainability**: Code must be easily updated by developers or AI 5 years from now.
*   **Scalability**: The architecture must gracefully handle increased traffic and data volume.
*   **Performance**: Extremely fast Time to First Byte (TTFB) and seamless user experiences.
*   **Security**: Airtight permissions, CSRF mitigation, and robust authentication.
*   **Reliability**: Predictable failures and high uptime.
*   **Observability**: Clear logging and standardized error tracing.
*   **Accessibility**: WCAG compliance on the presentation layer.
*   **AI Friendliness**: Small context windows, co-located logic, and strict predictability.
*   **SEO**: Uncompromising search engine optimization built into the core.

### 4. Architecture Success Metrics
The architecture is considered successful if it achieves:
1.  **Zero Architectural Drift**: The core stack and boundaries remain intact over time.
2.  **Predictable AI Implementation**: An AI agent can successfully complete an Implementation Specification with >90% accuracy on the first pass due to strict boundaries.
3.  **Sub-Second Read Latency**: Despite the Vercel -> DO -> Atlas network path, cached reads resolve in <100ms.
4.  **Isolated Failures**: A bug in one vertical slice (e.g., `Blog`) cannot break an unrelated slice (e.g., `Services`).

### 5. Development Workflow
To maintain architectural integrity, no code is written without prior authorization through the following strict workflow:
`Architecture -> Architecture Review -> Architecture Freeze -> Implementation Specification -> Implementation -> Code Review -> Documentation Update`

**Architecture Traceability Rule:**
From this point forward, every Implementation Specification and sprint must reference the architecture by **document section**, not just by document name. 
Example:
*   Implements: `01-architecture-principles.md §2 (Vertical Slicing)`
*   Implements: `05-backend-architecture.md §4 (Request Lifecycle)`

This creates full traceability between architecture and code, ensuring implementation is always grounded in approved decisions instead of interpretation or memory.

### 6. Ubiquitous Language / Glossary
*   **Domain**: A core area of business logic (e.g., `Blog`, `Services`). Domains encapsulate specific business rules and data.
*   **Engine**: A reusable, technical capability providing services across domains (e.g., `SEO Engine`, `Media Engine`, `Layout Engine`).
*   **Vertical Slice (Module)**: A feature containing all its necessary layers (Controller, Service, Validation, Types) co-located in a single directory.
*   **CQRS-lite**: A pattern separating reads (Queries) and writes (Commands) to prevent pass-through boilerplate.
*   **AHA**: Avoid Hasty Abstractions. The preference for slight duplication over premature coupling.
*   **Layout Engine**: The system managing global presentation elements (navigation, footers, reusable blocks).
*   **Implementation Specification**: A tactical document created *before* a sprint, translating architecture into exact execution steps.

---

## Examples
*   **Applying Values**: If a developer finds a 1-line RegEx that validates a complex string (Brevity) versus a 5-line standard parsing function (Readability), the 5-line function is chosen (*Readability over Brevity*).
*   **Applying Scope**: If a client requests a "shopping cart", the request is rejected or moved to a separate microservice, as it violates the *Out of Scope (Ecommerce)* rule.

---

## Related Documents
*   `01-architecture-principles.md`

---

## Future Considerations
As the platform matures over the next 5 years, the AI-Assisted Development Framework will likely evolve. We anticipate relying more heavily on generative UI and automated testing generation. The DNA document must be reviewed annually to ensure the Engineering Values still align with the current AI capabilities.
