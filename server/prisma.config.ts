import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: "postgresql://admin:password123@localhost:5432/gym_db?schema=public",
  },
});