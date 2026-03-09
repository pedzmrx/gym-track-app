import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { WorkoutExercisesModule } from './workout-exercises/workout-exercises.module';

@Module({
  imports: [ExercisesModule, WorkoutsModule, WorkoutExercisesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
