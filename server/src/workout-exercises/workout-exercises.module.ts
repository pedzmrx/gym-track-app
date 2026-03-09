import { Module } from '@nestjs/common';
import { WorkoutExercisesService } from './workout-exercises.service';
import { WorkoutExercisesController } from './workout-exercises.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [WorkoutExercisesController],
  providers: [WorkoutExercisesService, PrismaService],
})
export class WorkoutExercisesModule {}