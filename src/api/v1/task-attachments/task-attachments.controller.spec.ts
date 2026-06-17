import { Test, TestingModule } from '@nestjs/testing';
import { TaskAttachmentsController } from './task-attachments.controller';
import { TaskAttachmentsService } from './task-attachments.service';

const mockService = { create: jest.fn(), findByTaskId: jest.fn(), remove: jest.fn() };

describe('TaskAttachmentsController', () => {
  let controller: TaskAttachmentsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskAttachmentsController],
      providers: [{ provide: TaskAttachmentsService, useValue: mockService }],
    }).compile();

    controller = module.get<TaskAttachmentsController>(TaskAttachmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
