import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
// See: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reload-issues

declare global {
  // allow global prisma var on the NodeJS global type
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const client = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = client

export default client
