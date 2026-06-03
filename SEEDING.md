# Database Seeding Guide

This guide explains the different seed scripts available and how to use them safely.

## Available Seed Scripts

### 🌱 `npm run seed` (Recommended)

**File**: `src/db/seed-safe.ts`

This is the **recommended** seed script that:

- ✅ Only uses entities that exist in the main DataSource
- ✅ Handles missing JSON files gracefully with warnings
- ✅ Checks for existing data before creating new records
- ✅ Provides clear progress feedback
- ✅ Creates essential data (admin user, contact info)
- ✅ Seeds optional data from JSON files if available

**What it creates:**

- Admin user (`admin@bekur.com` / password from `ADMIN_PASSWORD` env var)
- Contact information (email, phone, LinkedIn, location)
- Services, companies, team members, testimonials, features, values (from JSON files)

### 👤 `npm run seed:admin`

**File**: `src/db/create-admin.ts`

Creates only the admin user. Useful when you just need admin access.

### 📄 `npm run seed:json`

**File**: `src/db/seed-from-json.ts`

Legacy script that seeds data from JSON files only.

### 🔧 `npm run seed:legacy`

**File**: `src/db/seed.ts`

Original seed script (may have issues with missing entities).

## Environment Variables

Make sure you have these in your `.env` file:

```env
# Database connection
DATABASE_URL=mysql://username:password@localhost:3306/bekur_website

# Admin credentials (optional - defaults to changeme123)
ADMIN_PASSWORD=your_secure_password
```

## Usage Examples

### First-time setup:

```bash
# Run the main seed script
npm run seed
```

### Just create admin user:

```bash
# Only create admin user
npm run seed:admin
```

### Reset admin password:

```bash
# Update ADMIN_PASSWORD in .env, then run:
npm run seed:admin
```

## Error Handling

The improved seed script (`npm run seed`) handles common issues:

1. **Missing JSON files**: Shows warnings but continues
2. **Existing data**: Checks before creating to avoid duplicates
3. **Missing entities**: Only uses entities available in the main DataSource
4. **Database errors**: Provides clear error messages

## Troubleshooting

### "EntityMetadataNotFoundError"

- This means an entity is not included in the main DataSource
- Use `npm run seed` instead of `npm run seed:legacy`

### "Field doesn't have a default value"

- The entity requires a field that wasn't provided
- Check the entity definition and provide required fields

### "Cannot find module"

- Missing JSON data files
- The script will show warnings and continue without that data

## Admin Access

After running the seed script, you can access the admin panel:

- **URL**: `http://localhost:3000/admin`
- **Email**: `admin@bekur.com`
- **Password**: Value from `ADMIN_PASSWORD` env var (default: `changeme123`)

## Best Practices

1. **Always use `npm run seed`** for new setups
2. **Set a secure `ADMIN_PASSWORD`** in your `.env` file
3. **Run seed scripts in development only** - never in production
4. **Check the output** for any warnings or errors
5. **Keep JSON data files** in `src/data/` for optional seeding

## File Structure

```
src/db/
├── seed-safe.ts          # ✅ Recommended seed script
├── create-admin.ts       # Admin user only
├── seed.ts              # Legacy (may have issues)
├── seed-from-json.ts    # JSON data only
└── migrations/          # Database migrations

src/data/                # JSON data files (optional)
├── hero.json
├── features.json
├── services.json
├── team.json
├── testimonials.json
├── companies.json
└── values.json
```
