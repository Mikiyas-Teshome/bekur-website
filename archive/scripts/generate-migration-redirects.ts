/**
 * Generate content/site/redirects.migration.json from database id → slug maps.
 *
 * Usage (after DATABASE_URL is set):
 *   npx ts-node --project tsconfig.seed.json scripts/generate-migration-redirects.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { getDataSource } from "../src/lib/db";
import { BlogPost } from "../src/lib/entities/BlogPost";
import { PortfolioProject } from "../src/lib/entities/PortfolioProject";

async function main() {
  const dataSource = await getDataSource();
  const blogs = await dataSource.getRepository(BlogPost).find({
    select: ["id", "slug"],
  });
  const projects = await dataSource.getRepository(PortfolioProject).find({
    select: ["id", "slug"],
  });

  const redirects = [
    ...blogs.map((b) => ({
      source: `/blog/${b.id}`,
      destination: `/blog/${b.slug}`,
      permanent: true,
      entity: "blog_posts",
      entityId: b.id,
    })),
    ...projects.map((p) => ({
      source: `/portfolio/${p.id}`,
      destination: `/portfolio/${p.slug}`,
      permanent: true,
      entity: "portfolio_projects",
      entityId: p.id,
    })),
  ];

  const outPath = path.join(
    process.cwd(),
    "content/site/redirects.migration.json"
  );

  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        version: "1.0",
        description: "Auto-generated id → slug redirects. Merge into next.config at cutover.",
        generatedAt: new Date().toISOString(),
        redirects,
      },
      null,
      2
    )
  );

  console.log(`Wrote ${redirects.length} redirects to ${outPath}`);
  await dataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
