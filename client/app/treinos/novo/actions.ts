"use server";

import { prisma } from "@/lib/prisma"; 

export async function salvarTreinoAction(nome: string, exercicios: any[], userId: string) {
  try {
    console.log("🚀 Iniciando salvamento do treino no Supabase...");

    if (!userId) throw new Error("Usuário não identificado na sessão.");

    const novoTreino = await prisma.workout.create({
      data: {
        name: nome,
        userId: userId,
        exercises: {
          create: exercicios.map(ex => ({
            name: ex.nome || "Exercício sem nome",
            sets: String(ex.series || "0"),
            reps: String(ex.repeticoes || "0")
          }))
        }
      }
    });
    
    console.log("✅ Treino salvo com sucesso! ID:", novoTreino.id);
    return { success: true };
  } catch (error: any) {
    console.error("❌ ERRO NO PRISMA AO SALVAR:", error);
    return { success: false, error: error.message };
  }
}