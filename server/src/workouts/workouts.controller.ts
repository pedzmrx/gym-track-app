import { Controller, Get, Post, Body } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  create(@Body() data: { title: string; description?: string; userId: string }) {
    return this.workoutsService.create(data);
  }

  @Get()
  findAll() {
    return this.workoutsService.findAll();
  }
}