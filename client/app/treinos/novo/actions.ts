"use server";

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);

const prisma = new PrismaClient({ adapter });

export async function salvarTreinoAction(nome: string, exercicios: any[], userId: string) {
  try {
    console.log("🚀 Iniciando salvamento do treino...");

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
    
    console.log("✅ Treino salvo com ID:", novoTreino.id);
    return { success: true };
  } catch (error: any) {
    console.error("❌ ERRO NO PRISMA:", error);
    return { success: false, error: error.message };
  }
}