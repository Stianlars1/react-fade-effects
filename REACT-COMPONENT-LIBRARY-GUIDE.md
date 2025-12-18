# React Component Library Guide

A comprehensive guide for building, configuring, and publishing React component libraries to NPM.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Essential package.json Fields](#essential-packagejson-fields)
3. [tsconfig.json for Libraries vs Apps](#tsconfigjson-for-libraries-vs-apps)
4. [Build Tooling Options](#build-tooling-options)
5. [React Server Components (RSC) Compatibility](#react-server-components-rsc-compatibility)
6. [Local Testing with npm link](#local-testing-with-npm-link)
7. [Publishing Checklist](#publishing-checklist)

---

## Project Structure

A well-organized component library should follow this structure:

```
my-component-library/
├── src/
│   ├── index.ts              # Barrel export - main entry point
│   └── components/
│       └── MyComponent/
│           ├── MyComponent.tsx       # Component implementation
│           ├── MyComponent.types.ts  # TypeScript types
│           └── index.ts              # Component barrel export
├── dist/                     # Build output (generated)
│   ├── index.js              # CommonJS build
│   ├── index.mjs             # ESM build
│   ├── index.d.ts            # Type declarations (CJS)
│   └── index.d.mts           # Type declarations (ESM)
├── package.json
├── tsconfig.json
├── tsup.config.ts            # Build configuration
├── .gitignore
├── .npmignore
└── README.md
```

### Key Principles

1. **Colocate types with components** - Keep `.types.ts` files next to components
2. **Barrel exports** - Use `index.ts` files to re-export from each directory
3. **Flat dist output** - Output directly to `dist/`, not `dist/src/`

---

## Essential package.json Fields

```json
{
  "name": "@your-scope/package-name",
  "version": "1.0.0",

  // Entry points for different module systems
  "main": "./dist/index.js",        // CommonJS entry (Node.js, older bundlers)
  "module": "./dist/index.mjs",     // ESM entry (modern bundlers)
  "types": "./dist/index.d.ts",     // TypeScript types fallback

  // Modern exports field (Node.js 12.7+)
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },

  // Tree-shaking hint - false means all code is side-effect free
  "sideEffects": false,

  // Files to include in the published package
  "files": ["dist"],

  // Peer dependencies - don't bundle these
  "peerDependencies": {
    "react": ">=18.0.0 <20.0.0",
    "react-dom": ">=18.0.0 <20.0.0"
  },

  // Runtime dependencies - bundled with your package
  "dependencies": {},

  // Development dependencies - not published
  "devDependencies": {
    "@types/react": "^18.2.0 || ^19.0.0",
    "@types/react-dom": "^18.2.0 || ^19.0.0",
    "react": "^18.2.0 || ^19.0.0",
    "react-dom": "^18.2.0 || ^19.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Field Explanations

| Field | Purpose |
|-------|---------|
| `main` | Entry point for CommonJS (`require()`) |
| `module` | Entry point for ES Modules (`import`) |
| `types` | Fallback TypeScript declarations path |
| `exports` | Modern entry points with conditional exports |
| `sideEffects` | Enables tree-shaking (`false` = pure module) |
| `files` | Whitelist of files/folders to publish |
| `peerDependencies` | Dependencies consumers must provide |

### peerDependencies vs dependencies

- **peerDependencies**: Use for React, React DOM, and major frameworks. Consumers provide these, preventing version conflicts.
- **dependencies**: Use for libraries your code imports at runtime that consumers shouldn't need to install separately.
- **devDependencies**: Use for build tools, types, and testing. These are NOT published.

---

## tsconfig.json for Libraries vs Apps

### For Libraries (Recommended)

```json
{
  "compilerOptions": {
    // Output settings - let bundler handle actual compilation
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],

    // JSX - use react-jsx for React 17+
    "jsx": "react-jsx",

    // Type declarations
    "declaration": true,
    "declarationMap": true,

    // Strict mode
    "strict": true,
    "noUncheckedIndexedAccess": true,

    // Interop
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,

    // Skip node_modules type checking
    "skipLibCheck": true,

    // Don't emit - let tsup/rollup handle it
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Key Differences: Library vs App

| Setting | Library | App |
|---------|---------|-----|
| `noEmit` | `true` (bundler emits) | `false` or omit |
| `declaration` | `true` (generate .d.ts) | Usually `false` |
| `module` | `ESNext` | Depends on target |
| `moduleResolution` | `bundler` | `node` or `bundler` |

---

## Build Tooling Options

### Option 1: tsup (Recommended)

**Pros**: Zero-config, fast, handles dual ESM/CJS, generates declarations
**Cons**: Less customizable than Rollup

```bash
npm install -D tsup
```

**tsup.config.ts**:
```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  treeshake: true,
  target: "es2020",
});
```

### Option 2: Rollup

**Pros**: Highly customizable, mature ecosystem
**Cons**: More configuration required

```bash
npm install -D rollup @rollup/plugin-typescript @rollup/plugin-node-resolve rollup-plugin-dts
```

### Option 3: unbuild

**Pros**: Passive bundling, good for simple libraries
**Cons**: Newer, smaller community

### Option 4: Plain tsc

**Pros**: No extra dependencies
**Cons**: Only outputs one format, no bundling, manual declaration handling

---

## React Server Components (RSC) Compatibility

For Next.js App Router compatibility, add the `"use client"` directive to client-side components:

```tsx
// src/components/MyComponent/MyComponent.tsx
"use client";

import { useState } from "react";

export function MyComponent() {
  const [count, setCount] = useState(0);
  // ...
}
```

### When to Use "use client"

Add `"use client"` if your component:
- Uses React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Uses browser-only APIs (`window`, `document`, etc.)
- Has event handlers (`onClick`, `onChange`, etc.)
- Uses class components

### tsup Configuration for RSC

```typescript
// tsup.config.ts
export default defineConfig({
  // ... other options
  banner: {
    js: '"use client";',
  },
});
```

---

## Local Testing with npm link

### Step 1: Link the Library

In your library directory:

```bash
# Build the library
npm run build

# Create a global symlink
npm link
```

### Step 2: Link in Your Test Project

In your test app (e.g., Next.js project):

```bash
# Link to the library
npm link @your-scope/package-name
```

### Step 3: Test the Import

```tsx
// In your test app
import { MyComponent } from "@your-scope/package-name";

export default function Page() {
  return <MyComponent />;
}
```

### Step 4: Unlink When Done

```bash
# In test app
npm unlink @your-scope/package-name

# In library
npm unlink
```

### Alternative: npm pack

For more realistic testing:

```bash
# In library directory
npm pack
# Creates: your-scope-package-name-1.0.0.tgz

# In test app
npm install ../path/to/your-scope-package-name-1.0.0.tgz
```

---

## Publishing Checklist

### Before First Publish

- [ ] Choose a unique package name (use `npm search` to check)
- [ ] Set up NPM account and login (`npm login`)
- [ ] If using a scope, ensure you own it or it's public

### Before Each Publish

1. **Verify build output**
   ```bash
   npm run build
   ls dist/  # Check all expected files exist
   ```

2. **Check what will be published**
   ```bash
   npm pack --dry-run
   ```

3. **Test locally**
   ```bash
   npm link
   # Or
   npm pack && npm install ../package.tgz
   ```

4. **Verify TypeScript types**
   ```bash
   npm run typecheck
   ```

5. **Update version**
   ```bash
   npm version patch  # or minor, or major
   ```

6. **Publish**
   ```bash
   npm publish --access public  # For scoped packages
   # Or
   npm publish  # For unscoped packages
   ```

### Post-Publish Verification

```bash
# In a new directory
npm init -y
npm install @your-scope/package-name

# Test import
node -e "console.log(require('@your-scope/package-name'))"
```

### Common Publishing Mistakes

1. **Forgetting to build before publish** - Use `prepublishOnly` script
2. **Publishing src instead of dist** - Check `files` field
3. **Missing peer dependencies** - Test in fresh project
4. **Breaking type exports** - Verify `.d.ts` files in dist
5. **Not testing in both CJS and ESM** - Test `require()` and `import`

---

## Quick Reference

### Minimal package.json

```json
{
  "name": "@scope/my-lib",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },
      "require": { "types": "./dist/index.d.ts", "default": "./dist/index.js" }
    }
  },
  "sideEffects": false,
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": ">=18.0.0"
  }
}
```

### Minimal tsup.config.ts

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  external: ["react", "react-dom"],
});
```

---

## Additional Resources

- [NPM Package.json Documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [tsup Documentation](https://tsup.egoist.dev/)
- [React Server Components](https://react.dev/reference/react/use-client)
