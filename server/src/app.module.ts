import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutsModule } from './workouts/workouts.module';

@Module({
  imports: [ExercisesModule, WorkoutsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
