/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const GEMINI_PRODUCTION_URL = 'https://api.gemini.com';
export const GEMINI_SANDBOX_URL = 'https://api.sandbox.gemini.com';

export const API_VERSION = {
  V1: '/v1',
  V2: '/v2',
};

export const ORDER_TYPES = [
  { name: 'Exchange Limit', value: 'exchange limit' },
  { name: 'Exchange Stop Limit', value: 'exchange stop limit' },
  { name: 'Market Buy', value: 'market buy' },
  { name: 'Market Sell', value: 'market sell' },
];

export const ORDER_OPTIONS = [
  { name: 'Maker or Cancel', value: 'maker-or-cancel' },
  { name: 'Immediate or Cancel', value: 'immediate-or-cancel' },
  { name: 'Fill or Kill', value: 'fill-or-kill' },
  { name: 'Auction Only', value: 'auction-only' },
  { name: 'Indication of Interest', value: 'indication-of-interest' },
];

export const ORDER_SIDES = [
  { name: 'Buy', value: 'buy' },
  { name: 'Sell', value: 'sell' },
];

export const CANDLE_INTERVALS = [
  { name: '1 Minute', value: '1m' },
  { name: '5 Minutes', value: '5m' },
  { name: '15 Minutes', value: '15m' },
  { name: '30 Minutes', value: '30m' },
  { name: '1 Hour', value: '1hr' },
  { name: '6 Hours', value: '6hr' },
  { name: '1 Day', value: '1day' },
];

export const TRANSFER_TYPES = [
  { name: 'Deposit', value: 'Deposit' },
  { name: 'Withdrawal', value: 'Withdrawal' },
  { name: 'Reward', value: 'Reward' },
  { name: 'Fee Credit', value: 'Fee Credit' },
  { name: 'Interest Credit', value: 'Interest Credit' },
];

export const ACCOUNT_TYPES = [
  { name: 'Exchange', value: 'exchange' },
  { name: 'Custody', value: 'custody' },
];

export const RESOURCE_OPERATIONS = {
  marketData: [
    'getSymbols',
    'getSymbolDetails',
    'getNetwork',
    'getTicker',
    'getTickerV2',
    'getAllTickers',
    'getCandles',
    'getDerivativesCandles',
    'getCurrentOrderBook',
    'getTradeHistory',
    'getPriceFeed',
    'getFundingAmount',
    'getFundingRate',
    'getFXRate',
  ],
  orders: [
    'placeNewOrder',
    'cancelOrder',
    'cancelAllOrders',
    'cancelAllSessionOrders',
    'getOrderStatus',
    'getActiveOrders',
    'getPastTrades',
    'getNotionalVolume',
    'getTradeVolume',
    'orderPreview',
    'wrapOrder',
  ],
  account: [
    'getAvailableBalances',
    'getNotionalBalances',
    'getTransfers',
    'getTransactions',
    'getCustodyAccountFees',
    'getAccountDetails',
    'createDepositAddress',
    'getDepositAddresses',
  ],
  fundManagement: [
    'withdraw',
    'addBank',
    'getPaymentMethods',
    'internalTransfer',
    'withdrawGUSD',
    'addApprovedAddress',
    'removeApprovedAddress',
    'getApprovedAddresses',
  ],
  staking: [
    'getStakingRates',
    'stakeAssets',
    'unstakeAssets',
    'getStakingBalances',
    'getStakingHistory',
    'getStakingRewards',
  ],
  earn: [
    'getEarnRates',
    'getEarnBalances',
    'subscribeEarn',
    'redeemEarn',
    'getEarnHistory',
    'getEarnInterestHistory',
  ],
  perpetuals: [
    'getPositions',
    'getFundingPayments',
    'getTransfers',
    'riskLimits',
    'getPerpetualDetails',
  ],
  clearing: [
    'confirmTrade',
    'getClearingTrades',
    'getBrokerTrades',
    'cancelClearingTrade',
  ],
  custody: ['getBalances', 'getHistory'],
  subAccount: [
    'getSubAccounts',
    'getSubAccountBalance',
    'createSubAccount',
    'renameSubAccount',
  ],
  utility: ['heartbeat', 'getAPIHealth'],
};

export const ERROR_CODES: Record<string, string> = {
  AuctionNotOpen: 'The auction is not open for new orders',
  ClientOrderIdTooLong: 'Client order ID exceeds maximum length',
  ClientOrderIdMustBeString: 'Client order ID must be a string',
  ConflictingOptions: 'Order options conflict with each other',
  EndpointMismatch: 'Payload endpoint does not match request endpoint',
  EndpointNotFound: 'Requested endpoint does not exist',
  IneligibleTiming: 'Order cannot be placed at this time',
  InsufficientFunds: 'Insufficient funds for the order',
  InvalidJson: 'Request body is not valid JSON',
  InvalidNonce: 'Nonce is not valid',
  InvalidOrderType: 'Order type is not valid',
  InvalidPrice: 'Price is not valid',
  InvalidQuantity: 'Quantity is not valid',
  InvalidSide: 'Side must be buy or sell',
  InvalidSignature: 'Signature is not valid',
  InvalidSymbol: 'Trading pair symbol is not valid',
  InvalidTimestampInPayload: 'Timestamp in payload is too old',
  Maintenance: 'System is in maintenance mode',
  MarketNotOpen: 'Market is not open for trading',
  MissingApikeyHeader: 'X-GEMINI-APIKEY header is missing',
  MissingOrderField: 'Required order field is missing',
  MissingPayloadHeader: 'X-GEMINI-PAYLOAD header is missing',
  MissingSignatureHeader: 'X-GEMINI-SIGNATURE header is missing',
  NoSSL: 'Request must use HTTPS',
  OptionsMustBeArray: 'Options must be an array',
  OrderNotFound: 'Order not found',
  RateLimit: 'Rate limit exceeded',
  System: 'System error occurred',
  UnsupportedOption: 'Order option is not supported',
};

export interface GeminiCredentials {
  apiKey: string;
  apiSecret: string;
  account?: string;
  environment: 'production' | 'sandbox';
  baseUrl?: string;
}

export interface GeminiOrder {
  order_id: string;
  id: string;
  client_order_id?: string;
  symbol: string;
  exchange: string;
  avg_execution_price: string;
  side: string;
  type: string;
  timestamp: string;
  timestampms: number;
  is_live: boolean;
  is_cancelled: boolean;
  is_hidden: boolean;
  was_forced: boolean;
  executed_amount: string;
  remaining_amount: string;
  options: string[];
  price: string;
  original_amount: string;
}

export interface GeminiTicker {
  bid: string;
  ask: string;
  last: string;
  volume: Record<string, string>;
}

export interface GeminiBalance {
  type: string;
  currency: string;
  amount: string;
  available: string;
  availableForWithdrawal: string;
}

export interface GeminiTransfer {
  type: string;
  status: string;
  timestampms: number;
  eid: number;
  currency: string;
  amount: string;
  method?: string;
  txHash?: string;
  outputIdx?: number;
  destination?: string;
  purpose?: string;
}

export interface GeminiTrade {
  price: string;
  amount: string;
  timestamp: number;
  timestampms: number;
  type: string;
  aggressor: boolean;
  fee_currency: string;
  fee_amount: string;
  tid: number;
  order_id: string;
  exchange: string;
  is_auction_fill: boolean;
  is_clearing_fill: boolean;
  symbol: string;
  client_order_id?: string;
}

export interface GeminiSymbolDetails {
  symbol: string;
  base_currency: string;
  quote_currency: string;
  tick_size: number;
  quote_increment: number;
  min_order_size: string;
  status: string;
  wrap_enabled: boolean;
}

export interface GeminiCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface GeminiOrderBook {
  bids: Array<{ price: string; amount: string }>;
  asks: Array<{ price: string; amount: string }>;
}

export interface GeminiStakingBalance {
  currency: string;
  balance: string;
  availableForStaking: string;
  availableForUnstaking: string;
  lastStakeDate?: string;
  lastUnstakeDate?: string;
}

export interface GeminiEarnBalance {
  currency: string;
  balance: string;
  availableForRedemption: string;
  accruedInterest: string;
}

export interface GeminiPerpetualPosition {
  symbol: string;
  side: string;
  quantity: string;
  entryPrice: string;
  markPrice: string;
  liquidationPrice: string;
  unrealizedPnl: string;
}

export interface GeminiSubAccount {
  name: string;
  account: string;
  type: string;
  created: string;
}

export interface GeminiApiError {
  result: 'error';
  reason: string;
  message: string;
}
