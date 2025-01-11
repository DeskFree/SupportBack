import { Test, TestingModule } from '@nestjs/testing';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';

describe('ProblemController', () => {
  let controller: ProblemController;

  const problemService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProblemController],
      providers: [{ provide: ProblemService, useValue: { problemService } }],
    }).compile();

    controller = module.get<ProblemController>(ProblemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have create problem method',()=>{
    expect(controller.createProblem).toBeDefined();
  })
});
