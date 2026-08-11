## why this index.ts file in /developer service

```

                   Developer Module
                         │
                  ┌──────▼──────┐
                  │   index.ts  │
                  └──────┬──────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Routes       Controller       Service
                                         │
                                         ▼
                                    Repository



```

## Instead of other parts of the application knowing the internal file structure

```Javascript

// ❌ Avoid
import { developerService } from "@/modules/developer/developer.composition.js";
import { DeveloperController } from "@/modules/developer/developer.controller.js";

```

## they can use the module's public API:

```Javascript
// ✅ Preferred
import {
  developerRoutes,
  developerService,
} from "@/modules/developer/index.js";
```
