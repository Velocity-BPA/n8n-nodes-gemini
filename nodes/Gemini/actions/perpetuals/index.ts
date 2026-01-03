/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { geminiPrivateRequest } from '../../transport';
import { toExecutionData, cleanObject } from '../../utils';

export async function getPositions(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/positions', {});
  return toExecutionData(response as IDataObject[]);
}

export async function getFundingPayments(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    symbol: additionalFields.symbol
      ? (additionalFields.symbol as string).toLowerCase()
      : undefined,
    since: additionalFields.since,
    until: additionalFields.until,
    limit: additionalFields.limit,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/fundingpayments',
    body,
  );
  return toExecutionData(response as IDataObject[]);
}

export async function getTransfers(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    since: additionalFields.since,
    until: additionalFields.until,
    limit: additionalFields.limit,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/perpetuals/transfers',
    body,
  );
  return toExecutionData(response as IDataObject[]);
}

export async function riskLimits(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('riskOperation', 0) as string;

  if (operation === 'get') {
    const response = await geminiPrivateRequest.call(this, 'POST', '/v1/risklimits', {});
    return toExecutionData(response as IDataObject);
  }

  // Set risk limits
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    max_notional_value: additionalFields.maxNotionalValue,
    max_leverage: additionalFields.maxLeverage,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/risklimits/set',
    body,
  );
  return toExecutionData(response as IDataObject);
}

export async function getPerpetualDetails(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    `/v1/perpetuals/details/${symbol.toLowerCase()}`,
    {},
  );
  return toExecutionData(response as IDataObject);
}
