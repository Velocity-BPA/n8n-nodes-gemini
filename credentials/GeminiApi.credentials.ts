/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class GeminiApi implements ICredentialType {
  name = 'geminiApi';
  displayName = 'Gemini API';
  documentationUrl = 'https://docs.gemini.com/rest-api/';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your Gemini API Key',
    },
    {
      displayName: 'API Secret',
      name: 'apiSecret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your Gemini API Secret',
    },
    {
      displayName: 'Account',
      name: 'account',
      type: 'string',
      default: '',
      description:
        'Optional account identifier for master accounts with sub-accounts. Leave empty for standard accounts.',
    },
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Production',
          value: 'production',
        },
        {
          name: 'Sandbox',
          value: 'sandbox',
        },
      ],
      default: 'production',
      description: 'Select the API environment to use',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      description:
        'Custom base URL (optional). Leave empty to use default based on environment.',
      placeholder: 'https://api.gemini.com',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {},
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl || ($credentials.environment === "sandbox" ? "https://api.sandbox.gemini.com" : "https://api.gemini.com")}}',
      url: '/v1/symbols',
      method: 'GET',
    },
  };
}
