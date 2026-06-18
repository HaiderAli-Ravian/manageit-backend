import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskActivityAction } from '../../../common/enums/task-activity-action.enum';
import { PaginationMeta } from '../../../common/interfaces/api-response.interface';
import { TaskActivitiesService } from '../task-activities/task-activities.service';
import { TaskActivity } from '../task-activities/entities/task-activity.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
    private readonly taskActivitiesService: TaskActivitiesService,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    const task = this.repo.create({ ...dto, userId });
    const saved = await this.repo.save(task);
    await this.taskActivitiesService.create({
      taskId: saved.id,
      userId,
      action: TaskActivityAction.CREATED,
    });
    return saved;
  }

  async findAll(
    userId: string,
    query: ListTasksQueryDto,
  ): Promise<{ data: Task[]; meta: PaginationMeta }> {
    const { status, search, sortBy, sortOrder, page, limit } = query;
    const direction = (sortOrder ?? 'desc').toUpperCase() as 'ASC' | 'DESC';

    const qb = this.repo
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId });

    if (status) {
      qb.andWhere('task.status = :status', { status });
    }

    if (search) {
      qb.andWhere('task.title ILIKE :search', { search: `%${search}%` });
    }

    switch (sortBy) {
      case 'priority':
        qb.orderBy(
          `CASE WHEN task.priority='LOW' THEN 0 WHEN task.priority='MEDIUM' THEN 1 ELSE 2 END`,
          direction,
        );
        break;
      case 'status':
        qb.orderBy(
          `CASE WHEN task.status='COMPLETED' THEN 0 WHEN task.status='IN_PROGRESS' THEN 1 ELSE 2 END`,
          direction,
        );
        break;
      case 'dueDate':
        qb.orderBy('task.dueDate', direction, 'NULLS LAST');
        break;
      default:
        qb.orderBy('task.createdAt', direction);
    }

    const pageNum = page ?? 1;
    const pageLimit = limit ?? 10;

    qb.skip((pageNum - 1) * pageLimit).take(pageLimit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        page: pageNum,
        limit: pageLimit,
        total,
        totalPages: Math.ceil(total / pageLimit),
      },
    };
  }

  async findOne(userId: string, id: string): Promise<Task> {
    const task = await this.repo.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Task not found' });
    }
    return task;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto): Promise<Task> {
    const existing = await this.findOne(userId, id);

    const normalize = (v: unknown) =>
      v instanceof Date ? v.toISOString() : v;

    const diff = Object.entries(dto).reduce(
      (acc, [k, v]) => {
        const existingVal = (existing as unknown as Record<string, unknown>)[k];
        return normalize(existingVal) !== normalize(v)
          ? { ...acc, [k]: { from: existingVal, to: v } }
          : acc;
      },
      {} as Record<string, { from: unknown; to: unknown }>,
    );

    Object.assign(existing, dto);
    const updated = await this.repo.save(existing);

    if ('status' in diff) {
      await this.taskActivitiesService.create({
        taskId: id,
        userId,
        action: TaskActivityAction.STATUS_CHANGED,
        changes: diff,
      });
    } else if (Object.keys(diff).length > 0) {
      await this.taskActivitiesService.create({
        taskId: id,
        userId,
        action: TaskActivityAction.UPDATED,
        changes: diff,
      });
    }

    return updated;
  }

  async remove(userId: string, id: string): Promise<void> {
    const task = await this.findOne(userId, id);
    await this.repo.remove(task);
  }

  async getActivities(userId: string, taskId: string): Promise<TaskActivity[]> {
    await this.findOne(userId, taskId);
    return this.taskActivitiesService.findByTaskId(taskId);
  }

  async findAllAdmin(
    query: ListTasksQueryDto,
  ): Promise<{ data: Task[]; meta: PaginationMeta }> {
    const { status, search, sortBy, sortOrder, page, limit } = query;
    const direction = (sortOrder ?? 'desc').toUpperCase() as 'ASC' | 'DESC';

    const qb = this.repo
      .createQueryBuilder('task')
      .leftJoin('task.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.email']);

    if (status) {
      qb.andWhere('task.status = :status', { status });
    }

    if (search) {
      qb.andWhere('task.title ILIKE :search', { search: `%${search}%` });
    }

    switch (sortBy) {
      case 'priority':
        qb.orderBy(
          `CASE WHEN task.priority='LOW' THEN 0 WHEN task.priority='MEDIUM' THEN 1 ELSE 2 END`,
          direction,
        );
        break;
      case 'status':
        qb.orderBy(
          `CASE WHEN task.status='COMPLETED' THEN 0 WHEN task.status='IN_PROGRESS' THEN 1 ELSE 2 END`,
          direction,
        );
        break;
      case 'dueDate':
        qb.orderBy('task.dueDate', direction, 'NULLS LAST');
        break;
      default:
        qb.orderBy('task.createdAt', direction);
    }

    const pageNum = page ?? 1;
    const pageLimit = limit ?? 10;

    qb.skip((pageNum - 1) * pageLimit).take(pageLimit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        page: pageNum,
        limit: pageLimit,
        total,
        totalPages: Math.ceil(total / pageLimit),
      },
    };
  }
}
