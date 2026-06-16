import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskActivityDto } from './create-task-activity.dto';

export class UpdateTaskActivityDto extends PartialType(CreateTaskActivityDto) {}
