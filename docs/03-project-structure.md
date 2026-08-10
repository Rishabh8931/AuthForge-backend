# AuthForge — Project Structure

**Project:** AuthForge  
**Document:** 03 — Project Structure  
**Status:** Living documentation  
**Scope:** Source tree, file responsibilities, module organization, naming, and placement rules

---

# 1. Purpose

This document answers a practical question:

> **When I need to add or modify something in AuthForge, where exactly should the code go?**

The architecture document explains the dependency flow.

This document explains the physical organization of the codebase.

The current source tree is organized around two major areas:

```text
src/
├── common/
└── modules/
```

The fundamental distinction is:

```text
common  → shared infrastructure
modules → business/domain functionality
```

---

# 2. Current Source Tree

The current `src` structure is:

```text
src/
│
├── app.ts
├── server.ts
│
├── common/
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── index.ts
│   │   └── schema.ts
│   │
│   ├── constants/
│   │
│   ├── crypto/
│   │
│   ├── db/
│   │   ├── connection.ts
│   │   ├── index.ts
│   │   └── schema/
│   │       ├── audit-log.ts
│   │       ├── authorization.ts
│   │       ├── client-grant-type.ts
│   │       ├── client-redirect-uri.ts
│   │       ├── client-scope.ts
│   │       ├── client.ts
│   │       ├── consent.ts
│   │       ├── developer.ts
│   │       ├── enums.ts
│   │       ├── helper.ts
│   │       ├── index.ts
│   │       ├── session.ts
│   │       ├── token.ts
│   │       └── user.ts
│   │
│   ├── errors/
│   │   ├── api-error.ts
│   │   ├── error-codes.ts
│   │   ├── error-handler.ts
│   │   └── index.ts
│   │
│   ├── logger/
│   │   ├── index.ts
│   │   └── logger.ts
│   │
│   ├── middleware/
│   │   ├── cors.ts
│   │   ├── index.ts
│   │   ├── not-found.ts
│   │   ├── rate-limit.ts
│   │   ├── request-id.ts
│   │   ├── request-logger.ts
│   │   └── security.ts
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   ├── utils/
│   │   └── response.ts
│   │
│   └── validation/
│
└── modules/
    │
    ├── audit/
    ├── auth/
    ├── client/
    ├── consent/
    ├── developer/
    ├── health/
    │   ├── health.controller.ts
    │   ├── health.routes.ts
    │   ├── health.service.ts
    │   ├── health.types.ts
    │   └── index.ts
    │
    ├── jwks/
    ├── oauth/
    ├── oidc/
    ├── session/
    ├── token/
    └── user/
```

This is the current known structure. Empty directories represent planned/domain areas whose detailed files are not established by the supplied tree.

---

# 3. Top-Level `src` Files

## `src/server.ts`

Responsible for starting the HTTP server.

Conceptually:

```text
server.ts
    ↓
application
    ↓
listen()
```

It should not contain domain logic.

Avoid putting:

```text
OAuth logic
database queries
token generation
user authentication
client registration
```

inside `server.ts`.

---

## `src/app.ts`

Responsible for composing the Express application.

Typical responsibilities include:

```text
middleware registration
route registration
404 handling
central error handling
```

Think of it as the application composition root.

```text
server.ts
    ↓
app.ts
    ↓
middleware + routes + error handling
```

---

# 4. `common/`

The `common` directory contains reusable infrastructure.

Use `common` when the code answers:

> "Can multiple unrelated modules use this without knowing about one specific business domain?"

If yes, `common` is a candidate.

Examples:

```text
configuration
database
logging
errors
middleware
cryptography
generic validation
response formatting
shared types
```

---

# 5. `common/config/`

Current files:

```text
common/config/
├── env.ts
├── index.ts
└── schema.ts
```

## `schema.ts`

Defines the runtime validation schema for environment/configuration values.

Conceptually:

```text
process.env
    ↓
schema validation
    ↓
validated environment
```

---

## `env.ts`

Provides the validated environment/configuration to the application.

The rest of the codebase should consume centralized configuration instead of repeatedly parsing `process.env`.

---

## `index.ts`

Acts as the public export surface for configuration.

It allows consumers to import configuration from a stable location.

---

# 6. `common/constants/`

This directory is intended for shared constants.

Good examples:

```text
HTTP constants
generic application constants
non-domain-specific limits
shared constant values
```

Do not use this directory as a dumping ground for business logic.

If a constant only makes sense inside OAuth, prefer keeping it near the OAuth domain.

---

# 7. `common/crypto/`

This directory owns reusable cryptographic functionality.

Potential responsibilities include:

```text
secure random generation
hashing
verification
token hashing
secret hashing
PKCE operations
signing
signature verification
```

The exact implementation should remain behind this boundary.

The key rule is:

> Do not duplicate security-sensitive cryptographic code across business modules.

For example, do not implement client-secret hashing independently inside:

```text
client service
token service
session service
```

when the same primitive belongs in the crypto layer.

---

# 8. `common/db/`

Current structure:

```text
common/db/
├── connection.ts
├── index.ts
└── schema/
```

---

## `connection.ts`

Responsible for creating the database connection/ORM client.

The current project uses:

```text
Drizzle ORM
+
@neondatabase/serverless
+
Neon PostgreSQL
```

Conceptually:

```text
Environment
    ↓
DATABASE_URL
    ↓
Neon client
    ↓
Drizzle
    ↓
db
```

---

## `index.ts`

Acts as the database module's public export surface.

Consumers should be able to access the database through the established database entry point rather than knowing internal connection implementation details.

---

# 9. `common/db/schema/`

This directory contains the database schema definitions.

Current schema files:

```text
audit-log.ts
authorization.ts
client-grant-type.ts
client-redirect-uri.ts
client-scope.ts
client.ts
consent.ts
developer.ts
enums.ts
helper.ts
session.ts
token.ts
user.ts
index.ts
```

These files describe persistence structure.

They should not become a replacement for service-layer business logic.

---

# 10. Database Schema File Responsibilities

## `developer.ts`

Defines the developer persistence model.

Conceptually:

```text
Developer
    ↓
owns
    ↓
OAuth Clients
```

---

## `client.ts`

Defines the main OAuth client persistence model.

It represents the registered client identity/configuration.

---

## `client-redirect-uri.ts`

Defines registered redirect URI persistence.

This allows one client to have multiple registered redirect URIs.

Conceptually:

```text
Client
  1
  │
  └────── N Redirect URIs
```

---

## `client-scope.ts`

Defines client-to-scope relationships.

This represents which scopes a client is allowed to request.

---

## `client-grant-type.ts`

Defines the grant types supported/configured for a client.

---

## `user.ts`

Defines the user persistence model.

Users are distinct from developers because they represent different actors in the system.

---

## `session.ts`

Defines persistent user session state.

---

## `authorization.ts`

Defines authorization transaction/state information.

It represents the persisted state associated with an authorization operation.

---

## `consent.ts`

Defines persistent consent information.

The consent record represents the fact that a user granted permission to a client for specified access.

---

## `token.ts`

Defines token persistence and lifecycle state.

The model supports the token lifecycle represented by the project architecture.

---

## `audit-log.ts`

Defines persisted security-relevant audit events.

This is separate from ordinary application logs.

---

## `enums.ts`

Contains shared database enums.

Enums should represent actual constrained domain values rather than arbitrary strings that happen to be convenient.

---

## `helper.ts`

Contains shared schema helpers.

It should remain focused on reusable database-schema construction logic.

It should not become a generic application utility file.

---

## `schema/index.ts`

Acts as the central export point for database schema definitions.

This is particularly useful for:

```text
Drizzle configuration
database imports
schema discovery
centralized exports
```

---

# 11. `common/errors/`

Current files:

```text
common/errors/
├── api-error.ts
├── error-codes.ts
├── error-handler.ts
└── index.ts
```

---

## `api-error.ts`

Defines the application's structured API error representation.

Use this for errors that need consistent application-level handling.

---

## `error-codes.ts`

Defines stable application error codes.

Error codes should communicate machine-readable error identity without requiring consumers to parse human-readable messages.

---

## `error-handler.ts`

Centralizes Express error handling.

The goal is:

```text
Thrown Error
    ↓
Central Handler
    ↓
Standard API Error
```

---

## `index.ts`

Public export surface for the error subsystem.

---

# 12. `common/logger/`

Current files:

```text
common/logger/
├── index.ts
└── logger.ts
```

---

## `logger.ts`

Owns the application's logger configuration and logger instance.

The project uses Pino.

---

## `index.ts`

Public export surface for logging.

---

# 13. `common/middleware/`

Current middleware:

```text
cors.ts
index.ts
not-found.ts
rate-limit.ts
request-id.ts
request-logger.ts
security.ts
```

---

## `cors.ts`

Cross-Origin Resource Sharing configuration.

---

## `security.ts`

HTTP security middleware.

This is global infrastructure rather than domain logic.

---

## `rate-limit.ts`

Rate-limiting infrastructure.

This is particularly important for authentication and authorization endpoints.

---

## `request-id.ts`

Creates or propagates request correlation IDs.

---

## `request-logger.ts`

Logs HTTP request/response activity.

Sensitive credentials must remain redacted.

---

## `not-found.ts`

Handles unmatched routes.

---

## `index.ts`

Exports middleware utilities from one stable entry point.

---

# 14. `common/types/`

Current file:

```text
common/types/
└── express.d.ts
```

This directory contains shared TypeScript type declarations.

---

## `express.d.ts`

Used for Express-specific type augmentation.

For example, if AuthForge attaches a request-scoped value to:

```text
req
```

the type declaration can make TypeScript aware of it.

---

# 15. `common/utils/`

Current file:

```text
common/utils/
└── response.ts
```

---

## `response.ts`

Provides standardized API response behavior.

This is useful for keeping successful HTTP responses consistent across modules.

Do not put business logic here.

---

# 16. `common/validation/`

This directory is intended for reusable validation infrastructure.

Validation belongs here when it is generic/reusable.

Domain-specific validation should remain close to the domain when that validation expresses business rules.

For example:

```text
UUID format validation
    → common validation candidate

"client may use this redirect URI"
    → client/oauth domain rule
```

---

# 17. `modules/`

The `modules` directory contains business/domain capabilities.

Current domains:

```text
audit
auth
client
consent
developer
health
jwks
oauth
oidc
session
token
user
```

The key rule is:

> A module should represent a meaningful business capability, not merely a technical category.

---

# 18. Standard Module Anatomy

Where appropriate, a module can follow:

```text
module/
├── controller
├── routes
├── service
├── repository
├── types
└── index
```

Not every module needs every file.

The architecture should not force meaningless files into small modules.

For example, a health check may not need a repository.

---

# 19. Module Dependency Flow

The preferred flow is:

```text
routes
   ↓
controller
   ↓
service
   ↓
repository
   ↓
database
```

Shared infrastructure can be consumed where required:

```text
service → crypto
service → validation
service → logger
service → configuration
controller → response utility
```

Avoid reversing the dependency direction.

---

# 20. `modules/health/`

The health module currently demonstrates the intended module anatomy:

```text
modules/health/
├── health.controller.ts
├── health.routes.ts
├── health.service.ts
├── health.types.ts
└── index.ts
```

---

## `health.routes.ts`

Defines HTTP endpoints for health functionality.

---

## `health.controller.ts`

Handles the HTTP request and delegates to the health service.

---

## `health.service.ts`

Contains health-related application behavior.

---

## `health.types.ts`

Contains health-specific TypeScript types.

---

## `index.ts`

Provides the module's public exports.

---

# 21. `modules/developer/`

The developer domain represents the platform-side actor that creates/manages OAuth clients.

Conceptual relationship:

```text
Developer
    ↓
Client
```

Developer business rules belong here.

Database persistence belongs behind the appropriate repository boundary.

---

# 22. `modules/client/`

The client domain represents registered OAuth applications.

Responsibilities include concepts such as:

```text
client registration
client configuration
redirect URI management
scope configuration
grant-type configuration
client credential lifecycle
```

These are business responsibilities.

The underlying tables remain in:

```text
common/db/schema/
```

---

# 23. `modules/user/`

The user domain represents resource owners/end users.

Potential responsibilities include:

```text
user creation
user lookup
user profile state
identity-related business rules
```

Authentication should not be confused with the user persistence model.

---

# 24. `modules/auth/`

The authentication domain handles proving user identity.

It should remain conceptually separate from:

```text
oauth
authorization
consent
token
```

because:

```text
authentication = who are you?

authorization = what are you allowed to receive/do?
```

---

# 25. `modules/session/`

The session domain manages authenticated user sessions.

Its responsibility is the session lifecycle:

```text
create
validate
expire
revoke
```

The underlying session table is defined under:

```text
common/db/schema/session.ts
```

---

# 26. `modules/consent/`

The consent module owns user permission decisions.

A consent operation can conceptually involve:

```text
User
+
Client
+
Requested scopes
+
Permission decision
```

The persisted record should not be confused with the UI page that displays the permission request.

---

# 27. `modules/oauth/`

The OAuth module owns OAuth protocol behavior.

This is a protocol/domain module rather than a generic HTTP module.

Responsibilities include concepts such as:

```text
authorization endpoint
OAuth parameter validation
PKCE verification
authorization-code handling
token flow coordination
OAuth errors
```

The implementation should reuse shared infrastructure rather than duplicating it.

---

# 28. `modules/token/`

The token module owns token lifecycle behavior.

Relevant concepts include:

```text
access tokens
refresh tokens
expiration
revocation
rotation
token family/state
```

Token persistence is defined in the database schema.

Token business rules belong in the token module.

---

# 29. `modules/oidc/`

The OIDC module owns OpenID Connect functionality.

It builds on top of the OAuth foundation.

The module should not duplicate:

```text
client registration
session infrastructure
database connection
generic crypto utilities
```

unless a genuine OIDC-specific responsibility requires it.

---

# 30. `modules/jwks/`

The JWKS module owns the public key discovery interface.

Conceptually:

```text
Signing Infrastructure
       ↓
Public Keys
       ↓
JWKS Endpoint
```

Private signing material must never be exposed through this module.

---

# 31. `modules/audit/`

The audit module owns security-relevant event recording.

Examples of events that may belong here:

```text
authentication success/failure
client credential events
authorization events
consent decisions
token lifecycle events
security-sensitive administrative actions
```

The audit module should not replace operational logging.

---

# 32. How to Add a New Endpoint

Suppose a new client endpoint is required:

```text
POST /clients
```

The expected implementation path is:

```text
modules/client/
    ↓
client.routes.ts
    ↓
client.controller.ts
    ↓
client.service.ts
    ↓
client.repository.ts
    ↓
common/db/schema/client.ts
```

The database schema should only change if the persistence model actually needs to change.

---

# 33. How to Add a New Domain

Suppose AuthForge later adds a new meaningful domain.

Start with:

```text
modules/new-domain/
```

Then add only the files actually needed.

For example:

```text
modules/new-domain/
├── new-domain.routes.ts
├── new-domain.controller.ts
├── new-domain.service.ts
├── new-domain.repository.ts
├── new-domain.types.ts
└── index.ts
```

Do not automatically create all six files if the feature does not require them.

---

# 34. How to Decide Whether Something Belongs in `common`

Ask these questions:

### Question 1

Does the code depend on a specific business domain?

```text
Yes → modules/
No  → common/ candidate
```

### Question 2

Could multiple unrelated modules reuse it?

```text
Yes → common/ candidate
No  → keep it local
```

### Question 3

Does it express a business rule?

```text
Yes → domain module
No  → infrastructure/shared layer may be appropriate
```

---

# 35. File Placement Examples

| Code | Correct location |
|---|---|
| Database connection | `common/db` |
| Drizzle schema | `common/db/schema` |
| Password hashing primitive | `common/crypto` |
| OAuth authorization rule | `modules/oauth` |
| Client registration rule | `modules/client` |
| Token rotation rule | `modules/token` |
| User consent decision | `modules/consent` |
| Environment validation | `common/config` |
| Express security middleware | `common/middleware` |
| API error class | `common/errors` |
| HTTP response helper | `common/utils` |
| OIDC identity logic | `modules/oidc` |
| Audit event orchestration | `modules/audit` |

---

# 36. Naming Conventions

The current project uses descriptive kebab-case filenames:

```text
request-id.ts
request-logger.ts
error-handler.ts
client-redirect-uri.ts
client-grant-type.ts
```

Follow this style consistently.

For module-specific files, the domain name is included when useful:

```text
health.controller.ts
health.routes.ts
health.service.ts
health.types.ts
```

The goal is that a filename communicates both:

```text
what domain
+
what responsibility
```

---

# 37. Class and Function Naming

Use names that describe behavior rather than implementation details.

Prefer:

```text
ClientService
ClientRepository
createClient()
findClientById()
revokeSession()
verifyPkce()
```

Avoid vague names such as:

```text
Manager
Helper
Processor
Handler
Thing
DataService
```

unless the name genuinely communicates a stable responsibility.

---

# 38. Import Rules

Use the project's configured path aliases where appropriate.

The project uses the `@/` alias for source imports.

Example:

```ts
import { env } from "@/common/config/env.js";
```

When using ESM, preserve the runtime-compatible `.js` extension in source imports as required by the project's TypeScript/ESM configuration.

---

# 39. Index Files

`index.ts` files are used as public export surfaces.

For example:

```text
common/errors/index.ts
common/logger/index.ts
common/db/index.ts
common/db/schema/index.ts
modules/health/index.ts
```

The purpose is to make the module boundary explicit.

Do not create deeply nested export chains simply for the sake of abstraction.

---

# 40. Where Repositories Belong

Repositories are domain-specific persistence adapters.

Therefore they should normally live with their domain:

```text
modules/client/client.repository.ts
modules/user/user.repository.ts
modules/token/token.repository.ts
```

rather than creating one giant:

```text
common/repositories/
```

directory containing unrelated business persistence.

The database connection/schema remains shared infrastructure.

The repository represents the domain's persistence interface.

---

# 41. Where DTOs Belong

If a DTO is specific to one domain:

```text
modules/client/client.types.ts
```

is preferable.

If a type is genuinely shared across unrelated domains:

```text
common/types/
```

may be appropriate.

Avoid moving everything into `common/types`.

That creates a second dumping ground.

---

# 42. Where Validation Schemas Belong

Validation should be placed according to scope.

Generic:

```text
common/validation/
```

Domain-specific:

```text
modules/client/
modules/oauth/
modules/auth/
```

For example:

```text
OAuth authorize query schema
    → OAuth module

Environment schema
    → common/config/schema.ts

Generic UUID schema
    → common validation candidate
```

---

# 43. Where Business Constants Belong

A constant should be placed close to the code that owns its meaning.

For example:

```text
OAuth authorization-specific constant
    → modules/oauth
```

while:

```text
generic HTTP constant
    → common/constants
```

This prevents `common/constants` from becoming an enormous global namespace.

---

# 44. Where Security Logic Belongs

Use the narrowest appropriate boundary.

```text
HTTP security headers
    → common/middleware

Password hashing primitive
    → common/crypto

Authentication decision
    → modules/auth

OAuth authorization decision
    → modules/oauth

Consent decision
    → modules/consent

Token lifecycle policy
    → modules/token
```

Security should be layered rather than centralized into one giant security module.

---

# 45. Physical Structure vs Runtime Structure

The directory structure is not the complete architecture.

For example:

```text
common/db/schema/client.ts
```

defines persistence.

It does not mean:

```text
client.ts
```

contains all client business behavior.

The runtime architecture remains:

```text
HTTP
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Schema / ORM
 ↓
Database
```

Physical location and runtime responsibility are related, but they are not identical.

---

# 46. Recommended Development Workflow

When implementing a new feature:

## Step 1 — Identify the domain

Ask:

```text
Is this client?
OAuth?
Token?
User?
Consent?
Session?
```

---

## Step 2 — Define persistence changes

Only if needed:

```text
schema
migration
constraints
indexes
foreign keys
```

---

## Step 3 — Implement repository

Create the persistence operations required by the domain.

---

## Step 4 — Implement service

Put business rules and orchestration here.

---

## Step 5 — Implement controller

Translate HTTP input/output.

---

## Step 6 — Implement route

Expose the operation through HTTP.

---

## Step 7 — Add validation

Validate external input.

---

## Step 8 — Add errors

Use the centralized error model.

---

## Step 9 — Add audit events where appropriate

Security-sensitive operations should have an explicit audit decision.

---

## Step 10 — Test the complete flow

```text
HTTP
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database
```

---

# 47. Example: Adding a Client Scope Endpoint

Suppose the requirement is:

```text
Update allowed scopes for a client
```

Identify the domain:

```text
client
```

Expected structure:

```text
modules/client/
├── client.routes.ts
├── client.controller.ts
├── client.service.ts
├── client.repository.ts
└── client.types.ts
```

The service might coordinate:

```text
verify client ownership
        ↓
validate requested scopes
        ↓
replace/update client-scope relationships
        ↓
audit configuration change
```

The repository performs the database operations.

The controller only translates HTTP to the service call.

---

# 48. Example: Adding an OAuth Endpoint

Suppose the requirement is:

```text
GET /oauth/authorize
```

The domain is:

```text
oauth
```

The flow should be:

```text
oauth.routes
      ↓
oauth.controller
      ↓
oauth.service
      ↓
client repository
      ↓
authorization repository
      ↓
consent/auth/session services
```

The controller should not manually query:

```text
clients
redirect URIs
scopes
consents
```

and make every OAuth decision itself.

OAuth is a protocol workflow and belongs in the service/domain layer.

---

# 49. What Should Never Happen

Avoid this:

```text
modules/oauth/oauth.controller.ts

    ↓ directly imports
common/db/connection.ts

    ↓ performs
db.select(...)

    ↓ performs
hashing

    ↓ checks
redirect URI

    ↓ checks
PKCE

    ↓ issues
token

    ↓ returns
response
```

This creates a fat controller and destroys the architectural boundaries.

Preferred:

```text
OAuth Controller
      ↓
OAuth Service
      ├── Client Repository
      ├── Authorization Repository
      ├── Consent Service
      ├── Crypto
      └── Token Service
```

---

# 50. Current Structure Status

## Foundation

```text
src/app.ts                         ✅
src/server.ts                      ✅
```

## Common infrastructure

```text
config                            ✅
constants                         🟡 foundation exists
crypto                            🟡 boundary exists
db                                ✅
errors                            ✅
logger                            ✅
middleware                        ✅
types                             ✅
utils                             ✅
validation                        🟡 directory exists
```

## Domain modules

```text
audit                             🟡 module exists
auth                              🟡 module exists
client                            🟡 module exists
consent                           🟡 module exists
developer                         🟡 module exists
health                            ✅ established module
jwks                              🟡 module exists
oauth                             🟡 module exists
oidc                              🟡 module exists
session                           🟡 module exists
token                             🟡 module exists
user                              🟡 module exists
```

`🟡` means the directory/module exists in the current source tree; it does **not** mean every planned implementation inside that module is complete.

---

# 51. Structure Rules Checklist

Before creating a new file, verify:

- [ ] Do I know which domain owns this?
- [ ] Is this infrastructure or business logic?
- [ ] Am I putting business logic in `common`?
- [ ] Am I putting generic infrastructure inside a domain?
- [ ] Does this belong in an existing module?
- [ ] Does the file have one clear responsibility?
- [ ] Does its name communicate its purpose?
- [ ] Does it respect the dependency direction?
- [ ] Can the feature be implemented without creating unnecessary abstractions?
- [ ] Does the implementation require a database change?
- [ ] Does the operation require validation?
- [ ] Does it require an audit event?

---

# 52. Quick Placement Cheat Sheet

```text
Need environment config?
    → common/config

Need DB connection?
    → common/db

Need DB table/schema?
    → common/db/schema

Need cryptographic primitive?
    → common/crypto

Need global middleware?
    → common/middleware

Need global application error?
    → common/errors

Need generic validation?
    → common/validation

Need response formatting?
    → common/utils

Need OAuth business logic?
    → modules/oauth

Need client business logic?
    → modules/client

Need user business logic?
    → modules/user

Need authentication logic?
    → modules/auth

Need consent logic?
    → modules/consent

Need session logic?
    → modules/session

Need token logic?
    → modules/token

Need OIDC logic?
    → modules/oidc

Need JWKS logic?
    → modules/jwks

Need audit behavior?
    → modules/audit
```

---

# 53. Final Mental Model

The easiest way to remember the project structure is:

```text
src/
│
├── app.ts / server.ts
│       ↓
│   Application startup
│
├── common/
│       ↓
│   Shared infrastructure
│
└── modules/
        ↓
    Business domains
```

Inside a domain:

```text
module
  │
  ├── routes
  │       ↓
  ├── controller
  │       ↓
  ├── service
  │       ↓
  └── repository
          ↓
      common/db/schema
          ↓
       PostgreSQL
```

And across everything:

```text
config
validation
crypto
errors
logging
security
```

provide shared capabilities.

---

# 54. Final Rules

The project structure should follow these rules:

1. **`common` is for reusable infrastructure.**
2. **`modules` is for business domains.**
3. **Routes expose HTTP endpoints.**
4. **Controllers translate HTTP to application operations.**
5. **Services own business rules and orchestration.**
6. **Repositories own persistence operations.**
7. **Database schemas describe persistence, not business workflows.**
8. **Cryptographic primitives belong in `common/crypto`.**
9. **Generic middleware belongs in `common/middleware`.**
10. **Domain-specific logic stays inside its domain module.**
11. **Do not create unnecessary files just to satisfy a pattern.**
12. **Do not turn `common/utils` or `common/types` into dumping grounds.**
13. **Keep dependency direction predictable.**
14. **Keep security-sensitive logic centralized where appropriate.**
15. **Prefer the smallest clear structure that preserves the architectural boundary.**

---

# 55. Relationship With Previous Documentation

The documentation hierarchy is:

```text
01-project-overview.md
        ↓
What is AuthForge?
        ↓
02-architecture.md
        ↓
How does AuthForge work?
        ↓
03-project-structure.md
        ↓
Where does each piece of code belong?
```

The next documents should build on this rather than repeat it.

Recommended next document:

```text
04-development-conventions.md
```

That document should define the coding standards used while implementing the remaining AuthForge domains.
