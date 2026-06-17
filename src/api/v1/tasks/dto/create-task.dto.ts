import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskPriority } from '../../../../common/enums/task-priority.enum';
import { TaskStatus } from '../../../../common/enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Buy groceries',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the task',
    example: 'Pick up milk, eggs, and bread from the store',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Current status of the task',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Priority level of the task',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Due date in ISO 8601 format',
    example: '2026-07-01T00:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  dueDate?: string;
}
