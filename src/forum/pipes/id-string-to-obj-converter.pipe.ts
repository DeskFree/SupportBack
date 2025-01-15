import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class StringToObjectIdConverter implements PipeTransform {
  transform(value: Types.ObjectId, metadata: ArgumentMetadata) {
    if (metadata.type === 'param' && metadata.data === 'id') {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('Invalid ObjectId');
      }
      value = new Types.ObjectId(value);
    }
    return value;
  }
}
