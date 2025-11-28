import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
// See: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reload-issues

declare global {
  // allow global prisma var on the NodeJS global type
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Try to create the real Prisma client. If the generated client is missing
// the constructor will throw (common when @prisma/client wasn't generated).
// In that case we provide a small runtime fallback so the app can still run
// (returns data from local JSON / seed data) without requiring `prisma generate`.
let client: any
try {
  client = global.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') global.prisma = client
} catch (err) {
  // Prisma client not available / not generated -> create a fallback stub
  // that implements the small subset our app expects (perfume.findMany/findUnique)
  // This fallback uses adminProducts.json first, then src/data/perfumes.ts as seed.
  // NOTE: This is intentionally minimal — if you plan to use a DB, run `prisma generate`.
  /* eslint-disable @typescript-eslint/no-var-requires */
  const fs = require('fs')
  const path = require('path')
  let admin: any[] = []
  try {
    const DB_FILE = path.join(process.cwd(), 'src', 'data', 'adminProducts.json')
    const raw = fs.readFileSync(DB_FILE, 'utf8') || '[]'
    admin = JSON.parse(raw)
  } catch (e) {
    admin = []
  }

  // Import the seed perfumes collection (static TS module)
  let seed: any[] = []
  try {
    // require is used to avoid top-level ESM import resolution in environments
    seed = require('../data/perfumes').perfumes || []
  } catch (e) {
    seed = []
  }

  const merged = [...admin, ...seed]

  const makeFindMany = () => async (opts: any = {}) => {
    let out = merged.slice()
    // simple where.{category}
    if (opts.where && opts.where.category) {
      out = out.filter((p) => String(p.category) === String(opts.where.category))
    }
    // filter id not
    if (opts?.where?.id?.not) {
      out = out.filter((p) => p.id !== opts.where.id.not)
    }
    // simple ordering and take
    if (opts.orderBy && opts.orderBy.createdAt && opts.orderBy.createdAt === 'desc') {
      // if createdAt exists, sort by it, otherwise keep array order
      out.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0))
    }
    if (opts.take) out = out.slice(0, opts.take)
    return out
  }

  const makeFindUnique = () => async (opts: any = {}) => {
    if (!opts || !opts.where) return null
    const id = String(opts.where.id ?? opts.where?.id)
    return merged.find((p) => String(p.id) === id) || null
  }

  client = {
    // expose only the subset used by this app
    perfume: {
      findMany: makeFindMany(),
      findUnique: makeFindUnique(),
    },
  }
}

export default client
