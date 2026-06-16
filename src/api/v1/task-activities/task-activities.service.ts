import { Injectable } from '@nestjs/common';
import { CreateTaskActivityDto } from './dto/create-task-activity.dto';
import { UpdateTaskActivityDto } from './dto/update-task-activity.dto';

@Injectable()
export class TaskActivitiesService {
  create(createTaskActivityDto: CreateTaskActivityDto) {
    return 'This action adds a new taskActivity';
  }

  findAll() {
    return `This action returns all taskActivities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskActivity`;
  }

  update(id: number, updateTaskActivityDto: UpdateTaskActivityDto) {
    return `This action updates a #${id} taskActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskActivity`;
  }
}
