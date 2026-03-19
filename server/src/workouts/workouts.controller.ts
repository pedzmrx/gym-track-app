import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
create(@Body() data: { name: string; userId: string }) {
  return this.workoutsService.create(data);
  }

  @Get(':userId')
findAll(@Param('userId') userId: string) {
  return this.workoutsService.findAll(userId);
  }
}