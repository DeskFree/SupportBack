import { Test, TestingModule } from '@nestjs/testing';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { SearchProblemDto } from './dto/search-problem.dto';
import { Problem } from './schemas/problem.schema';
import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ProblemStatus } from './enums/status.enum';

describe('ProblemController', () => {
  let controller: ProblemController;
  let service: ProblemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProblemController],
      providers: [
        {
          provide: ProblemService,
          useValue: {
            createProblem: jest.fn(),
            getAllProblem: jest.fn(),
            searchProblem: jest.fn(),
            updateProblem: jest.fn(),
            getProblemWithSolutions: jest.fn(),
            deleteProblem: jest.fn(),
            vote: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProblemController>(ProblemController);
    service = module.get<ProblemService>(ProblemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProblem', () => {
    it('should create a problem', async () => {
      const createProblemDto: CreateProblemDto = {
        title: 'Test Problem',
        details: 'This is a test problem',
        tryAndExpect:"",
        tags: 'test',
        status: ProblemStatus.ACTIVE,
        createdBy:"6781080039c7df8d42da6ecd"
      };
      const result: Problem = {
        ...createProblemDto,
        solutions: [],
        votes: 0,
      };

      jest.spyOn(service, 'createProblem').mockResolvedValue(result);

      expect(await controller.createProblem(createProblemDto)).toBe(result);
    });

    it('should throw BadRequestException on error', async () => {
      const createProblemDto: CreateProblemDto = {
        title: 'Test Problem',
        description: 'This is a test problem',
        tags: ['test'],
        status: 'open',
      };

      jest.spyOn(service, 'createProblem').mockRejectedValue(new BadRequestException('Bad Request'));

      await expect(controller.createProblem(createProblemDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProblems', () => {
    it('should return all problems if no search criteria provided', async () => {
      const result: Problem[] = [
        {
          _id: '1',
          title: 'Test Problem 1',
          description: 'This is a test problem 1',
          tags: ['test'],
          status: 'open',
          solutions: [],
          upvotes: 0,
          downvotes: 0,
        },
        {
          _id: '2',
          title: 'Test Problem 2',
          description: 'This is a test problem 2',
          tags: ['test'],
          status: 'open',
          solutions: [],
          upvotes: 0,
          downvotes: 0,
        },
      ];

      jest.spyOn(service, 'getAllProblem').mockResolvedValue(result);

      expect(await controller.getProblems({})).toBe(result);
    });

    it('should return problems matching search criteria', async () => {
      const searchProblemDto: SearchProblemDto = {
        title: 'Test Problem',
      };
      const result: Problem[] = [
        {
          _id: '1',
          title: 'Test Problem 1',
          description: 'This is a test problem 1',
          tags: ['test'],
          status: 'open',
          solutions: [],
          upvotes: 0,
          downvotes: 0,
        },
      ];

      jest.spyOn(service, 'searchProblem').mockResolvedValue(result);

      expect(await controller.getProblems(searchProblemDto)).toBe(result);
    });

    it('should throw NotFoundException if no problems found', async () => {
      jest.spyOn(service, 'getAllProblem').mockResolvedValue([]);

      await expect(controller.getProblems({})).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProblem', () => {
    it('should update a problem', async () => {
      const updateProblemDto: UpdateProblemDto = {
        title: 'Updated Test Problem',
      };
      const result: Problem = {
        _id: '1',
        title: 'Updated Test Problem',
        description: 'This is a test problem',
        tags: ['test'],
        status: 'open',
        solutions: [],
        upvotes: 0,
        downvotes: 0,
      };

      jest.spyOn(service, 'updateProblem').mockResolvedValue(result);

      expect(await controller.updateProblem('1', updateProblemDto)).toBe(result);
    });

    it('should throw BadRequestException if problem does not exist', async () => {
      const updateProblemDto: UpdateProblemDto = {
        title: 'Updated Test Problem',
      };

      jest.spyOn(service, 'updateProblem').mockResolvedValue(null);

      await expect(controller.updateProblem('1', updateProblemDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProblem', () => {
    it('should return a problem with solutions', async () => {
      const result: Problem = {
        _id: '1',
        title: 'Test Problem',
        description: 'This is a test problem',
        tags: ['test'],
        status: 'open',
        solutions: [],
        upvotes: 0,
        downvotes: 0,
      };

      jest.spyOn(service, 'getProblemWithSolutions').mockResolvedValue(result);

      expect(await controller.getProblem('1')).toBe(result);
    });

    it('should throw NotFoundException if problem does not exist', async () => {
      jest.spyOn(service, 'getProblemWithSolutions').mockResolvedValue(null);

      await expect(controller.getProblem('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProblem', () => {
    it('should delete a problem', async () => {
      const result: Problem = {
        _id: '1',
        title: 'Test Problem',
        description: 'This is a test problem',
        tags: ['test'],
        status: 'open',
        solutions: [],
        upvotes: 0,
        downvotes: 0,
      };

      jest.spyOn(service, 'deleteProblem').mockResolvedValue(result);

      expect(await controller.deleteProblem('1')).toBe(result);
    });

    it('should throw NotFoundException if problem does not exist', async () => {
      jest.spyOn(service, 'deleteProblem').mockResolvedValue(null);

      await expect(controller.deleteProblem('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('voteProblem', () => {
    it('should upvote a problem', async () => {
      const result = true;

      jest.spyOn(service, 'vote').mockResolvedValue(result);

      expect(await controller.voteProblem('1', true)).toBe(result);
    });

    it('should throw BadRequestException if voting fails', async () => {
      jest.spyOn(service, 'vote').mockResolvedValue(false);

      await expect(controller.voteProblem('1', true)).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleError', () => {
    it('should return BadRequestException for BadRequestException', () => {
      const error = new BadRequestException('Bad Request');
      expect(controller['handleError'](error)).toBeInstanceOf(BadRequestException);
    });

    it('should return NotFoundException for NotFoundException', () => {
      const error = new NotFoundException('Not Found');
      expect(controller['handleError'](error)).toBeInstanceOf(NotFoundException);
    });

    it('should return InternalServerErrorException for DatabaseException', () => {
      const error = new InternalServerErrorException('Database Error');
      expect(controller['handleError'](error)).toBeInstanceOf(InternalServerErrorException);
    });

    it('should return InternalServerErrorException for generic errors', () => {
      const error = new Error('Generic Error');
      expect(controller['handleError'](error)).toBeInstanceOf(InternalServerErrorException);
    });
  });
});