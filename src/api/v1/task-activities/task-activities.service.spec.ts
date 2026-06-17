import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskActivity } from './entities/task-activity.entity';
import { TaskActivitiesService } from './task-activities.service';

describe('TaskActivitiesService', () => {
  let service: TaskActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskActivitiesService,
        { provide: getRepositoryToken(TaskActivity), useValue: {} },
      ],
    }).compile();

    service = module.get<TaskActivitiesService>(TaskActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
