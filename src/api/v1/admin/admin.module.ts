import { Module } from '@nestjs/common';
import { TasksModule } from '../tasks/tasks.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TasksModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
