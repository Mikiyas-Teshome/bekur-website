import * as fs from "node:fs";
import * as path from "node:path";
import {
  PAGE_FILES,
  pageSchemaById,
  type PageId,
} from "../../../content/schema/pages";

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export function loadPageContent<T extends PageId>(pageId: T) {
  const fileName = PAGE_FILES[pageId];
  const filePath = path.join(PAGES_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  const data: unknown = JSON.parse(raw);
  return pageSchemaById[pageId].parse(data);
}

export function loadSiteJson<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), "content", "site", relativePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}
