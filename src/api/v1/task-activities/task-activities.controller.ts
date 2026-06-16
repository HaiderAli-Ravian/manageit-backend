import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskActivitiesService } from './task-activities.service';
import { CreateTaskActivityDto } from './dto/create-task-activity.dto';
import { UpdateTaskActivityDto } from './dto/update-task-activity.dto';

@Controller('task-activities')
export class TaskActivitiesController {
  constructor(private readonly taskActivitiesService: TaskActivitiesService) {}

  @Post()
  create(@Body() createTaskActivityDto: CreateTaskActivityDto) {
    return this.taskActivitiesService.create(createTaskActivityDto);
  }

  @Get()
  findAll() {
    return this.taskActivitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskActivitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskActivityDto: UpdateTaskActivityDto) {
    return this.taskActivitiesService.update(+id, updateTaskActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskActivitiesService.remove(+id);
  }
}
