---
Version: 1.1.0
Status: APPROVED
Owner: Lead Architect
Reviewers: []
Dependencies: [00-project-dna.md, 01-architecture-principles.md]
Related Documents: []
---

# 03 - Monorepo Architecture

## History
| Version | Date       | Author         | Changes         |
| :------ | :--------- | :------------- | :-------------- |
| 1.0.0   | 2026-08-04 | Lead Architect | Initial Draft   |
| 1.1.0   | 2026-08-04 | Lead Architect | Replaced core with contracts, added package creation/dependency rules and Implementation Impact |

---

## 1. Purpose
This document defines the definitive repository layout, package organization, and strict import boundaries for the Intelligen Hirelinks Platform. It governs exactly where code lives, how it is named, and how different workspaces communicate.

## 2. Scope
This document covers the Turborepo workspace configuration (`apps/`, `packages/`), the internal structural conventions (`modules` vs. `features`), the integration of the Admin panel, and the strict rules for shared package creation and dependencies.

## 3. Decision Summary
*   **Turborepo Standard**: The monorepo uses the standard Turborepo + pnpm layout.
*   **Runnable Apps vs. Libraries**: `apps/` contains all runnable services (`web`, `api`). `packages/` contains only internal, reusable shared libraries (`contracts`, `config`, `ui`).
*   **Admin Panel Integration**: The Admin Panel is integrated directly into the `apps/web` Next.js application (`app/admin`). There is no standalone Admin application.
*   **Nomenclature**: The backend organizes vertical slices into **`modules`**. The frontend organizes vertical slices into **`features`**.
*   **No God Packages**: The `core` package is deprecated in favor of narrowly defined packages (e.g., `contracts`). Shared packages are strictly for cross-domain concerns. 

## 4. Architecture Decisions

### 4.1. Admin Panel Integration
Instead of creating a standalone `apps/admin` application, the Admin panel lives inside `apps/web/app/admin`. 
*   *Why?* To share the authentication session, design system, UI components, API clients, theme, and configuration without needing to hoist everything into a shared package or manage two separate deployments. 

### 4.2. Modules vs. Features
While the underlying philosophy is "Vertical Slicing" (refer to `01-architecture-principles.md §2`), the naming convention differs by context to align with standard framework practices:
*   **Backend (`apps/api`)**: Uses the term `modules` (e.g., `apps/api/src/modules/auth`). 
*   **Frontend (`apps/web`)**: Uses the term `features` (e.g., `apps/web/src/features/auth`).

### 4.3. Narrowly Defined Packages (No "Core")
The concept of a `packages/core` or `packages/shared` "God Package" is explicitly banned. Instead, we use highly specific packages:
*   `packages/contracts`: Shared Zod schemas, API response types, and TypeScript interfaces that guarantee communication between the backend and frontend.
*   `packages/ui`: Shared React components (shadcn/ui) and Tailwind configuration.
*   `packages/config`: Shared ESLint, Prettier, and TypeScript base configurations.

## 5. Design Rules

### 5.1. Package Creation Rules
*   A new package MUST ONLY be created if the code is genuinely consumed by multiple applications in `apps/`.
*   A package MUST have a single, highly focused responsibility. If it does two unrelated things, it should be two packages.
*   Feature-specific logic (e.g., Blog validation) MUST stay in its respective module/feature, unless the exact schema is shared with the frontend, in which case the schema moves to `packages/contracts`.

### 5.2. Workspace Dependency Rules
*   **App Isolation**: Apps inside `apps/` MUST NOT import directly from other apps using relative paths (e.g., `apps/web` cannot import from `apps/api/src/...`). Communication happens over HTTP.
*   **Package Consumption**: Apps MAY import from `packages/` using the pnpm workspace alias (e.g., `@hirelinks/contracts`).
*   **Package Hierarchy**: A package in `packages/` MUST NOT import from `apps/`. Packages may import other packages ONLY if strict hierarchical logic allows it (e.g., `packages/ui` can import `packages/config`, but `packages/config` cannot import `packages/ui`).

### 5.3. Path Aliases
Within an app, absolute path aliases MUST be used for internal imports (e.g., `@/modules/auth/` or `@/components/`). Relative paths (`../../`) SHOULD NOT be used if they traverse more than one directory level.

## 6. Diagrams

```text
intelligen_hirelinks/
├── apps/
│   ├── api/                 # Express Backend
│   │   ├── src/
│   │   │   ├── modules/     # Backend Vertical Slices
│   │   │   └── server.ts
│   └── web/                 # Next.js Frontend & Admin
│       ├── app/
│       │   └── admin/       # Admin routes
│       └── src/
│           └── features/    # Frontend Vertical Slices
├── packages/
│   ├── contracts/           # Shared Zod schemas & API types
│   ├── config/              # Shared ESLint/TS configs
│   └── ui/                  # Shared React components
├── pnpm-workspace.yaml      
└── turbo.json               
```

## 7. Examples

**Good (Internal Module Import)**:
```typescript
// Implements 03-monorepo-architecture.md §5.1
// Inside apps/api/src/modules/blogs/blog.service.ts
import { BlogModel } from './blog.model'; // Co-located logic
```

**Good (Consuming a Contract)**:
```typescript
// Inside apps/web/src/features/blogs/components/BlogCard.tsx
import { BlogResponseSchema } from '@hirelinks/contracts'; 
```

## 8. Implementation Impact
During an Implementation Specification sprint, the developer/AI must first evaluate if a new Type or Component is used purely within a single domain. If yes, it is created locally inside the vertical slice (`modules/` or `features/`). If it defines the HTTP boundary between `apps/web` and `apps/api`, the schema MUST be placed in `packages/contracts`.

## 9. Future Considerations
If the platform eventually requires a React Native mobile application, a new `apps/mobile` directory will be created. We must ensure that any business logic intended for the mobile app is safely abstracted into narrowly-scoped shared packages before mobile development begins.

## 10. Approval
*   **Approved By**: Lead Architect
*   **Date**: 2026-08-04
