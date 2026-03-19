import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; userId: string }) {
    return this.prisma.workout.create({
      data: {
        name: data.name,
        userId: data.userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.workout.findMany({
      where: { userId },
      include: { exercises: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.workout.findUnique({
      where: { id },
      include: { exercises: true },
    });
  }
}