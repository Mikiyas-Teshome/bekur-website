# Bekur Website CMS Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database (MySQL)
DATABASE_URL=mysql://username:password@localhost:3306/bekur_website

# MinIO S3-compatible storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
MINIO_BUCKET=bekur-media
MINIO_USE_SSL=false
MINIO_PUBLIC_URL=http://localhost:9000

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# Admin (for initial seed)
ADMIN_EMAIL=admin@bekur.com
ADMIN_PASSWORD=changeme123
```

## Database Setup

1. Install MySQL and create a database named `bekur_website`
2. Update the `DATABASE_URL` in your `.env.local` file
3. Run the seed script to populate the database:

```bash
npm run seed
```

## MinIO Setup

1. Install and run MinIO server
2. Create a bucket named `bekur-media`
3. Update the MinIO credentials in your `.env.local` file

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the admin panel at: `http://localhost:3000/admin`
   - Email: admin@bekur.com
   - Password: changeme123

## Admin Panel Features

- **Hero Section**: Edit main headline, descriptions, video, client avatars, social platforms
- **Features**: Manage homepage feature cards
- **Services**: Manage service offerings
- **Statistics**: Edit company statistics
- **Team**: Manage team members
- **Testimonials**: Edit client testimonials
- **Values**: Manage company values
- **Blogs**: Full CMS for blog posts (coming soon)
- **Portfolio**: Full CMS for portfolio projects (coming soon)
- **Media**: File upload and management (coming soon)

## Public API Endpoints

The public site will fetch data from these API endpoints:
- `/api/public/hero`
- `/api/public/features`
- `/api/public/services`
- `/api/public/statistics`
- `/api/public/team`
- `/api/public/testimonials`
- `/api/public/values`
- `/api/public/blogs`
- `/api/public/projects`

All endpoints return data in the same format as the original JSON files to maintain compatibility with existing components.
