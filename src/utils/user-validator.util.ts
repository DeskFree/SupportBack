import { Types } from 'mongoose';
import { UnauthorizedAccessException } from 'src/exceptions/unauthorized-access.exception';
/**
 * Utility class for user validation.
 */
export class UserValidatorUtil {
  /**
   * Validates if the given user ID matches the reference owner ID.
   *
   * @param userId - The ID of the user to validate.
   * @param refferenceOwnerId - The ID of the reference owner to compare against.
   * @returns `true` if the user ID matches the reference owner ID.
   * @throws {UnauthorizedAccessException} If the user ID does not match the reference owner ID.
   */
  static validateUser(userId: any, refferenceOwnerId: any): boolean {
    userId = userId.toString();
    refferenceOwnerId = refferenceOwnerId.toString();
    if (userId !== refferenceOwnerId) {
      throw new UnauthorizedAccessException(
        'User does not have permission to perform this action.',
      );
    }
    return true;
  }
}
