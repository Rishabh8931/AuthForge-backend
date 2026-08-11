## dependency direction

````Mermaid

flowchart TD
    Composition["session.composition.ts"]

    DB["Database"]
    Repository["SessionRepository"]
    Service["SessionService"]
    Controller["SessionController"]

    Composition --> DB
    Composition --> Repository
    DB --> Repository
    Composition --> Service
    Repository --> Service
    Service --> Controller

    ```
````
