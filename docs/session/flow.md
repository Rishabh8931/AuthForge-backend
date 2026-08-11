## The responsibility chain is

---

```Mermaid
                 CREATE
                   │
                   ▼
        generateRandomBase64Url()
                   │
                   ▼
             Raw Token
             /       \
            /         \
           ▼           ▼
      Client       sha256()
                       │
                       ▼
                Token Hash
                       │
                       ▼
                  Database

```

---

## when the client sends the raw token

```
Raw Token
    │
    ▼
sha256()
    │
    ▼
Token Hash
    │
    ▼
SessionRepository
    │
    ▼
Active Session

```
