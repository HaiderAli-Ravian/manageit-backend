import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Role } from '../../../common/enums/role.enum';
import { User } from '../users/entities/user.entity';
import {
  ApiSuccessResponse,
  ApiErrorResponse,
} from '../../../common/decorators/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
