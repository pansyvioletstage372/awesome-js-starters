# jsPDF

> Generate and download PDF files entirely in the browser — no server, no backend, no dependencies.

**npm:** https://www.npmjs.com/package/jspdf  
**GitHub:** https://github.com/parallax/jsPDF  
**Docs:** https://artskydj.github.io/jsPDF/docs/

---

## The Problem

Generating PDFs (invoices, reports, certificates, receipts) typically requires:

- A server-side process (Puppeteer, wkhtmltopdf, or a PDF rendering service)
- A paid SaaS API for PDF generation
- A heavy backend dependency just for one feature

For use cases like downloading an invoice or exporting a report, none of that server infrastructure should be necessary — the browser already has everything it needs.

---

## What It Does

jsPDF is a client-side JavaScript library that generates PDF files directly in the browser. You write text, shapes, images, and tables using a simple drawing API, and the user gets a `.pdf` download without any server involvement. It supports Unicode text, custom fonts, images (JPEG, PNG), and multi-page documents.

With nearly 2 million weekly npm downloads, it's one of the most battle-tested PDF libraries in the JS ecosystem.

---

## Installation

```bash
npm install jspdf
```

---

## Usage Example

### Simple text PDF download

```ts
import { jsPDF } from "jspdf";

function downloadSimplePDF() {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("Invoice #1042", 20, 20);

  doc.setFontSize(12);
  doc.text("Date: April 2, 2026", 20, 35);
  doc.text("To: John Doe", 20, 45);
  doc.text("Amount: $250.00", 20, 55);

  doc.save("invoice-1042.pdf"); // triggers browser download
}
```

### Adding a table (with jspdf-autotable plugin)

```bash
npm install jspdf jspdf-autotable
```

```ts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function downloadReport() {
  const doc = new jsPDF();

  doc.text("Monthly Sales Report", 14, 16);

  autoTable(doc, {
    head: [["Product", "Units Sold", "Revenue"]],
    body: [
      ["Widget A", "120", "$1,200"],
      ["Widget B", "85", "$2,125"],
      ["Widget C", "200", "$800"],
    ],
    startY: 25,
  });

  doc.save("sales-report.pdf");
}
```

### Embed an image (e.g. company logo)

```ts
import { jsPDF } from "jspdf";

async function downloadWithLogo() {
  const doc = new jsPDF();

  // Load image as base64
  const img = new Image();
  img.src = "/logo.png";
  await new Promise((resolve) => (img.onload = resolve));

  doc.addImage(img, "PNG", 20, 10, 50, 20); // x, y, width, height
  doc.setFontSize(16);
  doc.text("Official Receipt", 20, 45);
  doc.save("receipt.pdf");
}
```

---

## Screenshot / Demo

> Add a screenshot of a generated PDF or the download prompt here.

---

## Why It's a Hidden Gem

Most developers reach for Puppeteer or a PDF SaaS when they need PDFs, without realising jsPDF can handle most document use cases entirely in the browser with no infrastructure. The `jspdf-autotable` plugin makes it especially powerful for data-heavy reports.

---

## Submitted by

<!-- @your-github-handle -->
