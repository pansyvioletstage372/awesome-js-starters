#!/usr/bin/env node

/**
 * Validates that a package README.md follows the required template format.
 *
 * Usage:
 *   node scripts/validate-package-readme.js packages/general-js/hono/README.md
 *   node scripts/validate-package-readme.js --all
 */

const fs = require("fs");
const path = require("path");

const VALID_CATEGORIES = [
  "react",
  "angular",
  "vue",
  "node",
  "express",
  "fastify",
  "general-js",
];

const REQUIRED_SECTIONS = [
  "## The Problem",
  "## What It Does",
  "## Installation",
  "## Usage Example",
  "## Submitted by",
];

function validate(filePath) {
  const errors = [];
  const relPath = path.relative(process.cwd(), filePath);

  if (!fs.existsSync(filePath)) {
    errors.push(`File not found: ${relPath}`);
    return errors;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  // Check path structure: packages/<category>/<name>/README.md
  const parts = relPath.replace(/\\/g, "/").split("/");
  const pkgIdx = parts.indexOf("packages");
  if (pkgIdx === -1 || parts.length < pkgIdx + 4) {
    errors.push(
      `Invalid path structure. Expected packages/<category>/<name>/README.md`
    );
  } else {
    const category = parts[pkgIdx + 1];
    if (!VALID_CATEGORIES.includes(category)) {
      errors.push(
        `Invalid category "${category}". Must be one of: ${VALID_CATEGORIES.join(", ")}`
      );
    }
  }

  // Line 1: must be a # heading
  if (!lines[0] || !lines[0].startsWith("# ")) {
    errors.push(`Line 1 must be a heading (# Package Name)`);
  }

  // Line 2: must be empty
  if (lines.length > 1 && lines[1].trim() !== "") {
    errors.push(`Line 2 must be empty (blank line after heading)`);
  }

  // Line 3: must be a > blockquote description
  if (lines.length > 2 && !lines[2].startsWith("> ")) {
    errors.push(
      `Line 3 must be a blockquote description starting with "> ". This is required for the website's build system to parse descriptions correctly.`
    );
  }

  // Check for required link fields
  const hasNpm = lines.some((l) => l.startsWith("**npm:**"));
  const hasGitHub = lines.some((l) => l.startsWith("**GitHub:**"));
  const hasDocs = lines.some((l) => l.startsWith("**Docs:**"));

  if (!hasNpm) errors.push(`Missing **npm:** link field`);
  if (!hasGitHub) errors.push(`Missing **GitHub:** link field`);
  if (!hasDocs) errors.push(`Missing **Docs:** link field`);

  // Check for npm URL format
  const npmLine = lines.find((l) => l.startsWith("**npm:**"));
  if (npmLine && !npmLine.includes("npmjs.com/package/")) {
    errors.push(
      `**npm:** field should contain a valid npmjs.com URL (e.g., https://www.npmjs.com/package/<name>)`
    );
  }

  // Check for required sections
  for (const section of REQUIRED_SECTIONS) {
    if (!lines.some((l) => l.trim() === section)) {
      errors.push(`Missing required section: ${section}`);
    }
  }

  return errors;
}

function getAllReadmes() {
  const packagesDir = path.resolve(process.cwd(), "packages");
  const readmes = [];

  if (!fs.existsSync(packagesDir)) {
    console.error("packages/ directory not found. Run from the repo root.");
    process.exit(1);
  }

  const categories = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const category of categories) {
    const categoryDir = path.join(packagesDir, category);
    const packageFolders = fs
      .readdirSync(categoryDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const pkg of packageFolders) {
      const readmePath = path.join(categoryDir, pkg, "README.md");
      if (fs.existsSync(readmePath)) {
        readmes.push(readmePath);
      }
    }
  }

  return readmes;
}

// Main
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(
    "Usage:\n  node scripts/validate-package-readme.js <path-to-README.md>\n  node scripts/validate-package-readme.js --all"
  );
  process.exit(0);
}

const files = args.includes("--all") ? getAllReadmes() : args;
let totalErrors = 0;

for (const file of files) {
  const filePath = path.resolve(process.cwd(), file);
  const errors = validate(filePath);
  const relPath = path.relative(process.cwd(), filePath);

  if (errors.length > 0) {
    console.log(`\n  ${relPath}`);
    for (const err of errors) {
      console.log(`    - ${err}`);
    }
    totalErrors += errors.length;
  } else {
    console.log(`  ${relPath} ... ok`);
  }
}

if (totalErrors > 0) {
  console.log(`\n${totalErrors} error(s) found.`);
  process.exit(1);
} else {
  console.log(`\nAll files valid.`);
}
