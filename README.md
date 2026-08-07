<p align="center">
  <img src="./assets/banner.png" alt="AuthForge Banner" width="100%">
</p>

<p align="center">
  <img src="./assets/logo.png" alt="AuthForge Logo" width="140">
</p>

<h1 align="center">AuthForge</h1>

<p align="center">
  <strong>Production-grade OAuth 2.1 & OpenID Connect Authorization Server</strong>
</p>

<p align="center">
Built with TypeScript, Express.js, PostgreSQL, and Drizzle ORM
</p>

<p align="center">

![License](https://img.shields.io/github/license/yourusername/authforge?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/yourusername/authforge?style=for-the-badge)
![Forks](https://img.shields.io/github/forks/yourusername/authforge?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/yourusername/authforge?style=for-the-badge)

![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5-black?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge)
![OAuth 2.1](https://img.shields.io/badge/OAuth-2.1-blue?style=for-the-badge)
![OpenID Connect](https://img.shields.io/badge/OpenID-Connect-orange?style=for-the-badge)

</p>

---

# 🚀 Overview

AuthForge is a **production-grade OAuth 2.1 Authorization Server and OpenID Connect Identity Provider (IdP)** built with modern backend technologies and real-world engineering practices.

It is designed to be:

- 🔒 Secure by Default
- ⚡ High Performance
- 🏗 Modular & Maintainable
- 📈 Scalable
- 📚 Standards Compliant
- 🧩 Extensible

Whether you're building SaaS products, APIs, microservices, or enterprise platforms, AuthForge provides the authentication and authorization infrastructure needed to secure your applications.

---

# ✨ Features

## OAuth 2.1

- Authorization Code Flow
- PKCE
- Refresh Token Rotation
- Token Revocation
- Token Introspection
- Scope Validation
- Client Authentication
- Secure Redirect URI Validation

---

## OpenID Connect

- ID Tokens
- Discovery Endpoint
- JWKS Endpoint
- UserInfo Endpoint
- OIDC Claims
- Nonce Validation

---

## Authentication

- User Registration
- Secure Login
- Password Hashing
- Email Verification
- Password Reset
- Session Management

---

## Client Management

- Register OAuth Clients
- Rotate Client Secret
- Regenerate Client Secret
- Enable / Disable Client
- Redirect URI Management
- Scope Management

---

## Security

- OAuth 2.1 Compliance
- OpenID Connect Compliance
- JWT
- Secure Cookies
- Helmet
- CORS
- Rate Limiting
- CSRF Protection
- PKCE
- Request Validation
- Input Validation
- Audit Logs

---

## Developer Experience

- TypeScript
- Modular Architecture
- Repository Pattern
- DTO Validation
- Structured Logging
- Centralized Error Handling
- Production Ready

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Language | TypeScript |
| Runtime | Node.js 22+ |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Authentication | OAuth 2.1 |
| Identity | OpenID Connect |
| Token Format | JWT |
| Validation | Zod |
| Package Manager | pnpm |
| Linting | ESLint |
| Formatting | Prettier |

---

# 📁 Project Structure

```text
src
│
├── common
│   ├── config
│   ├── db
│   ├── errors
│   ├── logger
│   ├── middleware
│   ├── types
│   ├── utils
│   └── validation
│
├── modules
│   ├── auth
│   ├── oauth
│   ├── oidc
│   ├── client
│   ├── user
│   ├── session
│   ├── token
│   ├── consent
│   ├── jwks
│   ├── audit
│   └── health
│
├── docs
├── scripts
├── tests
└── types
```

---

# 🏛 Architecture

```text
                 HTTP Request
                      │
                      ▼
                  Express App
                      │
                      ▼
                Global Middleware
                      │
                      ▼
                 Route Layer
                      │
                      ▼
              Validation Layer
                      │
                      ▼
               Controller Layer
                      │
                      ▼
                 Service Layer
                      │
            ┌─────────┴─────────┐
            ▼                   ▼
     Repository Layer     External Services
            │
            ▼
       PostgreSQL Database
```

---

# 🔐 OAuth 2.1 Features

| Feature | Status |
|----------|--------|
| Authorization Code | 🚧 |
| PKCE | 🚧 |
| Refresh Token | 🚧 |
| Token Revocation | 🚧 |
| Token Introspection | 🚧 |
| Client Credentials | 🚧 |
| Device Authorization | 🚧 |
| JWT Access Tokens | 🚧 |

---

# 🪪 OpenID Connect Features

| Feature | Status |
|----------|--------|
| Discovery | 🚧 |
| JWKS | 🚧 |
| UserInfo | 🚧 |
| ID Token | 🚧 |
| Nonce Validation | 🚧 |
| RP Logout | 🚧 |
| Dynamic Client Registration | 🚧 |

---

# 🚀 Quick Start

## Clone Repository

```bash
git clone https://github.com/yourusername/authforge.git

cd authforge
```

## Install Dependencies

```bash
pnpm install
```

## Configure Environment

```bash
cp .env.example .env
```

Update the environment variables.

---

## Start Development Server

```bash
pnpm dev
```

---

## Build

```bash
pnpm build
```

---

## Run Production

```bash
pnpm start
```

---

# 📖 API Endpoints

## Authentication

```text
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
```

---

## OAuth

```text
GET    /oauth/authorize
POST   /oauth/token
POST   /oauth/revoke
POST   /oauth/introspect
```

---

## OpenID Connect

```text
GET    /.well-known/openid-configuration
GET    /.well-known/jwks.json
GET    /userinfo
```

---

## Clients

```text
POST   /clients
GET    /clients
GET    /clients/:id
PUT    /clients/:id
DELETE /clients/:id
POST   /clients/:id/rotate-secret
PUT    /clients/:id/scopes
```

---

# ⚙ Environment Variables

```env
PORT=3000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=

COOKIE_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

APP_URL=
```

---

# 🧪 Testing

```bash
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:e2e
```

---

# 🛣 Roadmap

- 🔄 OAuth 2.1
- 🔄 OpenID Connect
- 🔄JWT
- 🔄PKCE
- 🔄 Sessions
- 🔄 Client Management
- 🔄 Multi-Factor Authentication
- 🔄 Passkeys (WebAuthn)
- 🔄 SCIM
- 🔄 SAML 2.0
- 🔄 Federation
- 🔄 Organization Support
- 🔄 Admin Dashboard
- 🔄 Plugin SDK

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

Please follow the project's coding standards and ensure all tests pass before submitting a PR.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 🏷 GitHub Topics

```text
oauth
oauth2
oauth2-1
openid-connect
oidc
identity-provider
authorization-server
authentication
authorization
jwt
typescript
nodejs
express
postgresql
drizzle
pkce
security
api-security
backend
identity
```

---

# ⭐ Support

If you find **AuthForge** useful, please consider giving the repository a ⭐ on GitHub.

---

<p align="center">

Built with ❤️ using **TypeScript**, **Express.js**, **PostgreSQL**, and **Drizzle ORM**.

</p>