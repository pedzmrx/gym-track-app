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

    const todosTreinos = await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    });

    const indexAtual = todosTreinos.findIndex(t => t.id === workoutId);
    const proximoTreino = todosTreinos[indexAtual + 1] || todosTreinos[0];

    revalidatePath("/treinos");
    revalidatePath("/dashboard"); 
    
    return { 
      success: true, 
      proximoTreino: proximoTreino ? proximoTreino.name : "Novo Treino" 
    };
  } catch (error) {
    console.error("Erro ao registrar log completo:", error);
    return { success: false };
  }
}

export async function buscarExerciciosAction(workoutId: string) {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: { 
        exercises: {
          include: {
            logEntries: {
              orderBy: { workoutLog: { completedAt: 'desc' } },
              take: 1 
            }
          }
        } 
      }
    });

    const exerciciosComCarga = workout?.exercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      ultimoPeso: ex.logEntries[0]?.weight || "", 
      ultimasReps: ex.logEntries[0]?.reps || ex.reps 
    })) || [];

    return { 
      success: true, 
      exercicios: exerciciosComCarga, 
      nomeTreino: workout?.name || "" 
    };
  } catch (error) {
    console.error("Erro ao buscar exercícios com carga:", error);
    return { success: false };
  }
}

export async function getDashboardStats(userId: string) {
  try {
    const logsRecentas = await prisma.workoutLog.findMany({
      where: {
        userId: userId,
        completedAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
      },
    });

    const treinos = await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { exercises: true } } }
    });

    const ultimoLog = await prisma.workoutLog.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    let proximoTreino = treinos[0] || null;
    if (ultimoLog && treinos.length > 0) {
      const indexUltimo = treinos.findIndex(t => t.id === ultimoLog.workoutId);
      proximoTreino = treinos[(indexUltimo + 1) % treinos.length];
    }

    return { 
      logsRecentas, 
      proximoTreino, 
      quantidadeTreinos: treinos.length 
    };
  } catch (error) {
    return { logsRecentas: [], proximoTreino: null, quantidadeTreinos: 0 };
  }
}

export async function getUserTreinos(userId: string) {
  try {
    const treinos = await prisma.workout.findMany({
      where: { userId: userId },
      include: {
        exercises: true,
        _count: { select: { exercises: true } }
      },
      orderBy: { createdAt: 'desc' }
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
    await prisma.exercise.delete({ where: { id: exerciseId } });
    revalidatePath("/treinos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir exercício:", error);
    return { success: false };
  }
}

export async function deleteWorkout(workoutId: string) {
  try {
    
    await prisma.workout.delete({ where: { id: workoutId } });

    revalidatePath("/treinos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir treino:", error);
    return { success: false };
  }
}

export async function getVolumeStats(userId: string) {
  try {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const logs = await prisma.workoutLog.findMany({
      where: {
        userId,
        completedAt: { gte: seteDiasAtras }
      },
      include: { entries: true },
      orderBy: { completedAt: 'asc' }
    }); 

    const stats = logs.map(log => {
      const volumeTotal = log.entries.reduce((acc, entry) => {
        return acc + (Number(entry.weight || 0) * Number(entry.reps || 0));
      }, 0);

      return {
        dia: log.completedAt.toLocaleDateString('pt-BR', { weekday: 'short' }),
        volume: volumeTotal
      };
    });

    return { success: true, stats };
  } catch (error) {
    return { success: false, stats: [] };
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
    console.error("Erro ao buscar detalhes do log:", error);
    return { success: false };
  }
}

export async function getPersonalRecords(userId: string) {
  try {
    const recordePeso = await prisma.logEntry.findFirst({
      where: {
        workoutLog: { userId: userId }
      },
      orderBy: { weight: 'desc' },
      include: { exercise: true }
    });

    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const logsSemana = await prisma.workoutLog.findMany({
      where: {
        userId,
        completedAt: { gte: seteDiasAtras }
      },
      include: { entries: true }
    });

    const volumeTotalSemana = logsSemana.reduce((acc, log) => {
      return acc + log.entries.reduce((sum, entry) => sum + (Number(entry.weight) * Number(entry.reps)), 0);
    }, 0);

    return { 
      success: true, 
      maiorPeso: recordePeso?.weight || "0",
      nomeExercicio: recordePeso?.exercise.name || "Nenhum",
      volumeTotal: volumeTotalSemana
    };
  } catch (error) {
    console.error("Erro ao buscar recordes:", error);
    return { success: false };
  }
}

export async function getHomeData(userId: string) {
  try {
    const treinos = await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    const ultimoLog = await prisma.workoutLog.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    let proximoTreino = treinos[0]; 

    if (ultimoLog && treinos.length > 0) {
      const indexUltimo = treinos.findIndex(t => t.id === ultimoLog.workoutId);
      proximoTreino = treinos[(indexUltimo + 1) % treinos.length];
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
    return { success: false };
  }
}

export async function updateWorkout(workoutId: string, name: string, exerciseNames: string[]) {
  try {
    const exerciseConnections = await Promise.all(
      exerciseNames.map(async (exName) => {
        let exercise = await prisma.exercise.findFirst({
          where: { name: exName }
        });

        if (!exercise) {
          exercise = await prisma.exercise.create({
            data: { 
              name: exName,
              sets: "0",           
              reps: "0",          
              workoutId: workoutId 
            }
          });
        }

        return { id: exercise.id };
      })
    );

    await prisma.workout.update({
      where: { id: workoutId },
      data: {
        name: name,
        exercises: {
          set: exerciseConnections 
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error("ERRO_AO_ATUALIZAR_TREINO:", error);
    return { success: false };
  }
}