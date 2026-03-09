import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WorkoutExercisesService } from './workout-exercises.service';

@Controller('workout-exercises')
export class WorkoutExercisesController {
  constructor(private readonly workoutExercisesService: WorkoutExercisesService) {}

  @Post()
  create(@Body() data: { name: string; order: number; workoutId: string; exerciseId: string }) {
  return this.workoutExercisesService.create(data);
  }

  @Get('workout/:id')
  findByWorkout(@Param('id') id: string) {
    return this.workoutExercisesService.findByWorkout(id);
  }
}