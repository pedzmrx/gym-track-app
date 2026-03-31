import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EditWorkoutForm from "./EditWorkoutForm";

export default async function EditarTreinoPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const { id } = await params;

  const treino = await prisma.workout.findUnique({
    where: { id: id },
    include: { exercises: true }
  });

  if (!treino || treino.userId !== (session.user as any).id) {
    return notFound();
  }

  const todosExercicios = await prisma.exercise.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-44 max-w-md mx-auto">
      <header className="mt-4 mb-8">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 block mb-1">Editor</span>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Ajustar Treino</h1>
      </header>

      <EditWorkoutForm 
        treino={treino} 
        todosExercicios={todosExercicios} 
      />
    </main>
  );
}