---
Version: 1.1.0
Status: APPROVED
Owner: Lead Architect
Reviewers: []
Dependencies: [00-project-dna.md, 01-architecture-principles.md, 02-system-architecture.md, 03-monorepo-architecture.md, 04-database-architecture.md, 05-backend-architecture.md, 06-frontend-architecture.md]
Related Documents: []
---

# 07 - Platform Standards

## History
| Version | Date       | Author         | Changes         |
| :------ | :--------- | :------------- | :-------------- |
| 1.0.0   | 2026-08-04 | Lead Architect | Initial Draft   |
| 1.1.0   | 2026-08-04 | Lead Architect | Added Universal Module Defaults, CRUD, Audit, API, and UI conventions |

---

## 1. Purpose
This document serves as the final, consolidated rulebook for the Intelligen Hirelinks Platform. It prevents architectural drift by defining universal platform conventions that every module automatically inherits. It marks the absolute completion of Phase 0 Architecture.

## 2. Scope
This document covers all domain-agnostic standards across the platform, including Module Default Behaviors, Naming Conventions, API payloads, CRUD specifications, Security, and Accessibility.

## 3. Universal Module Default Behaviour
To prevent repetitive decision-making during implementation, **every backend and admin module automatically inherits the following behaviors by default**. Only explicit exceptions need to be documented in a module's Implementation Specification.

*   ✓ Full CRUD (Create, View, Update, Soft Delete, Permanent Delete)
*   ✓ Soft Delete & Restore Lifecycle
*   ✓ Audit Fields (`createdBy`, `updatedAt`, etc.)
*   ✓ Status Management
*   ✓ Standardized API Responses with Pagination
*   ✓ Advanced Listing (Search, Sort, Filter)
*   ✓ Explicit Permission Checks
*   ✓ Universal Validation Flow (Zod)
*   ✓ SEO & Media integration (where applicable)
*   ✓ Error Handling & Logging

---

## 4. Platform Conventions

### 4.1. Naming Standards
Strict naming conventions prevent cognitive friction.
*   **Database Collections**: Singular (e.g., `user`, `blog`).
*   **Models/Classes/Interfaces**: `PascalCase` (e.g., `UserModel`, `BlogService`).
*   **Files**: Kebab-case or dot notation (e.g., `blog.controller.ts`, `user-profile.tsx`).
*   **Routes**: Plural (e.g., `/api/v1/blogs`).
*   **Variables/Functions**: `camelCase` (e.g., `fetchBlogs`, `userStatus`).
*   **Constants**: `UPPER_CASE` (e.g., `MAX_UPLOAD_SIZE`).
*   **React Components**: `PascalCase` (e.g., `BlogCard`).

### 4.2. CRUD & Listing Standards
Every admin module must support standard operations and rich listing APIs.
*   **Default Operations**: Create, View, Update, Soft Delete, Restore, Permanent Delete. (Duplicate & Bulk Operations are Optional based on module volume).
*   **Listing Capabilities**: All listing APIs MUST support `page`, `limit`, `search`, `sortBy`, `order`, `status`, and date range filtering.
*   **Example Query**: `GET /api/v1/blogs?page=1&limit=10&search=node&status=published&sortBy=createdAt&order=desc`

### 4.3. Default Admin Table Features
Every admin data table natively includes:
*   ✓ Pagination, Search, Sort, Filter
*   ✓ View, Edit, Delete, Restore actions
*   ✓ Bulk Actions (Optional for high-volume modules)
*   ✓ Audit Information visibility
*   ✓ Export (Future capability)

### 4.4. Soft Delete & Audit Standards
Data is rarely hard-deleted.
*   **Soft Delete**: `isDeleted` (Boolean), `deletedAt` (Date), `deletedBy` (ObjectId).
*   **Rules**: Normal queries exclude deleted data. Delete triggers Soft Delete. Restore reverts it. Permanent Delete is restricted to Super Admins.
*   **Audit Fields**: Every collection MUST include `createdAt`, `updatedAt`, `createdBy`, `updatedBy`. Optional: `publishedAt`, `publishedBy`.

### 4.5. Status & Slug Standards
*   **Status (Content)**: `Draft`, `Published`, `Archived`.
*   **Status (System)**: `Active`, `Inactive`.
*   *(Never mix terminology like `true/false`, `enabled`, `active` across modules)*.
*   **Slugs**: Every public entity requires a `slug` field.
    *   Rules: `lowercase`, `kebab-case`, `unique`, `indexed`, `auto-generated`.
    *   Immutability: Slugs become immutable after the first publish, unless a manual override is forced.

### 4.6. Search Standards
By default, the `search` query parameter applies a text search across:
*   `title` or `name`
*   `slug`
*   `description` or `excerpt`
*(Module-specific fields can be appended in the module specification).*

---

## 5. Engineering Standards

### 5.1. Validation Flow
There is only one universal validation flow across the platform:
`Client Input` → `React Hook Form` → `Zod (Contracts)` → `API Request` → `Zod (Contracts)` → `Database`.

### 5.2. API Standards
*   **Versioning**: All routes prefixed with `/api/v1`.
*   **HTTP Codes**: Strict adherence to REST codes (200, 201, 400, 401, 403, 404, 500).
*   **Pagination Response**: All lists return a unified meta object:
    ```json
    {
      "success": true,
      "data": [],
      "meta": {
        "page": 1,
        "limit": 10,
        "total": 120,
        "totalPages": 12,
        "hasNext": true,
        "hasPrevious": false
      }
    }
    ```
*   **Error Codes & Request IDs**: Every response (error or success) can trace back to a specific request ID for observability.

### 5.3. Permission Standards
Every module automatically generates permission strings. Code checks permissions, not roles.
*   Format: `[module].[action]`
*   Example: `blogs.view`, `blogs.create`, `blogs.update`, `blogs.delete`, `blogs.restore`, `blogs.publish`.

### 5.4. Media & File Upload Standards
*   **Types**: Single Image, Gallery, Thumbnail, Banner, Document, Video.
*   **Pipeline**: Validate Allowed Types & Max Size → Virus Scan (Future) → Compression & Image Optimization (WebP/AVIF) → Cloudinary Storage.
*   **Folder Convention**: Cloudinary assets must be grouped by module and entity (e.g., `hirelinks/blogs/[blogId]/`).

### 5.5. SEO Standards
SEO is built into every public entity. The schema must support:
*   `Canonical`, `OpenGraph`, `Twitter`, `Robots`, `Structured Data`, `Breadcrumb`, `Indexing`, `Sitemap inclusion`.

### 5.6. Performance & Security Standards
*   **Performance**: Lean DB Queries, Explicit Indexes, React Server Components (RSC), Edge Caching, Cloudinary Image Optimization, Lazy Loading, and Code Splitting.
*   **Security**: Strict Input Sanitization, XSS Protection, CSRF mitigation (SameSite), Helmet (Secure Headers), Rate Limiting, bcrypt Password Hashing, HTTP-Only Secure Cookies, and Environment Variable Validation.

### 5.7. Accessibility (A11y) Standards
The public website MUST conform to WCAG AA guidelines:
*   Mandatory `alt` text on all images.
*   Full Keyboard Navigation support.
*   Proper ARIA Labels for screen readers.
*   Strict Color Contrast ratios.
*   Visible Focus Indicators.

---

## 6. Implementation Workflow (Phase 1+)

### 6.1. The Module Checklist
No module is considered "Done" until every applicable item on this checklist is completed or explicitly marked N/A in the Implementation Spec:
- [ ] CRUD
- [ ] Search
- [ ] Pagination
- [ ] Sorting
- [ ] Filtering
- [ ] Soft Delete
- [ ] Restore
- [ ] Status
- [ ] SEO
- [ ] Media
- [ ] Permissions
- [ ] Validation
- [ ] Audit
- [ ] API
- [ ] Documentation
- [ ] Tests

### 6.2. Architecture Freeze
**Phase 0 Architecture is now officially frozen.** 
No further architecture documents will be created. Any structural changes from this point forward require an Architecture Decision Record (ADR) in `docs/adrs/`.

## 7. Approval
*   **Approved By**: Lead Architect
*   **Date**: 2026-08-04
*   **Status**: PHASE 0 ARCHITECTURE FROZEN. PROCEED TO PHASE 1 IMPLEMENTATION.
