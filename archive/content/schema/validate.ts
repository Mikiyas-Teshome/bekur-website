import * as fs from "node:fs";
import * as path from "node:path";
import { PAGE_FILES, pageSchemaById, type PageId } from "./pages";

const CONTENT_ROOT = path.resolve(__dirname, "..");
const PAGES_DIR = path.join(CONTENT_ROOT, "pages");

function loadJson(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as unknown;
}

function validatePages(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [pageId, fileName] of Object.entries(PAGE_FILES) as [
    PageId,
    string,
  ][]) {
    const filePath = path.join(PAGES_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing page file: ${filePath}`);
      continue;
    }

    const data = loadJson(filePath);
    const schema = pageSchemaById[pageId];
    const result = schema.safeParse(data);

    if (!result.success) {
      errors.push(
        `${fileName}:\n${result.error.issues
          .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
          .join("\n")}`
      );
    }
  }

  return { ok: errors.length === 0, errors };
}

function main(): void {
  const { ok, errors } = validatePages();

  if (ok) {
    console.log(`✓ All ${Object.keys(PAGE_FILES).length} page files valid.`);
    process.exit(0);
  }

  console.error("✗ Content validation failed:\n");
  for (const err of errors) {
    console.error(err);
    console.error("");
  }
  process.exit(1);
}

main();
