// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

import ILogger from '../interfaces/ILogger';

/**
 * A console-backed logger.
 */
export default class ConsoleLogger implements ILogger {
  /**
   * Logs an informational message.
   */
  public info (data: any): void {
    console.info(data);
  }

  /**
   * Logs a warning message
   */
  public warn (data: any): void {
    console.warn(data);
  }

  /**
   * Logs an error message
   */
  public error (data: any): void {
    console.error(data);
  }
}
