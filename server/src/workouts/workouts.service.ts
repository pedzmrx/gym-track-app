import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; description?: string; userId: string }) {
    return this.prisma.workout.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
      },
    });
  }

  async findAll() {
    return this.prisma.workout.findMany({
      include: {
        exercises: {
          include: {
            exercise: true 
          }
        }
      }
    });
  }
}