# Task: Audit, Fix & Modernize React Component Library for NPM

## Context

This is a React UI component library published on NPM. The package was created
without proper knowledge of modern library configuration best practices,     
resulting in potential build issues, incorrect exports, and compatibility     
problems. **Assume the entire configuration is broken until proven            
otherwise.**

## Objective

Perform a complete audit and modernization of this package so it:

1. Builds correctly with proper TypeScript compilation
2. Exports all components and types correctly
3. Works when installed via `npm install <package-name>`
4. Supports modern import patterns with full TypeScript support
5. Is compatible with Next.js App Router (RSC), Vite, and CRA projects

## Phase 1: Discovery & Analysis

### 1.1 Scan Project Structure

- Map the entire project tree
- Identify all source files, config files, and build outputs
- Note any unusual patterns or legacy files

### 1.2 Understand Intent

- Read component source code to understand what this library does
- Identify the main exports (components, hooks, utilities, types)
- Document the intended public API

### 1.3 Audit Configuration Files

Review with a "assume everything is wrong" mindset:

- `package.json` - exports, main, module, types, files, peerDependencies,     
  sideEffects
- `tsconfig.json` - declaration, jsx, module resolution, target
- Build config (rollup/tsup/webpack/tsc) - if any exists
- `.npmignore` / `.gitignore`

### 1.4 Identify Issues

Document all problems found:

- Incorrect entry points
- Missing or wrong peer dependencies
- React/React-DOM in dependencies instead of peerDependencies
- Missing ESM/CJS dual format support
- Type declaration issues
- CSS/styling handling problems
- Missing "use client" directives for client components

## Phase 2: Plan & Implement

### 2.1 Fix Project Structure

Reorganize to follow this pattern:                                            
src/                                                                          
index.ts # Barrel export                                       
components/                                                                 
ComponentName/                                                            
ComponentName.tsx                                                       
ComponentName.types.ts                                                  
index.ts                                                                
dist/ # Build output (ESM + CJS + types)

### 2.2 Fix package.json

Required fields:

- `main`: CJS entry (`./dist/index.js`)
- `module`: ESM entry (`./dist/index.mjs`)
- `types`: TypeScript declarations (`./dist/index.d.ts`)
- `exports`: Conditional exports for import/require with types
- `sideEffects`: `false` (or specify CSS files if applicable)
- `files`: `["dist"]`
- `peerDependencies`: React >=18.0.0 <20.0.0

### 2.3 Fix tsconfig.json

Configure for library output:

- `jsx`: `react-jsx`
- `module`: `ESNext`
- `moduleResolution`: `bundler`
- `declaration`: `true`
- `noEmit`: `true` (let bundler handle output)

### 2.4 Set Up Build Tooling

Use **tsup** for simplicity:

- Dual ESM/CJS output
- TypeScript declarations
- External peer dependencies (react, react-dom)
- Source maps

### 2.5 RSC Compatibility

- Add `"use client"` directive to components using hooks, state, or browser   
  APIs
- Configure tsup banner if needed

### 2.6 Fix Exports

- Export all public components
- Export all TypeScript types
- Maintain backward compatibility aliases if renaming

## Phase 3: Validation

### 3.1 Build Verification

  ```bash                                                                       
  npm run build        # Must complete without errors                           
  npm run typecheck    # Must pass TypeScript checks                            
  npm pack --dry-run   # Verify correct files are included                      
```                                                                       

### 3.2 Output Verification

Confirm dist/ contains:

- index.js (CJS)
- index.mjs (ESM)
- index.d.ts (Types for CJS)
- index.d.mts (Types for ESM)

### 3.3 Import Pattern Test

This must work:                                                               
import { ComponentName } from "package-name";                                 
// Full TypeScript support with autocomplete

## Phase 4: Documentation

### 4.1 Update README.md

- Professional, concise format
- Shield badges (npm version, downloads, bundle size, license)
- Quick installation & usage example
- Props table
- Requirements section

### 4.2 Clean Up

- Remove obsolete files (old configs, duplicate READMEs, etc.)
- Update .gitignore and .npmignore

## Technical Requirements

- React: >=18.0.0, supports 18.x and 19.x
- TypeScript: Strict mode, full type exports
- Build: tsup (recommended) for dual ESM/CJS
- Zero runtime dependencies if possible (peer deps only)
- Bundle size: Keep minimal, externalize peer deps

## Deliverables

1. Fixed and modernized configuration files
2. Properly structured source code
3. Working build that outputs ESM + CJS + types
4. Updated README.md
5. Summary of changes made and any breaking changes identified

## Process

1. Scan - Map entire project
2. Analyze - Understand components and intended usage
3. Plan - Document all issues and fixes needed
4. Implement - Apply fixes systematically
5. Test - Build, typecheck, pack dry-run
6. Summarize - Report changes and verify nothing is broken
7. Re-evaluate - Final check that imports work correctly

Start by exploring the project structure and reading all configuration files. 
                                                                                