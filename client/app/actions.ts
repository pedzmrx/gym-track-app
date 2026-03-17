export async function getDashboardStats(userId: string) {
  try {
    const totalLogs = await prisma.workoutLog.count({ where: { userId } });
    
    // Busca logs dos últimos 7 dias para o mapa de cons.
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const logsRecentas = await prisma.workoutLog.findMany({
      where: { 
        userId,
        completedAt: { gte: seteDiasAtras }
      },
      select: { completedAt: true }
    });

    const ultimosLogs = await prisma.workoutLog.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 3
    });

    return { totalLogs, ultimosLogs, logsRecentas };
  } catch (error) {
    return { totalLogs: 0, ultimosLogs: [], logsRecentas: [] };
  }
}