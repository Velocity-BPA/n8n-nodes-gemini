/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Convert API response to n8n execution data format
 */
export function toExecutionData(data: IDataObject | IDataObject[]): INodeExecutionData[] {
  if (Array.isArray(data)) {
    return data.map((item) => ({ json: item }));
  }
  return [{ json: data }];
}

/**
 * Deep clean object by removing undefined and null values
 */
export function cleanObject(obj: IDataObject): IDataObject {
  const cleaned: IDataObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedValue = cleanObject(value as IDataObject);
        if (Object.keys(cleanedValue).length > 0) {
          cleaned[key] = cleanedValue;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

/**
 * Parse boolean query parameter
 */
export function parseBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
}

/**
 * Parse number with validation
 */
export function parseNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? undefined : num;
}

/**
 * Format timestamp for API request
 */
export function formatTimestamp(date: Date | string | number): number {
  if (typeof date === 'number') {
    return date;
  }
  if (typeof date === 'string') {
    return new Date(date).getTime();
  }
  return date.getTime();
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Retry operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Build query string parameters
 */
export function buildQueryParams(params: IDataObject): IDataObject {
  const queryParams: IDataObject = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      queryParams[key] = value;
    }
  }
  return queryParams;
}

/**
 * Validate required fields
 */
export function validateRequired(
  data: IDataObject,
  requiredFields: string[],
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(field);
    }
  }
  return { valid: missing.length === 0, missing };
}

/**
 * Format currency amount for display
 */
export function formatCurrency(amount: string | number, currency: string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (currency === 'USD' || currency === 'GUSD') {
    return `$${num.toFixed(2)}`;
  }
  return `${num} ${currency}`;
}

/**
 * Calculate percentage change
 */
export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) {
    return 0;
  }
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Validate Gemini symbol format
 */
export function isValidSymbol(symbol: string): boolean {
  // Gemini symbols are lowercase alphanumeric (e.g., btcusd, ethusd)
  return /^[a-z0-9]+$/.test(symbol);
}

/**
 * Normalize symbol to Gemini format
 */
export function normalizeSymbol(symbol: string): string {
  return symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Check if response is an error
 */
export function isApiError(response: unknown): boolean {
  return (
    typeof response === 'object' &&
    response !== null &&
    'result' in response &&
    (response as IDataObject).result === 'error'
  );
}

/**
 * Extract error message from API response
 */
export function getErrorMessage(response: unknown): string {
  if (!isApiError(response)) {
    return 'Unknown error';
  }
  const errorResponse = response as IDataObject;
  return (errorResponse.message as string) || (errorResponse.reason as string) || 'Unknown error';
}
