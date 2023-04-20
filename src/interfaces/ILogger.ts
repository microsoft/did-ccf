// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

/**
 * Interface for a generic logger
 */
export default interface ILogger {
  /**
   * Logs informational data.
   */
  info (data: any): void;

  /**
   * Logs warning.
   */
  warn (data: any): void;

  /**
   * Logs error.
   */
  error (data: any): void;
}
