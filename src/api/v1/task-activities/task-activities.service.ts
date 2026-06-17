import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskActivityAction } from '../../../common/enums/task-activity-action.enum';
import { TaskActivity } from './entities/task-activity.entity';

@Injectable()
export class TaskActivitiesService {
  constructor(
    @InjectRepository(TaskActivity)
    private readonly repo: Repository<TaskActivity>,
  ) {}

  async create(data: {
    taskId: string;
    userId: string;
    action: TaskActivityAction;
    changes?: Record<string, unknown>;
  }): Promise<TaskActivity> {
    return this.repo.save({
      taskId: data.taskId,
      userId: data.userId,
      action: data.action,
      changes: data.changes ?? null,
    });
  }

  async findByTaskId(taskId: string): Promise<TaskActivity[]> {
    return this.repo.find({
      where: { taskId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
