import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class RateLimitService {
  private userRateLimit: Map<Types.ObjectId, number> = new Map();
  private readonly limit = 5;
  private readonly windowMs = 60000;

  async isRateLimited(userId: Types.ObjectId, action: string): Promise<boolean> {
    const currentTime = Date.now();
    const lastRequestTime = this.userRateLimit.get(userId);

    if (!lastRequestTime) {
      this.userRateLimit.set(userId, currentTime);
      return false;
    }

    const timeDifference = currentTime - lastRequestTime;
    if (timeDifference < this.windowMs) {
      return true;
    }

    this.userRateLimit.set(userId, currentTime);
    return false;
  }
}
