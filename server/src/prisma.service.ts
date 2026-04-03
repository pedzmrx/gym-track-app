import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
    (this as any)._url = process.env.DATABASE_URL;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Conectado ao Supabase com sucesso (NestJS)');
    } catch (error) {
      console.error('❌ Erro ao conectar no Supabase:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}