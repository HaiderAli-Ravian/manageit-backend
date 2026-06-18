import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskActivitiesService } from '../task-activities/task-activities.service';
import { TasksService } from '../tasks/tasks.service';
import { TaskActivityAction } from '../../../common/enums/task-activity-action.enum';
import { CreateTaskAttachmentDto } from './dto/create-task-attachment.dto';
import { TaskAttachment } from './entities/task-attachment.entity';

@Injectable()
export class TaskAttachmentsService {
  constructor(
    @InjectRepository(TaskAttachment)
    private readonly repo: Repository<TaskAttachment>,
    private readonly tasksService: TasksService,
    private readonly taskActivitiesService: TaskActivitiesService,
  ) {}

  async create(userId: string, taskId: string, dto: CreateTaskAttachmentDto): Promise<TaskAttachment> {
    await this.tasksService.findOne(userId, taskId);
    const attachment = await this.repo.save({ ...dto, taskId, uploadedById: userId });
    await this.taskActivitiesService.create({
      taskId,
      userId,
      action: TaskActivityAction.ATTACHMENT_ADDED,
      changes: { fileName: dto.fileName, fileSize: dto.fileSize },
    });
    return attachment;
  }

  async findByTaskId(userId: string, taskId: string): Promise<TaskAttachment[]> {
    await this.tasksService.findOne(userId, taskId);
    return this.repo.find({ where: { taskId }, order: { createdAt: 'DESC' } });
  }

  async remove(userId: string, taskId: string, attachmentId: string): Promise<void> {
    const attachment = await this.repo.findOne({ where: { id: attachmentId, taskId } });
    if (!attachment) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Attachment not found' });
    }
    await this.tasksService.findOne(userId, taskId);
    await this.taskActivitiesService.create({
      taskId,
      userId,
      action: TaskActivityAction.ATTACHMENT_REMOVED,
      changes: { fileName: attachment.fileName },
    });
    await this.repo.remove(attachment);
  }
}
