import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../../common/decorators/swagger';
import { Role } from '../../../common/enums/role.enum';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ListTasksQueryDto } from '../tasks/dto/list-tasks-query.dto';
import { TaskResponseDto } from '../tasks/dto/task-response.dto';
import { TasksService } from '../tasks/tasks.service';
import { User } from '../users/entities/user.entity';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({
    summary: 'Admin test endpoint',
    description: 'Verifies RBAC — requires ADMIN role',
  })
  @ApiCookieAuth('access_token')
  @ApiSuccessResponse(undefined, { description: 'Hello admin response' })
  @ApiErrorResponse(401, 'UNAUTHORIZED', 'Not authenticated')
  @ApiErrorResponse(403, 'FORBIDDEN', 'Insufficient role')
  @Get('test')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  test(@CurrentUser() user: User) {
    return { message: 'Hello admin', userId: user.id };
  }

  @Get('tasks')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "List all users' tasks (admin only)" })
  @ApiCookieAuth('access_token')
  @ApiPaginatedResponse(TaskResponseDto)
  @ApiErrorResponse(401, 'UNAUTHORIZED', 'Not authenticated')
  @ApiErrorResponse(403, 'FORBIDDEN', 'Admin role required')
  listAllTasks(@Query() query: ListTasksQueryDto) {
    return this.tasksService.findAllAdmin(query);
  }
}
