## registration flow

---

```Mermaid

flowchart TD
    Controller["DeveloperController"]
    Service["DeveloperService"]
    Crypto["hashPassword()"]
    Repository["DeveloperRepository"]
    DB[("PostgreSQL")]

    Controller --> Service
    Service --> Crypto
    Service --> Repository
    Repository --> DB


```
