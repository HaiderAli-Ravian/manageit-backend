import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/base.entity';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Index(['taskId'])
@Entity('task_attachments')
export class TaskAttachment extends BaseEntity {
  @Column({ type: 'uuid' })
  taskId: string;

  @Column()
  fileUrl: string;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column({ type: 'integer' })
  fileSize: number;

  @Column({ type: 'uuid' })
  uploadedById: string;

  @ManyToOne(() => Task, (task) => task.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;
}
