# @vercel/blob

> Globally distributed file storage with a 3-line API — no S3 buckets, IAM policies, or config required.

**npm:** https://www.npmjs.com/package/@vercel/blob  
**GitHub:** https://github.com/vercel/storage/tree/main/packages/blob  
**Docs:** https://vercel.com/docs/storage/vercel-blob

---

## The Problem

Storing user-uploaded files (images, PDFs, attachments) in a Node.js app typically means:

- Setting up an AWS S3 bucket with IAM roles, CORS policies, and bucket policies
- Managing pre-signed URLs for secure uploads
- Configuring a CDN separately for fast delivery
- Handling multipart uploads for large files
- Remembering which env vars map to which credentials across environments

It's a lot of infrastructure for what is conceptually a simple operation: *store a file, get a URL back*.

---

## What It Does

`@vercel/blob` gives you a simple API to upload, list, and delete files. Files are stored on Vercel's globally distributed edge network — no CDN setup needed, files are served fast everywhere. Works from both server-side Node.js code and client-side browser uploads.

---

## Installation

```bash
npm install @vercel/blob
```

---

## Usage Example

### Upload a file (server-side)

```ts
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file") as File;

  const blob = await put(file.name, file, {
    access: "public",
  });

  return Response.json({ url: blob.url });
  // blob.url is a globally distributed CDN URL — ready to use immediately
}
```

### Client-side upload (bypass your server)

```tsx
"use client";
import { upload } from "@vercel/blob/client";

export function AvatarUpload() {
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/avatar/upload", // your server-side token endpoint
    });

    console.log("Uploaded:", blob.url);
  }

  return <input type="file" onChange={handleChange} />;
}
```

### List and delete files

```ts
import { list, del } from "@vercel/blob";

// List all blobs
const { blobs } = await list({ prefix: "avatars/" });

// Delete a blob
await del("https://your-blob-url.vercel-storage.com/avatar.png");
```

---

## Screenshot / Demo

> Add a screenshot showing the Vercel Blob dashboard or a file upload flow here.

---

## Why It's a Hidden Gem

Most developers reach for AWS S3 without considering the setup overhead. `@vercel/blob` gets you to the same result in minutes instead of hours, with zero infrastructure config — and it's especially seamless if you're already on Vercel.

---

## Submitted by

<!-- @your-github-handle -->
