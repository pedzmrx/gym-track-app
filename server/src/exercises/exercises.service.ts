import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; sets: string; reps: string; workoutId: string }) {
    return this.prisma.exercise.create({
      data: {
        name: data.name,
        sets: data.sets,
        reps: data.reps,
        workoutId: data.workoutId,
      },
    });
  }
}