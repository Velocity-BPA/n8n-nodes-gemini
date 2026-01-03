/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { geminiPrivateRequest } from '../../transport';
import { toExecutionData, cleanObject } from '../../utils';

export async function withdraw(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const currency = this.getNodeParameter('currency', 0) as string;
  const amount = this.getNodeParameter('amount', 0) as string;
  const address = this.getNodeParameter('address', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    currency: currency.toUpperCase(),
    amount,
    address,
    client_transfer_id: additionalFields.clientTransferId,
    memo: additionalFields.memo,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/withdraw/crypto',
    body,
  );
  return toExecutionData(response as IDataObject);
}

export async function addBank(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const accountName = this.getNodeParameter('accountName', 0) as string;
  const accountNumber = this.getNodeParameter('accountNumber', 0) as string;
  const routingNumber = this.getNodeParameter('routingNumber', 0) as string;
  const accountType = this.getNodeParameter('accountType', 0) as string;

  const body: IDataObject = cleanObject({
    accountname: accountName,
    accountnumber: accountNumber,
    routing: routingNumber,
    type: accountType,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/payments/addbank', body);
  return toExecutionData(response as IDataObject);
}

export async function getPaymentMethods(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/payments/methods', {});
  return toExecutionData(response as IDataObject[]);
}

export async function internalTransfer(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const currency = this.getNodeParameter('currency', 0) as string;
  const amount = this.getNodeParameter('amount', 0) as string;
  const sourceAccount = this.getNodeParameter('sourceAccount', 0) as string;
  const targetAccount = this.getNodeParameter('targetAccount', 0) as string;

  const body: IDataObject = cleanObject({
    currency: currency.toUpperCase(),
    amount,
    sourceAccount,
    targetAccount,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/account/transfer',
    body,
  );
  return toExecutionData(response as IDataObject);
}

export async function withdrawGUSD(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const amount = this.getNodeParameter('amount', 0) as string;
  const address = this.getNodeParameter('address', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    amount,
    address,
    client_transfer_id: additionalFields.clientTransferId,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/withdraw/gusd',
    body,
  );
  return toExecutionData(response as IDataObject);
}

export async function addApprovedAddress(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const network = this.getNodeParameter('network', 0) as string;
  const address = this.getNodeParameter('address', 0) as string;
  const label = this.getNodeParameter('label', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    network: network.toLowerCase(),
    address,
    label,
    memo: additionalFields.memo,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/approvedAddresses/:network/request',
    body,
  );
  return toExecutionData(response as IDataObject);
}

export async function removeApprovedAddress(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const network = this.getNodeParameter('network', 0) as string;
  const address = this.getNodeParameter('address', 0) as string;

  const body: IDataObject = cleanObject({
    network: network.toLowerCase(),
    address,
  });

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/approvedAddresses/:network/remove',
    body,
  );
  return toExecutionData(response as IDataObject);
}

export async function getApprovedAddresses(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const network = this.getNodeParameter('network', 0) as string;

  const response = await geminiPrivateRequest.call(
    this,
    'POST',
    `/v1/approvedAddresses/account/${network.toLowerCase()}`,
    {},
  );
  return toExecutionData(response as IDataObject[]);
}
