/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { geminiPublicRequest } from '../../transport';
import { toExecutionData, buildQueryParams } from '../../utils';

export async function getSymbols(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPublicRequest.call(this, 'GET', '/v1/symbols');
  return toExecutionData({ symbols: response });
}

export async function getSymbolDetails(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v1/symbols/details/${symbol.toLowerCase()}`,
  );
  return toExecutionData(response as IDataObject);
}

export async function getNetwork(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const token = this.getNodeParameter('token', 0) as string;
  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v1/network/${token.toLowerCase()}`,
  );
  return toExecutionData(response as IDataObject);
}

export async function getTicker(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v1/pubticker/${symbol.toLowerCase()}`,
  );
  return toExecutionData(response as IDataObject);
}

export async function getTickerV2(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v2/ticker/${symbol.toLowerCase()}`,
  );
  return toExecutionData(response as IDataObject);
}

export async function getAllTickers(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPublicRequest.call(this, 'GET', '/v1/pricefeed');
  return toExecutionData(response as IDataObject[]);
}

export async function getCandles(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const timeFrame = this.getNodeParameter('timeFrame', 0) as string;
  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v2/candles/${symbol.toLowerCase()}/${timeFrame}`,
  );
  return toExecutionData({ candles: response });
}

export async function getDerivativesCandles(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const timeFrame = this.getNodeParameter('timeFrame', 0) as string;
  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v2/derivatives/candles/${symbol.toLowerCase()}/${timeFrame}`,
  );
  return toExecutionData({ candles: response });
}

export async function getCurrentOrderBook(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const qs = buildQueryParams({
    limit_bids: additionalFields.limitBids,
    limit_asks: additionalFields.limitAsks,
  });

  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v1/book/${symbol.toLowerCase()}`,
    qs,
  );
  return toExecutionData(response as IDataObject);
}

export async function getTradeHistory(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const qs = buildQueryParams({
    timestamp: additionalFields.timestamp,
    since_tid: additionalFields.sinceTid,
    limit_trades: additionalFields.limitTrades,
    include_breaks: additionalFields.includeBreaks,
  });

  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v1/trades/${symbol.toLowerCase()}`,
    qs,
  );
  return toExecutionData(response as IDataObject[]);
}

export async function getPriceFeed(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPublicRequest.call(this, 'GET', '/v1/pricefeed');
  return toExecutionData(response as IDataObject[]);
}

export async function getFundingAmount(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v1/fundingamount/${symbol.toLowerCase()}`,
  );
  return toExecutionData(response as IDataObject);
}

export async function getFundingRate(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v1/fundingrate/${symbol.toLowerCase()}`,
  );
  return toExecutionData(response as IDataObject);
}

export async function getFXRate(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol', 0) as string;
  const response = await geminiPublicRequest.call(
    this,
    'GET',
    `/v1/fxrate/${symbol.toLowerCase()}`,
  );
  return toExecutionData(response as IDataObject);
}
