import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SolutionService } from './solution.service';
import { CreateSolutionDto, UpdateSolutionDto } from './dto';
import { Types } from 'mongoose';
import { Solution } from './schemas';
import { StringToObjectIdConverter } from '../pipes';
import { ErrorHandlerUtil } from 'src/utils/error-handler.util';

@Controller('forum/solution')
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @Post('/:id')
  async createSolution(
    @Param('id', StringToObjectIdConverter) problemId: Types.ObjectId,
    @Body() newSolution: CreateSolutionDto,
  ): Promise<any> {
    try {
      const solution = await this.solutionService.createSolution(
        problemId,
        newSolution,
      );

      if (!solution) {
        throw new BadRequestException(
          'Solution creation failed: Unable to create a new solution for the specified problem.',
        );
      }

      return {
        ...solution,
        responseMetadata: {
          message: 'Solution created successfully',
        },
      };
    } catch (error) {
      throw ErrorHandlerUtil.handleError(error);
    }
  }

  @Get('/:id')
  async getAllSolutions(
    @Param('id', StringToObjectIdConverter) problemId: Types.ObjectId,
  ): Promise<any> {
    const solutions = await this.solutionService
      .getSolutions(problemId)
      .then((solutions) => {
        if (!solutions || solutions.length === 0) {
          throw new NotFoundException(
            'No solutions found for the specified problem.',
          );
        }
        return solutions;
      })
      .catch((error) => {
        throw ErrorHandlerUtil.handleError(error);
      });
    return {
      ...solutions,
      responseMetadata: { message: 'Solutions retrieved successfully' },
    };
  }

  @Delete('/:id')
  deleteSolution(
    @Param('id', StringToObjectIdConverter) solutionId: Types.ObjectId,
  ): Promise<any> {
    const solution = this.solutionService
      .deleteSolution(solutionId)
      .then((solution) => {
        if (!solution) {
          throw new NotFoundException(
            'Solution deletion failed: No solution found with the specified ID.',
          );
        }
        return {
          ...solution,
          responseMetadata: { message: 'Solution deleted successfully' },
        };
      })
      .catch((error) => {
        throw ErrorHandlerUtil.handleError(error);
      });
    return solution;
  }

  @Put('/:id')
  updateSolution(
    @Param('id', StringToObjectIdConverter) solutionId: Types.ObjectId,
    @Body() updatedSolution: UpdateSolutionDto,
  ): Promise<Solution> {
    return this.solutionService
      .updateSolution(solutionId, updatedSolution)
      .then((solution) => {
        if (!solution) {
          throw new NotFoundException(
            'Solution update failed: No solution found with the specified ID.',
          );
        }
        return {
          ...solution,
          responseMetadata: { message: 'Solution updated successfully' },
        };
      })
      .catch((error) => {
        throw ErrorHandlerUtil.handleError(error);
      });
  }
}
