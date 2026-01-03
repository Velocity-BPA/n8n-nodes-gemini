/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  INodeType,
  INodeTypeDescription,
  IPollFunctions,
  INodeExecutionData,
} from 'n8n-workflow';

import { geminiPrivateRequest, geminiPublicRequest } from './transport';

let licenseNoticeLogged = false;

function logLicenseNotice(): void {
  if (!licenseNoticeLogged) {
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licenseNoticeLogged = true;
  }
}

export class GeminiTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Gemini Trigger',
    name: 'geminiTrigger',
    icon: 'file:gemini.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Triggers when events occur on Gemini exchange',
    defaults: {
      name: 'Gemini Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'geminiApi',
        required: true,
      },
    ],
    polling: true,
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Deposit Received',
            value: 'depositReceived',
            description: 'Trigger when a new deposit is received',
          },
          {
            name: 'Earn Interest Received',
            value: 'earnInterestReceived',
            description: 'Trigger when earn interest is credited',
          },
          {
            name: 'New Order',
            value: 'newOrder',
            description: 'Trigger when a new order is created',
          },
          {
            name: 'Order Canceled',
            value: 'orderCanceled',
            description: 'Trigger when an order is canceled',
          },
          {
            name: 'Order Filled',
            value: 'orderFilled',
            description: 'Trigger when an order is executed',
          },
          {
            name: 'Price Alert',
            value: 'priceAlert',
            description: 'Trigger when price crosses a threshold',
          },
          {
            name: 'Staking Reward Received',
            value: 'stakingRewardReceived',
            description: 'Trigger when a staking reward is received',
          },
          {
            name: 'Withdrawal Completed',
            value: 'withdrawalCompleted',
            description: 'Trigger when a withdrawal is completed',
          },
        ],
        default: 'orderFilled',
        required: true,
      },
      // Price Alert Options
      {
        displayName: 'Symbol',
        name: 'symbol',
        type: 'string',
        default: 'btcusd',
        required: true,
        description: 'Trading pair symbol to monitor',
        displayOptions: {
          show: {
            event: ['priceAlert'],
          },
        },
      },
      {
        displayName: 'Alert Type',
        name: 'alertType',
        type: 'options',
        options: [
          { name: 'Price Above', value: 'above' },
          { name: 'Price Below', value: 'below' },
          { name: 'Price Crosses', value: 'crosses' },
        ],
        default: 'above',
        required: true,
        displayOptions: {
          show: {
            event: ['priceAlert'],
          },
        },
      },
      {
        displayName: 'Threshold Price',
        name: 'thresholdPrice',
        type: 'number',
        default: 0,
        required: true,
        description: 'Price threshold to trigger the alert',
        displayOptions: {
          show: {
            event: ['priceAlert'],
          },
        },
      },
      // Filter Options
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Currency Filter',
            name: 'currency',
            type: 'string',
            default: '',
            description: 'Filter by specific currency (for transfers/deposits)',
          },
          {
            displayName: 'Minimum Amount',
            name: 'minAmount',
            type: 'number',
            default: 0,
            description: 'Minimum amount to trigger (for transfers)',
          },
          {
            displayName: 'Symbol Filter',
            name: 'symbol',
            type: 'string',
            default: '',
            description: 'Filter by specific trading symbol (for orders)',
          },
        ],
      },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    logLicenseNotice();

    const event = this.getNodeParameter('event') as string;
    const options = this.getNodeParameter('options', {}) as IDataObject;
    const webhookData = this.getWorkflowStaticData('node');
    const lastTimestamp = (webhookData.lastTimestamp as number) || Date.now() - 60000;

    let results: INodeExecutionData[] = [];

    try {
      switch (event) {
        case 'newOrder':
        case 'orderFilled':
        case 'orderCanceled':
          results = await pollOrders.call(this, event, options, lastTimestamp);
          break;
        case 'depositReceived':
        case 'withdrawalCompleted':
          results = await pollTransfers.call(this, event, options, lastTimestamp);
          break;
        case 'priceAlert':
          results = await pollPriceAlert.call(this, webhookData);
          break;
        case 'stakingRewardReceived':
          results = await pollStakingRewards.call(this, options, lastTimestamp);
          break;
        case 'earnInterestReceived':
          results = await pollEarnInterest.call(this, options, lastTimestamp);
          break;
      }

      if (results.length > 0) {
        // Update last timestamp for next poll
        const latestItem = results[results.length - 1];
        if (latestItem.json.timestampms) {
          webhookData.lastTimestamp = latestItem.json.timestampms as number;
        } else {
          webhookData.lastTimestamp = Date.now();
        }
      }
    } catch (error) {
      // On error, update timestamp to avoid reprocessing
      webhookData.lastTimestamp = Date.now();
      throw error;
    }

    if (results.length === 0) {
      return null;
    }

    return [results];
  }
}

async function pollOrders(
  this: IPollFunctions,
  event: string,
  options: IDataObject,
  lastTimestamp: number,
): Promise<INodeExecutionData[]> {
  const results: INodeExecutionData[] = [];

  // Get past trades for filled orders
  if (event === 'orderFilled') {
    const body: IDataObject = {
      timestamp: lastTimestamp,
      limit_trades: 100,
    };

    if (options.symbol) {
      body.symbol = (options.symbol as string).toLowerCase();
    }

    const trades = (await geminiPrivateRequest.call(
      this,
      'POST',
      '/v1/mytrades',
      body,
    )) as IDataObject[];

    for (const trade of trades) {
      if ((trade.timestampms as number) > lastTimestamp) {
        results.push({
          json: {
            ...trade,
            eventType: 'orderFilled',
          },
        });
      }
    }
  }

  // Get active orders for new orders
  if (event === 'newOrder') {
    const orders = (await geminiPrivateRequest.call(
      this,
      'POST',
      '/v1/orders',
      {},
    )) as IDataObject[];

    for (const order of orders) {
      if ((order.timestampms as number) > lastTimestamp) {
        if (!options.symbol || (order.symbol as string) === (options.symbol as string).toLowerCase()) {
          results.push({
            json: {
              ...order,
              eventType: 'newOrder',
            },
          });
        }
      }
    }
  }

  // For canceled orders, we need to check order history
  if (event === 'orderCanceled') {
    const body: IDataObject = {
      timestamp: lastTimestamp,
      limit_trades: 100,
    };

    if (options.symbol) {
      body.symbol = (options.symbol as string).toLowerCase();
    }

    // We check for orders that are now cancelled but were active
    const trades = (await geminiPrivateRequest.call(
      this,
      'POST',
      '/v1/mytrades',
      body,
    )) as IDataObject[];

    // Filter for cancelled fills (trade breaks)
    for (const trade of trades) {
      if (
        (trade.timestampms as number) > lastTimestamp &&
        trade.is_cancelled === true
      ) {
        results.push({
          json: {
            ...trade,
            eventType: 'orderCanceled',
          },
        });
      }
    }
  }

  return results;
}

async function pollTransfers(
  this: IPollFunctions,
  event: string,
  options: IDataObject,
  lastTimestamp: number,
): Promise<INodeExecutionData[]> {
  const results: INodeExecutionData[] = [];

  const body: IDataObject = {
    timestamp: lastTimestamp,
    limit_transfers: 100,
  };

  if (options.currency) {
    body.currency = (options.currency as string).toUpperCase();
  }

  const transfers = (await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/transfers',
    body,
  )) as IDataObject[];

  for (const transfer of transfers) {
    if ((transfer.timestampms as number) <= lastTimestamp) {
      continue;
    }

    // Filter by type
    const transferType = transfer.type as string;
    if (event === 'depositReceived' && transferType !== 'Deposit') {
      continue;
    }
    if (event === 'withdrawalCompleted' && transferType !== 'Withdrawal') {
      continue;
    }

    // Filter by status for withdrawals
    if (event === 'withdrawalCompleted' && transfer.status !== 'Complete') {
      continue;
    }

    // Filter by minimum amount
    if (options.minAmount && parseFloat(transfer.amount as string) < (options.minAmount as number)) {
      continue;
    }

    results.push({
      json: {
        ...transfer,
        eventType: event,
      },
    });
  }

  return results;
}

async function pollPriceAlert(
  this: IPollFunctions,
  webhookData: IDataObject,
): Promise<INodeExecutionData[]> {
  const symbol = this.getNodeParameter('symbol') as string;
  const alertType = this.getNodeParameter('alertType') as string;
  const thresholdPrice = this.getNodeParameter('thresholdPrice') as number;

  const ticker = (await geminiPublicRequest.call(
    this,
    'GET',
    `/v1/pubticker/${symbol.toLowerCase()}`,
  )) as IDataObject;

  const currentPrice = parseFloat(ticker.last as string);
  const lastPrice = (webhookData.lastPrice as number) || currentPrice;

  // Update last price for next check
  webhookData.lastPrice = currentPrice;

  let triggered = false;

  switch (alertType) {
    case 'above':
      triggered = currentPrice > thresholdPrice && lastPrice <= thresholdPrice;
      break;
    case 'below':
      triggered = currentPrice < thresholdPrice && lastPrice >= thresholdPrice;
      break;
    case 'crosses':
      triggered =
        (currentPrice > thresholdPrice && lastPrice <= thresholdPrice) ||
        (currentPrice < thresholdPrice && lastPrice >= thresholdPrice);
      break;
  }

  if (triggered) {
    return [
      {
        json: {
          eventType: 'priceAlert',
          symbol,
          alertType,
          thresholdPrice,
          currentPrice,
          previousPrice: lastPrice,
          ticker,
          triggeredAt: new Date().toISOString(),
        },
      },
    ];
  }

  return [];
}

async function pollStakingRewards(
  this: IPollFunctions,
  options: IDataObject,
  lastTimestamp: number,
): Promise<INodeExecutionData[]> {
  const results: INodeExecutionData[] = [];

  const body: IDataObject = {
    since: new Date(lastTimestamp).toISOString(),
  };

  if (options.currency) {
    body.currency = (options.currency as string).toUpperCase();
  }

  const rewards = (await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/staking/rewards',
    body,
  )) as IDataObject[];

  for (const reward of rewards) {
    const rewardTime = reward.timestamp
      ? new Date(reward.timestamp as string).getTime()
      : Date.now();

    if (rewardTime > lastTimestamp) {
      if (options.minAmount && parseFloat(reward.amount as string) < (options.minAmount as number)) {
        continue;
      }

      results.push({
        json: {
          ...reward,
          eventType: 'stakingRewardReceived',
          timestampms: rewardTime,
        },
      });
    }
  }

  return results;
}

async function pollEarnInterest(
  this: IPollFunctions,
  options: IDataObject,
  lastTimestamp: number,
): Promise<INodeExecutionData[]> {
  const results: INodeExecutionData[] = [];

  const body: IDataObject = {
    since: new Date(lastTimestamp).toISOString(),
  };

  if (options.currency) {
    body.currency = (options.currency as string).toUpperCase();
  }

  const interest = (await geminiPrivateRequest.call(
    this,
    'POST',
    '/v1/earn/interest',
    body,
  )) as IDataObject[];

  for (const item of interest) {
    const itemTime = item.timestamp
      ? new Date(item.timestamp as string).getTime()
      : Date.now();

    if (itemTime > lastTimestamp) {
      if (options.minAmount && parseFloat(item.amount as string) < (options.minAmount as number)) {
        continue;
      }

      results.push({
        json: {
          ...item,
          eventType: 'earnInterestReceived',
          timestampms: itemTime,
        },
      });
    }
  }

  return results;
}
