import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/base.entity';
import { Role } from '../../../../common/enums/role.enum';
import { Task } from '../../tasks/entities/task.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
