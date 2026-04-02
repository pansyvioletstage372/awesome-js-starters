# Contributing to npm Hidden Gems

Thank you for sharing your discoveries! This guide walks you through submitting a package.

---

## Who Can Contribute?

Anyone who has **personally used** a package and found it genuinely useful. You don't need to be the package author — in fact, user-written submissions are preferred because they include honest, real-world context.

---

## What Makes a Good Submission?

A great submission answers these questions for a developer who has never heard of the package:

- **What problem were you trying to solve?** Be specific. "I needed to send transactional emails" is better than "I needed email functionality."
- **Why was this hard before?** What alternatives did you try, and why did they fall short?
- **What does this package do differently?** One or two sentences.
- **How do you use it?** A minimal, working code snippet.
- **What does it look like?** Screenshot or gif if relevant (drag into your PR or link externally).

---

## Submission Steps

1. **Fork** this repository
2. **Create a folder** at the correct path:
   ```
   packages/<category>/<package-name>/
   ```
   Categories: `react`, `angular`, `vue`, `node`, `express`, `fastify`, `general-js`

3. **Add a `README.md`** inside that folder using the template below
4. **Add any screenshots** inside the same folder (e.g., `screenshot.png`)
5. **Open a pull request** — the PR template will guide you through a checklist

---

## Package README Template

Copy this into your `packages/<category>/<package-name>/README.md`:

```markdown
# <package-name>

> One-line description of what the package does.

**npm:** https://www.npmjs.com/package/<package-name>
**GitHub:** https://github.com/<org>/<repo>
**Docs:** <link to official docs>

---

## The Problem

<!-- What were you trying to do, and why was it painful without this package? -->

---

## What It Does

<!-- 2-3 sentences explaining the package's approach -->

---

## Installation

```bash
npm install <package-name>
```

---

## Usage Example

<!-- A real, minimal working snippet from your actual project (sanitized if needed) -->

```js
// your code here
```

---

## Screenshot / Demo

<!-- Optional but encouraged. Drag an image into your PR or paste a link -->

---

## Submitted by

<!-- Your GitHub username: @yourhandle -->
```

---

## Rules

- The package must be published on npm
- You must have **personally used** it (not just read about it)
- No packages that are abandoned (last publish > 3 years ago, no active maintainer), unless you explain why it still works well
- No self-promotion of packages you authored unless you also include honest caveats
- One package per pull request
- Keep code examples concise — if a full working example is large, link to a separate `examples/` file

---

## Updating an Existing Entry

If you have additional examples, a better screenshot, or a correction — open a PR with your changes and describe what you improved in the PR body.

---

## Questions?

Open a [GitHub Discussion](../../discussions) with the "Question" label.
