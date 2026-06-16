import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskAttachmentsService } from './task-attachments.service';
import { CreateTaskAttachmentDto } from './dto/create-task-attachment.dto';
import { UpdateTaskAttachmentDto } from './dto/update-task-attachment.dto';

@Controller('task-attachments')
export class TaskAttachmentsController {
  constructor(private readonly taskAttachmentsService: TaskAttachmentsService) {}

  @Post()
  create(@Body() createTaskAttachmentDto: CreateTaskAttachmentDto) {
    return this.taskAttachmentsService.create(createTaskAttachmentDto);
  }

  @Get()
  findAll() {
    return this.taskAttachmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskAttachmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskAttachmentDto: UpdateTaskAttachmentDto) {
    return this.taskAttachmentsService.update(+id, updateTaskAttachmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskAttachmentsService.remove(+id);
  }
}
