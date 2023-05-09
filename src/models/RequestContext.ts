// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request } from '@microsoft/ccf-app';
import ILogger from '../interfaces/ILogger';
import IRequestContext from '../interfaces/IRequestContext';
import LoggerCreator from '../logging/LoggerCreator';
import { RequestParameters } from './RequestParameters';

/**
 * Encapsulates the context of a given request.
 */
export class RequestContext implements IRequestContext {
  /**
   * Static readonly regular expression for checking white space.
   */
  public static readonly ONLY_WHITE_SPACE = /^\s*$/g;

  /**
   * Static readonly property for the query string regular expression.
   */
  public static readonly QUERY_STRING_PARSER_REGEX = /([^=?#&]+)=?([^&]*)/g;

  /**
   * Map to hold the parsed query string parameters.
   */
  private queryParameters: Map<string, string> = new Map();

  /**
   * Gives a context-specific logger instance
   */
  private _logger: ILogger;

  /**
   * Constructs a new instance of the class.
   * @param {Request} request to parse.
   */
  constructor (private request: Request) {
    // Only need to do additional processing
    // if passed the string.
    if (request.query) {
      // Decode the query string part of the request
      const decodedQueryString = decodeURIComponent(request.query);
      let param: RegExpExecArray;
      while (param = RequestContext.QUERY_STRING_PARSER_REGEX.exec(decodedQueryString)) {
        this.queryParameters.set(param[1], param[2]);
      }
    }
    this._logger = LoggerCreator.createLogger(this);
  }

  /**
   * Returns the logger
   */
  public get logger (): ILogger {
    return this._logger;
  }

  /**
   * Returns the identifier id from the path.
   * @returns {string} with the identifier.
   */
  public get identifier (): string {
    return this.getPathParameter(RequestParameters.Identifier);
  }

  /**
   * Returns the key identifier id from the path.
   * @returns {string} with the key identifier.
   */
  public get keyIdentifier (): string {
    return this.getPathParameter(RequestParameters.KeyIdentifier);
  }

  /**
   * Returns the key identifier id from the path.
   * @returns {string} with the key identifier.
   */
  public get serviceIdentifier (): string {
    return this.getPathParameter(RequestParameters.ServiceIdentifier);
  }

  /**
   * Attempts to read the specified parameter from the query string.
   * @param {string} id of the parameter to be returned.
   * @param {T} [defaultIfMissing] to return if the parameter is missing or whitespace.
   */
  public getQueryParameter<T> (id: string, defaultIfMissing?: T): T {
    const parameter = this.queryParameters.get(id);
    if (parameter && !RequestContext.ONLY_WHITE_SPACE.test(parameter)) {
      return <T>(<unknown>parameter);
    }

    if (defaultIfMissing) {
      return defaultIfMissing;
    }
  }

  /**
   * Attempts to read the specified parameter from the params array.
   * If the parameter exists its value is checked for whitespace, and
   * if not whitespace is URI decoded a returned.
   * @param {string} id of the parameter to be returned.
   * @returns {string} with the URI decoded value.
   */
  public getPathParameter (id: string): string {
    if (id in this.request.params) {
      const value = decodeURIComponent(this.request.params[id]);

      if (!value || !RequestContext.ONLY_WHITE_SPACE.test(value)) {
        return value;
      }
    }
  }

  /**
   * Returns the headers which match the given predicate.
   * @param matching a predicate to apply to each header
   * @returns the headers for which the predicate evaluated to true.
   */
  public getHeaders<T> (matching: (header: Record<string, string>) => T | undefined): T[] {
    const records: Record<string, string>[] = [];
    const matched: T[] = [];
    for (const key in this.request.headers) {
      const value = this.request.headers[key];
      const t = matching({ key, value });
      if (t !== undefined) {
        matched.push(t);
      }
    }
    return matched;
  }
}
