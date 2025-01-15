import { Solution } from './';

export interface SolutionWithMetadata extends Solution {
  responseMetadata: { message: string };
}
