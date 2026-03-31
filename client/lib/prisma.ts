import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = "postgresql://admin:password123@localhost:5432/gym_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter } as any);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;