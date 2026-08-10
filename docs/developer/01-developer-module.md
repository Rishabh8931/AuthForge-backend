# AuthForge — Developer Module

**Location:** `docs/developer/01-developer-module.md`  
**Module:** Developer  
**Status:** Architecture / implementation plan

> This document defines the Developer module before implementation so implementation and documentation stay aligned.

---

## 1. Purpose

The Developer module represents developers who use AuthForge to register and manage OAuth clients.

```text
Developer
    │
    │ owns
    ▼
  Client
```

A developer is different from an OAuth end user:

```text
Developer → creates/manages OAuth applications
User      → authenticates and grants applications access
```

---

## 2. Module Boundary

Expected structure:

```text
src/modules/developer/
├── developer.repository.ts
├── developer.service.ts
├── developer.controller.ts
├── developer.routes.ts
├── developer.dto.ts
├── developer.schema.ts
└── index.ts
```

Create files as their corresponding layers are implemented.

---

## 3. Layered Architecture

AuthForge follows:

```text
HTTP
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Drizzle ORM
  ↓
PostgreSQL / Neon
```

For Developer:

```text
DeveloperController
        ↓
DeveloperService
        ↓
DeveloperRepository
        ↓
developers table
```

---

## 4. Developer Repository

File:

```text
src/modules/developer/developer.repository.ts
```

The repository owns **database access**, not business workflows.

It should answer persistence questions such as:

```text
Find developer
Find developer by email
Create developer
Update developer
Check email existence
Soft-delete developer
```

### Initial methods

| Method | Purpose | Priority |
|---|---|---:|
| `create()` | Persist developer | High |
| `findById()` | Find by ID | High |
| `findByEmail()` | Find by email | High |
| `existsByEmail()` | Duplicate check | Medium |
| `update()` | Persist allowed changes | Medium |
| `softDelete()` | Set logical deletion state | Medium |

Do not create generic CRUD methods merely for completeness. Add repository operations because an actual use case needs them.

---

## 5. Repository Must NOT Do

### No password hashing

The repository stores the resulting password hash. It does not own password hashing policy.

### No password verification

Password verification belongs to the authentication/service/security workflow.

### No business validation

Examples:

```text
Is registration allowed?
Is account active?
Is email verified?
Can this developer delete the account?
```

These are service-level decisions.

### No authentication workflow

The repository does not log developers in or create authentication workflows.

### No HTTP logic

Never put:

```text
req
res
next
HTTP status codes
```

inside the repository.

### No client-domain operations

Do not put:

```text
createClient()
findClient()
updateClient()
```

in `DeveloperRepository`.

Those belong to `ClientRepository`.

---

## 6. DeveloperRepository vs ClientRepository

Ownership does not mean the DeveloperRepository should query every client table.

Prefer:

```text
DeveloperRepository
    ↓
developers
```

and:

```text
ClientRepository
    ↓
clients
```

For a client ownership check, a client-domain operation such as:

```text
ClientRepository.findByIdAndDeveloperId()
```

is preferable to making the DeveloperRepository query clients.

---

## 7. Service Responsibility

The service sits above the repository:

```text
DeveloperService
       ↓
DeveloperRepository
```

The service owns business workflows such as:

```text
registerDeveloper
signInDeveloper
updateDeveloper
deleteDeveloper
```

Actual service methods should be driven by real use cases rather than a generic CRUD template.

---

## 8. Registration Flow

Conceptually:

```text
Registration Request
        ↓
DeveloperController
        ↓
DeveloperService
        ↓
validate input
        ↓
check email
        ↓
hash password
        ↓
DeveloperRepository.create()
        ↓
developers
```

Boundary:

```text
Repository = persistence
Service    = workflow
Controller = HTTP
```

Application-level `existsByEmail()` checks improve workflow behavior, but the database unique constraint remains the final integrity guarantee.

---

## 9. Sign-In Flow

```text
Sign-In Request
       ↓
DeveloperController
       ↓
DeveloperService
       ↓
DeveloperRepository.findByEmail()
       ↓
developer
       ↓
verify password
       ↓
check account state
       ↓
create authentication/session state
       ↓
response
```

The repository performs only the database lookup.

---

## 10. Database Entity

The module maps to:

```text
developers
```

The database schema is authoritative:

```text
src/common/db/schema/developer.ts
```

Important concepts include:

```text
id
email
password_hash
is_active
email_verified_at
created_at
updated_at
deleted_at
```

Do not duplicate the database schema inside the module.

---

## 11. Database Constraints

Developer email is unique.

```text
developers.email
        │
        ▼
      UNIQUE
```

Therefore:

```text
existsByEmail()
```

is useful for workflow validation, but it does not replace the database constraint because concurrent requests can race.

---

## 12. Soft Delete

The developer entity contains:

```text
deleted_at
```

Logical deletion can therefore be represented by:

```text
deleted_at = current timestamp
```

Conceptually:

```text
Active developer
       ↓
softDelete()
       ↓
deleted_at != NULL
```

The service must define whether a deleted developer can sign in, access clients, restore the account, etc.

Do not invent these business rules inside the repository.

---

## 13. Error Responsibility

Database errors should not become HTTP responses inside the repository.

```text
Database error
      ↓
Repository
      ↓
Service / error boundary
      ↓
Central error handling
      ↓
HTTP response
```

Use the project's existing error infrastructure.

---

## 14. Transaction Strategy

Simple lookups normally do not require transactions.

A multi-step business workflow may require one:

```text
BEGIN
    developer operation
    related operation
COMMIT
```

Failure:

```text
ROLLBACK
```

Do not add transactions to every repository method automatically.

---

## 15. Repository Design Principle

Repositories should expose **domain-useful persistence operations**, not a giant generic database API.

Good:

```text
findByEmail()
findById()
existsByEmail()
```

Avoid unnecessary generic methods such as:

```text
findEverything()
genericQuery()
findByAnything()
```

The goal is a clear persistence boundary.

---

## 16. Testing Strategy

Repository tests should focus on persistence behavior:

```text
create
findById
findByEmail
existsByEmail
update
softDelete
```

Important cases:

```text
existing developer
missing developer
duplicate email
soft-deleted developer
database constraint failure
```

Service tests should separately cover:

```text
registration workflow
password handling
account-state rules
business validation
```

---

## 17. Implementation Order

```text
1. DeveloperRepository
       ↓
2. DeveloperService
       ↓
3. DTO / validation
       ↓
4. Controller
       ↓
5. Routes
       ↓
6. Tests
       ↓
7. Documentation update
```

Do not build the complete HTTP layer before the underlying use cases are understood.

---

## 18. Current Task

The immediate implementation task is:

```text
DeveloperRepository
```

Initial candidates:

```text
create()
findById()
findByEmail()
existsByEmail()
update()
softDelete()
```

Implement only what the actual use cases require.

---

## 19. Definition of Done — Repository

- [ ] Repository file exists.
- [ ] Database access uses the project's Drizzle `db`.
- [ ] `create()` works.
- [ ] `findById()` works.
- [ ] `findByEmail()` works.
- [ ] `existsByEmail()` works if registration requires it.
- [ ] `update()` works if required.
- [ ] `softDelete()` works if required.
- [ ] No HTTP logic exists in the repository.
- [ ] No password hashing exists in the repository.
- [ ] No authentication workflow exists in the repository.
- [ ] No client-domain operations exist in the repository.
- [ ] Errors reach the application's error boundary appropriately.
- [ ] Repository tests are added when the testing layer is established.

---

## 20. Developer Module Roadmap

```text
Developer
│
├── Database schema                    ✅
│
├── Repository                        ⬅ CURRENT
│
├── Service
│   ├── Registration
│   ├── Sign-in
│   ├── Account state
│   └── Developer lifecycle
│
├── Validation / DTO
├── Controller
├── Routes
└── Tests
```

After Developer is sufficiently complete, move to Client because:

```text
Developer
    ↓
owns
    ↓
Client
```

---

## 21. Core Architectural Rule

```text
Repository
    = HOW data is persisted

Service
    = WHY / WHEN the operation is allowed

Controller
    = HOW HTTP exposes the operation
```

If a method starts making business decisions, it probably belongs in the service.

If it starts dealing with HTTP, it belongs in the controller.

If it exists to query or mutate persistent state, it probably belongs in the repository.

---

## 22. Documentation Policy

This document is created before implementation.

After implementation:

```text
Implement
    ↓
Test
    ↓
Compare implementation against this document
    ↓
Update document where the real design differs
```

The implementation is the source of truth for what actually exists.

This document is the source of truth for intended module boundaries and the implementation plan.

Never leave documentation describing behavior that the implementation no longer follows.
