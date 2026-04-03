import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; 

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const treino = await prisma.workout.findUnique({
      where: { 
        id: id,
        userId: (session.user as any).id 
      },
      include: {
        exercises: true
      }
    });

    if (!treino) {
      return NextResponse.json({ error: "Treino não encontrado" }, { status: 404 });
    }

    return NextResponse.json(treino);
  } catch (error) {
    console.error("Erro na API de treino:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}