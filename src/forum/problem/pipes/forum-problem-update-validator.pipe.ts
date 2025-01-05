import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ProblemStatus } from '../enums/status.enum';
import { throwIfEmpty } from 'rxjs';

@Injectable()
export class ForumProblemUpdateValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (Object.keys(value).length) {
      if (!(value.status.toLocaleUpperCase() in ProblemStatus)) {
        throw new BadRequestException(`${value.status} is not a valid Status`);
      }
    }
    return value;
  }
}
