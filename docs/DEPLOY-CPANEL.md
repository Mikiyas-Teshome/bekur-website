# Deploy Bekur Website on cPanel Shared Hosting

Step-by-step guide for deploying this **Next.js 16** app (Node.js + PostgreSQL + optional MinIO) on typical cPanel shared hosting.

---

## Before you start — read this

This project is **not** a static HTML/PHP site. It needs:

| Requirement | Why |
|-------------|-----|
| **Node.js 20+** (18 minimum) | `next build` and `next start` |
| **PostgreSQL** | TypeORM uses `DATABASE_URL` (not MySQL by default) |
| **Always-on Node process** | SSR, `/api/*`, `/admin/*` |
| **~1–2 GB RAM for build** | `npm run build` can fail on tiny plans |

Many cheap shared plans **do not** support this well. Confirm with your host:

1. **“Setup Node.js App”** (or “Application Manager”) exists in cPanel  
2. **Node 20.x** selectable  
3. **PostgreSQL** available *or* you will use **external** DB (Neon, Supabase, Railway)  
4. **SSH** access (strongly recommended for migrations and builds)

If any of the above is missing, use **Vercel + Neon** (easier for Next.js) or a **VPS** instead of fighting shared hosting.

**MVP-only deploy (homepage, no admin):** Still needs Node for Next.js unless you switch to `output: 'export'` (not supported for this codebase as-is because of API routes and admin).

---

## Overview of the deployment flow

```
[Your PC]  git clone → npm ci → npm run build  (recommended on PC)
                ↓
[cPanel]   upload files → Setup Node.js App → env vars → start app
                ↓
[DB]       PostgreSQL + npm run migration:run + npm run seed:admin
                ↓
[DNS]      domain → cPanel account → SSL
```

**Recommended:** Build on your computer, upload the built app. Shared hosts often timeout or run out of memory during `next build`.

---

## Step 1 — Check cPanel capabilities

1. Log in to **cPanel**.
2. Search for **“Setup Node.js App”** or **“Node.js Selector”**.
3. Note the highest **Node version** (pick **20.x** if available).
4. Open **“Terminal”** or confirm **SSH** works:
   ```bash
   node -v    # should be v20.x
   npm -v
   ```
5. Check databases:
   - **PostgreSQL Databases** → create DB + user if offered  
   - If only **MySQL** → use external PostgreSQL (Step 3B)

---

## Step 2 — Prepare the project on your computer

```bash
cd bekur-website
git pull
npm ci
cp .env.production.example .env   # create from template below if missing
```

Create **`.env.production`** (values you will copy into cPanel):

```env
NODE_ENV=production
PORT=3000

# Public site URL (no trailing slash)
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com

# Auth — use a long random string (32+ chars)
NEXTAUTH_SECRET=replace-with-openssl-rand-hex-32

# PostgreSQL (cPanel or external)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME

# Admin seed (first deploy only)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=use-a-strong-password-here

# MinIO / S3-compatible storage (admin media uploads)
MINIO_ENDPOINT=your-minio-host.com
MINIO_PORT=9000
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=bekur-hms
MINIO_PUBLIC_URL=https://cdn.yourdomain.com

# Contact form (optional)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-mailbox-password
SMTP_FROM_NAME=Bekur Technologies
SMTP_FROM_EMAIL=noreply@yourdomain.com
CONTACT_EMAIL=info@yourdomain.com
```

Build:

```bash
npm run build
```

If build succeeds, you have a `.next` folder ready for production.

**Optional — test production locally:**

```bash
npm run start
# open http://localhost:3000
```

---

## Step 3 — Database (PostgreSQL)

### Option A — PostgreSQL on cPanel

1. cPanel → **PostgreSQL Databases**.
2. Create database, e.g. `bekur_prod`.
3. Create user with a strong password; **add user to database** with ALL PRIVILEGES.
4. Note host (often `localhost` on same server).
5. Build connection string:

   ```text
   postgresql://cpanel_user:password@localhost:5432/cpanel_bekur_prod
   ```

6. Set as `DATABASE_URL` in cPanel env (Step 5).

### Option B — External PostgreSQL (Neon / Supabase / Railway)

1. Create a free/cheap Postgres instance.
2. Copy the **connection string** (SSL mode often required):

   ```text
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

3. Whitelist your **server outbound IP** if the provider requires it (cPanel → **Server Information** for shared IP).

---

## Step 4 — Upload files to cPanel

### 4.1 Choose app root directory

Typical paths:

- `~/bekur-website` (home folder — **recommended**)
- or `~/public_html/app` (only if your host docs require it)

Avoid putting the whole repo inside `public_html` unless you know how to proxy; Node app root should not expose `.env` publicly.

### 4.2 Upload method

**Option 1 — Git (best if SSH + git available)**

```bash
cd ~
git clone https://github.com/YOUR_ORG/bekur-website.git
cd bekur-website
```

Then upload **`.env`** separately (never commit secrets).

**Option 2 — ZIP via File Manager**

1. On your PC, zip the project **excluding**:
   - `node_modules`
   - `.next` (if you will build on server)  
   **Include** `.next` if you built locally (faster deploy).
2. cPanel → **File Manager** → upload ZIP → Extract.

### 4.3 What must exist on the server

Minimum for **pre-built deploy**:

```
bekur-website/
├── .next/              ← from local npm run build
├── public/
├── src/
├── content/
├── package.json
├── package-lock.json
├── next.config.ts
├── ormconfig-cli.ts
├── tsconfig.json
├── tsconfig.seed.json
└── .env                ← create on server only, not in git
```

---

## Step 5 — Create the Node.js application in cPanel

Names vary by host (CloudLinux **Passenger**, **LiteSpeed**, etc.). General steps:

1. cPanel → **Setup Node.js App** → **Create Application**.
2. Settings:

   | Field | Value |
   |-------|--------|
   | Node.js version | **20.x** |
   | Application mode | **Production** |
   | Application root | `/home/USERNAME/bekur-website` |
   | Application URL | your domain or subdomain |
   | Application startup file | `server.js` **or** use npm script (see below) |

3. **Application startup / script**

   Many panels use:

   - **Startup file:** leave default **or** set custom  
   - **Run script:** `npm start`  
   - **Passenger / start command:** `node node_modules/next/dist/bin/next start -p $PORT`

   If the UI asks for **“Application startup file”**, some hosts generate `server.js`. Alternative pattern in app root:

   **`server.js`** (create only if cPanel requires a single file):

   ```js
   const { createServer } = require("http");
   const { parse } = require("url");
   const next = require("next");

   const port = parseInt(process.env.PORT || "3000", 10);
   const hostname = "0.0.0.0";
   const dev = false;
   const app = next({ dev, hostname, port });
   const handle = app.getRequestHandler();

   app.prepare().then(() => {
     createServer((req, res) => {
       const parsedUrl = parse(req.url, true);
       handle(req, res, parsedUrl);
     }).listen(port, hostname, () => {
       console.log(`> Ready on http://${hostname}:${port}`);
     });
   });
   ```

   Then set startup file to `server.js`.  
   **Simpler:** if cPanel supports **“npm start”** as the start command, use that and skip `server.js`.

4. Click **Create**.

---

## Step 6 — Install dependencies on the server

Open **Terminal** (cPanel) or SSH:

```bash
cd ~/bekur-website
source /home/USERNAME/nodevenv/bekur-website/20/bin/activate   # path varies — copy from Node.js App screen
npm ci --omit=dev
```

If you did **not** upload `.next` from your PC:

```bash
npm run build
```

If build fails with **JavaScript heap out of memory**:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

Or build locally and re-upload only `.next`.

---

## Step 7 — Environment variables in cPanel

1. **Setup Node.js App** → your app → **Edit** → **Environment variables** (or **“.env”** button).
2. Add every variable from Step 2 (production values).
3. Critical ones:

   | Variable | Required for |
   |----------|----------------|
   | `NODE_ENV` | `production` |
   | `PORT` | Often set automatically by cPanel — use their value |
   | `DATABASE_URL` | All DB-backed routes |
   | `NEXTAUTH_SECRET` | Admin login |
   | `NEXT_PUBLIC_SITE_URL` | Canonical URLs, metadata |
   | `MINIO_*` | Admin media upload only |

4. **Save** and **Restart** the Node application.

---

## Step 8 — Run database migrations (SSH)

Still in project folder with env loaded:

```bash
cd ~/bekur-website
# activate node venv if needed
export $(grep -v '^#' .env | xargs)   # or rely on cPanel-injected env
npm run migration:run
npm run seed:admin
```

Change `ADMIN_PASSWORD` after first login.

If `migration:run` fails:

- Check `DATABASE_URL` and SSL (`?sslmode=require` for cloud Postgres).
- Ensure IP is allowed on external DB firewall.

---

## Step 9 — Point the domain to the Node app

### Subdomain (easiest)

1. cPanel → **Subdomains** → `app.yourdomain.com` or use main domain in Node.js App wizard.
2. Node.js App usually creates the mapping automatically.

### Main domain on `public_html`

Apache/LiteSpeed often needs to **proxy** to Node:

1. Node.js App UI may offer **“Open website”** / automatic config.
2. If manual, in `public_html/.htaccess` (host-specific — ask support):

   ```apache
   RewriteEngine On
   RewriteRule ^$ http://127.0.0.1:PORT/ [P,L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://127.0.0.1:PORT/$1 [P,L]
   ```

   Replace `PORT` with the port shown in **Setup Node.js App** (not always 3000).

**Do not** mix old PHP `index.php` in `public_html` with the Node proxy — remove conflicting index files.

---

## Step 10 — SSL (HTTPS)

1. cPanel → **SSL/TLS Status** or **Let’s Encrypt**.
2. Issue certificate for `yourdomain.com` and `www`.
3. Force HTTPS: **Domains** → redirect HTTP → HTTPS, or toggle in Node.js App.
4. Set `NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com` and restart Node.

---

## Step 11 — Verify deployment

| Check | URL / action |
|-------|----------------|
| Homepage | `https://yourdomain.com/` |
| Admin login | `https://yourdomain.com/admin/login` |
| API health | `https://yourdomain.com/api/hero` (may return JSON or error if DB empty) |
| Static assets | `https://yourdomain.com/assets/logo/logo-light.svg` |
| Logs | cPanel Node.js App → **stderr.log** / **Application logs** |

**Admin:** log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from seed — then change password in DB or re-seed.

---

## Step 12 — MinIO on shared hosting

cPanel rarely runs MinIO locally. Options:

1. **External MinIO** (same server company object storage, DigitalOcean Spaces, AWS S3 with S3-compatible API) — set `MINIO_*` vars to provider values.
2. **Skip admin uploads** until object storage exists — homepage still works; media APIs will error.
3. **Another VPS** for MinIO only — point `MINIO_ENDPOINT` there.

Public case study images in `public/assets/case-studies/` do **not** need MinIO.

---

## Step 13 — Post-deploy maintenance

### Restart after code update

```bash
cd ~/bekur-website
git pull
npm ci --omit=dev
npm run build
# Restart app from cPanel Node.js UI
```

### Run new migrations

```bash
npm run migration:run
```

### Logs

- Node.js App → **Open log file**
- cPanel → **Errors** (Apache/PHP error log — less useful for Node)

### Cron (optional)

Not required for the website process itself. Use cron only for backups:

```bash
0 3 * * * pg_dump "$DATABASE_URL" > ~/backups/db-$(date +\%F).sql
```

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|----------------|-----|
| 503 / Application error | Node not running | Restart Node app; check startup command |
| Build OOM | Low memory | Build locally; upload `.next` |
| `DATABASE_URL is not set` | Env not injected | Add vars in cPanel; restart |
| Postgres connection refused | Wrong host / firewall | Use `localhost` on cPanel PG; external: SSL + IP allowlist |
| Admin login fails | Wrong `NEXTAUTH_SECRET` or no user | Re-run `seed:admin`; check cookie domain/HTTPS |
| Uploads fail | MinIO unreachable | Fix `MINIO_*` or disable admin uploads |
| CSS/JS 404 | Wrong base path / proxy | Ensure all traffic proxies to Node, not static `public_html` only |
| Old site shows | `public_html` index | Remove default page; configure proxy |
| `next: command not found` | Wrong PATH | Use full path from nodevenv activation |

---

## Environment variable reference

| Variable | Required | Notes |
|----------|----------|--------|
| `NODE_ENV` | Yes | `production` |
| `PORT` | Yes | Set by cPanel often |
| `DATABASE_URL` | Yes* | *Required for admin/API/DB pages |
| `NEXTAUTH_SECRET` | Yes | Admin JWT |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public canonical URL |
| `MINIO_ENDPOINT` | For uploads | |
| `MINIO_PORT` | For uploads | Default `9000` |
| `MINIO_USE_SSL` | For uploads | `true` / `false` |
| `MINIO_ACCESS_KEY` | For uploads | |
| `MINIO_SECRET_KEY` | For uploads | |
| `MINIO_BUCKET` | For uploads | e.g. `bekur-hms` |
| `MINIO_PUBLIC_URL` | For uploads | CDN/public base URL |
| `ADMIN_EMAIL` | Seed only | |
| `ADMIN_PASSWORD` | Seed only | |
| `SMTP_*` | Contact form | |
| `CONTACT_EMAIL` | Contact form | |
| `AUTH_DEBUG` | No | `1` only when debugging |

---

## Simpler alternatives (if cPanel fails)

| Platform | Effort | Fits this stack |
|----------|--------|-----------------|
| **Vercel** + **Neon** | Low | Best for Next.js; move Postgres to Neon |
| **Railway / Render** | Low | Full Node + Postgres + volumes |
| **VPS** (DigitalOcean, Hetzner) | Medium | Full control; PM2 + Nginx |
| **cPanel VPS** | Medium | Same guide, more RAM |

---

## Quick checklist

- [ ] Node 20+ available in cPanel  
- [ ] PostgreSQL ready (`DATABASE_URL` tested)  
- [ ] `npm run build` succeeded (local or server)  
- [ ] Files uploaded; `npm ci --omit=dev` on server  
- [ ] All env vars set in Node.js App  
- [ ] App started / restarted  
- [ ] Domain proxied to Node port  
- [ ] SSL active  
- [ ] `migration:run` + `seed:admin` completed  
- [ ] Homepage and `/admin/login` tested  

---

## Related docs

- [`HANDOVER.md`](./HANDOVER.md) — architecture and what to build next  
- [`site-architecture.md`](./site-architecture.md) — target routes and redirects  

For host-specific screenshots, refer to your provider’s **“Deploy Node.js on cPanel”** article (Namecheap, Hostinger, A2, etc.) — steps map to **Setup Node.js App** + **Run npm start** above.
