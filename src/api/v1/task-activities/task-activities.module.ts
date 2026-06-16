import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskActivitiesService } from './task-activities.service';
import { TaskActivitiesController } from './task-activities.controller';
import { TaskActivity } from './entities/task-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskActivity])],
  controllers: [TaskActivitiesController],
  providers: [TaskActivitiesService],
})
export class TaskActivitiesModule {}
