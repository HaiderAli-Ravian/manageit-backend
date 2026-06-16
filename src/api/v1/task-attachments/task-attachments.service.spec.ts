import { Test, TestingModule } from '@nestjs/testing';
import { TaskAttachmentsService } from './task-attachments.service';

describe('TaskAttachmentsService', () => {
  let service: TaskAttachmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskAttachmentsService],
    }).compile();

    service = module.get<TaskAttachmentsService>(TaskAttachmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
