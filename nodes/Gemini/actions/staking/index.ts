/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { geminiPrivateRequest } from '../../transport';
import { toExecutionData, cleanObject } from '../../utils';

export async function getStakingRates(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/staking/rates', {});
  return toExecutionData(response as IDataObject[]);
}

export async function stakeAssets(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const currency = this.getNodeParameter('currency', 0) as string;
  const amount = this.getNodeParameter('amount', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    currency: currency.toUpperCase(),
    amount,
    provider_id: additionalFields.providerId,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/staking/stake', body);
  return toExecutionData(response as IDataObject);
}

export async function unstakeAssets(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const currency = this.getNodeParameter('currency', 0) as string;
  const amount = this.getNodeParameter('amount', 0) as string;
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    currency: currency.toUpperCase(),
    amount,
    provider_id: additionalFields.providerId,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/staking/unstake', body);
  return toExecutionData(response as IDataObject);
}

export async function getStakingBalances(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/staking/balances', {});
  return toExecutionData(response as IDataObject[]);
}

export async function getStakingHistory(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    currency: additionalFields.currency
      ? (additionalFields.currency as string).toUpperCase()
      : undefined,
    since: additionalFields.since,
    until: additionalFields.until,
    limit: additionalFields.limit,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/staking/history', body);
  return toExecutionData(response as IDataObject[]);
}

export async function getStakingRewards(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

  const body: IDataObject = cleanObject({
    currency: additionalFields.currency
      ? (additionalFields.currency as string).toUpperCase()
      : undefined,
    since: additionalFields.since,
    until: additionalFields.until,
  });

  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/staking/rewards', body);
  return toExecutionData(response as IDataObject[]);
}
