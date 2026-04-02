# turbo (Turborepo)

> High-performance monorepo build system with smart caching — only rebuilds what actually changed.

**npm:** https://www.npmjs.com/package/turbo  
**GitHub:** https://github.com/vercel/turborepo  
**Docs:** https://turbo.build/repo/docs

---

## The Problem

As a codebase grows into multiple packages (a shared UI library, multiple apps, shared utils), managing builds becomes painful:

- Running `npm run build` rebuilds everything from scratch every time
- CI pipelines take 10+ minutes even when only one package changed
- No standard way to define which tasks depend on which other tasks
- Running tests across all packages in the right order is manual
- Sharing cached results between team members or CI runs is hard

---

## What It Does

Turborepo is a build system that understands the dependency graph of your monorepo. It caches task outputs (build artifacts, test results) and skips tasks whose inputs haven't changed. Cache hits are instant. Remote caching shares these cached results across your whole team and CI — so a build that took 10 minutes on one developer's machine is a cache hit for everyone else.

---

## Installation

```bash
npm install turbo --save-dev
# or create a new monorepo:
npx create-turbo@latest
```

---

## Usage Example

### turbo.json — define your task pipeline

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Run tasks across all packages

```bash
# Build everything (skips unchanged packages automatically)
npx turbo build

# Run tests only in packages that changed since last commit
npx turbo test --filter=[HEAD^1]

# Run multiple tasks in parallel
npx turbo build test lint
```

### package.json scripts with turbo

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint"
  }
}
```

### Enable remote caching (share cache with team + CI)

```bash
npx turbo login
npx turbo link
# Now CI builds use your team's shared cache — no redundant rebuilds
```

---

## Screenshot / Demo

> Add a screenshot showing the turbo build output with cache hits vs misses.

---

## Why It's a Hidden Gem

Many teams running monorepos with Lerna or Nx don't know about Turborepo's remote caching — it's the feature that turns 15-minute CI pipelines into 30-second ones. Once set up, it's completely transparent.

---

## Submitted by

<!-- @your-github-handle -->
