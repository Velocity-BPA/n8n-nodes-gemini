/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { geminiPrivateRequest } from '../../transport';
import { toExecutionData, cleanObject } from '../../utils';

export async function getAvailableBalances(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/balances', {});
  return toExecutionData(response as IDataObject[]);
}

export async function getNotionalBalances(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const currency = this.getNodeParameter('currency', 0, 'USD') as string;

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    `/v1/notionalbalances/${currency.toUpperCase()}`,
    {},
  );
  return toExecutionData(response as IDataObject[]);
}

export async function getTransfers(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    currency: additionalFields.currency
      ? (additionalFields.currency as string).toUpperCase()
      : undefined,
    timestamp: additionalFields.timestamp,
    limit_transfers: additionalFields.limitTransfers,
    show_completed_deposit_advances: additionalFields.showCompletedDepositAdvances,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/transfers', body);
  return toExecutionData(response as IDataObject[]);
}

export async function getTransactions(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    timestamp: additionalFields.timestamp,
    limit_transfers: additionalFields.limitTransfers,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/transactions', body);
  return toExecutionData(response as IDataObject[]);
}

export async function getCustodyAccountFees(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/custodyaccountfees', {});
  return toExecutionData(response as IDataObject);
}

export async function getAccountDetails(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/account', {});
  return toExecutionData(response as IDataObject);
}

export async function createDepositAddress(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const currency = this.getNodeParameter('currency', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    currency: currency.toUpperCase(),
    label: additionalFields.label,
    legacy: additionalFields.legacy,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/deposit/address',
    body,
  );
  return toExecutionData(response as IDataObject);
}

export async function getDepositAddresses(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const network = this.getNodeParameter('network', 0) as string;

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    `/v1/addresses/${network.toLowerCase()}`,
    {},
  );
  return toExecutionData(response as IDataObject[]);
}
