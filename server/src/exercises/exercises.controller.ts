import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  create(@Body() data: { name: string; muscleGroup: string }) {
    return this.exercisesService.create(data);
  }

  @Get()
  findAll() {
    return this.exercisesService.findAll();
  }
}