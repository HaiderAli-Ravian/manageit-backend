import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '../../../../common/enums/task-priority.enum';
import { TaskStatus } from '../../../../common/enums/task-status.enum';

export class TaskResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'Buy groceries' })
  title: string;

  @ApiProperty({ example: 'Pick up milk, eggs, and bread', nullable: true })
  description: string | null;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @ApiProperty({ example: '2026-07-01T00:00:00.000Z', nullable: true })
  dueDate: Date | null;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  userId: string;

  @ApiProperty({ example: '2026-06-17T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-17T10:00:00.000Z' })
  updatedAt: Date;
}
