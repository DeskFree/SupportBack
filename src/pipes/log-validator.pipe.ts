import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { LogActions, targetModels } from 'src/forum/enums';

@Injectable()
export class LogValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }
    value = value.toUpperCase();

    switch (metadata.data) {
      case 'action':
        const validAction = Object.values(LogActions).find(
          (action) => action.toUpperCase() === value.toUpperCase(),
        );
        if (!validAction) {
          throw new BadRequestException(`Invalid target model: ${value}`);
        }
        return validAction;
      case 'targetModel':
        const validTargetModel = Object.values(targetModels).find(
          (targetModel) => targetModel.toUpperCase() === value.toUpperCase(),
        );
        if (!validTargetModel) {
          throw new BadRequestException(`Invalid target model: ${value}`);
        }
        return validTargetModel;
      case 'targetId':
        if (!Types.ObjectId.isValid(value)) {
          throw new BadRequestException(`Invalid target id: ${value}`);
        }
        const targetId: string = value.toString();
        return new Types.ObjectId(targetId);
      default:
        break;
    }
  }
}
