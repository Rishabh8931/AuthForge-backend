# AuthForge — Coding Standards

**Status:** Active project standard  
**Scope:** Backend TypeScript / Node.js codebase

This document defines the coding patterns and architectural conventions used throughout AuthForge.

The goal is not to force one programming style everywhere. The goal is to keep the codebase predictable, testable, maintainable, and consistent as the project grows.

---

# 1. Core Principle

Use the simplest pattern that correctly represents the responsibility of the code.

AuthForge primarily uses:

```text
Classes
    → components with dependencies, responsibilities, or lifecycle

Functions
    → stateless operations and framework composition

Schemas / Types
    → data contracts and validation
```

Do not introduce abstractions only because they look "enterprise".

---

# 2. Module Architecture

AuthForge follows:

```text
HTTP Request
      ↓
Route
      ↓
Controller
      ↓
Service
      ↓
Repository
      ↓
Drizzle ORM
      ↓
PostgreSQL
```

The dependency direction should remain clear.

```text
Controller → Service → Repository → Database
```

Lower layers must not depend on higher HTTP layers.

---

# 3. Module Structure

A typical feature module follows:

```text
src/modules/<module>/
├── <module>.repository.ts
├── <module>.service.ts
├── <module>.controller.ts
├── <module>.routes.ts
├── <module>.dto.ts
├── <module>.schema.ts
└── index.ts
```

Not every module must contain every file.

Create a file when the corresponding responsibility actually exists.

Avoid creating empty architectural layers just to satisfy a template.

---

# 4. Repository Pattern

Repositories are responsible for persistence.

Recommended pattern:

```text
class Repository
    ↓
database queries
```

For example:

```text
DeveloperRepository
├── create()
├── findById()
├── findByEmail()
└── ...
```

Repositories should:

- query the database
- insert records
- update records
- delete/soft-delete records
- expose persistence-focused operations

Repositories should NOT:

- contain HTTP logic
- create HTTP responses
- validate API requests
- hash passwords
- perform authentication workflows
- make business decisions
- orchestrate multiple business operations unnecessarily

Repository boundary:

```text
Repository = HOW data is persisted
```

---

# 5. Repository Style

Prefer instance-based classes when dependencies such as `db` are injected.

Conceptually:

```text
DeveloperRepository
        ↑
        │ db
        │
DeveloperService
```

The goal is dependency injection and testability.

Avoid turning every repository into a static global API without a concrete reason.

Do not mix repository patterns across modules without an architectural reason.

---

# 6. Service Pattern

Services own business workflows.

Recommended pattern:

```text
class Service
```

A service may coordinate:

```text
Repository
Crypto utilities
Other services
Session/token operations
Business validation
```

Example conceptual flow:

```text
DeveloperService
       ↓
DeveloperRepository
       ↓
database
```

Service boundary:

```text
Service = WHY / WHEN an operation is allowed
```

Services should not directly manipulate HTTP objects.

Avoid:

```text
req
res
next
```

inside services.

---

# 7. Controller Pattern

Controllers handle HTTP concerns.

Recommended pattern:

```text
class Controller
```

A controller should generally:

1. receive the request
2. extract required input
3. invoke the service
4. return the HTTP response

Conceptually:

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Response
```

Controllers should remain thin.

Avoid putting:

- database queries
- password hashing
- complex business rules
- OAuth protocol logic
- transaction orchestration

directly in controllers.

---

# 8. Routes Pattern

Routes are framework composition and should remain simple.

Use Express router functions rather than forcing routes into classes.

Conceptually:

```text
router.post(...)
router.get(...)
router.patch(...)
```

Routes should connect:

```text
HTTP method
    ↓
Controller method
```

They should not contain business logic.

---

# 9. DTO and Validation Pattern

Use schemas/types for data contracts.

AuthForge uses Zod for runtime validation.

Conceptually:

```text
Request
   ↓
Zod schema
   ↓
validated data
   ↓
Service
```

Validation schemas should describe the shape and constraints of input.

Examples:

```text
RegisterDeveloperSchema
SignInDeveloperSchema
UpdateDeveloperSchema
```

Do not duplicate the same validation logic in multiple layers.

---

# 10. TypeScript Standards

Use TypeScript strictly.

Prefer:

```text
explicit domain types
safe narrowing
inferred types where clear
```

Avoid:

```text
any
unnecessary type assertions
unsafe casts
```

Do not use `any` to silence a compiler error.

Instead:

```text
understand the actual type
→ narrow it
→ fix the design
```

Use `unknown` when a value is genuinely unknown and narrow it safely.

---

# 11. Async Code

Use `async/await` for asynchronous application operations.

Prefer:

```text
try
    await operation
catch
    handle/propagate appropriately
```

Avoid unnecessary promise nesting.

Keep asynchronous boundaries clear.

---

# 12. Error Handling

AuthForge uses centralized error handling.

Application code should raise/propagate meaningful application errors rather than constructing HTTP responses everywhere.

Conceptually:

```text
Service
   ↓
throws/returns application error
   ↓
central error handler
   ↓
HTTP response
```

Do not scatter:

```text
res.status(...).json(...)
```

through business logic.

---

# 13. Error Types

Use the project's centralized error system.

When a failure has a meaningful application-level identity, use the project's `ApiError` / error-code infrastructure rather than creating random error strings throughout the codebase.

Errors should be:

```text
consistent
machine-readable
loggable
safe for clients
```

Do not expose:

```text
password hashes
database credentials
internal stack traces
sensitive tokens
```

in normal API responses.

---

# 14. Logging

Use the project's centralized logger.

Prefer:

```text
logger.info()
logger.warn()
logger.error()
```

over scattered `console.log()` calls in application code.

`console` may be appropriate for very early bootstrap diagnostics, but normal application logging should use the project logger.

Never log:

```text
passwords
client secrets
access tokens
refresh tokens
authorization codes
session secrets
```

or other sensitive credentials.

---

# 15. Security-Sensitive Code

AuthForge is an authentication and authorization system.

Security-sensitive code must be treated differently from ordinary CRUD logic.

Examples:

```text
password hashing
PKCE
authorization codes
access tokens
refresh tokens
client secrets
session identifiers
JWKS/private keys
```

Rules:

- never log secrets
- never return secrets unnecessarily
- never store plaintext passwords
- never invent cryptographic primitives
- use established cryptographic libraries
- keep cryptographic operations isolated and testable
- validate security-sensitive input at the boundary

---

# 16. Database Access

Application modules should access the database through repositories.

Preferred:

```text
Service
   ↓
Repository
   ↓
Drizzle
```

Avoid:

```text
Controller
   ↓
Drizzle query
```

and:

```text
Service
   ↓
Drizzle query
```

unless an explicitly documented architectural exception exists.

The repository is the normal database boundary.

---

# 17. Drizzle Standards

Use the project's configured Drizzle instance.

Schema definitions remain under:

```text
src/common/db/schema/
```

Do not redefine database schemas inside feature modules.

Feature modules should import and use the established schema/database layer.

---

# 18. Naming Conventions

Use descriptive names.

### Files

Use:

```text
developer.repository.ts
developer.service.ts
developer.controller.ts
developer.routes.ts
```

### Classes

Use PascalCase:

```text
DeveloperRepository
DeveloperService
DeveloperController
```

### Functions / methods

Use camelCase:

```text
findById()
findByEmail()
create()
signInDeveloper()
```

### Variables

Use camelCase:

```text
developerId
passwordHash
clientId
redirectUri
```

### Constants

Use descriptive names. Prefer project-consistent naming rather than blindly converting every constant to uppercase.

---

# 19. Naming Methods by Intent

Repository methods should communicate what they retrieve or mutate.

Good:

```text
findById()
findByEmail()
findByIdAndDeveloperId()
existsByEmail()
```

Avoid vague names:

```text
getData()
fetch()
process()
handle()
doSomething()
```

Service methods should describe business intent:

```text
registerDeveloper()
signInDeveloper()
updateDeveloper()
```

This makes the architecture readable without opening every implementation.

---

# 20. Avoid Generic CRUD Abstractions

Do not automatically create:

```text
BaseRepository
BaseService
GenericCrudService
GenericController
```

just because several modules have CRUD operations.

AuthForge contains security-sensitive domains where domain-specific behavior matters.

Prefer focused domain repositories and services.

Introduce a shared abstraction only when:

1. the duplication is real,
2. the behavior is genuinely identical,
3. the abstraction improves the code rather than hiding it.

---

# 21. Dependency Injection

Prefer explicit dependencies.

Conceptually:

```text
Repository(db)
Service(repository)
Controller(service)
```

This makes dependencies visible and supports testing.

Avoid hidden global dependencies when they make testing or reasoning difficult.

---

# 22. Stateless Utilities

Use functions for small stateless utilities.

Examples:

```text
hashPassword()
verifyPassword()
generateRandomValue()
normalizeEmail()
```

Do not create a class merely because the function sounds like a "manager".

Use classes when an actual object/dependency boundary exists.

---

# 23. Middleware

Express middleware should normally be functions.

Examples:

```text
requestId()
requestLogger()
security()
cors()
rateLimit()
notFound()
errorHandler()
```

Middleware should follow Express's contract and remain focused on one concern.

---

# 24. Configuration

Configuration should come through the project's configuration/environment layer.

Avoid reading environment variables randomly throughout business modules.

Prefer:

```text
common/config
    ↓
typed configuration
    ↓
application modules
```

This centralizes configuration validation and makes required environment variables explicit.

---

# 25. Imports

Use the project's configured path aliases and ESM conventions consistently.

Do not mix incompatible import styles.

Follow the existing project convention for:

```text
relative imports
path aliases
.js extensions
```

when writing TypeScript for the ESM runtime.

---

# 26. Comments

Comments should explain **why**, not restate obvious code.

Bad:

```ts
// Find developer by ID
findById(id)
```

Better:

```ts
// Exclude soft-deleted accounts from normal authentication lookups.
```

Use comments when they preserve important design reasoning or security constraints.

Do not use comments to compensate for unclear code.

---

# 27. Function Size

Prefer focused functions.

If a method is doing:

```text
validation
database access
cryptography
logging
response formatting
```

all at once, it is probably crossing architectural boundaries.

Break responsibilities at meaningful boundaries rather than splitting every few lines into artificial helpers.

---

# 28. Business Logic Placement

Use this rule:

```text
Database question?
    → Repository

Business decision?
    → Service

HTTP concern?
    → Controller / Middleware

Request shape?
    → DTO / Zod

Reusable stateless operation?
    → Utility

Application-wide cross-cutting concern?
    → Common infrastructure
```

This is one of the most important AuthForge coding rules.

---

# 29. Example Architecture

For Developer:

```text
POST /developers/signin
        ↓
developer.routes.ts
        ↓
DeveloperController.signIn()
        ↓
DeveloperService.signInDeveloper()
        ↓
DeveloperRepository.findByEmail()
        ↓
PostgreSQL
```

Then:

```text
DeveloperService
        ↓
verifyPassword()
        ↓
account-state checks
        ↓
session/authentication workflow
```

The controller never performs those business operations itself.

---

# 30. Testing and Design

Code should be written so responsibilities can be tested independently.

```text
Repository tests
    → database behavior

Service tests
    → business behavior

Controller tests
    → HTTP behavior

Middleware tests
    → cross-cutting behavior
```

Dependency injection should make it possible to substitute repository/database dependencies in service tests.

---

# 31. Documentation Rule

When an architectural decision is significant, document the reasoning.

Use:

```text
docs/architecture/decisions/
```

for Architecture Decision Records when appropriate.

Module behavior belongs in:

```text
docs/modules/
```

Infrastructure conventions belong in:

```text
docs/infrastructure/
```

Development conventions belong in:

```text
docs/development/
```

Do not duplicate the same architectural explanation across many files.

---

# 32. Git and Implementation Workflow

Use:

```text
Design
   ↓
Implement
   ↓
Test
   ↓
Update documentation
   ↓
Commit
   ↓
Push
   ↓
PR
   ↓
Review
   ↓
Merge
```

Feature branches should start from the latest `main`.

Do not reuse an old merged feature branch for unrelated work.

---

# 33. Code Review Checklist

Before considering a change complete:

- [ ] Correct architectural layer?
- [ ] Business logic in service rather than controller/repository?
- [ ] Database access isolated in repository?
- [ ] Input validated?
- [ ] Types are safe?
- [ ] No unnecessary `any`?
- [ ] Errors use centralized error infrastructure?
- [ ] Sensitive data protected?
- [ ] Logging is safe?
- [ ] No unnecessary abstraction?
- [ ] Naming communicates intent?
- [ ] Tests cover important behavior?
- [ ] Documentation reflects the actual implementation?

---

# 34. AuthForge Pattern Summary

```text
                    AuthForge
                        │
        ┌───────────────┼────────────────┐
        │               │                │
     Stateful        Stateless        Declarative
     Components      Operations       Contracts
        │               │                │
        ▼               ▼                ▼
      Classes         Functions       Zod/Types
        │
   ┌────┼─────┐
   │    │     │
Repo Service Controller
        │
        ▼
      Routes
    (functions)
```

### Final rule

Do not choose a pattern because it is "more enterprise".

Choose it because it makes the responsibility clear.

```text
Class
→ component with dependencies/state

Function
→ stateless operation or framework composition

Schema/Type
→ data contract

Repository
→ persistence

Service
→ business workflow

Controller
→ HTTP

Middleware
→ cross-cutting HTTP behavior
```

Consistency across AuthForge is more important than following a fashionable pattern.
