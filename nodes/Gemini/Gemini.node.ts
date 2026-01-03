/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import * as marketData from './actions/marketData';
import * as orders from './actions/orders';
import * as account from './actions/account';
import * as fundManagement from './actions/fundManagement';
import * as staking from './actions/staking';
import * as earn from './actions/earn';
import * as perpetuals from './actions/perpetuals';
import * as clearing from './actions/clearing';
import * as custody from './actions/custody';
import * as subAccount from './actions/subAccount';
import * as utility from './actions/utility';

import { CANDLE_INTERVALS, ORDER_TYPES, ORDER_OPTIONS, ORDER_SIDES } from './constants';

export class Gemini implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Gemini',
    name: 'gemini',
    icon: 'file:gemini.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Gemini cryptocurrency exchange API',
    defaults: {
      name: 'Gemini',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'geminiApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Account', value: 'account' },
          { name: 'Clearing', value: 'clearing' },
          { name: 'Custody', value: 'custody' },
          { name: 'Earn', value: 'earn' },
          { name: 'Fund Management', value: 'fundManagement' },
          { name: 'Market Data', value: 'marketData' },
          { name: 'Orders', value: 'orders' },
          { name: 'Perpetual Futures', value: 'perpetuals' },
          { name: 'Staking', value: 'staking' },
          { name: 'Sub-Account', value: 'subAccount' },
          { name: 'Utility', value: 'utility' },
        ],
        default: 'marketData',
      },
      // Market Data Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['marketData'] } },
        options: [
          { name: 'Get All Tickers', value: 'getAllTickers', action: 'Get all tickers' },
          { name: 'Get Candles', value: 'getCandles', action: 'Get candlestick data' },
          { name: 'Get Current Order Book', value: 'getCurrentOrderBook', action: 'Get order book' },
          { name: 'Get Derivatives Candles', value: 'getDerivativesCandles', action: 'Get perpetual candles' },
          { name: 'Get Funding Amount', value: 'getFundingAmount', action: 'Get funding amount' },
          { name: 'Get Funding Rate', value: 'getFundingRate', action: 'Get funding rate' },
          { name: 'Get FX Rate', value: 'getFXRate', action: 'Get FX rate' },
          { name: 'Get Network', value: 'getNetwork', action: 'Get supported networks' },
          { name: 'Get Price Feed', value: 'getPriceFeed', action: 'Get price feed' },
          { name: 'Get Symbol Details', value: 'getSymbolDetails', action: 'Get symbol details' },
          { name: 'Get Symbols', value: 'getSymbols', action: 'Get all symbols' },
          { name: 'Get Ticker', value: 'getTicker', action: 'Get ticker' },
          { name: 'Get Ticker V2', value: 'getTickerV2', action: 'Get enhanced ticker' },
          { name: 'Get Trade History', value: 'getTradeHistory', action: 'Get trade history' },
        ],
        default: 'getSymbols',
      },
      // Orders Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['orders'] } },
        options: [
          { name: 'Cancel All Orders', value: 'cancelAllOrders', action: 'Cancel all orders' },
          { name: 'Cancel All Session Orders', value: 'cancelAllSessionOrders', action: 'Cancel session orders' },
          { name: 'Cancel Order', value: 'cancelOrder', action: 'Cancel an order' },
          { name: 'Get Active Orders', value: 'getActiveOrders', action: 'Get active orders' },
          { name: 'Get Notional Volume', value: 'getNotionalVolume', action: 'Get notional volume' },
          { name: 'Get Order Status', value: 'getOrderStatus', action: 'Get order status' },
          { name: 'Get Past Trades', value: 'getPastTrades', action: 'Get past trades' },
          { name: 'Get Trade Volume', value: 'getTradeVolume', action: 'Get trade volume' },
          { name: 'Order Preview', value: 'orderPreview', action: 'Preview order' },
          { name: 'Place New Order', value: 'placeNewOrder', action: 'Place a new order' },
          { name: 'Wrap Order', value: 'wrapOrder', action: 'Wrap/unwrap order' },
        ],
        default: 'getActiveOrders',
      },
      // Account Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['account'] } },
        options: [
          { name: 'Create Deposit Address', value: 'createDepositAddress', action: 'Create deposit address' },
          { name: 'Get Account Details', value: 'getAccountDetails', action: 'Get account details' },
          { name: 'Get Available Balances', value: 'getAvailableBalances', action: 'Get available balances' },
          { name: 'Get Custody Account Fees', value: 'getCustodyAccountFees', action: 'Get custody fees' },
          { name: 'Get Deposit Addresses', value: 'getDepositAddresses', action: 'Get deposit addresses' },
          { name: 'Get Notional Balances', value: 'getNotionalBalances', action: 'Get notional balances' },
          { name: 'Get Transactions', value: 'getTransactions', action: 'Get transactions' },
          { name: 'Get Transfers', value: 'getTransfers', action: 'Get transfers' },
        ],
        default: 'getAvailableBalances',
      },
      // Fund Management Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['fundManagement'] } },
        options: [
          { name: 'Add Approved Address', value: 'addApprovedAddress', action: 'Add approved address' },
          { name: 'Add Bank', value: 'addBank', action: 'Add bank account' },
          { name: 'Get Approved Addresses', value: 'getApprovedAddresses', action: 'Get approved addresses' },
          { name: 'Get Payment Methods', value: 'getPaymentMethods', action: 'Get payment methods' },
          { name: 'Internal Transfer', value: 'internalTransfer', action: 'Internal transfer' },
          { name: 'Remove Approved Address', value: 'removeApprovedAddress', action: 'Remove approved address' },
          { name: 'Withdraw', value: 'withdraw', action: 'Withdraw cryptocurrency' },
          { name: 'Withdraw GUSD', value: 'withdrawGUSD', action: 'Withdraw GUSD' },
        ],
        default: 'getPaymentMethods',
      },
      // Staking Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['staking'] } },
        options: [
          { name: 'Get Staking Balances', value: 'getStakingBalances', action: 'Get staking balances' },
          { name: 'Get Staking History', value: 'getStakingHistory', action: 'Get staking history' },
          { name: 'Get Staking Rates', value: 'getStakingRates', action: 'Get staking rates' },
          { name: 'Get Staking Rewards', value: 'getStakingRewards', action: 'Get staking rewards' },
          { name: 'Stake Assets', value: 'stakeAssets', action: 'Stake assets' },
          { name: 'Unstake Assets', value: 'unstakeAssets', action: 'Unstake assets' },
        ],
        default: 'getStakingRates',
      },
      // Earn Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['earn'] } },
        options: [
          { name: 'Get Earn Balances', value: 'getEarnBalances', action: 'Get earn balances' },
          { name: 'Get Earn History', value: 'getEarnHistory', action: 'Get earn history' },
          { name: 'Get Earn Interest History', value: 'getEarnInterestHistory', action: 'Get interest history' },
          { name: 'Get Earn Rates', value: 'getEarnRates', action: 'Get earn rates' },
          { name: 'Redeem Earn', value: 'redeemEarn', action: 'Redeem from earn' },
          { name: 'Subscribe Earn', value: 'subscribeEarn', action: 'Subscribe to earn' },
        ],
        default: 'getEarnRates',
      },
      // Perpetuals Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['perpetuals'] } },
        options: [
          { name: 'Get Funding Payments', value: 'getFundingPayments', action: 'Get funding payments' },
          { name: 'Get Perpetual Details', value: 'getPerpetualDetails', action: 'Get perpetual details' },
          { name: 'Get Positions', value: 'getPositions', action: 'Get open positions' },
          { name: 'Get Transfers', value: 'getTransfers', action: 'Get perpetual transfers' },
          { name: 'Risk Limits', value: 'riskLimits', action: 'Get/set risk limits' },
        ],
        default: 'getPositions',
      },
      // Clearing Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['clearing'] } },
        options: [
          { name: 'Cancel Clearing Trade', value: 'cancelClearingTrade', action: 'Cancel clearing trade' },
          { name: 'Confirm Trade', value: 'confirmTrade', action: 'Confirm clearing trade' },
          { name: 'Get Broker Trades', value: 'getBrokerTrades', action: 'Get broker trades' },
          { name: 'Get Clearing Trades', value: 'getClearingTrades', action: 'Get clearing trades' },
        ],
        default: 'getClearingTrades',
      },
      // Custody Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['custody'] } },
        options: [
          { name: 'Get Balances', value: 'getBalances', action: 'Get custody balances' },
          { name: 'Get History', value: 'getHistory', action: 'Get custody history' },
        ],
        default: 'getBalances',
      },
      // Sub-Account Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['subAccount'] } },
        options: [
          { name: 'Create Sub-Account', value: 'createSubAccount', action: 'Create sub-account' },
          { name: 'Get Sub-Account Balance', value: 'getSubAccountBalance', action: 'Get sub-account balance' },
          { name: 'Get Sub-Accounts', value: 'getSubAccounts', action: 'Get sub-accounts' },
          { name: 'Rename Sub-Account', value: 'renameSubAccount', action: 'Rename sub-account' },
        ],
        default: 'getSubAccounts',
      },
      // Utility Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['utility'] } },
        options: [
          { name: 'Get API Health', value: 'getAPIHealth', action: 'Get API health status' },
          { name: 'Heartbeat', value: 'heartbeat', action: 'Send heartbeat' },
        ],
        default: 'getAPIHealth',
      },
      // Common Parameters
      {
        displayName: 'Symbol',
        name: 'symbol',
        type: 'string',
        default: 'btcusd',
        required: true,
        description: 'Trading pair symbol (e.g., btcusd, ethusd)',
        displayOptions: {
          show: {
            resource: ['marketData', 'orders', 'clearing'],
            operation: [
              'getSymbolDetails', 'getTicker', 'getTickerV2', 'getCandles',
              'getDerivativesCandles', 'getCurrentOrderBook', 'getTradeHistory',
              'getFundingAmount', 'getFundingRate', 'getFXRate', 'placeNewOrder',
              'orderPreview', 'wrapOrder', 'confirmTrade',
            ],
          },
        },
      },
      {
        displayName: 'Symbol',
        name: 'symbol',
        type: 'string',
        default: 'BTCGUSDPERP',
        required: true,
        description: 'Perpetual contract symbol',
        displayOptions: {
          show: {
            resource: ['perpetuals'],
            operation: ['getPerpetualDetails'],
          },
        },
      },
      {
        displayName: 'Token',
        name: 'token',
        type: 'string',
        default: 'btc',
        required: true,
        description: 'Token symbol (e.g., btc, eth)',
        displayOptions: {
          show: {
            resource: ['marketData'],
            operation: ['getNetwork'],
          },
        },
      },
      {
        displayName: 'Time Frame',
        name: 'timeFrame',
        type: 'options',
        options: CANDLE_INTERVALS,
        default: '1hr',
        required: true,
        displayOptions: {
          show: {
            resource: ['marketData'],
            operation: ['getCandles', 'getDerivativesCandles'],
          },
        },
      },
      // Order Parameters
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'string',
        default: '',
        required: true,
        description: 'Quantity of the order',
        displayOptions: {
          show: {
            resource: ['orders', 'clearing', 'staking', 'earn', 'fundManagement'],
            operation: [
              'placeNewOrder', 'orderPreview', 'wrapOrder', 'confirmTrade',
              'stakeAssets', 'unstakeAssets', 'subscribeEarn', 'redeemEarn',
              'withdraw', 'withdrawGUSD', 'internalTransfer',
            ],
          },
        },
      },
      {
        displayName: 'Side',
        name: 'side',
        type: 'options',
        options: ORDER_SIDES,
        default: 'buy',
        required: true,
        displayOptions: {
          show: {
            resource: ['orders', 'clearing'],
            operation: ['placeNewOrder', 'orderPreview', 'wrapOrder', 'confirmTrade'],
          },
        },
      },
      {
        displayName: 'Order Type',
        name: 'orderType',
        type: 'options',
        options: ORDER_TYPES,
        default: 'exchange limit',
        required: true,
        displayOptions: {
          show: {
            resource: ['orders'],
            operation: ['placeNewOrder', 'orderPreview'],
          },
        },
      },
      {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'string',
        default: '',
        required: true,
        description: 'The order ID to operate on',
        displayOptions: {
          show: {
            resource: ['orders', 'clearing'],
            operation: ['cancelOrder', 'getOrderStatus', 'cancelClearingTrade'],
          },
        },
      },
      {
        displayName: 'Price',
        name: 'price',
        type: 'string',
        default: '',
        required: true,
        description: 'Price for the order',
        displayOptions: {
          show: {
            resource: ['clearing'],
            operation: ['confirmTrade'],
          },
        },
      },
      {
        displayName: 'Counterparty ID',
        name: 'counterpartyId',
        type: 'string',
        default: '',
        required: true,
        description: 'The counterparty ID for clearing',
        displayOptions: {
          show: {
            resource: ['clearing'],
            operation: ['confirmTrade'],
          },
        },
      },
      // Account Parameters
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: 'USD',
        required: true,
        description: 'Currency code (e.g., USD, BTC, ETH)',
        displayOptions: {
          show: {
            resource: ['account', 'fundManagement', 'staking', 'earn'],
            operation: [
              'getNotionalBalances', 'createDepositAddress', 'withdraw',
              'internalTransfer', 'stakeAssets', 'unstakeAssets',
              'subscribeEarn', 'redeemEarn',
            ],
          },
        },
      },
      {
        displayName: 'Network',
        name: 'network',
        type: 'string',
        default: 'bitcoin',
        required: true,
        description: 'Network name (e.g., bitcoin, ethereum)',
        displayOptions: {
          show: {
            resource: ['account', 'fundManagement'],
            operation: ['getDepositAddresses', 'addApprovedAddress', 'removeApprovedAddress', 'getApprovedAddresses'],
          },
        },
      },
      // Fund Management Parameters
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        default: '',
        required: true,
        description: 'Destination address',
        displayOptions: {
          show: {
            resource: ['fundManagement'],
            operation: ['withdraw', 'withdrawGUSD', 'addApprovedAddress', 'removeApprovedAddress'],
          },
        },
      },
      {
        displayName: 'Label',
        name: 'label',
        type: 'string',
        default: '',
        required: true,
        description: 'Label for the address',
        displayOptions: {
          show: {
            resource: ['fundManagement'],
            operation: ['addApprovedAddress'],
          },
        },
      },
      {
        displayName: 'Account Name',
        name: 'accountName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['fundManagement'],
            operation: ['addBank'],
          },
        },
      },
      {
        displayName: 'Account Number',
        name: 'accountNumber',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['fundManagement'],
            operation: ['addBank'],
          },
        },
      },
      {
        displayName: 'Routing Number',
        name: 'routingNumber',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['fundManagement'],
            operation: ['addBank'],
          },
        },
      },
      {
        displayName: 'Account Type',
        name: 'accountType',
        type: 'options',
        options: [
          { name: 'Checking', value: 'checking' },
          { name: 'Savings', value: 'savings' },
        ],
        default: 'checking',
        required: true,
        displayOptions: {
          show: {
            resource: ['fundManagement', 'subAccount'],
            operation: ['addBank', 'createSubAccount'],
          },
        },
      },
      {
        displayName: 'Source Account',
        name: 'sourceAccount',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['fundManagement'],
            operation: ['internalTransfer'],
          },
        },
      },
      {
        displayName: 'Target Account',
        name: 'targetAccount',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['fundManagement'],
            operation: ['internalTransfer'],
          },
        },
      },
      // Sub-Account Parameters
      {
        displayName: 'Account',
        name: 'account',
        type: 'string',
        default: '',
        required: true,
        description: 'Sub-account identifier',
        displayOptions: {
          show: {
            resource: ['subAccount'],
            operation: ['getSubAccountBalance', 'renameSubAccount'],
          },
        },
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        description: 'Name for the sub-account',
        displayOptions: {
          show: {
            resource: ['subAccount'],
            operation: ['createSubAccount'],
          },
        },
      },
      {
        displayName: 'New Name',
        name: 'newName',
        type: 'string',
        default: '',
        required: true,
        description: 'New name for the sub-account',
        displayOptions: {
          show: {
            resource: ['subAccount'],
            operation: ['renameSubAccount'],
          },
        },
      },
      // Perpetuals Parameters
      {
        displayName: 'Risk Operation',
        name: 'riskOperation',
        type: 'options',
        options: [
          { name: 'Get Risk Limits', value: 'get' },
          { name: 'Set Risk Limits', value: 'set' },
        ],
        default: 'get',
        required: true,
        displayOptions: {
          show: {
            resource: ['perpetuals'],
            operation: ['riskLimits'],
          },
        },
      },
      // Additional Fields
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['marketData'],
            operation: ['getCurrentOrderBook'],
          },
        },
        options: [
          {
            displayName: 'Limit Asks',
            name: 'limitAsks',
            type: 'number',
            default: 50,
            description: 'Limit for asks',
          },
          {
            displayName: 'Limit Bids',
            name: 'limitBids',
            type: 'number',
            default: 50,
            description: 'Limit for bids',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['marketData'],
            operation: ['getTradeHistory'],
          },
        },
        options: [
          {
            displayName: 'Include Breaks',
            name: 'includeBreaks',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Limit Trades',
            name: 'limitTrades',
            type: 'number',
            default: 50,
          },
          {
            displayName: 'Since TID',
            name: 'sinceTid',
            type: 'number',
            default: 0,
          },
          {
            displayName: 'Timestamp',
            name: 'timestamp',
            type: 'number',
            default: 0,
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['orders'],
            operation: ['placeNewOrder'],
          },
        },
        options: [
          {
            displayName: 'Client Order ID',
            name: 'clientOrderId',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Min Amount',
            name: 'minAmount',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Options',
            name: 'options',
            type: 'multiOptions',
            options: ORDER_OPTIONS,
            default: [],
          },
          {
            displayName: 'Price',
            name: 'price',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Stop Price',
            name: 'stopPrice',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['orders'],
            operation: ['getPastTrades'],
          },
        },
        options: [
          {
            displayName: 'Limit Trades',
            name: 'limitTrades',
            type: 'number',
            default: 50,
          },
          {
            displayName: 'Return All',
            name: 'returnAll',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Symbol',
            name: 'symbol',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Timestamp',
            name: 'timestamp',
            type: 'number',
            default: 0,
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['orders'],
            operation: ['orderPreview', 'wrapOrder'],
          },
        },
        options: [
          {
            displayName: 'Client Order ID',
            name: 'clientOrderId',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Price',
            name: 'price',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['account'],
            operation: ['getTransfers'],
          },
        },
        options: [
          {
            displayName: 'Currency',
            name: 'currency',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Limit Transfers',
            name: 'limitTransfers',
            type: 'number',
            default: 50,
          },
          {
            displayName: 'Show Completed Deposit Advances',
            name: 'showCompletedDepositAdvances',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Timestamp',
            name: 'timestamp',
            type: 'number',
            default: 0,
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['account'],
            operation: ['getTransactions'],
          },
        },
        options: [
          {
            displayName: 'Limit Transfers',
            name: 'limitTransfers',
            type: 'number',
            default: 50,
          },
          {
            displayName: 'Timestamp',
            name: 'timestamp',
            type: 'number',
            default: 0,
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['account'],
            operation: ['createDepositAddress'],
          },
        },
        options: [
          {
            displayName: 'Label',
            name: 'label',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Legacy',
            name: 'legacy',
            type: 'boolean',
            default: false,
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['fundManagement'],
            operation: ['withdraw', 'withdrawGUSD'],
          },
        },
        options: [
          {
            displayName: 'Client Transfer ID',
            name: 'clientTransferId',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Memo',
            name: 'memo',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['fundManagement'],
            operation: ['addApprovedAddress'],
          },
        },
        options: [
          {
            displayName: 'Memo',
            name: 'memo',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['staking', 'earn'],
            operation: ['stakeAssets', 'unstakeAssets', 'subscribeEarn', 'redeemEarn'],
          },
        },
        options: [
          {
            displayName: 'Provider ID',
            name: 'providerId',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['staking', 'earn', 'custody'],
            operation: ['getStakingHistory', 'getStakingRewards', 'getEarnHistory', 'getEarnInterestHistory', 'getHistory'],
          },
        },
        options: [
          {
            displayName: 'Currency',
            name: 'currency',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            default: 50,
          },
          {
            displayName: 'Since',
            name: 'since',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'Until',
            name: 'until',
            type: 'dateTime',
            default: '',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['perpetuals'],
            operation: ['getFundingPayments', 'getTransfers'],
          },
        },
        options: [
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            default: 50,
          },
          {
            displayName: 'Since',
            name: 'since',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'Symbol',
            name: 'symbol',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Until',
            name: 'until',
            type: 'dateTime',
            default: '',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['perpetuals'],
            operation: ['riskLimits'],
            riskOperation: ['set'],
          },
        },
        options: [
          {
            displayName: 'Max Leverage',
            name: 'maxLeverage',
            type: 'number',
            default: 10,
          },
          {
            displayName: 'Max Notional Value',
            name: 'maxNotionalValue',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['clearing'],
            operation: ['confirmTrade'],
          },
        },
        options: [
          {
            displayName: 'Client Order ID',
            name: 'clientOrderId',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Expires At',
            name: 'expiresAt',
            type: 'dateTime',
            default: '',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['clearing'],
            operation: ['getClearingTrades', 'getBrokerTrades'],
          },
        },
        options: [
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            default: 50,
          },
          {
            displayName: 'Symbol',
            name: 'symbol',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Timestamp',
            name: 'timestamp',
            type: 'number',
            default: 0,
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    let result: INodeExecutionData[] = [];

    try {
      switch (resource) {
        case 'marketData':
          result = await executeMarketData.call(this, operation);
          break;
        case 'orders':
          result = await executeOrders.call(this, operation);
          break;
        case 'account':
          result = await executeAccount.call(this, operation);
          break;
        case 'fundManagement':
          result = await executeFundManagement.call(this, operation);
          break;
        case 'staking':
          result = await executeStaking.call(this, operation);
          break;
        case 'earn':
          result = await executeEarn.call(this, operation);
          break;
        case 'perpetuals':
          result = await executePerpetuals.call(this, operation);
          break;
        case 'clearing':
          result = await executeClearing.call(this, operation);
          break;
        case 'custody':
          result = await executeCustody.call(this, operation);
          break;
        case 'subAccount':
          result = await executeSubAccount.call(this, operation);
          break;
        case 'utility':
          result = await executeUtility.call(this, operation);
          break;
        default:
          throw new Error(`Unknown resource: ${resource}`);
      }
    } catch (error) {
      if (this.continueOnFail()) {
        return [[{ json: { error: (error as Error).message } }]];
      }
      throw error;
    }

    return [result];
  }
}

async function executeMarketData(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getSymbols':
      return marketData.getSymbols.call(this);
    case 'getSymbolDetails':
      return marketData.getSymbolDetails.call(this);
    case 'getNetwork':
      return marketData.getNetwork.call(this);
    case 'getTicker':
      return marketData.getTicker.call(this);
    case 'getTickerV2':
      return marketData.getTickerV2.call(this);
    case 'getAllTickers':
      return marketData.getAllTickers.call(this);
    case 'getCandles':
      return marketData.getCandles.call(this);
    case 'getDerivativesCandles':
      return marketData.getDerivativesCandles.call(this);
    case 'getCurrentOrderBook':
      return marketData.getCurrentOrderBook.call(this);
    case 'getTradeHistory':
      return marketData.getTradeHistory.call(this);
    case 'getPriceFeed':
      return marketData.getPriceFeed.call(this);
    case 'getFundingAmount':
      return marketData.getFundingAmount.call(this);
    case 'getFundingRate':
      return marketData.getFundingRate.call(this);
    case 'getFXRate':
      return marketData.getFXRate.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function executeOrders(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'placeNewOrder':
      return orders.placeNewOrder.call(this);
    case 'cancelOrder':
      return orders.cancelOrder.call(this);
    case 'cancelAllOrders':
      return orders.cancelAllOrders.call(this);
    case 'cancelAllSessionOrders':
      return orders.cancelAllSessionOrders.call(this);
    case 'getOrderStatus':
      return orders.getOrderStatus.call(this);
    case 'getActiveOrders':
      return orders.getActiveOrders.call(this);
    case 'getPastTrades':
      return orders.getPastTrades.call(this);
    case 'getNotionalVolume':
      return orders.getNotionalVolume.call(this);
    case 'getTradeVolume':
      return orders.getTradeVolume.call(this);
    case 'orderPreview':
      return orders.orderPreview.call(this);
    case 'wrapOrder':
      return orders.wrapOrder.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function executeAccount(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getAvailableBalances':
      return account.getAvailableBalances.call(this);
    case 'getNotionalBalances':
      return account.getNotionalBalances.call(this);
    case 'getTransfers':
      return account.getTransfers.call(this);
    case 'getTransactions':
      return account.getTransactions.call(this);
    case 'getCustodyAccountFees':
      return account.getCustodyAccountFees.call(this);
    case 'getAccountDetails':
      return account.getAccountDetails.call(this);
    case 'createDepositAddress':
      return account.createDepositAddress.call(this);
    case 'getDepositAddresses':
      return account.getDepositAddresses.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function executeFundManagement(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'withdraw':
      return fundManagement.withdraw.call(this);
    case 'addBank':
      return fundManagement.addBank.call(this);
    case 'getPaymentMethods':
      return fundManagement.getPaymentMethods.call(this);
    case 'internalTransfer':
      return fundManagement.internalTransfer.call(this);
    case 'withdrawGUSD':
      return fundManagement.withdrawGUSD.call(this);
    case 'addApprovedAddress':
      return fundManagement.addApprovedAddress.call(this);
    case 'removeApprovedAddress':
      return fundManagement.removeApprovedAddress.call(this);
    case 'getApprovedAddresses':
      return fundManagement.getApprovedAddresses.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function executeStaking(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getStakingRates':
      return staking.getStakingRates.call(this);
    case 'stakeAssets':
      return staking.stakeAssets.call(this);
    case 'unstakeAssets':
      return staking.unstakeAssets.call(this);
    case 'getStakingBalances':
      return staking.getStakingBalances.call(this);
    case 'getStakingHistory':
      return staking.getStakingHistory.call(this);
    case 'getStakingRewards':
      return staking.getStakingRewards.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function executeEarn(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getEarnRates':
      return earn.getEarnRates.call(this);
    case 'getEarnBalances':
      return earn.getEarnBalances.call(this);
    case 'subscribeEarn':
      return earn.subscribeEarn.call(this);
    case 'redeemEarn':
      return earn.redeemEarn.call(this);
    case 'getEarnHistory':
      return earn.getEarnHistory.call(this);
    case 'getEarnInterestHistory':
      return earn.getEarnInterestHistory.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function executePerpetuals(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getPositions':
      return perpetuals.getPositions.call(this);
    case 'getFundingPayments':
      return perpetuals.getFundingPayments.call(this);
    case 'getTransfers':
      return perpetuals.getTransfers.call(this);
    case 'riskLimits':
      return perpetuals.riskLimits.call(this);
    case 'getPerpetualDetails':
      return perpetuals.getPerpetualDetails.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function executeClearing(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'confirmTrade':
      return clearing.confirmTrade.call(this);
    case 'getClearingTrades':
      return clearing.getClearingTrades.call(this);
    case 'getBrokerTrades':
      return clearing.getBrokerTrades.call(this);
    case 'cancelClearingTrade':
      return clearing.cancelClearingTrade.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function executeCustody(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getBalances':
      return custody.getBalances.call(this);
    case 'getHistory':
      return custody.getHistory.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function executeSubAccount(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getSubAccounts':
      return subAccount.getSubAccounts.call(this);
    case 'getSubAccountBalance':
      return subAccount.getSubAccountBalance.call(this);
    case 'createSubAccount':
      return subAccount.createSubAccount.call(this);
    case 'renameSubAccount':
      return subAccount.renameSubAccount.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function executeUtility(
  this: IExecuteFunctions,
  operation: string,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'heartbeat':
      return utility.heartbeat.call(this);
    case 'getAPIHealth':
      return utility.getAPIHealth.call(this);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
