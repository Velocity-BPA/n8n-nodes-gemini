# n8n-nodes-gemini

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Gemini**, the US-regulated cryptocurrency exchange founded by the Winklevoss twins. This node provides complete integration with Gemini's REST API for spot trading, perpetual futures, staking, earn programs, and account management.

![n8n](https://img.shields.io/badge/n8n-community%20node-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **11 Resource Categories** with 80+ operations
- **Complete Trading Suite**: Spot orders, perpetual futures, and derivatives
- **Staking & Earn**: Stake assets and earn interest on holdings
- **Fund Management**: Deposits, withdrawals, and internal transfers
- **Account Management**: Balances, transaction history, and custody
- **Sub-Account Support**: Master account management capabilities
- **Market Data**: Real-time tickers, order books, candles, and trade history
- **Trigger Node**: Poll-based triggers for trading events and price alerts
- **Sandbox Support**: Test with Gemini sandbox environment
- **GUSD Integration**: Native Gemini Dollar stablecoin operations

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-gemini`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-gemini
```

### Development Installation

```bash
# Clone and enter directory
git clone https://github.com/Velocity-BPA/n8n-nodes-gemini.git
cd n8n-nodes-gemini

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-gemini

# Restart n8n
n8n start
```

## Credentials Setup

Create Gemini API credentials in n8n with the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| API Key | String | Yes | Your Gemini API key |
| API Secret | String | Yes | Your Gemini API secret |
| Account | String | No | Sub-account hash (for master accounts) |
| Environment | Select | Yes | Production or Sandbox |
| Base URL | String | No | Custom API URL (defaults to official endpoints) |

### Getting API Credentials

1. Log in to your [Gemini account](https://exchange.gemini.com/)
2. Navigate to **Account** > **API Settings**
3. Click **Create a New API Key**
4. Select appropriate permissions (Trader, Fund Manager, or Auditor)
5. Copy the API Key and Secret (secret shown only once!)
6. For sandbox testing, use [sandbox.gemini.com](https://exchange.sandbox.gemini.com/)

## Resources & Operations

### Market Data (Public)
| Operation | Description |
|-----------|-------------|
| getSymbols | Get all available trading symbols |
| getSymbolDetails | Get detailed symbol information |
| getNetwork | Get supported networks for asset |
| getTicker | Get current ticker for symbol |
| getTickerV2 | Get enhanced ticker with volume data |
| getAllTickers | Get tickers for all symbols |
| getCandles | Get OHLCV candlestick data |
| getDerivativesCandles | Get perpetual contract candles |
| getCurrentOrderBook | Get current order book |
| getTradeHistory | Get recent public trades |
| getPriceFeed | Get price feed for all symbols |
| getFundingAmount | Get perpetual funding amount |
| getFundingRate | Get current funding rate |
| getFXRate | Get FX rate for fiat pairs |

### Orders
| Operation | Description |
|-----------|-------------|
| placeNewOrder | Place new order (limit/market/stop-limit) |
| cancelOrder | Cancel order by ID |
| cancelAllOrders | Cancel all active orders |
| cancelAllSessionOrders | Cancel all session orders |
| getOrderStatus | Get status of specific order |
| getActiveOrders | Get all active orders |
| getPastTrades | Get past trade history |
| getNotionalVolume | Get 30-day notional volume |
| getTradeVolume | Get trade volume |
| orderPreview | Preview order impact |
| wrapOrder | Wrap/unwrap ETH to WETH |

### Account
| Operation | Description |
|-----------|-------------|
| getAvailableBalances | Get available balances |
| getNotionalBalances | Get balances in USD value |
| getTransfers | Get deposit/withdrawal history |
| getTransactions | Get account transactions |
| getCustodyAccountFees | Get custody account fees |
| getAccountDetails | Get account information |
| createDepositAddress | Create new deposit address |
| getDepositAddresses | Get all deposit addresses |

### Fund Management
| Operation | Description |
|-----------|-------------|
| withdraw | Withdraw cryptocurrency |
| withdrawGUSD | Withdraw GUSD stablecoin |
| addBank | Add bank account |
| getPaymentMethods | Get payment methods |
| internalTransfer | Transfer between accounts |
| addApprovedAddress | Add approved withdrawal address |
| removeApprovedAddress | Remove approved address |
| getApprovedAddresses | Get approved addresses list |

### Staking
| Operation | Description |
|-----------|-------------|
| getStakingRates | Get current staking APY rates |
| stakeAssets | Stake assets |
| unstakeAssets | Unstake assets |
| getStakingBalances | Get staking balances |
| getStakingHistory | Get staking transaction history |
| getStakingRewards | Get staking rewards |

### Earn (Lending)
| Operation | Description |
|-----------|-------------|
| getEarnRates | Get earn interest rates |
| getEarnBalances | Get earn program balances |
| subscribeEarn | Subscribe assets to earn |
| redeemEarn | Redeem from earn program |
| getEarnHistory | Get earn transaction history |
| getEarnInterestHistory | Get interest accrual history |

### Perpetual Futures
| Operation | Description |
|-----------|-------------|
| getPositions | Get open perpetual positions |
| getFundingPayments | Get funding payment history |
| getTransfers | Get perpetual transfers |
| riskLimits | Get or set risk limits |
| getPerpetualDetails | Get contract details |

### Clearing
| Operation | Description |
|-----------|-------------|
| confirmTrade | Confirm clearing trade |
| getClearingTrades | Get clearing trades |
| getBrokerTrades | Get broker trades |
| cancelClearingTrade | Cancel clearing trade |

### Custody
| Operation | Description |
|-----------|-------------|
| getBalances | Get custody balances |
| getHistory | Get custody transaction history |

### Sub-Account (Master)
| Operation | Description |
|-----------|-------------|
| getSubAccounts | Get list of sub-accounts |
| getSubAccountBalance | Get sub-account balance |
| createSubAccount | Create new sub-account |
| renameSubAccount | Rename sub-account |

### Utility
| Operation | Description |
|-----------|-------------|
| heartbeat | Session heartbeat keepalive |
| getAPIHealth | Check API service status |

## Trigger Node

The **Gemini Trigger** node polls for events at configurable intervals:

| Event | Description |
|-------|-------------|
| newOrder | New order created |
| orderFilled | Order executed/filled |
| orderCanceled | Order canceled |
| depositReceived | Deposit received |
| withdrawalCompleted | Withdrawal completed |
| priceAlert | Price crosses threshold |
| stakingRewardReceived | Staking reward received |
| earnInterestReceived | Earn interest credited |

### Price Alert Configuration
- **Symbol**: Trading pair to monitor
- **Threshold**: Price level to trigger
- **Direction**: Above, Below, or Crosses

## Usage Examples

### Place a Limit Order
```json
{
  "resource": "orders",
  "operation": "placeNewOrder",
  "symbol": "btcusd",
  "amount": "0.001",
  "price": "50000",
  "side": "buy",
  "orderType": "exchange limit"
}
```

### Get Account Balances
```json
{
  "resource": "account",
  "operation": "getAvailableBalances"
}
```

### Stake ETH
```json
{
  "resource": "staking",
  "operation": "stakeAssets",
  "currency": "ETH",
  "amount": "1.0"
}
```

## Gemini Concepts

| Concept | Description |
|---------|-------------|
| GUSD | Gemini Dollar - 1:1 USD-backed stablecoin |
| ActiveTrader | Advanced trading platform with lower fees |
| Master Account | Parent account that can manage sub-accounts |
| Nonce | Incrementing number for request ordering |
| Order Types | exchange limit, exchange stop limit, market |
| Order Options | maker-or-cancel, immediate-or-cancel, fill-or-kill |

## Error Handling

The node handles Gemini API errors with descriptive messages:

| Error Code | Description |
|------------|-------------|
| InvalidPrice | Price must be positive |
| InvalidQuantity | Quantity must be positive |
| InvalidSide | Side must be 'buy' or 'sell' |
| InsufficientFunds | Not enough balance |
| OrderNotFound | Order ID not found |
| RateLimitExceeded | Too many requests |

## Security Best Practices

1. **Use Read-Only Keys** for monitoring workflows
2. **Enable IP Whitelisting** in Gemini API settings
3. **Use Sandbox** for testing before production
4. **Store Credentials Securely** using n8n's credential system
5. **Limit Permissions** to only what's needed
6. **Monitor API Usage** for unexpected activity

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [Gemini API Docs](https://docs.gemini.com/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-gemini/issues)
- **n8n Community**: [community.n8n.io](https://community.n8n.io/)

## Acknowledgments

- [Gemini](https://www.gemini.com/) for their comprehensive API
- [n8n](https://n8n.io/) for the workflow automation platform
- The n8n community for feedback and testing
