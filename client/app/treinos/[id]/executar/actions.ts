"use server";

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

export async function registrarLogAction(workoutId: string, userId: string) {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool as any);
  
  const prisma = new PrismaClient({ adapter });

  try {
    if (!workoutId || !userId) {
      return { success: false, error: "IDs ausentes" };
    }

    const log = await prisma.workoutLog.create({
      data: {
        workoutId: workoutId,
        workoutName: "Treino Finalizado",
        userId: userId,
      },
    });

    return { success: true, id: log.id };
  } catch (error: any) {
    console.error("ERRO NO BANCO:", error.message);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

export async function buscarExerciciosAction(workoutId: string) {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool as any);
  const prisma = new PrismaClient({ adapter });

  try {
    const exercicios = await prisma.exercise.findMany({
      where: { workoutId },
    });
    return { success: true, exercicios };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}