/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IPollFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import * as crypto from 'crypto';
import {
  GEMINI_PRODUCTION_URL,
  GEMINI_SANDBOX_URL,
  ERROR_CODES,
  type GeminiCredentials,
  type GeminiApiError,
} from '../constants';

let licenseNoticeLogged = false;

function logLicenseNotice(): void {
  if (!licenseNoticeLogged) {
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licenseNoticeLogged = true;
  }
}

/**
 * Get the base URL for Gemini API
 */
export function getBaseUrl(credentials: GeminiCredentials): string {
  if (credentials.baseUrl) {
    return credentials.baseUrl.replace(/\/$/, '');
  }
  return credentials.environment === 'sandbox' ? GEMINI_SANDBOX_URL : GEMINI_PRODUCTION_URL;
}

/**
 * Generate nonce for request ordering
 */
export function generateNonce(): number {
  return Date.now();
}

/**
 * Create HMAC SHA384 signature for authenticated requests
 */
export function createSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha384', secret).update(payload).digest('hex');
}

/**
 * Encode payload to base64
 */
export function encodePayload(payload: object): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Build authenticated headers for Gemini API
 */
export function buildAuthHeaders(
  credentials: GeminiCredentials,
  endpoint: string,
  body: IDataObject = {},
): Record<string, string> {
  const nonce = generateNonce();

  const payload: IDataObject = {
    request: endpoint,
    nonce,
    ...body,
  };

  // Add account if specified (for master accounts)
  if (credentials.account) {
    payload.account = credentials.account;
  }

  const encodedPayload = encodePayload(payload);
  const signature = createSignature(encodedPayload, credentials.apiSecret);

  return {
    'Content-Type': 'text/plain',
    'Content-Length': '0',
    'X-GEMINI-APIKEY': credentials.apiKey,
    'X-GEMINI-PAYLOAD': encodedPayload,
    'X-GEMINI-SIGNATURE': signature,
    'Cache-Control': 'no-cache',
  };
}

/**
 * Make a public API request (no authentication required)
 */
export async function geminiPublicRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  qs: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
  logLicenseNotice();

  const credentials = (await this.getCredentials('geminiApi')) as unknown as GeminiCredentials;
  const baseUrl = getBaseUrl(credentials);

  const options: IHttpRequestOptions = {
    method,
    url: `${baseUrl}${endpoint}`,
    qs,
    json: true,
  };

  try {
    const response = await this.helpers.httpRequest(options);
    return response as IDataObject | IDataObject[];
  } catch (error) {
    throw new NodeApiError(this.getNode(), { message: (error as Error).message } as JsonObject, {
      message: 'Gemini API request failed',
    });
  }
}

/**
 * Make an authenticated API request
 */
export async function geminiPrivateRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
  logLicenseNotice();

  const credentials = (await this.getCredentials('geminiApi')) as unknown as GeminiCredentials;
  const baseUrl = getBaseUrl(credentials);
  const headers = buildAuthHeaders(credentials, endpoint, body);

  const options: IHttpRequestOptions = {
    method,
    url: `${baseUrl}${endpoint}`,
    headers,
    json: true,
  };

  try {
    const response = await this.helpers.httpRequest(options);

    // Check for API errors
    if (response && typeof response === 'object' && 'result' in response) {
      const apiResponse = response as unknown as GeminiApiError;
      if (apiResponse.result === 'error') {
        const errorMessage = ERROR_CODES[apiResponse.reason] || apiResponse.message;
        throw new NodeApiError(this.getNode(), {
          message: errorMessage,
          description: apiResponse.message,
        } as JsonObject);
      }
    }

    return response as IDataObject | IDataObject[];
  } catch (error) {
    if (error instanceof NodeApiError) {
      throw error;
    }
    throw new NodeApiError(this.getNode(), { message: (error as Error).message } as JsonObject, {
      message: 'Gemini API request failed',
    });
  }
}

/**
 * Handle pagination for list endpoints
 */
export async function geminiPaginatedRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IPollFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  limit?: number,
): Promise<IDataObject[]> {
  const results: IDataObject[] = [];
  let timestamp: number | undefined;

  const requestBody = { ...body };
  if (limit) {
    requestBody.limit_trades = Math.min(limit, 500);
  }

  let hasMore = true;
  while (hasMore) {
    if (timestamp) {
      requestBody.timestamp = timestamp;
    }

    const response = (await geminiPrivateRequest.call(
      this,
      method,
      endpoint,
      requestBody,
    )) as IDataObject[];

    if (!Array.isArray(response) || response.length === 0) {
      hasMore = false;
      break;
    }

    results.push(...response);

    // Get timestamp from last item for pagination
    const lastItem = response[response.length - 1];
    if (lastItem && typeof lastItem.timestampms === 'number') {
      timestamp = lastItem.timestampms;
    } else {
      hasMore = false;
      break;
    }

    // Check if we've reached the requested limit
    if (limit && results.length >= limit) {
      hasMore = false;
      break;
    }
  }

  return limit ? results.slice(0, limit) : results;
}

/**
 * Validate symbol format
 */
export function validateSymbol(symbol: string): string {
  return symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Format amount to string with proper precision
 */
export function formatAmount(amount: number | string, precision: number = 8): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(precision);
}

/**
 * Parse Gemini timestamp to Date
 */
export function parseTimestamp(timestampms: number): Date {
  return new Date(timestampms);
}
