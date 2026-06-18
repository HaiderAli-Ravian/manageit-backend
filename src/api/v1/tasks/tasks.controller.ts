import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import {
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../../common/decorators/swagger';
import { User } from '../users/entities/user.entity';
import { ActivityResponseDto } from '../task-activities/dto/activity-response.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@ApiCookieAuth('access_token')
@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a task' })
  @ApiSuccessResponse(TaskResponseDto, { status: 201, description: 'Task created' })
  @ApiErrorResponse(400, 'VALIDATION_ERROR', 'Invalid input')
  @Post()
  @HttpCode(201)
  create(@CurrentUser() user: User, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.id, dto);
  }

  @ApiOperation({ summary: 'List my tasks' })
  @ApiPaginatedResponse(TaskResponseDto)
  @ApiErrorResponse(400, 'VALIDATION_ERROR', 'Invalid query params')
  @Get()
  findAll(@CurrentUser() user: User, @Query() query: ListTasksQueryDto) {
    return this.tasksService.findAll(user.id, query);
  }

  @ApiOperation({ summary: 'Get a task by id' })
  @ApiSuccessResponse(TaskResponseDto)
  @ApiErrorResponse(404, 'NOT_FOUND', 'Task not found')
  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tasksService.findOne(user.id, id);
  }

  @ApiOperation({ summary: 'Update a task' })
  @ApiSuccessResponse(TaskResponseDto)
  @ApiErrorResponse(400, 'VALIDATION_ERROR', 'Invalid input')
  @ApiErrorResponse(404, 'NOT_FOUND', 'Task not found')
  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, id, dto);
  }

  @ApiOperation({ summary: 'Delete a task' })
  @ApiSuccessResponse(undefined, { description: 'Task deleted' })
  @ApiErrorResponse(404, 'NOT_FOUND', 'Task not found')
  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tasksService.remove(user.id, id);
  }

  @ApiOperation({ summary: 'Get activity log for a task' })
  @ApiSuccessResponse(ActivityResponseDto, {
    description: 'Activity history (most recent first)',
  })
  @ApiErrorResponse(404, 'NOT_FOUND', 'Task not found')
  @Get(':id/activities')
  getActivities(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tasksService.getActivities(user.id, id);
  }
}
