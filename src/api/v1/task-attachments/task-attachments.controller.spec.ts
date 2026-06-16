import { Test, TestingModule } from '@nestjs/testing';
import { TaskAttachmentsController } from './task-attachments.controller';
import { TaskAttachmentsService } from './task-attachments.service';

describe('TaskAttachmentsController', () => {
  let controller: TaskAttachmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskAttachmentsController],
      providers: [TaskAttachmentsService],
    }).compile();

    controller = module.get<TaskAttachmentsController>(TaskAttachmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
