import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiErrorResponse, ApiSuccessResponse } from '../../../common/decorators/swagger';
import { User } from '../users/entities/user.entity';
import { AttachmentResponseDto } from './dto/attachment-response.dto';
import { CreateTaskAttachmentDto } from './dto/create-task-attachment.dto';
import { TaskAttachmentsService } from './task-attachments.service';

@ApiTags('Attachments')
@ApiCookieAuth('access_token')
@Controller({ path: 'tasks/:taskId/attachments', version: '1' })
export class TaskAttachmentsController {
  constructor(private readonly taskAttachmentsService: TaskAttachmentsService) {}

  @ApiOperation({ summary: 'Add an attachment to a task' })
  @ApiSuccessResponse(AttachmentResponseDto, { status: 201 })
  @ApiErrorResponse(400, 'VALIDATION_ERROR', 'Invalid input')
  @ApiErrorResponse(404, 'NOT_FOUND', 'Task not found')
  @Post()
  @HttpCode(201)
  create(
    @CurrentUser() user: User,
    @Param('taskId') taskId: string,
    @Body() dto: CreateTaskAttachmentDto,
  ) {
    return this.taskAttachmentsService.create(user.id, taskId, dto);
  }

  @ApiOperation({ summary: 'List attachments for a task' })
  @ApiExtraModels(AttachmentResponseDto)
  @ApiResponse({
    status: 200,
    description: 'List of attachments',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(AttachmentResponseDto) },
        },
      },
    },
  })
  @ApiErrorResponse(404, 'NOT_FOUND', 'Task not found')
  @Get()
  findAll(@CurrentUser() user: User, @Param('taskId') taskId: string) {
    return this.taskAttachmentsService.findByTaskId(user.id, taskId);
  }

  @ApiOperation({ summary: 'Remove an attachment' })
  @ApiSuccessResponse(undefined, { description: 'Attachment removed' })
  @ApiErrorResponse(404, 'NOT_FOUND', 'Attachment or task not found')
  @Delete(':id')
  remove(
    @CurrentUser() user: User,
    @Param('taskId') taskId: string,
    @Param('id') attachmentId: string,
  ) {
    return this.taskAttachmentsService.remove(user.id, taskId, attachmentId);
  }
}
