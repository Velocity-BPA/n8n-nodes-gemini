/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { geminiPrivateRequest } from '../../transport';
import { toExecutionData, cleanObject } from '../../utils';

export async function confirmTrade(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const amount = this.getNodeParameter('amount', 0) as string;
  const price = this.getNodeParameter('price', 0) as string;
  const side = this.getNodeParameter('side', 0) as string;
  const counterpartyId = this.getNodeParameter('counterpartyId', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    symbol: symbol.toLowerCase(),
    amount,
    price,
    side,
    counterparty_id: counterpartyId,
    client_order_id: additionalFields.clientOrderId,
    expires_at: additionalFields.expiresAt,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/clearing/new',
    body,
  );
  return toExecutionData(response as IDataObject);
}

export async function getClearingTrades(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    symbol: additionalFields.symbol
      ? (additionalFields.symbol as string).toLowerCase()
      : undefined,
    timestamp: additionalFields.timestamp,
    limit: additionalFields.limit,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/clearing/trades',
    body,
  );
  return toExecutionData(response as IDataObject[]);
}

export async function getBrokerTrades(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    symbol: additionalFields.symbol
      ? (additionalFields.symbol as string).toLowerCase()
      : undefined,
    timestamp: additionalFields.timestamp,
    limit: additionalFields.limit,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/clearing/broker/trades',
    body,
  );
  return toExecutionData(response as IDataObject[]);
}

export async function cancelClearingTrade(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const orderId = this.getNodeParameter('orderId', 0) as string;

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/clearing/cancel', {
    order_id: orderId,
  });
  return toExecutionData(response as IDataObject);
}
