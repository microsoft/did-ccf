// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { Request, Response } from '@microsoft/ccf-app';
import { IdentifierStore } from '../../models';

/**
 * Returns the count of decentralized identifiers on the network.
 * @param {Request} request containing the CCF request context.
 * @returns HTTP 200 OK and the identifier count.
 */
export function count (request: Request): Response {
  // Use the size of the key value store to determine the number
  // of identifiers in the network. Each entry equates a single identifier.
  const count = new IdentifierStore().count();

  // Return 200 and the count.
  return {
    statusCode: 200,
    body: count,
  };
}
