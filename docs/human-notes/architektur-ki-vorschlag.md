
src/app/
├── core/                        # Einmalige globale Services & Konfigurationen
│   ├── auth/                    # Authentifizierung (Interceptors, Guards, Service)
│   │   ├── auth.guard.ts
│   │   └── auth.interceptor.ts
│   ├── services/                # Globale Singletons (z.B. ApiService, ThemeService)
│   │   └── api.service.ts
│   └── models/                  # Globale TypeScript-Interfaces und Typen
│       └── user.model.ts
│
├── shared/                      # Wiederverwendbare UI-Elemente für die ganze App
│   ├── components/              # Dumb-Components (Buttons, Spinner, Overlays)
│   │   ├── button/
│   │   └── loading-spinner/
│   ├── directives/              # Gemeinsam genutzte Direktiven (z.B. AutoFocus)
│   ├── pipes/                   # Gemeinsam genutzte Pipes (z.B. CustomDatePipe)
│   └── models/                  # UI-spezifische Interfaces (z.B. TableConfig)
│
├── features/                    # Die eigentlichen Fachbereiche der Anwendung
│   ├── dashboard/               # Feature 1: Dashboard-Bereich
│   │   ├── components/          # Interne Komponenten, nur für das Dashboard
│   │   │   └── stats-card/
│   │   ├── services/            # Spezifischer Daten-Service für das Dashboard
│   │   └── dashboard.component.ts # Haupt-View des Features
│   │
│   ├── products/                # Feature 2: Produkt-Bereich
│   │   ├── product-list/        # Unter-Komponente (Liste)
│   │   ├── product-detail/      # Unter-Komponente (Detailansicht)
│   │   └── products.routes.ts   # Eigenes Child-Routing für dieses Feature
│   │
│   └── user-profile/            # Feature 3: Profil-Bereich
│
├── app.component.ts             # Die Root-Komponente (enthält meist nur <router-outlet>)
├── app.config.ts                # Zentrale Konfiguration (Routing-Definition, HTTP-Client)
└── app.routes.ts                # Das Haupt-Routing (verweist per Lazy Loading auf Features)
