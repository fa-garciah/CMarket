CMarket (Community Market) is a web application designed to facilitate peer-to-peer buying and selling within defined communities — such as university campuses, residential complexes, or organizations.
Instead of relying on generic marketplaces, CMarket connects people who already share a common space or affiliation, making transactions more trustworthy, local, and relevant. Members of a community (e.g., students at Anáhuac Cancún) can list products, browse listings from peers, and coordinate exchanges — all within their own closed community environment.

## What you need installed

- Node.js 24 or newer. The Dockerfile uses `node:24-slim`, so that is the safest baseline.
- npm or pnpm. The repo has a `pnpm-lock.yaml`, but the container build uses `npm ci`.
- PostgreSQL 15+ locally, or Docker Compose if you want to run the database in containers.
- Git.

## External services you must have ready

These are the services the app expects when you run it locally:

- PostgreSQL database connection string.
- NextAuth credentials: `AUTH_URL`, `NEXTAUTH_URL`, and `AUTH_SECRET`.
- Resend API key for verification emails.
- Cloudinary credentials for product image uploads.

Optional, but useful if you want the full production setup:

- Sentry auth token for source map upload and monitoring.
- Dokploy webhook URL for deployment notifications.
- A Bella Baxter API key if you build the Docker image, because the Dockerfile uses it as a build secret.

## Environment variables

Start from [.env.example](.env.example) and fill in the values below.

Required for the app to start:

- `AUTH_URL`
- `NEXTAUTH_URL`
- `AUTH_SECRET`
- `DATABASE_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional environment variables:

- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_SECRET`  
	Keep this set to the same value as `AUTH_SECRET` if you want the legacy variable available.
- `SENTRY_ENVIRONMENT`
- `SENTRY_AUTH_TOKEN`
- `DOKPLOY_WEBHOOK_URL`

## Local setup

1. Install dependencies with `npm install` or `pnpm install`.
2. Create a local `.env` file from [.env.example](.env.example) and fill in the variables above.
3. Start PostgreSQL.
4. Prepare Prisma and seed the lookup tables:

	```bash
	npx prisma generate
	npx prisma db push
	npx prisma db seed
	```

5. Run the app:

	```bash
	npm run dev
	```

## Docker setup

If you want the containerized stack instead of running services manually, use:

```bash
docker compose up --build
```

That starts the Next.js app, a Postgres container, and nginx. The Docker build also expects the Bella Baxter API key secret.

## Notes

- The database schema is defined in [prisma/schema.prisma](prisma/schema.prisma) and the initial seed data lives in [prisma/seed.ts](prisma/seed.ts).
- Product image uploads require Cloudinary, and verification emails require Resend.
- If you only want to verify the app locally without uploads or email flows, those features still need valid env values because the app imports them during runtime.