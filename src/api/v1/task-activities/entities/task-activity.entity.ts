import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/base.entity';
import { TaskActivityAction } from '../../../../common/enums/task-activity-action.enum';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Index(['taskId', 'createdAt'])
@Entity('task_activities')
export class TaskActivity extends BaseEntity {
  @Column({ type: 'uuid' })
  taskId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: TaskActivityAction })
  action: TaskActivityAction;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, unknown> | null;

  @ManyToOne(() => Task, (task) => task.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
