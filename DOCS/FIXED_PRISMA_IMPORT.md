## Fix: Missing Prisma client import resolved

What I changed
- Added `src/lib/prisma.ts` which exports a default PrismaClient instance and guards against creating multiple client instances during development hot reloads.

Why this fixes the build error
- The project previously imported `@/lib/prisma` but `src/lib/prisma.ts` was missing — that caused the "Module not found: Can't resolve '@/lib/prisma'" build error. Creating the file resolves the missing module.

Next recommended steps
- Run `npm i @prisma/client prisma` (if the package.json does not include them) and run `prisma generate` if you manage the database schema with Prisma.
- The codebase still contains TypeScript type errors (category/price types) — address those separately to complete a clean compile.
