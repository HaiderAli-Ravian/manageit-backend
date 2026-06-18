import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskActivityAction } from '../../../common/enums/task-activity-action.enum';
import { TaskPriority } from '../../../common/enums/task-priority.enum';
import { TaskStatus } from '../../../common/enums/task-status.enum';
import { TaskActivitiesService } from '../task-activities/task-activities.service';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockActivitiesService = {
  create: jest.fn(),
  findByTaskId: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockRepo },
        { provide: TaskActivitiesService, useValue: mockActivitiesService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('throws NotFoundException when task belongs to a different user', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('userA', 'task-owned-by-userB')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'task-owned-by-userB', userId: 'userA' },
      });
    });
  });

  describe('update', () => {
    it('logs STATUS_CHANGED (not UPDATED) when status is part of the diff', async () => {
      const taskId = 'task-123';
      const userId = 'user-456';
      const existing: Partial<Task> = {
        id: taskId,
        userId,
        title: 'Buy milk',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        description: null,
        dueDate: null,
      };

      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.save.mockImplementation((t: Task) => Promise.resolve(t));
      const createSpy = jest.spyOn(mockActivitiesService, 'create').mockResolvedValue({});

      await service.update(userId, taskId, { status: TaskStatus.COMPLETED });

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: TaskActivityAction.STATUS_CHANGED,
          changes: expect.objectContaining({
            status: { from: TaskStatus.PENDING, to: TaskStatus.COMPLETED },
          }),
        }),
      );
      expect(createSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ action: TaskActivityAction.UPDATED }),
      );
    });
  });
});
