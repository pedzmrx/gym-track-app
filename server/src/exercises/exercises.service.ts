import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; muscleGroup: string }) {
    return this.prisma.exercise.create({
      data: {
        name: data.name,
        muscleGroup: data.muscleGroup,
      },
    });
  }

  async findAll() {
    return this.prisma.exercise.findMany({
      orderBy: { name: 'asc' },
    });
  }
}