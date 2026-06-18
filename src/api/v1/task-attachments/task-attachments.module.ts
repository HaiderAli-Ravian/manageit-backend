import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskActivitiesModule } from '../task-activities/task-activities.module';
import { TasksModule } from '../tasks/tasks.module';
import { TaskAttachment } from './entities/task-attachment.entity';
import { TaskAttachmentsController } from './task-attachments.controller';
import { TaskAttachmentsService } from './task-attachments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskAttachment]),
    TasksModule,
    TaskActivitiesModule,
  ],
  controllers: [TaskAttachmentsController],
  providers: [TaskAttachmentsService],
})
export class TaskAttachmentsModule {}
