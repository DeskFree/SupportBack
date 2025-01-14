import { Types } from 'mongoose';
import { UnauthorizedAccessException } from 'src/exceptions/unauthorized-access.exception';

export class UserValidatorUtil {
  static validateUser(
    userId: Types.ObjectId,
    refferenceOwnerId: Types.ObjectId,
  ): boolean {
    if (userId !== refferenceOwnerId) {
      throw new UnauthorizedAccessException(
        'User does not have permission to perform this action.',
      );
    }
    return true;
  }
}
