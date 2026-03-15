import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Plus, ChevronRight, Dumbbell, Clock } from "lucide-react";
import Link from "next/link";

export default async function TreinosPage() {
  const session = await getServerSession(authOptions);

  // Proteção de rota
  if (!session) {
    redirect("/");
  }

  // Dados falsos só para montarmos o visual por enquanto
  const meusTreinos = [
    { id: 1, nome: "Treino A - Peito e Tríceps", exercicios: 6, tempoEstimado: "50 min" },
    { id: 2, nome: "Treino B - Costas e Bíceps", exercicios: 5, tempoEstimado: "45 min" },
    { id: 3, nome: "Treino C - Pernas Completas", exercicios: 7, tempoEstimado: "60 min" },
  ];

  return (
    <main className="min-h-[100dvh] max-w-md mx-auto p-6 flex flex-col gap-6">
      
      {/* CABEÇALHO DA PÁGINA */}
      <header className="flex items-center justify-between w-full mt-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Meus Treinos</h1>
          <p className="text-zinc-400 text-sm mt-1">Gerencie suas rotinas</p>
        </div>
      </header>

      {/* CRIAR NOVO TREINO */}
      <Link 
        href="/treinos/novo" 
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
      >
        <Plus size={24} strokeWidth={3} />
        Criar Novo Treino
      </Link>

      {/* LISTA DE TREINOS SALVOS */}
      <section className="flex flex-col gap-4 mt-2">
        {meusTreinos.map((treino) => (
          <Link 
            key={treino.id} 
            href={`/treinos/${treino.id}`}
            className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-5 flex items-center justify-between backdrop-blur-md hover:bg-zinc-800/50 transition-colors group"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-zinc-100">{treino.nome}</h2>
              
              <div className="flex items-center gap-3 text-zinc-400 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <Dumbbell size={16} className="text-blue-500" />
                  <span>{treino.exercicios} ex.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-blue-500" />
                  <span>{treino.tempoEstimado}</span>
                </div>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white text-zinc-400 transition-all">
              <ChevronRight size={20} />
            </div>
          </Link>
        ))}
      </section>

    </main>
  );
}