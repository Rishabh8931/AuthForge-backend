# AuthForge — Middleware

**Project:** AuthForge  
**Document:** 06 — Middleware  
**Status:** Living documentation  
**Scope:** Cross-cutting HTTP middleware currently present in `src/common/middleware/`

> This document records middleware that has actually been established in the AuthForge codebase. API endpoint conventions are intentionally not documented here because the API layer is still under implementation.

---

# 1. Purpose

Middleware is the cross-cutting layer that sits around the HTTP request lifecycle.

AuthForge uses middleware for concerns that should not be duplicated inside individual controllers or services.

Current middleware concerns include:

```text
CORS
Security
Request ID
Request Logging
Rate Limiting
Not Found
Error Handling
```

The core principle is:

> **Middleware handles cross-cutting HTTP concerns; services handle business rules.**

---

# 2. Current Middleware Structure

Current directory:

```text
src/
└── common/
    └── middleware/
        ├── cors.ts
        ├── index.ts
        ├── not-found.ts
        ├── rate-limit.ts
        ├── request-id.ts
        ├── request-logger.ts
        └── security.ts
```

Responsibilities:

| File | Responsibility |
|---|---|
| `cors.ts` | Cross-Origin Resource Sharing |
| `security.ts` | HTTP security protections |
| `request-id.ts` | Request correlation identifier |
| `request-logger.ts` | HTTP request logging |
| `rate-limit.ts` | Request-rate control |
| `not-found.ts` | Unmatched route handling |
| `index.ts` | Middleware exports |

Error handling is part of the application's cross-cutting middleware/error pipeline and is implemented under:

```text
src/common/errors/
```

The relevant infrastructure is:

```text
error-handler.ts
```

It is therefore documented alongside the middleware lifecycle even though it is not physically stored inside `common/middleware/`.

---

# 3. Middleware Mental Model

The request lifecycle should be thought of as:

```text
Incoming HTTP Request
        │
        ▼
   Request ID
        │
        ▼
      CORS
        │
        ▼
    Security
        │
        ▼
  Rate Limiting
        │
        ▼
 Request Logging
        │
        ▼
      Router
        │
        ▼
Controller / Service
        │
        ▼
   Response
        │
        ▼
 Error Handler
```

The exact Express registration order is the source of truth for runtime behavior.

The diagram represents the intended architectural role, not a replacement for the actual `app.ts` middleware registration order.

---

# 4. Why Middleware Exists

Without middleware, every endpoint would have to repeatedly implement things such as:

```text
generate request ID
check CORS
apply security headers
check rate limits
log request
handle missing routes
format errors
```

That would create:

- duplication
- inconsistent behavior
- harder maintenance
- security gaps
- difficult debugging

Middleware provides one centralized place for these concerns.

---

# 5. Request ID Middleware

File:

```text
request-id.ts
```

Purpose:

Give each incoming request a unique identifier.

Conceptually:

```text
Request
   │
   ├── Request ID generated/attached
   │
   ▼
Application
```

The request ID is useful for:

```text
logs
error investigation
request tracing
support/debugging
```

---

# 6. Why Request IDs Matter

Suppose several users send requests simultaneously:

```text
Request A
Request B
Request C
```

Their logs may be interleaved.

Without correlation:

```text
database query
token validation
error
response
database query
```

It becomes difficult to determine which log belongs to which request.

With a request ID:

```text
req=abc123
req=abc123
req=abc123
```

the complete request lifecycle can be correlated.

---

# 7. Request ID Security

Request IDs are correlation identifiers, not authentication credentials.

They should not contain:

```text
passwords
tokens
client secrets
authorization codes
private information
```

They should be generated using the project's established secure/random identifier mechanism.

---

# 8. Request Logger Middleware

File:

```text
request-logger.ts
```

Purpose:

Record useful information about HTTP requests/responses.

Typical information can include:

```text
request ID
HTTP method
request path
status code
duration
```

The exact fields should follow the current logger implementation rather than being duplicated in documentation as a second source of truth.

---

# 9. Logger vs `console.log`

AuthForge has a centralized logger:

```text
src/common/logger/
```

Middleware should use that logger rather than scattering raw:

```ts
console.log(...)
console.error(...)
```

through request-processing code.

This gives the application a consistent operational logging strategy.

---

# 10. Sensitive Data Must Not Be Logged

Request logging must never accidentally expose credentials.

Do not log raw:

```text
Authorization headers
access tokens
refresh tokens
client secrets
passwords
authorization codes
PKCE verifiers
private keys
```

Be particularly careful with:

```text
query parameters
request bodies
headers
```

because OAuth credentials can appear in HTTP inputs.

---

# 11. Request Duration

Request logging can measure:

```text
start time
    ↓
request processing
    ↓
response
    ↓
duration
```

This helps identify:

```text
slow endpoints
database bottlenecks
external service latency
unexpected performance regressions
```

Performance logging should remain operationally useful without turning every request into an excessive log payload.

---

# 12. CORS Middleware

File:

```text
cors.ts
```

Purpose:

Control which browser origins may interact with the server through Cross-Origin Resource Sharing.

CORS is a browser-enforced policy mechanism.

It should not be confused with authentication or authorization.

---

# 13. CORS Is Not Authentication

This distinction is important.

CORS answers:

> Which browser origins are permitted to make cross-origin requests?

Authentication answers:

> Who is making the request?

Authorization answers:

> What is that actor allowed to do?

Therefore:

```text
CORS ≠ Authentication
CORS ≠ Authorization
```

CORS configuration must not be treated as an access-control replacement.

---

# 14. CORS Configuration Principle

CORS should be explicit.

Avoid casually allowing every origin in a production security-sensitive authorization server.

Configuration should reflect the environments and clients the application is actually intended to support.

When the production origin policy is finalized, document that decision here.

---

# 15. Security Middleware

File:

```text
security.ts
```

Purpose:

Apply HTTP-level security protections.

This is cross-cutting infrastructure and should be configured centrally instead of repeated per route.

The security middleware should remain focused on transport/HTTP security concerns.

It should not contain application authorization decisions.

---

# 16. Security Middleware Responsibilities

The security middleware layer can provide protections such as:

```text
security-related HTTP headers
browser security policies
content-type protections
clickjacking protections
other centralized HTTP hardening
```

The exact protections enabled by the current implementation should be treated as the source of truth in `security.ts`.

---

# 17. Rate Limiting Middleware

File:

```text
rate-limit.ts
```

Purpose:

Limit how frequently clients can make requests within a defined policy.

Conceptually:

```text
Requests
   │
   ▼
Rate Limiter
   │
   ├── within limit ──→ application
   │
   └── over limit ────→ reject
```

Rate limiting is especially important for AuthForge because authentication and OAuth endpoints can be attractive targets for automated abuse.

---

# 18. Why Rate Limiting Exists

Rate limiting helps reduce:

```text
brute-force attempts
credential stuffing
endpoint abuse
automated scanning
resource exhaustion
request floods
```

It is one layer of defense, not a complete security solution.

---

# 19. Rate Limiting Is Not Authorization

A rate limiter answers:

> How frequently can this requester make requests?

Authorization answers:

> Is this requester allowed to perform this operation?

Therefore:

```text
Rate limiting ≠ authorization
```

Both are needed for a security-sensitive server.

---

# 20. Rate Limit Granularity

Different endpoints can eventually require different policies.

For example:

```text
General API
    → normal limit

Login
    → stricter limit

Authorization endpoint
    → stricter abuse protection

Token endpoint
    → strict credential-sensitive policy

Health endpoint
    → lightweight policy
```

Do not automatically apply the same rate-limit policy to every security-sensitive operation without evaluating its threat model.

The actual policies should be documented here as they are finalized.

---

# 21. Distributed Deployment Consideration

A process-local in-memory rate limiter can be insufficient when AuthForge runs across multiple instances.

For example:

```text
Instance A → counter = 10
Instance B → counter = 0
```

A user can potentially bypass a local limit by distributing requests across instances.

For multi-instance production deployments, rate-limit state may need a shared store.

This is a future infrastructure decision and should be documented when the production deployment architecture is implemented.

---

# 22. Not Found Middleware

File:

```text
not-found.ts
```

Purpose:

Handle requests that do not match any registered route.

Conceptually:

```text
Request
   ↓
Router
   ↓
No matching route
   ↓
Not Found Middleware
```

This keeps unmatched-route behavior consistent.

---

# 23. Not Found vs Application Error

These are different situations.

### Not Found

The requested route does not exist.

```text
GET /something-that-does-not-exist
```

### Application error

A valid route was reached but an operation failed.

```text
GET /clients/:id
        ↓
client lookup
        ↓
database/service failure
```

The first is handled by the not-found layer.

The second belongs in the normal error pipeline.

---

# 24. Error Handler

File:

```text
src/common/errors/error-handler.ts
```

Purpose:

Provide centralized handling for errors reaching Express's error boundary.

Conceptually:

```text
Controller
    ↓
Service
    ↓
throw error
    ↓
Express error pipeline
    ↓
Error Handler
    ↓
standard response
```

This prevents every controller from implementing its own error formatting.

---

# 25. Why Centralized Error Handling Matters

Without centralized handling, endpoints may return inconsistent responses:

```text
{ error: "bad request" }

{ message: "Something failed" }

{ success: false, data: null }

plain text
```

A centralized error handler provides one predictable error boundary.

The exact response contract belongs to the API documentation once the API layer is finalized.

---

# 26. Expected vs Unexpected Errors

The error layer should distinguish between expected application failures and unexpected failures.

Examples of expected failures:

```text
invalid input
resource not found
invalid client
invalid credentials
invalid authorization request
```

Unexpected failures can include:

```text
programming errors
unexpected database failure
unhandled infrastructure failure
```

Expected application errors should use the project's established:

```text
ApiError
error-codes
```

system.

Unexpected errors should be logged appropriately without leaking internal details to the client.

---

# 27. Do Not Leak Internal Errors

Production responses should not expose:

```text
stack traces
database connection strings
SQL internals
filesystem paths
secret values
private configuration
```

Internal diagnostic information belongs in controlled logs.

The client should receive a safe, stable error representation.

---

# 28. Middleware Ordering

Middleware order matters.

For example:

```text
Request ID
    ↓
Request logging
    ↓
Security/CORS
    ↓
Rate limiting
    ↓
Routes
    ↓
Not Found
    ↓
Error Handler
```

is not equivalent to:

```text
Routes
    ↓
Request ID
    ↓
Rate limiting
```

A middleware only affects the request flow at the point where Express executes it.

Therefore changes to `app.ts` middleware registration order should be reviewed carefully.

---

# 29. Error Handler Must Be Last

Express error-handling middleware should sit after the routes and other middleware that can forward errors into it.

Conceptually:

```text
normal middleware
       ↓
routes
       ↓
not-found
       ↓
error handler
```

Putting the error handler too early can prevent later errors from reaching the intended boundary.

---

# 30. Global vs Route-Level Middleware

Not every middleware must be global.

## Global candidates

These affect the entire application:

```text
request ID
security
CORS
request logging
global error handling
not-found
```

## Route-level candidates

These may be appropriate for specific operations:

```text
strict authentication rate limit
admin authorization
special validation
OAuth-specific processing
```

Do not make every concern global simply because global registration is convenient.

---

# 31. Middleware Should Stay Thin

Middleware should not become a second service layer.

Avoid:

```text
middleware
    ↓
complex database queries
    ↓
business decisions
    ↓
token issuance
```

Prefer:

```text
middleware
    ↓
cross-cutting HTTP concern
```

Business workflows belong in services.

---

# 32. Middleware and Authentication

Authentication middleware may eventually be introduced for protected resources.

Its responsibility should be:

```text
extract credentials
    ↓
validate credentials
    ↓
establish authenticated context
```

It should not contain unrelated business operations.

The exact authentication middleware will be documented when implemented.

---

# 33. Middleware and OAuth

OAuth-specific checks should not automatically be implemented as generic middleware.

For example:

```text
redirect_uri validation
scope validation
PKCE validation
authorization-code validation
client grant validation
```

are protocol/business rules.

These belong primarily in OAuth services and repositories, with middleware used only where the concern is genuinely cross-cutting.

---

# 34. Middleware and Logging Context

A useful request context can eventually carry:

```text
request ID
authenticated actor
client ID
user ID
```

when those values are known.

However:

> Never put raw credentials into the request context merely for logging.

Use safe identifiers rather than secret material.

---

# 35. Failure Handling

Middleware must fail predictably.

For an expected failure:

```text
create/forward appropriate application error
```

For an unexpected failure:

```text
forward error
   ↓
central error handler
```

Avoid silently continuing after a security middleware failure.

---

# 36. Current Middleware Architecture

Current conceptual architecture:

```text
                    HTTP REQUEST
                         │
                         ▼
                  ┌─────────────┐
                  │ Request ID  │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │    CORS     │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  Security   │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │Rate Limiter │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │Request Logger│
                  └──────┬──────┘
                         │
                         ▼
                    ┌────────┐
                    │ Router │
                    └───┬────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
        Controller              No Route
             │                     │
             ▼                     ▼
         Service              Not Found
             │
             ▼
          Response
             │
             └──────────┐
                        ▼
                 Error Handler
                        │
                        ▼
                  HTTP RESPONSE
```

Again, the actual registration order in the application remains authoritative.

---

# 37. Current Status

Based on the current project structure, these middleware components exist as implementation areas:

- [x] CORS middleware file
- [x] Security middleware file
- [x] Request ID middleware file
- [x] Request logger middleware file
- [x] Rate-limit middleware file
- [x] Not-found middleware file
- [x] Central error-handler infrastructure
- [x] Middleware barrel export

The exact behavior and configuration of each component should be updated here whenever its implementation changes.

---

# 38. Future Middleware Documentation

As the project evolves, add documentation here for newly implemented cross-cutting middleware such as:

```text
authentication
authorization
CSRF protection where applicable
body-size limits
request timeout
maintenance mode
trusted proxy handling
security-specific OAuth protections
```

Do not document a middleware as implemented until it actually exists in the codebase.

---

# 39. Middleware Review Checklist

Before merging middleware changes:

## Architecture

- [ ] Is this genuinely cross-cutting?
- [ ] Could this belong in a service instead?
- [ ] Is the middleware placed in the correct layer?

## Security

- [ ] Does it expose sensitive data?
- [ ] Does it trust client-controlled input?
- [ ] Does failure fail safely?
- [ ] Does it introduce an authorization bypass?

## Performance

- [ ] Does it run on every request?
- [ ] Does it perform expensive work?
- [ ] Does it perform unnecessary database calls?
- [ ] Is distributed deployment affected?

## Logging

- [ ] Is useful context logged?
- [ ] Are secrets excluded?
- [ ] Is request correlation preserved?

## Error Handling

- [ ] Are errors forwarded correctly?
- [ ] Does the centralized error handler receive failures?
- [ ] Are internal details hidden from clients?

## Ordering

- [ ] Is registration order correct?
- [ ] Does the middleware need to run before routes?
- [ ] Does it depend on another middleware?

---

# 40. Rules to Remember

### Rule 1

**Middleware is for cross-cutting concerns.**

### Rule 2

**Business logic belongs in services.**

### Rule 3

**Never log credentials.**

### Rule 4

**Middleware order matters.**

### Rule 5

**Error handling should be centralized.**

### Rule 6

**Rate limiting is a security layer, not authorization.**

### Rule 7

**CORS is not authentication.**

### Rule 8

**Do not trust request input merely because TypeScript has a type for it.**

### Rule 9

**Do not add middleware just to avoid putting logic in a service.**

### Rule 10

**Document new middleware when it is actually implemented.**

---

# 41. Documentation Relationship

Current documentation chain:

```text
01-project-overview.md
        ↓
02-architecture.md
        ↓
03-project-structure.md
        ↓
04-development-conventions.md
        ↓
05-database.md
        ↓
06-middleware.md
```

The next documents will be added as corresponding parts of the system are implemented.

The project documentation strategy is now:

```text
Implement
    ↓
Test
    ↓
Document
    ↓
Commit
    ↓
PR
    ↓
Merge
```

This keeps documentation synchronized with the actual AuthForge implementation instead of describing features that do not yet exist.
