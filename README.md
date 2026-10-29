# Resume Builder — TypeScript Refactor

A production-grade, ATS-optimized resume builder built with React, Node.js/Express, and MongoDB — fully migrated to TypeScript with strict mode, clean architecture, and complete type safety across the stack.

---

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 19, TypeScript 5, Vite 7, Tailwind CSS v4 |
| State      | Redux Toolkit                                   |
| Backend    | Node.js, Express 5, TypeScript 5                |
| Database   | MongoDB, Mongoose 9                             |
| Validation | Zod (frontend + backend)                        |
| Auth       | JWT + bcrypt                                    |
| Linting    | ESLint + typescript-eslint (strict)             |

---

## Project Structure

```
resume-builder/
├── package.json                    # Root: concurrent dev scripts
│
├── server/
│   ├── src/
│   │   ├── index.ts                # App entry point
│   │   ├── config/
│   │   │   ├── db.ts               # MongoDB connection
│   │   │   └── env.ts              # Type-safe env vars (Zod)
│   │   ├── middleware/
│   │   │   ├── authenticate.ts     # JWT middleware, types req.userId
│   │   │   ├── errorHandler.ts     # Global error handler
│   │   │   └── requestLogger.ts    # Dev request logger
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── resume/
│   │   │   │   ├── resume.controller.ts
│   │   │   │   ├── resume.route.ts
│   │   │   │   ├── resume.schema.ts
│   │   │   │   ├── resume.service.ts
│   │   │   │   └── resume.validation.ts
│   │   │   └── user/
│   │   │       └── user.schema.ts
│   │   └── types/
│   │       └── shared.ts           # Domain types shared with frontend
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── client/
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── eslint.config.ts
    ├── .env.example
    └── src/
        ├── main.tsx                # Redux Provider + React mount
        ├── App.tsx                 # Router + auth bootstrap
        ├── index.css               # Tailwind v4 + print styles
        ├── vite-env.d.ts           # ImportMeta types
        ├── types/
        │   └── index.ts            # All shared domain types
        ├── services/
        │   └── api.ts              # Typed Axios client
        ├── store/
        │   ├── index.ts
        │   └── features/
        │       └── authSlice.ts
        ├── hooks/
        │   └── useAppStore.ts      # Typed useDispatch/useSelector
        ├── utils/
        │   └── resume.ts           # generateId, formatMonthYear, etc.
        ├── components/
        │   └── ui/
        │       └── ProtectedRoute.tsx
        └── features/
            ├── resume/
            │   ├── ResumeBuilderPage.tsx   # Split-panel builder UI
            │   ├── DashboardPage.tsx       # Resume list + create
            │   ├── LoginPage.tsx           # Login + register
            │   ├── PublicPreviewPage.tsx   # Shareable resume view
            │   ├── hooks/
            │   │   └── useResumeBuilder.ts # Core resume state hook
            │   └── components/
            │       ├── PersonalInfoForm.tsx
            │       ├── SummaryForm.tsx
            │       ├── ExperienceForm.tsx
            │       ├── EducationForm.tsx
            │       ├── ProjectForm.tsx
            │       ├── CertificationForm.tsx
            │       ├── SkillsForm.tsx
            │       ├── TemplateSelector.tsx
            │       ├── ColorPicker.tsx
            │       └── ResumePreview.tsx
            └── templates/
                ├── components/
                │   ├── ClassicTemplate.tsx   # Traditional, max ATS compat
                │   ├── ModernTemplate.tsx    # Sidebar layout
                │   ├── MinimalTemplate.tsx   # Clean, airy
                │   └── ExecutiveTemplate.tsx # Bold typographic hierarchy
                └── registry/
                    └── index.ts              # Template registry + definitions
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB 7+ (local or Atlas)

### Installation

```bash
# Clone and install all dependencies
git clone <repo>
cd resume-builder
npm run install:all
```

### Environment Setup

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env:
#   MONGODB_URI=mongodb://localhost:27017/resume-builder
#   JWT_SECRET=<at-least-32-random-chars>

# Client
cp client/.env.example client/.env
# VITE_API_URL is empty by default (uses Vite proxy to localhost:3000)
```

### Development

```bash
# Run both server and client concurrently
npm run dev

# Or run individually
npm run dev --prefix server    # http://localhost:3000
npm run dev --prefix client    # http://localhost:5173
```

### Build

```bash
npm run build
```

### Type Check

```bash
npm run type-check
```

---

## API Reference

All endpoints return `{ message: string, data?: T }`.

### Auth — `/api/auth`

| Method | Path        | Auth   | Body                        | Response          |
| ------ | ----------- | ------ | --------------------------- | ----------------- |
| POST   | `/register` | —      | `{ name, email, password }` | `{ token, user }` |
| POST   | `/login`    | —      | `{ email, password }`       | `{ token, user }` |
| GET    | `/me`       | Bearer | —                           | `User`            |

### Resumes — `/api/resumes`

| Method | Path          | Auth   | Body                  | Response   |
| ------ | ------------- | ------ | --------------------- | ---------- |
| GET    | `/`           | Bearer | —                     | `Resume[]` |
| POST   | `/`           | Bearer | `{ title }`           | `Resume`   |
| GET    | `/:id`        | Bearer | —                     | `Resume`   |
| PUT    | `/:id`        | Bearer | `ResumeUpdatePayload` | `Resume`   |
| DELETE | `/:id`        | Bearer | —                     | —          |
| GET    | `/public/:id` | —      | —                     | `Resume`   |

---

## How to Add a New Template

Adding a template requires changes in exactly **two files**.

**Step 1** — Add the template ID to the shared types:

```ts
// server/src/types/shared.ts  AND  client/src/types/index.ts
export type TemplateId =
  "classic" | "modern" | "minimal" | "executive" | "creative";
//                                                                          ^^^^^^^^
```

**Step 2** — Create the component:

```tsx
// client/src/features/templates/components/CreativeTemplate.tsx
import type { TemplateProps } from "@/types";

export function CreativeTemplate({ resume }: TemplateProps) {
  return (
    <article>
      <h1>{resume.personalInfo.fullName}</h1>
      {/* ATS tip: always use semantic elements (section, h2, ul, address) */}
    </article>
  );
}
```

**Step 3** — Register it:

```ts
// client/src/features/templates/registry/index.ts
import { CreativeTemplate } from "../components/CreativeTemplate";

export const templateRegistry: Record<
  TemplateId,
  ComponentType<TemplateProps>
> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate, // add here
};

export const templateDefinitions: TemplateDefinition[] = [
  // ...existing
  {
    id: "creative",
    name: "Creative",
    description: "Bold layout for design and creative roles",
  },
];
```

That's all. The template selector, preview, and PDF export will all pick it up automatically.

---

## How to Extend the Resume Schema

To add a new section (e.g., `languages`):

**Step 1** — Add the type to both `shared.ts` files:

```ts
export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Intermediate" | "Basic";
}

export interface Resume {
  // ...existing fields
  languages: LanguageEntry[];
}
```

**Step 2** — Add to the Mongoose schema:

```ts
// server/src/modules/resume/resume.schema.ts
const LanguageSchema = new Schema(
  { id: String, language: String, proficiency: String },
  { _id: false }
);

// Inside ResumeSchema:
languages: { type: [LanguageSchema], default: [] },
```

**Step 3** — Add to Zod validation:

```ts
// server/src/modules/resume/resume.validation.ts
const languageSchema = z.object({
  id: z.string(),
  language: z.string().default(""),
  proficiency: z.enum(["Native", "Fluent", "Intermediate", "Basic"]),
});

// Inside updateResumeSchema:
languages: z.array(languageSchema).optional(),
```

**Step 4** — Create the form component and add to `ResumeBuilderPage.tsx`:

```tsx
// Add to SECTIONS array
{ id: "languages", label: "Languages", icon: Globe },

// Add to render
{activeSection?.id === "languages" && (
  <LanguagesForm
    data={resume.languages}
    onChange={(v) => updateField("languages", v)}
  />
)}
```

**Step 5** — Render it in templates. Each template receives the full `Resume` type, so just add the new section wherever appropriate.

---

## ATS Optimization Notes

All templates follow these ATS best practices:

- **Semantic HTML** — `<article>`, `<section>`, `<header>`, `<h1>`–`<h3>`, `<address>`, `<ul>`, `<time>`
- **`aria-labelledby`** on every `<section>` so screen readers and parsers associate headings
- **No tables, no floats, no absolute positioning** — all layout uses flexbox/grid which degrades gracefully
- **Plain text skills** — rendered as `·`-separated inline text, not images or icon-based badges
- **Proper heading hierarchy** — `h1` for name, `h2` for section headings, `h3` for entry titles
- **`<time>` elements** for all dates — machine-readable date metadata
- **Hyperlinks** on email/phone/URLs — linked with proper `href` protocols

---

## Type Safety Highlights

### No `any` anywhere

`strict: true` is enabled on both `server/tsconfig.json` and `client/tsconfig.json`. The ESLint rule `"@typescript-eslint/no-explicit-any": "error"` enforces this at lint time.

### Typed API responses end-to-end

```ts
// Every API call knows its return type
const { data } = await resumeApi.get(id);
//                                ^-- ApiResponse<Resume>
//       data.data is Resume | undefined
```

### Typed request extensions

```ts
// middleware/authenticate.ts
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
// Controllers can safely access req.userId after the middleware runs
```

### Zod → TypeScript inference

```ts
export const createResumeSchema = z.object({
  title: z.string().min(1).max(100),
});
export type CreateResumeInput = z.infer<typeof createResumeSchema>;
// CreateResumeInput = { title: string }
// The type is derived from the schema — they can never get out of sync
```

---

## Future Extension Points

The architecture is designed to support these features without breaking changes:

| Feature                    | How to add                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------- |
| Resume versioning          | Add `versions: ResumeSnapshot[]` to schema; save snapshot on each `PUT`             |
| Resume sharing with expiry | Add `shareToken` and `shareExpiresAt` fields; add `/api/resumes/share/:token` route |
| AI summary generation      | Add `POST /api/resumes/:id/ai/summary`; call LLM with experience data               |
| OAuth (Google)             | Add passport strategy; `authRouter` already isolated in its own module              |
| Multiple users / teams     | `userId` is already indexed; add `orgId` field and org-scoped queries               |
| Resume analytics           | Add `views: number` field; increment on public fetch                                |
