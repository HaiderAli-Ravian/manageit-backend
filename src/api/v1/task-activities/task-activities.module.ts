import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskActivitiesService } from './task-activities.service';
import { TaskActivity } from './entities/task-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskActivity])],
  controllers: [],
  providers: [TaskActivitiesService],
  exports: [TaskActivitiesService],
})
export class TaskActivitiesModule {}
