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


export async function registrarTreinoCompleto(workoutId: string, userId: string, nomeTreino: string, logTreino: any[]) {
  try {
    await prisma.workoutLog.create({
      data: {
        workoutId,
        userId,
        workoutName: nomeTreino,
        completedAt: new Date(),
        entries: {
          create: logTreino.map((item) => ({
            exerciseId: item.exerciseId,
            setNumber: item.setNumber,
            weight: String(item.peso),
            reps: String(item.reps),
          })),
        },
      },
    });

    const treinos = await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    let proximoTreinoNome = "Descanso ou Novo Treino";

    if (treinos.length > 0) {
      const indexAtual = treinos.findIndex(t => t.id === workoutId);
      const proximo = treinos[(indexAtual + 1) % treinos.length];
      proximoTreinoNome = proximo.name;
    }

    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true, proximoTreinoNome };
  } catch (error) {
    console.error("Erro ao registrar treino:", error);
    return { success: false };
  }
}

export async function getLogDetalhes(logId: string) {
  try {
    const log = await prisma.workoutLog.findUnique({
      where: { id: logId },
      include: {
        entries: {
          include: { exercise: true }
        }
      }
    });
    return { success: true, log };
  } catch (error) {
    return { success: false };
  }
}

export async function getEvolutionData(userId: string) {
  try {
    const logs = await prisma.workoutLog.findMany({
      where: { userId },
      select: { completedAt: true },
      orderBy: { completedAt: 'desc' }
    });

    const datasTreino = Array.from(new Set(
      logs.map(log => new Date(log.completedAt).toISOString().split('T')[0])
    ));

    let streak = 0;
    const hoje = new Date().toISOString().split('T')[0];
    const ontem = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];

    let dataVerificacao = datasTreino.includes(hoje) ? hoje : (datasTreino.includes(ontem) ? ontem : null);

    if (dataVerificacao) {
      let dataCursor = new Date(dataVerificacao);
      while (datasTreino.includes(dataCursor.toISOString().split('T')[0])) {
        streak++;
        dataCursor.setDate(dataCursor.getDate() - 1);
      }
    }

    return { 
      success: true, 
      datasTreino, 
      streakAtual: streak,
      totalTreinos: logs.length
    };
  } catch (error) {
    return { success: false, streakAtual: 0, datasTreino: [] };
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
    revalidatePath("/");
    return { success: true, id: novoTreino.id };
  } catch (error) {
    return { success: false, error: "Falha ao salvar" };
  }
}

export async function updateWorkout(workoutId: string, name: string, exercises: { name: string, sets: string, reps: string }[]) {
  try {
    const exerciseConnections = await Promise.all(
      exercises.map(async (ex) => {
        let exercise = await prisma.exercise.findFirst({ where: { name: ex.name } });
        if (exercise) {
          exercise = await prisma.exercise.update({
            where: { id: exercise.id },
            data: { sets: ex.sets, reps: ex.reps }
          });
        } else {
          exercise = await prisma.exercise.create({
            data: { name: ex.name, sets: ex.sets, reps: ex.reps, workoutId }
          });
        }
        return { id: exercise.id };
      })
    );
    await prisma.workout.update({
      where: { id: workoutId },
      data: { name, exercises: { set: exerciseConnections } }
    });
    revalidatePath(`/treinos/${workoutId}`);
    revalidatePath("/treinos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteWorkout(workoutId: string) {
  try {
    await prisma.workout.delete({ where: { id: workoutId } });
    revalidatePath("/treinos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteExercise(exerciseId: string) {
  try {
    await prisma.exercise.delete({ where: { id: exerciseId } });
    revalidatePath("/treinos");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}


export async function getHomeData(userId: string) {
  try {
    const treinos = await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: { exercises: true }
    });

    const ultimoLog = await prisma.workoutLog.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    let proximoTreino = null;

    if (treinos.length > 0) {
      if (!ultimoLog) {
        proximoTreino = treinos[0];
      } else {
        const indexUltimo = treinos.findIndex(t => t.id === ultimoLog.workoutId);
        proximoTreino = treinos[(indexUltimo + 1) % treinos.length];
      }
    }

    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    const treinosNaSemana = await prisma.workoutLog.count({
      where: { userId, completedAt: { gte: seteDiasAtras } }
    });

    return { 
      success: true, 
      proximoTreino, 
      treinosNaSemana 
    };
  } catch (error) {
    console.error("Erro ao buscar dados da Home:", error);
    return { success: false, proximoTreino: null };
  }
}

export async function getDashboardStats(userId: string) {
  try {
    const logsRecentas = await prisma.workoutLog.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 10
    });
    return { logsRecentas };
  } catch (error) {
    return { logsRecentas: [] };
  }
}

export async function getPersonalRecords(userId: string) {
  try {
    const recordePeso = await prisma.logEntry.findFirst({
      where: { workoutLog: { userId } },
      orderBy: { weight: 'desc' },
      include: { exercise: true }
    });
    return { 
      success: true, 
      maiorPeso: recordePeso?.weight || "0",
      nomeExercicio: recordePeso?.exercise.name || "Nenhum"
    };
  } catch (error) {
    return { success: false };
  }
}

export async function getUserTreinos(userId: string) {
  try {
    return await prisma.workout.findMany({
      where: { userId },
      include: { exercises: true, _count: { select: { exercises: true } } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    return [];
  }
}

export async function buscarExerciciosAction(workoutId: string) {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: { exercises: { include: { logEntries: { orderBy: { workoutLog: { completedAt: 'desc' } }, take: 1 } } } }
    });
    const exerciciosComCarga = workout?.exercises.map(ex => ({
      id: ex.id, name: ex.name, sets: ex.sets, reps: ex.reps,
      ultimoPeso: ex.logEntries[0]?.weight || "",
      ultimasReps: ex.logEntries[0]?.reps || ex.reps 
    })) || [];
    return { success: true, exercicios: exerciciosComCarga, nomeTreino: workout?.name || "" };
  } catch (error) {
    return { success: false };
  }
}