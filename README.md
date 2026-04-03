# Gym Track - Gestão de Treinos Inteligente

## Visão Geral
O Gym Track é uma aplicação Full‑stack de alta performance desenvolvida para facilitar a rotina de treinos. O foco do projeto foi integrar o Next.js com NestJS, utilizando o Prisma como ORM para gerenciar o banco de dados PostgreSQL (Supabase). A aplicação conta com autenticação via Google e um dashboard para acompanhamento de evolução, permitindo que o usuário registre e gerencie seus treinos de forma prática e moderna.

## Pré-requisitos
- Node.js (Versão 20 ou superior recomendada).
- PostgreSQL (Via Supabase ou Docker).
- Google Cloud Console (Para as chaves do Google Auth).
- Vercel Account (Para deploy e variáveis de ambiente).


## Instruções de Instalação
1. Clone o repositório para a sua máquina local.
```
git clone https://github.com/pedzmrx/gym-track-app.git
```
2. Instale as dependências (Front e Back).
```
Na pasta do cliente utilize os comandos
cd client && npm install
```
```
Na pasta do servidor
cd ../server && npm install
```

3. Configurações do Prisma
```
Certifique-se de que o seu arquivo .env contém a DATABASE_URL do seu banco Supabase.
```
```
Utilize os comandos
npx prisma generate
npx prisma db push
```

4. Executando o projeto localmente.
```
 No Front-end utilize o comando
 npm run dev
```

## Configuração de Variáveis de Ambiente
Para o pleno funcionamento, você precisará configurar as seguintes chaves no seu arquivo local e na Vercel
- DATABASE_URL: URL de conexão do Supabase.
- NEXTAUTH_URL: URL do seu site
- NEXTAUTH_SECRET: Uma chave aleatória para segurança da sessão.
- GOOGLE_CLIENT_ID: Gerado no Google Cloud Console.
- GOOGLE_CLIENT_SECRET: Gerado no Google Cloud Console.

## Instruções de Uso
- Acesse a aplicação via link da Vercel ou localhost.
- Faça Login com Google para criar seu perfil automaticamente.
- Monte seu Treino: Adicione exercícios, séries e repetições na aba de criação.
- Registre sua Execução: Ao finalizar um treino, salve o progresso para alimentar os gráficos de evolução.
- Acompanhe sua Evolução: Veja o seu progresso semanal e recordes pessoais diretamente no Dashboard.

## Tecnologias Utilizadas
- Front-end: Next.js 15, Tailwind CSS, TypeScript.
- Back-end: NestJS
- Banco de Dados: PostgreSQL via Supabase.
- ORM: Prisma.
- Autenticação: NextAuth.js com Google Provider.
##
Veja o Projeto funcionando online no link abaixo

https://gym-track-app-nxww.vercel.app/




