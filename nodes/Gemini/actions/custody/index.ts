/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { geminiPrivateRequest } from '../../transport';
import { toExecutionData, cleanObject } from '../../utils';

export async function getBalances(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/custody/balances', {});
  return toExecutionData(response as IDataObject[]);
}

export async function getHistory(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    currency: additionalFields.currency
      ? (additionalFields.currency as string).toUpperCase()
      : undefined,
    since: additionalFields.since,
    until: additionalFields.until,
    limit: additionalFields.limit,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/custody/history', body);
  return toExecutionData(response as IDataObject[]);
}
