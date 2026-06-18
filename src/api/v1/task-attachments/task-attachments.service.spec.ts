import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskActivitiesService } from '../task-activities/task-activities.service';
import { TasksService } from '../tasks/tasks.service';
import { TaskAttachment } from './entities/task-attachment.entity';
import { TaskAttachmentsService } from './task-attachments.service';

const mockRepo = { save: jest.fn(), find: jest.fn(), findOne: jest.fn(), remove: jest.fn() };
const mockTasksService = { findOne: jest.fn() };
const mockActivitiesService = { create: jest.fn() };

describe('TaskAttachmentsService', () => {
  let service: TaskAttachmentsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskAttachmentsService,
        { provide: getRepositoryToken(TaskAttachment), useValue: mockRepo },
        { provide: TasksService, useValue: mockTasksService },
        { provide: TaskActivitiesService, useValue: mockActivitiesService },
      ],
    }).compile();

    service = module.get<TaskAttachmentsService>(TaskAttachmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
