## dependency graph:

---

```Mermaid


 flowchart TD
     DB["Database"]
     Repository["DeveloperRepository"]
     Service["DeveloperService"]
     Composition["developer.composition.ts"]
     Controller["DeveloperController"]

     Composition --> Repository
     Composition --> Service
     DB --> Repository
     Repository --> Service
     Service --> Controller
```
