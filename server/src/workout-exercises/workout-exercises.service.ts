import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WorkoutExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; order: number; workoutId: string; exerciseId: string }) {
    return this.prisma.workoutExercise.create({
      data: {
        name: data.name,
        order: data.order,
        workoutId: data.workoutId,
        exerciseId: data.exerciseId,
      },
    });
  }

  async findByWorkout(workoutId: string) {
    return this.prisma.workoutExercise.findMany({
      where: { workoutId },
      orderBy: { order: 'asc' },
    });
  }
}