import { ApiProperty } from '@nestjs/swagger';
import { TaskActivityAction } from '../../../../common/enums/task-activity-action.enum';

export class ActivityResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  taskId: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  userId: string;

  @ApiProperty({ enum: TaskActivityAction, example: TaskActivityAction.CREATED })
  action: TaskActivityAction;

  @ApiProperty({
    example: { status: { from: 'PENDING', to: 'COMPLETED' } },
    nullable: true,
  })
  changes: Record<string, unknown> | null;

  @ApiProperty({ example: '2026-06-17T10:00:00.000Z' })
  createdAt: Date;
}
