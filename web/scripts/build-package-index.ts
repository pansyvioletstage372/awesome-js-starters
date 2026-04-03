import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Package {
  name: string;
  description: string;
  category: string;
  npm: string;
  github: string;
  docs: string;
  repoPath: string;
}

const packagesDir = path.resolve(__dirname, "../../packages");
const outputFile = path.resolve(__dirname, "../src/data/packages.json");

function extractField(lines: string[], prefix: string): string {
  const line = lines.find((l) => l.startsWith(prefix));
  if (!line) return "";
  return line.replace(prefix, "").replace(/\s+$/, "").trim();
}

function parseReadme(content: string, category: string, packageName: string): Package {
  const lines = content.split("\n");

  // Name: first # heading
  const nameLine = lines.find((l) => l.startsWith("# "));
  const name = nameLine ? nameLine.replace(/^#\s+/, "").trim() : packageName;

  // Description: first > blockquote line
  const descLine = lines.find((l) => l.startsWith("> ") && !l.startsWith("> Add"));
  const description = descLine ? descLine.replace(/^>\s+/, "").trim() : "";

  // Links
  const npm = extractField(lines, "**npm:**");
  const github = extractField(lines, "**GitHub:**");
  const docs = extractField(lines, "**Docs:**");

  if (!description) {
    console.warn(`[warn] No description found for ${category}/${packageName}`);
  }

  return {
    name,
    description,
    category,
    npm,
    github,
    docs,
    repoPath: `packages/${category}/${packageName}`,
  };
}

function buildIndex(): Package[] {
  const packages: Package[] = [];

  if (!fs.existsSync(packagesDir)) {
    console.error(`packages directory not found: ${packagesDir}`);
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

    for (const packageName of packageFolders) {
      const readmePath = path.join(categoryDir, packageName, "README.md");
      if (!fs.existsSync(readmePath)) {
        console.warn(`[warn] No README.md found for ${category}/${packageName}`);
        continue;
      }
      const content = fs.readFileSync(readmePath, "utf-8");
      const pkg = parseReadme(content, category, packageName);
      packages.push(pkg);
    }
  }

  return packages;
}

const packages = buildIndex();
fs.writeFileSync(outputFile, JSON.stringify(packages, null, 2));
console.log(`[build] Generated ${packages.length} packages → src/data/packages.json`);
