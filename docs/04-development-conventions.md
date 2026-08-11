# AuthForge — Development Conventions

**Project:** AuthForge  
**Document:** 04 — Development Conventions  
**Status:** Living coding rulebook  
**Purpose:** Define the conventions used while implementing and reviewing AuthForge.

---

# 1. Why This Document Exists

AuthForge is a security-sensitive OAuth/OIDC system.

The goal is not to make every file look identical. The goal is to make the codebase:

- predictable
- type-safe
- reviewable
- secure
- testable
- maintainable
- consistent across modules

When a new implementation decision is not explicitly covered here, prefer the existing architecture and the smallest solution that preserves its boundaries.

---

# 2. Core Engineering Principles

AuthForge follows these principles:

1. **Type safety over convenience.**
2. **Explicit boundaries over hidden behavior.**
3. **Business logic belongs in services.**
4. **Persistence belongs behind repositories.**
5. **Controllers remain thin.**
6. **Security-sensitive operations are explicit.**
7. **Validate external input before using it.**
8. **Do not trust client-controlled values.**
9. **Do not duplicate infrastructure logic.**
10. **Prefer simple code over unnecessary abstraction.**
11. **Keep modules cohesive.**
12. **Make failures predictable.**

---

# 3. TypeScript

AuthForge uses TypeScript as the primary implementation language.

Prefer strict typing.

```ts
const client = await ClientRepository.findById(clientId);
```

Avoid:

```ts
const client: any = await something();
```

Do not use `any` to silence compiler errors.

If a type is genuinely unknown, prefer:

```ts
unknown;
```

and narrow it explicitly.

---

# 4. ESM Imports

AuthForge uses ESM.

Use runtime-compatible `.js` extensions in local TypeScript imports when required by the project's configuration.

Example:

```ts
import { env } from "@/common/config/env.js";
import { db } from "@/common/db/index.js";
```

Do not randomly mix extension styles.

---

# 5. Path Aliases

Use the configured `@/` alias for internal source imports where appropriate.

Prefer:

```ts
import { ApiError } from "@/common/errors/api-error.js";
```

over unnecessarily long relative paths such as:

```ts
import { ApiError } from "../../../common/errors/api-error.js";
```

The alias makes architectural boundaries easier to read.

---

# Coding Conventions

                  AuthForge
                    │
          ┌─────────┴─────────┐
          │                   │
      Stateful/             Stateless/
      dependent             standalone
          │                   │
          ▼                   ▼
       Classes             Functions
          │                   │
    ┌─────┼─────┐       ┌─────┼─────┐
    │           │       │     │     │
    |           |       |    Utils  |

Repository Service Controller Middleware

---

# 6. Naming Conventions

Use descriptive names.

## Files

Use kebab-case:

```text
error-handler.ts
request-id.ts
client-redirect-uri.ts
```

## Classes

Use PascalCase:

```ts
class ClientService {}
class ClientRepository {}
```

## Functions and variables

Use camelCase:

```ts
createClient();
findClientById();
clientId;
redirectUri;
```

## Constants

Use descriptive names. Uppercase is appropriate for genuine global constants:

```ts
MAX_TOKEN_LIFETIME;
```

Do not uppercase every local variable.

---

# 7. One Responsibility Per File

A file should have a clear primary responsibility.

Good:

```text
client.service.ts
```

contains client business logic.

Avoid creating files such as:

```text
everything.service.ts
misc.ts
helpers.ts
common.ts
```

without a strong reason.

---

# 8. Controllers

Controllers are HTTP adapters.

Their job is to:

1. read HTTP input
2. invoke the appropriate service
3. return the HTTP response

Conceptually:

```text
HTTP Request
     ↓
Controller
     ↓
Service
     ↓
HTTP Response
```

A controller should not contain complex business rules.

Avoid:

```ts
const client = await db.query.client.findFirst(...);

if (client.redirectUri !== redirectUri) {
  ...
}

const hash = await bcrypt.hash(...);

...
```

inside a controller.

Prefer:

```ts
const result = await ClientService.createClient(input);
return sendSuccess(res, result);
```

---

# 9. Services

Services own business logic and orchestration.

A service can coordinate:

```text
repository
validation
crypto
other domain services
transactions
audit
```

Example:

```ts
const client = await ClientRepository.findById(clientId);

if (!client) {
  throw new ApiError(...);
}

await ClientRepository.update(...);
await AuditService.record(...);
```

The service decides **what should happen**.

---

# 10. Repositories

Repositories own persistence operations.

A repository should answer questions such as:

```text
find client
create client
update client
delete client
find authorization
create token
```

Avoid putting business policy into repositories.

Bad:

```ts
ClientRepository.createClientIfUserIsAllowedAndGenerateToken(...)
```

Better:

```text
Service
  ↓
check authorization
  ↓
Repository
  ↓
persist client
```

---

# 11. Database Access Rule

Business modules should not randomly access the database connection everywhere.

Preferred:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
Drizzle
   ↓
PostgreSQL
```

This keeps persistence behavior centralized.

---

# 12. Drizzle Conventions

Use the existing Drizzle database instance.

Do not create new database clients inside individual repositories.

Prefer:

```ts
import { db } from "@/common/db/index.js";
```

Repositories should use the existing schema definitions and database connection.

---

# 13. Schema vs Business Logic

Database schemas define persistence.

They should describe:

```text
columns
types
constraints
indexes
foreign keys
relations
```

They should not contain application workflows.

For example:

```text
client.ts
```

defines the client table.

It should not implement:

```text
client registration workflow
secret rotation policy
authorization decisions
```

Those belong to services.

---

# 14. Foreign Keys

Foreign keys should represent real database relationships.

Example:

```text
developer
    │
    └── client.developer_id
```

The database should enforce referential integrity where appropriate.

Do not rely exclusively on application code for relationships that the database can safely enforce.

---

# 15. Transactions

Use a transaction when multiple database operations must succeed or fail together.

Conceptually:

```text
BEGIN
  operation A
  operation B
  operation C
COMMIT
```

If a required operation fails:

```text
ROLLBACK
```

Typical examples:

```text
create client
+
create redirect URIs
+
create scopes
```

or a token/authorization operation that changes several related records atomically.

Do not use transactions for every single query without a reason.

---

# 16. Validation

External input is untrusted.

Validate:

```text
req.body
req.query
req.params
headers
OAuth parameters
configuration
```

before using it.

AuthForge uses Zod-based validation.

Prefer:

```ts
const input = authorizeSchema.parse(req.query);
```

or the project's established safe parsing approach when controlled error handling is required.

Do not assume TypeScript types validate runtime input.

This:

```ts
const input = req.body as CreateClientInput;
```

does **not** validate the request.

---

# 17. DTOs and Types

Keep input shapes explicit.

Example:

```ts
type CreateClientInput = {
  name: string;
  redirectUris: string[];
};
```

If the input comes from HTTP, validate it at the boundary.

Avoid passing raw `req.body` deep into the application.

Preferred:

```text
HTTP input
    ↓
Zod validation
    ↓
typed input
    ↓
service
```

---

# 18. Error Handling

AuthForge uses centralized error handling.

Expected flow:

```text
Service throws
      ↓
Express error handler
      ↓
standard API response
```

Use the project's `ApiError` and error-code system for expected application failures.

Do not manually construct inconsistent error responses in every controller.

---

# 19. Error Messages vs Error Codes

Error codes are machine-readable.

Messages are human-readable.

Do not force clients to parse message strings.

Prefer:

```text
code: INVALID_REDIRECT_URI
message: Redirect URI is not registered for this client.
```

rather than requiring consumers to interpret the message itself.

---

# 20. Async/Await

Prefer `async/await` for application flow.

Good:

```ts
const client = await ClientRepository.findById(clientId);

if (!client) {
  throw new ApiError(...);
}
```

Avoid deeply nested Promise chains when they reduce readability.

Handle errors at an intentional boundary.

Do not silently swallow failures.

Bad:

```ts
try {
  await something();
} catch {
  // nothing
}
```

If an error is intentionally ignored, document why.

---

# 21. Logging

Use the centralized logger.

Do not scatter random:

```ts
console.log(...)
```

through production application logic.

Logs should be useful for operations and debugging.

Avoid logging:

```text
passwords
client secrets
access tokens
refresh tokens
authorization codes
private keys
session secrets
```

Use request IDs/correlation information where available.

---

# 22. Operational Logs vs Audit Logs

These are different.

## Application logs

Answer:

> What happened inside the system?

Examples:

```text
request completed
database unavailable
service started
unexpected exception
```

## Audit logs

Answer:

> Which security-sensitive action happened?

Examples:

```text
client created
client secret rotated
user authenticated
consent granted
token revoked
```

Do not treat ordinary debug logs as audit records.

---

# 23. Cryptography

Security-sensitive cryptographic primitives belong behind the crypto boundary.

Examples:

```text
hashing
verification
secure random generation
PKCE operations
signing
signature verification
```

Do not duplicate cryptographic implementations inside multiple services.

Never log secrets or private key material.

Use cryptographically secure randomness for security-sensitive identifiers.

---

# 24. Authentication

Authentication answers:

```text
Who is the user?
```

Keep authentication behavior in:

```text
modules/auth
```

Do not mix authentication with OAuth authorization policy unnecessarily.

---

# 25. Authorization

Authorization answers:

```text
What may this client/user access?
```

Keep authorization behavior in the appropriate domain:

```text
modules/oauth
modules/consent
modules/token
```

depending on the operation.

Do not treat a database existence check as sufficient authorization.

---

# 26. OAuth Rules

OAuth is a protocol boundary.

OAuth parameters must be validated carefully.

Important values include:

```text
client_id
redirect_uri
response_type
scope
state
code_challenge
code_challenge_method
```

Never trust a client-supplied redirect URI merely because it is syntactically valid.

It must be checked against the registered client configuration.

---

# 27. PKCE

PKCE is security-sensitive.

The authorization flow must preserve the relationship between:

```text
code_verifier
      ↓
code_challenge
```

The authorization server should not treat a client-provided challenge as proof by itself.

At token exchange time, the verifier must be validated according to the registered/received PKCE method.

Do not invent alternative PKCE behavior without documenting the protocol decision.

---

# 28. Tokens

Token handling is security-sensitive.

Never expose secrets unnecessarily.

Be deliberate about:

```text
expiration
rotation
revocation
storage
hashing
reuse detection
```

Access tokens, refresh tokens, and authorization codes should not be treated as ordinary database strings without considering their security lifecycle.

---

# 29. Client Secrets

Client secrets are credentials.

Do not:

```text
log them
store them casually
return them repeatedly
include them in error messages
```

If the architecture intentionally exposes a secret only once, preserve that rule.

Secret rotation should be an explicit lifecycle operation.

---

# 30. API Response Conventions

Use the centralized response utility.

The goal is consistency across modules.

Avoid creating a different response envelope for every endpoint.

Controllers should not manually duplicate response-formatting logic.

---

# 31. Middleware

Global concerns belong in middleware.

Examples:

```text
CORS
security headers
request ID
request logging
rate limiting
not found
```

Business decisions should remain in services.

Avoid implementing OAuth business workflows as Express middleware unless the middleware is genuinely cross-cutting.

---

# 32. Configuration

Configuration should flow through the validated configuration system.

Prefer:

```ts
env.DATABASE_URL;
```

over scattered direct reads:

```ts
process.env.DATABASE_URL;
```

throughout application code.

The purpose is to validate configuration once and expose a reliable typed interface.

---

# 33. `index.ts` Exports

Use `index.ts` as a clean public boundary.

Good:

```text
common/errors/index.ts
common/db/index.ts
modules/health/index.ts
```

Do not create unnecessary barrel files for every tiny folder just because the pattern exists.

Use them where they improve module boundaries and imports.

---

# 34. Comments

Comments should explain **why**, not repeat **what** the code already says.

Bad:

```ts
// Increment counter
counter++;
```

Useful:

```ts
// The authorization code is single-use, so mark it consumed
// before issuing tokens to prevent replay.
```

Security-sensitive assumptions should be documented.

---

# 35. Avoid Premature Abstraction

Do not build:

```text
GenericBaseRepository
GenericCrudService
UniversalController
MegaHelper
```

just to avoid writing a few lines.

First identify the actual repeated behavior.

Abstract only when repetition is meaningful and stable.

---

# 36. Avoid God Services

Avoid a service that handles:

```text
users
clients
OAuth
tokens
consent
sessions
```

all at once.

Prefer domain-focused services:

```text
ClientService
OAuthService
TokenService
ConsentService
SessionService
```

This keeps changes localized.

---

# 37. Dependency Direction

The preferred direction is:

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

Shared infrastructure is consumed from the appropriate layer:

```text
Service → Crypto
Service → Config
Service → Logger
Service → Validation
Repository → DB
```

Avoid:

```text
Repository → Controller
Database schema → HTTP
Common utility → business domain
```

when those dependencies create architectural coupling.

---

# 38. Cross-Domain Calls

A domain service may need another domain.

Example:

```text
OAuthService
    ↓
ConsentService
```

That is acceptable when it represents a real business relationship.

Avoid importing another module's internal implementation details unnecessarily.

Prefer its public interface.

---

# 39. Testing Convention

Tests should verify behavior, not implementation trivia.

Prioritize:

```text
business rules
security boundaries
validation
authorization
database constraints
protocol behavior
error cases
```

Important security tests include:

```text
invalid redirect URI
invalid PKCE verifier
expired authorization code
reused authorization code
invalid client credentials
revoked token
unauthorized scope
```

---

# 40. Git Conventions

Use feature-oriented branches.

Examples:

```text
feature/client-registration
feature/oauth-authorization
feature/token-rotation
fix/pkce-validation
fix/database-migration
```

Avoid vague branches such as:

```text
changes
new
test
stuff
```

---

# 41. Commit Conventions

Commits should describe one logical change.

Examples:

```text
feat(client): add client registration service
feat(oauth): implement PKCE validation
fix(token): prevent refresh token reuse
docs(db): document authorization schema
refactor(auth): extract password verification
```

Avoid giant commits containing unrelated features.

---

# 42. Pull Requests

A PR should ideally represent one coherent change.

Include:

```text
what changed
why it changed
how it was implemented
how it was tested
database/migration impact
security impact
```

For database changes, explicitly mention:

```text
schema changes
migration changes
foreign keys
indexes
data migration requirements
```

---

# 43. Database Change Workflow

When changing persistence:

```text
1. Modify schema
       ↓
2. Generate migration
       ↓
3. Review migration
       ↓
4. Apply migration
       ↓
5. Test affected repository/service
```

Never blindly apply generated SQL without reviewing a security-sensitive schema change.

---

# 44. Feature Implementation Workflow

For a normal feature:

```text
Requirement
    ↓
Identify domain
    ↓
Check database model
    ↓
Add/modify schema if required
    ↓
Generate migration
    ↓
Repository
    ↓
Service
    ↓
Validation
    ↓
Controller
    ↓
Route
    ↓
Error handling
    ↓
Audit/security review
    ↓
Tests
    ↓
PR
```

---

# 45. Review Checklist

Before considering a feature complete:

## Architecture

- [ ] Correct module?
- [ ] Correct layer?
- [ ] Dependency direction preserved?
- [ ] No unnecessary abstraction?

## TypeScript

- [ ] No unnecessary `any`
- [ ] Inputs are typed
- [ ] ESM imports are correct
- [ ] No unsafe casts hiding problems

## Validation

- [ ] External input validated
- [ ] Invalid input handled consistently
- [ ] Security-sensitive values validated

## Database

- [ ] Repository owns queries
- [ ] Schema is correct
- [ ] Foreign keys are correct
- [ ] Indexes considered
- [ ] Transaction used where required
- [ ] Migration generated and reviewed

## Security

- [ ] Secrets are protected
- [ ] Tokens are protected
- [ ] PKCE behavior is correct where relevant
- [ ] Authorization is enforced
- [ ] Sensitive values are not logged

## API

- [ ] Controller is thin
- [ ] Response format is consistent
- [ ] Error format is consistent
- [ ] HTTP semantics are appropriate

## Operations

- [ ] Useful logging exists
- [ ] Audit requirements considered
- [ ] Request ID/correlation behavior preserved

## Git

- [ ] Focused commit(s)
- [ ] Clear branch name
- [ ] PR description explains the change
- [ ] Tests/checks performed

---

# 46. Quick Decision Table

| Situation                | Preferred location  |
| ------------------------ | ------------------- |
| Environment validation   | `common/config`     |
| DB connection            | `common/db`         |
| Drizzle schema           | `common/db/schema`  |
| Generic crypto primitive | `common/crypto`     |
| Generic middleware       | `common/middleware` |
| API error infrastructure | `common/errors`     |
| Generic response utility | `common/utils`      |
| Domain business logic    | `modules/<domain>`  |
| Domain repository        | `modules/<domain>`  |
| Domain DTO/type          | `modules/<domain>`  |
| Domain validation        | `modules/<domain>`  |
| Security audit behavior  | `modules/audit`     |
| OAuth protocol logic     | `modules/oauth`     |
| OIDC logic               | `modules/oidc`      |
| Token lifecycle          | `modules/token`     |
| Session lifecycle        | `modules/session`   |

---

# 47. The Golden Rule

When unsure where code belongs, ask:

> **What responsibility does this code own?**

Then place it at the narrowest boundary that owns that responsibility.

For example:

```text
"How do I hash a secret?"
    → common/crypto

"Is this client allowed to use this redirect URI?"
    → client/OAuth business logic

"How do I save this client?"
    → client repository

"How should this HTTP request be translated?"
    → controller

"How should this route be exposed?"
    → routes
```

This single rule prevents a large percentage of architectural drift.

---

# 48. Final Convention

AuthForge should evolve through **intentional boundaries**, not through copying patterns blindly.

The standard is:

```text
Clear responsibility
        +
Strong typing
        +
Validated input
        +
Thin HTTP layer
        +
Business-focused services
        +
Controlled persistence
        +
Centralized security primitives
        +
Consistent errors/logging
        +
Reviewed database changes
```

That is the baseline for future AuthForge implementation work.

---

# 49. Documentation Relationship

The current documentation chain is:

```text
01-project-overview.md
        ↓
02-architecture.md
        ↓
03-project-structure.md
        ↓
04-development-conventions.md
```

Together they answer:

```text
What is AuthForge?
        ↓
How is it architected?
        ↓
Where does code belong?
        ↓
How should code be written?
```

Future implementation decisions should follow these documents unless a deliberate architectural change is made and documented.
