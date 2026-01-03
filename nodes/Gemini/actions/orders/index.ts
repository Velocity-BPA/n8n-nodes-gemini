/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { geminiPrivateRequest, geminiPaginatedRequest } from '../../transport';
import { toExecutionData, cleanObject } from '../../utils';

export async function placeNewOrder(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const amount = this.getNodeParameter('amount', 0) as string;
  const side = this.getNodeParameter('side', 0) as string;
  const type = this.getNodeParameter('orderType', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    symbol: symbol.toLowerCase(),
    amount,
    side,
    type,
    price: additionalFields.price,
    client_order_id: additionalFields.clientOrderId,
    options: additionalFields.options,
    stop_price: additionalFields.stopPrice,
    min_amount: additionalFields.minAmount,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/order/new', body);
  return toExecutionData(response as IDataObject);
}

export async function cancelOrder(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const orderId = this.getNodeParameter('orderId', 0) as string;

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/order/cancel', {
    order_id: orderId,
  });
  return toExecutionData(response as IDataObject);
}

export async function cancelAllOrders(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/order/cancel/all', {});
  return toExecutionData(response as IDataObject);
}

export async function cancelAllSessionOrders(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/order/cancel/session', {});
  return toExecutionData(response as IDataObject);
}

export async function getOrderStatus(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const orderId = this.getNodeParameter('orderId', 0) as string;

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/order/status', {
    order_id: orderId,
  });
  return toExecutionData(response as IDataObject);
}

export async function getActiveOrders(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/orders', {});
  return toExecutionData(response as IDataObject[]);
}

export async function getPastTrades(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    symbol: additionalFields.symbol ? (additionalFields.symbol as string).toLowerCase() : undefined,
    limit_trades: additionalFields.limitTrades,
    timestamp: additionalFields.timestamp,
  });

  const returnAll = additionalFields.returnAll as boolean;

  if (returnAll) {
    const response = await geminiPaginatedRequest.call(this, 'POST', '/v1/mytrades', body);
    return toExecutionData(response);
  }

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/mytrades', body);
  return toExecutionData(response as IDataObject[]);
}

export async function getNotionalVolume(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/notionalvolume', {});
  return toExecutionData(response as IDataObject);
}

export async function getTradeVolume(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/tradevolume', {});
  return toExecutionData(response as IDataObject[]);
}

export async function orderPreview(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const amount = this.getNodeParameter('amount', 0) as string;
  const side = this.getNodeParameter('side', 0) as string;
  const type = this.getNodeParameter('orderType', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    symbol: symbol.toLowerCase(),
    amount,
    side,
    type,
    price: additionalFields.price,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/order/preview', body);
  return toExecutionData(response as IDataObject);
}

export async function wrapOrder(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const amount = this.getNodeParameter('amount', 0) as string;
  const side = this.getNodeParameter('side', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    symbol: symbol.toLowerCase(),
    amount,
    side,
    client_order_id: additionalFields.clientOrderId,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/wrap/:symbol', body);
  return toExecutionData(response as IDataObject);
}
