import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/base.entity';
import { TaskStatus } from '../../../../common/enums/task-status.enum';
import { TaskPriority } from '../../../../common/enums/task-priority.enum';
import { User } from '../../users/entities/user.entity';
import { TaskActivity } from '../../task-activities/entities/task-activity.entity';
import { TaskAttachment } from '../../task-attachments/entities/task-attachment.entity';

@Index(['userId', 'status'])
@Index(['userId', 'createdAt'])
@Entity('tasks')
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate: Date | null;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => TaskActivity, (activity) => activity.task)
  activities: TaskActivity[];

  @OneToMany(() => TaskAttachment, (attachment) => attachment.task)
  attachments: TaskAttachment[];
}
