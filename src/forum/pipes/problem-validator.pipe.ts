import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ProblemStatus } from '../problem/enums/status.enum';

@Injectable()
export class ProblemValidator implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return this.validateDto(value, metadata.metatype);
  }

  private validateDto(value: any, dtoClass: any):any {

    value.status = this.validateAndToUpperCaseStatus(value.status);
    
    const dtoInstance = plainToInstance(dtoClass, value);

    const errors = validateSync(dtoInstance);

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      );
    }

    return value;
  }

  private validateAndToUpperCaseStatus(status: any): any {
    if (status && typeof status !== 'string') {
      throw new BadRequestException(
        'Invalid status: Must be a string if provided',
      );
    }

    const transformedStatus = status?.toUpperCase();

    if (
      status &&
      !Object.values(ProblemStatus).includes(transformedStatus as ProblemStatus)
    ) {
      throw new BadRequestException(`'${status}' is not a valid status`);
    }
    return transformedStatus;
  }
}
