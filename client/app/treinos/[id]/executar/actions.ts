"use server";

import { prisma } from "@/lib/prisma"; 

export async function registrarLogAction(workoutId: string, userId: string) {
  
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
  } 
}

export async function buscarExerciciosAction(workoutId: string) {
  try {
    const exercicios = await prisma.exercise.findMany({
      where: { workoutId },
    });
    return { success: true, exercicios };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}