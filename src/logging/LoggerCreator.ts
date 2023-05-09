// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

import ILogger from '../interfaces/ILogger';
import IRequestContext from '../interfaces/IRequestContext';
import ConsoleLogger from './ConsoleLogger';

/**
 * Instantiates logger instances.
 */
export default class LoggerCreator {
  /**
   * Creates a new logger instance
   * @param context the enclosing request context
   */
  public static createLogger (_context: IRequestContext): ILogger {
    return new ConsoleLogger();
  }
}
