"use server"

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from "next/cache";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


export async function getDashboardStats(userId: string) {
  try {
    const logsRecentas = await prisma.workoutLog.findMany({
      where: {
        userId: userId,
        completedAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
      orderBy: { completedAt: "desc" },
    });

    const ultimosLogs = await prisma.workoutLog.findMany({
      where: { userId: userId },
      take: 5,
      orderBy: { completedAt: "desc" },
      include: {
        workout: true,
      },
    });

    return { logsRecentas, ultimosLogs };
  } catch (error) {
    console.error("Erro ao buscar stats:", error);
    return { logsRecentas: [], ultimosLogs: [] };
  }
}


export async function getUserTreinos(userId: string) {
  try {
    const treinos = await prisma.workout.findMany({
      where: {
        userId: userId,
      },
      include: {
        exercises: true,
        _count: {
          select: { exercises: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return treinos;
  } catch (error) {
    console.error("Erro ao buscar treinos:", error);
    return [];
  }
}


export async function createWorkout(userId: string, nome: string, exercicios: { nome: string, series: number, repeticoes: string }[]) {
  try {
    const novoTreino = await prisma.workout.create({
      data: {
        userId: userId,
        name: nome,
        exercises: {
          create: exercicios.map(ex => ({
            name: ex.nome,
            sets: String(ex.series),
            reps: ex.repeticoes
          }))
        }
      }
    });

    revalidatePath("/treinos");
    return { success: true, id: novoTreino.id };
  } catch (error) {
    console.error("Erro ao criar treino:", error);
    return { success: false, error: "Falha ao salvar no banco" };
  }
}


export async function deleteExercise(exerciseId: string) {
  try {
    await prisma.exercise.delete({
      where: { id: exerciseId }
    });
    revalidatePath("/treinos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir exercício:", error);
    return { success: false };
  }
}


export async function deleteWorkout(workoutId: string) {
  try {
    await prisma.exercise.deleteMany({
      where: { workoutId: workoutId }
    });
    
    await prisma.workout.delete({
      where: { id: workoutId }
    });

    revalidatePath("/treinos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir treino:", error);
    return { success: false };
  }
}