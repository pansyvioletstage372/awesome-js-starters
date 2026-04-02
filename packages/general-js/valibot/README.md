# valibot

> Tiny, tree-shakeable schema validation library — a Zod alternative that won't bloat your bundle.

**npm:** https://www.npmjs.com/package/valibot  
**GitHub:** https://github.com/fabian-hiller/valibot  
**Docs:** https://valibot.dev

---

## The Problem

Zod is the dominant schema validation library in the TypeScript ecosystem — but it has a significant downside: **it's not tree-shakeable**. The entire Zod runtime (~14KB gzipped) is included in your bundle whether you use 3 validators or 30.

For client-side apps, Edge Functions, or Lambda functions where bundle size matters, this is a real cost. And for teams using React Hook Form or tRPC, the validation library ends up in the critical path for page load.

---

## What It Does

Valibot provides the same schema validation capabilities as Zod — objects, strings, numbers, arrays, enums, transforms, refinements — but with a module-based architecture that's fully tree-shakeable. Only the validators you import are included in your bundle. A minimal schema can be under 1KB gzipped. It also has nearly 1 million weekly npm downloads.

---

## Installation

```bash
npm install valibot
```

---

## Usage Example

### Basic schema validation

```ts
import * as v from "valibot";

const UserSchema = v.object({
  name: v.pipe(v.string(), v.minLength(2), v.maxLength(50)),
  email: v.pipe(v.string(), v.email()),
  age: v.pipe(v.number(), v.minValue(0), v.maxValue(120)),
  role: v.picklist(["admin", "user", "guest"]),
});

type User = v.InferOutput<typeof UserSchema>;

const result = v.safeParse(UserSchema, {
  name: "Sarah",
  email: "sarah@example.com",
  age: 28,
  role: "admin",
});

if (result.success) {
  console.log(result.output); // Typed as User
} else {
  console.log(result.issues); // Detailed validation errors
}
```

### Form validation with React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";

const SignupSchema = v.object({
  email: v.pipe(v.string(), v.email("Enter a valid email")),
  password: v.pipe(v.string(), v.minLength(8, "Password must be at least 8 characters")),
});

type SignupForm = v.InferOutput<typeof SignupSchema>;

export function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: valibotResolver(SignupSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}
      <input type="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}
```

### API input validation (Next.js route handler)

```ts
import * as v from "valibot";

const CreatePostSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(200)),
  content: v.pipe(v.string(), v.minLength(1)),
  tags: v.array(v.string()),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = v.safeParse(CreatePostSchema, body);

  if (!result.success) {
    return Response.json({ errors: result.issues }, { status: 400 });
  }

  // result.output is fully typed
  const post = await createPost(result.output);
  return Response.json(post);
}
```

---

## Screenshot / Demo

> Add a bundle size comparison screenshot (Valibot vs Zod) here.

---

## Why It's a Hidden Gem

Zod's dominance means most developers don't look for alternatives. Valibot's tree-shaking makes a real difference in client-side apps and edge environments — it's a drop-in replacement for 90% of Zod use cases with a fraction of the bundle cost.

---

## Submitted by

<!-- @your-github-handle -->
