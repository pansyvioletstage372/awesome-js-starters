# react-email

> Build cross-client compatible HTML emails using React components.

**npm:** https://www.npmjs.com/package/react-email  
**GitHub:** https://github.com/resend/react-email  
**Docs:** https://react.email/docs

---

## The Problem

HTML emails are notoriously difficult to build. Unlike the modern web, email clients have extremely inconsistent CSS support:

- **Gmail** strips `<style>` tags in some contexts and requires inline styles
- **Outlook** uses Microsoft Word's rendering engine (yes, really), which breaks flexbox, grid, and most modern CSS
- **Apple Mail** is more forgiving, which makes cross-testing even more confusing

The result: you spend hours writing table-based layouts with inline styles, testing in 5+ clients, and watching things break in ways that make no sense.

This was discovered after hours of fighting email templates — then a LinkedIn post mentioned `react-email` and everything changed.

---

## What It Does

React Email lets you write email templates as React components using a set of purpose-built primitives (`<Html>`, `<Body>`, `<Section>`, `<Button>`, etc.) that compile down to email-safe HTML. It handles cross-client compatibility so you don't have to think about it.

It also ships with a **local preview server** that shows your email rendered in a browser as you develop — no more sending test emails to yourself.

---

## Installation

```bash
npm install react-email @react-email/components
```

---

## Usage Example

### Basic welcome email

```tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface WelcomeEmailProps {
  username: string;
}

export default function WelcomeEmail({ username }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 0" }}>
          <Section style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "8px" }}>
            <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#1a1a1a" }}>
              Welcome, {username}!
            </Text>
            <Text style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
              We're glad you're here. Click below to get started.
            </Text>
            <Hr />
            <Button
              href="https://yourapp.com/dashboard"
              style={{
                backgroundColor: "#5c6bc0",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "4px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Go to Dashboard
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

### Rendering to HTML (for sending via any email provider)

```ts
import { render } from "@react-email/render";
import WelcomeEmail from "./emails/WelcomeEmail";

const html = render(<WelcomeEmail username="Sarah" />);

// Pass `html` to your email provider (Resend, SendGrid, Nodemailer, etc.)
await sendEmail({
  to: "sarah@example.com",
  subject: "Welcome!",
  html,
});
```

### Local preview server

```bash
npx react-email dev
```

Opens a browser preview at `http://localhost:3000` — live-reloads as you edit.

---

## Screenshot / Demo

> Add a screenshot of the local preview server or a rendered email here.
> Drag an image into this folder and reference it: `![Preview](./screenshot.png)`

---

## Why It Works in All Clients

React Email's components (like `<Section>`, `<Row>`, `<Column>`) generate table-based layouts under the hood — the only layout system with reliable support across Outlook, Gmail, and others. You write modern React; it outputs email-safe HTML.

---

## Pairs Well With

- **[Resend](https://resend.com)** — email sending API by the same team, integrates directly
- **Nodemailer** — for self-hosted SMTP setups
- **SendGrid / Postmark** — pass the rendered HTML string to any provider

---

## Submitted by

<!-- @your-github-handle -->
