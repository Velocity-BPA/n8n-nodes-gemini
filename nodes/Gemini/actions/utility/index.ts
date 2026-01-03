/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { geminiPrivateRequest, geminiPublicRequest } from '../../transport';
import { toExecutionData } from '../../utils';

export async function heartbeat(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPrivateRequest.call(this, 'POST', '/v1/heartbeat', {});
  return toExecutionData(response as IDataObject);
}

export async function getAPIHealth(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await geminiPublicRequest.call(this, 'GET', '/v1/status');
  return toExecutionData(response as IDataObject);
}
