// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

/**
 * A class for parsing parameters specified on the query string.
 */
export class QueryStringParser {
  /**
   * Static readonly property for the query strign regualr expression.
   */
  public static readonly PARSER_REGEX = /([^=?#&]+)=?([^&]*)/g;

  /**
   * Key-value to hold the parsed params.
   */
  [key: string]: string;

  /**
   * Constructs a new instance of the class.
   * @param {string} queryString to parse.
   */
  constructor (public queryString: string) {
    let param;
    const decodedQueryString = decodeURIComponent(queryString);
    while (param = QueryStringParser.PARSER_REGEX.exec(decodedQueryString)) {
      this[param[1]] = param[2];
    }
  }
}
