## high level architecture

```Mermaid

flowchart TD
Auth["Auth Service"]
UserRepo["User Repository"]
SessionService["Session Service"]
SessionRepo["Session Repository"]
DB[("PostgreSQL")]

    Auth --> UserRepo
    Auth --> SessionService
    SessionService --> SessionRepo
    UserRepo --> DB
    SessionRepo --> DB

```
