/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { geminiPrivateRequest } from '../../transport';
import { toExecutionData, cleanObject } from '../../utils';

export async function getSubAccounts(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/account/list', {});
  return toExecutionData(response as IDataObject[]);
}

export async function getSubAccountBalance(
  this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
  const account = this.getNodeParameter('account', 0) as string;

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/balances', {
    account,
  });
  return toExecutionData(response as IDataObject[]);
}

export async function createSubAccount(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', 0) as string;
  const type = this.getNodeParameter('accountType', 0) as string;

  const body: IDataObject = cleanObject({
    name,
    type,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/account/create', body);
  return toExecutionData(response as IDataObject);
}

export async function renameSubAccount(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const account = this.getNodeParameter('account', 0) as string;
  const newName = this.getNodeParameter('newName', 0) as string;

  const body: IDataObject = cleanObject({
    account,
    newAccountName: newName,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/account/rename', body);
  return toExecutionData(response as IDataObject);
}
