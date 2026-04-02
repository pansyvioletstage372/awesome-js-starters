# milkdown

> Plugin-driven, WYSIWYG Markdown editor for React with a clean prose editing experience.

**npm:** https://www.npmjs.com/package/@milkdown/core  
**GitHub:** https://github.com/Milkdown/milkdown  
**Docs:** https://milkdown.dev

---

## The Problem

Adding a rich text editor to a React app that outputs clean Markdown is surprisingly difficult:

- Most WYSIWYG editors (Quill, TinyMCE, Draft.js) output HTML — not Markdown
- Markdown-outputting editors often look plain or require a lot of custom styling
- Building a custom editor from scratch with ProseMirror is complex and time-consuming
- Many editors are abandoned or have poor TypeScript support

---

## What It Does

Milkdown is a plugin-driven Markdown WYSIWYG editor built on top of ProseMirror and Remark. You write in a live-preview prose environment and the output is always clean Markdown. The plugin architecture means you can add tables, math formulas, slash commands, collaborative editing, and more — only loading what you need.

---

## Installation

```bash
npm install @milkdown/core @milkdown/react @milkdown/preset-commonmark @milkdown/theme-nord
```

---

## Usage Example

### Basic editor in React

```tsx
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { ReactEditor, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";

import "@milkdown/theme-nord/style.css";

export function MarkdownEditor() {
  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, "# Hello Milkdown\n\nStart typing here...");
      })
      .use(nord)
      .use(commonmark)
  );

  return <ReactEditor editor={get()} />;
}
```

### Reading the Markdown output

```tsx
import { getMarkdown } from "@milkdown/utils";

function SaveButton({ editorRef }) {
  function handleSave() {
    const markdown = editorRef.get()?.action(getMarkdown());
    console.log(markdown); // clean Markdown string
    // save to your database
  }

  return <button onClick={handleSave}>Save</button>;
}
```

### Adding table support

```tsx
import { gfm } from "@milkdown/preset-gfm";

Editor.make()
  .config(...)
  .use(nord)
  .use(commonmark)
  .use(gfm) // adds tables, strikethrough, task lists
  .create();
```

---

## Screenshot / Demo

> Add a screenshot of the editor UI here.

---

## Why It's a Hidden Gem

Developers building note-taking apps, CMS editors, or documentation tools usually reach for Tiptap or Slate. Milkdown is lighter, has a more opinionated (and beautiful) default theme, and outputs Markdown rather than HTML — making it a much better fit for developer-focused tools.

---

## Submitted by

<!-- @your-github-handle -->
