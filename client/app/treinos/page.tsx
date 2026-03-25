import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Plus, ChevronRight, Dumbbell, Activity } from "lucide-react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Interfaces de Tipagem
interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface CustomSession {
  user: CustomUser;
}

// 2. Configuração do Prisma (Singleton)
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function TreinosPage() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;

  if (!session?.user) {
    redirect("/");
  }

  const userId = session.user.id;

  const meusTreinos = await prisma.workout.findMany({
    where: { userId: userId },
    include: { exercises: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-44 max-w-md mx-auto relative overflow-x-hidden">
      
      {/* HEADER */}
      <header className="mt-4 mb-8 flex justify-between items-center px-1">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 block mb-1">Biblioteca</span>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Meus Treinos</h1>
        </div>
        <Link 
          href="/treinos/novo"
          className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-90 transition-all"
        >
          <Plus size={24} strokeWidth={3} className="text-white" />
        </Link>
      </header>

      {/* LISTA DE TREINOS */}
      <section className="flex flex-col gap-6">
        {meusTreinos.length === 0 ? (
          <div className="bg-zinc-900/20 border-2 border-dashed border-zinc-900 rounded-[2.5rem] p-12 text-center flex flex-col items-center gap-4">
            <Activity size={40} className="text-zinc-800" />
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest italic">
              Nenhum treino encontrado
            </p>
          </div>
        ) : (
          meusTreinos.map((treino) => (
            <Link 
              key={treino.id} 
              href={`/treinos/${treino.id}`}
              className="relative bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 overflow-hidden group active:scale-[0.98] transition-all hover:border-blue-600/30"
            >
              <div className="relative z-10">
                <span className="bg-zinc-800/50 text-[9px] font-black px-3 py-1 rounded-full text-zinc-400 uppercase tracking-widest mb-4 inline-block">
                  Rotina
                </span>

                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <h2 className="text-2xl font-black italic uppercase text-zinc-100 group-hover:text-blue-500 transition-colors leading-tight">
                      {treino.name}
                    </h2>
                    
                    <div className="flex items-center gap-4 mt-3 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Dumbbell size={14} className="text-blue-600" />
                        <span>{treino.exercises.length} exercícios</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center group-hover:bg-blue-600 text-zinc-500 group-hover:text-white transition-all shadow-lg">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>

              {/* Ícone de Fundo Decorativo */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Dumbbell size={120} strokeWidth={4} />
              </div>
            </Link>
          ))
        )}
      </section>

    </main>
  );
}