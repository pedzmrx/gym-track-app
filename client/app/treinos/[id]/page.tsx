import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Play, Edit2, Dumbbell, Hash, Repeat } from "lucide-react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

export default async function DetalhesTreino({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const { id } = await params;

  // Busca o treino no banco
  const treino = await prisma.workout.findUnique({
    where: { id },
    include: { exercises: true },
  });

  // Segurança
  if (!treino || treino.userId !== (session.user as any).id) {
    notFound();
  }

  return (
    <main className="min-h-[100dvh] max-w-md mx-auto p-6 flex flex-col gap-8 pb-32">
      {/* HEADER */}
      <header className="flex items-center justify-between mt-4">
        <Link href="/treinos" className="p-2 bg-zinc-900 rounded-full text-zinc-400">
          <ArrowLeft size={24} />
        </Link>
        <button className="p-2 bg-zinc-900 rounded-full text-zinc-400">
          <Edit2 size={20} />
        </button>
      </header>

      <div>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          {treino.name}
        </h1>
        <p className="text-blue-500 font-bold text-sm uppercase tracking-widest mt-1">
          {treino.exercises.length} Exercícios totais
        </p>
      </div>

      {/* LISTA DE EXERCÍCIOS */}
      <section className="flex flex-col gap-4">
        {treino.exercises.map((ex) => (
          <div 
            key={ex.id} 
            className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                <Dumbbell size={20} />
              </div>
              <h3 className="text-lg font-bold text-zinc-100">{ex.name}</h3>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 bg-zinc-950/50 rounded-2xl p-3 border border-zinc-800/50 flex items-center gap-3">
                <Hash size={16} className="text-zinc-500" />
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-600">Séries</p>
                  <p className="text-white font-bold">{ex.sets}</p>
                </div>
              </div>

              <div className="flex-1 bg-zinc-950/50 rounded-2xl p-3 border border-zinc-800/50 flex items-center gap-3">
                <Repeat size={16} className="text-zinc-500" />
                <div>
                  <p className="text-[10px] uppercase font-black text-zinc-600">Reps</p>
                  <p className="text-white font-bold">{ex.reps}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="fixed bottom-24 left-0 w-full px-6 flex justify-center">
        <Link 
          href={`/treinos/${treino.id}/executar`}
          className="w-full max-w-md bg-white text-black font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all uppercase italic text-center"
        >
          <Play size={24} fill="black" />
          Começar Treino
        </Link>
      </div>
    </main>
  );
}