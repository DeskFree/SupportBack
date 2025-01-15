import { Injectable } from '@nestjs/common';
import { Log } from './schemas';
import { LogRepository } from './repository';
import { CreateLogDto } from './dto';
import { targetModels, LogActions } from '../enums';
import { LogFailureException } from 'src/exceptions';

/**
 * @class LogService
 * @description
 * The LogService class is responsible for handling operations related to logging within the application.
 * It interacts with the LogRepository to perform CRUD operations on log entries and manages error handling
 * and rollback mechanisms in case of failures.
 *
 * @example
 * // Example usage of LogService
 * const logService = new LogService(logRepository);
 *
 * // Creating a new log entry
 * const newLog = {
 *   userId: 'user123',
 *   action: 'CREATE',
 *   targetId: 'target123',
 *   targetModel: 'User',
 *   details: 'Created a new user.'
 * };
 * logService.createLog(newLog);
 *
 * // Retrieving all logs
 * logService.getAllLogs();
 *
 * // Clearing all logs
 * logService.clearLogs();
 *
 * @param {LogRepository} logRepository - The repository used for interacting with the log data store.
 */
@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  /**
   * Creates a log entry in the system.
   *
   * @param {CreateLogDto} newLog - The data transfer object containing the details of the log to be created.
   * @param {() => Promise<any>} [rollbackFunction] - An optional rollback function to be executed if the log creation fails.
   * @returns {Promise<Log>} A promise that resolves to the created log entry.
   *
   * @throws {LogFailureException} If the log creation fails and the rollback function (if provided) also fails.
   * @throws {LogFailureException} If the log creation fails and no rollback function is provided.
   *
   * This method attempts to create a log entry using the provided `newLog` data. If the log creation fails,
   * it will attempt to execute the optional `rollbackFunction` to revert any changes made during the process.
   * If the rollback also fails, a `LogFailureException` is thrown with details of both the original error and the rollback error.
   * If no rollback function is provided, a `LogFailureException` is thrown with details of the original error.
   */
  async createLog(
    newLog: CreateLogDto,
    rollbackFunction?: () => Promise<any>,
  ): Promise<Log> {
    try {
      // Attempt to create the log
      const log = await this.logRepository.createLog(newLog);
      return log;
    } catch (error) {
      if (rollbackFunction) {
        try {
          await rollbackFunction();
        } catch (rollbackError) {
          console.error('Rollback failed:', rollbackError);
          throw new LogFailureException(
            `Failed to record the creation of the log entry and rollback the database transaction. Original error: ${error.message}, Rollback error: ${rollbackError.message}`,
          );
        }
      }
      throw new LogFailureException(
        `Failed to record the creation of the ${newLog.targetModel.toLowerCase()}. Error details: ${error.message}.`,
      );
    }
  }

  /**
   * Retrieves all log entries from the log repository.
   *
   * @returns {Promise<Log[]>} A promise that resolves to an array of Log objects.
   * @throws {LogFailureException} If there is an error while retrieving the logs.
   *
   * This method interacts with the log repository to fetch all log entries.
   * In case of any error during the retrieval process, it catches the error
   * and throws a `LogFailureException` with a detailed error message.
   */
  async getAllLogs(): Promise<Log[]> {
    return await this.logRepository.getLogs({}).catch((error) => {
      throw new LogFailureException(
        `Failed to retrieve all logs. Error details: ${error.message}.`,
      );
    });
  }

  /**
   * Retrieves logs filtered by a specific action.
   *
   * @param {LogActions} action - The action type to filter logs by.
   * @returns {Promise<Log[]>} A promise that resolves to an array of logs matching the specified action.
   * @throws {LogFailureException} If there is an error retrieving the logs, an exception is thrown with details.
   *
   * This method interacts with the log repository to fetch logs that match the given action.
   * If an error occurs during the retrieval process, it catches the error and throws a
   * `LogFailureException` with a detailed error message.
   */
  async getLogsByAction(action: LogActions): Promise<Log[]> {
    return await this.logRepository.getLogs({ action }).catch((error) => {
      throw new LogFailureException(
        `Failed to retrieve logs with action ${action}. Error details: ${error.message}.`,
      );
    });
  }

  /**
   * Retrieves logs filtered by the specified target model.
   *
   * @param {LogActions} targetModel - The target model to filter logs by.
   * @returns {Promise<Log[]>} A promise that resolves to an array of logs matching the target model.
   * @throws {LogFailureException} If there is an error retrieving the logs.
   *
   * This method interacts with the log repository to fetch logs that match the given target model.
   * If an error occurs during the retrieval process, a `LogFailureException` is thrown with details
   * about the error.
   */
  async getLogsByTargetModel(targetModel: LogActions): Promise<Log[]> {
    return await this.logRepository.getLogs({ targetModel }).catch((error) => {
      throw new LogFailureException(
        `Failed to retrieve logs with target model ${targetModel}. Error details: ${error.message}.`,
      );
    });
  }

  /**
   * Retrieves logs based on the specified target ID.
   *
   * @param {LogActions} targetId - The target ID for which logs are to be retrieved.
   * @returns {Promise<Log[]>} - A promise that resolves to an array of logs associated with the given target ID.
   * @throws {LogFailureException} - Throws an exception if there is an error while retrieving the logs.
   *
   * This method interacts with the log repository to fetch logs that match the provided target ID.
   * If an error occurs during the retrieval process, a `LogFailureException` is thrown with details
   * about the error.
   */
  async getLogsByTargetId(targetId: LogActions): Promise<Log[]> {
    return await this.logRepository.getLogs({ targetId }).catch((error) => {
      throw new LogFailureException(
        `Failed to retrieve logs with target ID ${targetId}. Error details: ${error.message}.`,
      );
    });
  }

  /**
   * Clears all logs from the log repository and records the action.
   *
   * This method performs two main actions:
   * 1. Clears all logs from the log repository.
   * 2. Creates a new log entry to record the action of clearing all logs.
   *
   * If an error occurs while clearing the logs, a `LogFailureException` is thrown with details of the error.
   * Similarly, if an error occurs while recording the log entry for the clearing action, a `LogFailureException` is thrown with details of the error.
   *
   * @returns {Promise<Log>} A promise that resolves to the log entry created to record the clearing of all logs.
   *
   * @throws {LogFailureException} If an error occurs while clearing the logs or recording the log entry.
   */
  async clearLogs(): Promise<Log> {
    await this.logRepository.clearLogs().catch((error) => {
      throw new LogFailureException(
        `Failed to clear all logs. Error details: ${error.message}.`,
      );
    });

    const clearedLog: CreateLogDto = {
      userId: null, // will get
      action: LogActions.CLEAR,
      targetId: null, //null cuz all docs has been clear
      targetModel: targetModels.LOG,
      details: 'All logs have been cleared.',
    };

    return this.createLog(clearedLog).catch((error) => {
      throw new LogFailureException(
        `Failed to record the clearing of all logs. Error details: ${error.message}.`,
      );
    });
  }
}
