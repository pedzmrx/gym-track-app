import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Plus, ChevronRight, Dumbbell, Clock } from "lucide-react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

export default async function TreinosPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  // Busca no Banco de Dados
  const meusTreinos = await prisma.workout.findMany({
    where: {
      userId: (session.user as any).id
    },
    include: {
      exercises: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <main className="min-h-[100dvh] max-w-md mx-auto p-6 flex flex-col gap-6 pb-24">
      <header className="mt-4 text-left">
        <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Meus Treinos</h1>
        <p className="text-zinc-500 text-sm font-medium tracking-wide">Sua rotina personalizada</p>
      </header>

      <Link 
        href="/treinos/novo" 
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg py-5 rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
      >
        <Plus size={24} strokeWidth={3} />
        CRIAR NOVO TREINO
      </Link>

      <section className="flex flex-col gap-4">
        {meusTreinos.length === 0 ? (
          <div className="bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-3xl p-10 text-center">
            <p className="text-zinc-500 font-medium italic">Nenhum treino encontrado.</p>
          </div>
        ) : (
          meusTreinos.map((treino) => (
            <Link 
              key={treino.id} 
              href={`/treinos/${treino.id}`}
              className="bg-zinc-900/50 border border-zinc-800/50 rounded-[2rem] p-6 flex items-center justify-between group hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-black text-zinc-100 italic uppercase tracking-tight">
                  {treino.name}
                </h2>
                
                <div className="flex items-center gap-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <Dumbbell size={14} className="text-blue-500" />
                    <span>{treino.exercises.length} exercícios</span>
                  </div>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center group-hover:bg-blue-600 text-zinc-400 group-hover:text-white transition-all duration-300">
                <ChevronRight size={24} />
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}