import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAttachmentsService } from './task-attachments.service';
import { TaskAttachmentsController } from './task-attachments.controller';
import { TaskAttachment } from './entities/task-attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskAttachment])],
  controllers: [TaskAttachmentsController],
  providers: [TaskAttachmentsService],
})
export class TaskAttachmentsModule {}
