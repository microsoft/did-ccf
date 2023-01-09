// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { ServiceMap } from './ServiceMap';

/**
 * An interface defining a {@link https://www.w3.org/TR/did-core/#services} service
 * entry.
 */
export interface Service {
  /**
   * The id for the service.
   */
  id: string;

  /**
   * The type of the service.
   */
  type: string;

  /**
   * The endpoint details for the service, either
   * a string or {@link ServiceMap}.
   */
  serviceEndpoint: string | ServiceMap;
}
