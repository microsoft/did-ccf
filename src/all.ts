// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.

/* Export endpoints exposed by the CCF App. These
are referenced in the app.json file. */
export * from './endpoints/identifier/count';
export * from './endpoints/identifier/create';
export * from './endpoints/identifier/resolve';
export * from './endpoints/identifier/deactivate';
export * from './endpoints/identifier/signature/sign';
export * from './endpoints/identifier/signature/verify';
export * from './endpoints/identifier/keys/list';
export * from './endpoints/identifier/keys/revoke';
export * from './endpoints/identifier/keys/roll';
export * from './endpoints/identifier/keys/exportPrivate';
