import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
create(@Body() data: { name: string; sets: string; reps: string; workoutId: string }) {
  return this.exercisesService.create(data);
  }

};