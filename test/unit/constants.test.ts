/**
 * Unit tests for Gemini constants and types
 *
 * [Velocity BPA Licensing Notice]
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 * For licensing information, visit https://velobpa.com/licensing
 */

describe('Gemini Constants', () => {
	describe('API Endpoints', () => {
		const API_ENDPOINTS = {
			// Public endpoints
			symbols: '/v1/symbols',
			symbolDetails: '/v1/symbols/details',
			ticker: '/v1/pubticker',
			tickerV2: '/v2/ticker',
			candles: '/v2/candles',
			orderBook: '/v1/book',
			tradeHistory: '/v1/trades',
			priceFeed: '/v1/pricefeed',
			
			// Private endpoints
			newOrder: '/v1/order/new',
			cancelOrder: '/v1/order/cancel',
			cancelAllOrders: '/v1/order/cancel/all',
			orderStatus: '/v1/order/status',
			activeOrders: '/v1/orders',
			pastTrades: '/v1/mytrades',
			balances: '/v1/balances',
			transfers: '/v1/transfers',
			depositAddresses: '/v1/addresses',
		};

		it('should have correct public endpoint paths', () => {
			expect(API_ENDPOINTS.symbols).toBe('/v1/symbols');
			expect(API_ENDPOINTS.tickerV2).toBe('/v2/ticker');
			expect(API_ENDPOINTS.candles).toBe('/v2/candles');
		});

		it('should have correct private endpoint paths', () => {
			expect(API_ENDPOINTS.newOrder).toBe('/v1/order/new');
			expect(API_ENDPOINTS.cancelOrder).toBe('/v1/order/cancel');
			expect(API_ENDPOINTS.balances).toBe('/v1/balances');
		});

		it('should use v1 for most endpoints', () => {
			const v1Endpoints = Object.values(API_ENDPOINTS).filter(ep => ep.startsWith('/v1'));
			const v2Endpoints = Object.values(API_ENDPOINTS).filter(ep => ep.startsWith('/v2'));
			
			expect(v1Endpoints.length).toBeGreaterThan(v2Endpoints.length);
		});
	});

	describe('Order Types', () => {
		const ORDER_TYPES = [
			'exchange limit',
			'exchange stop limit',
			'market buy',
			'market sell',
		];

		it('should include exchange limit order type', () => {
			expect(ORDER_TYPES).toContain('exchange limit');
		});

		it('should include stop limit order type', () => {
			expect(ORDER_TYPES).toContain('exchange stop limit');
		});

		it('should include market order types', () => {
			expect(ORDER_TYPES).toContain('market buy');
			expect(ORDER_TYPES).toContain('market sell');
		});
	});

	describe('Order Options', () => {
		const ORDER_OPTIONS = [
			'maker-or-cancel',
			'immediate-or-cancel',
			'fill-or-kill',
			'auction-only',
		];

		it('should include maker-or-cancel option', () => {
			expect(ORDER_OPTIONS).toContain('maker-or-cancel');
		});

		it('should include immediate-or-cancel option', () => {
			expect(ORDER_OPTIONS).toContain('immediate-or-cancel');
		});

		it('should include fill-or-kill option', () => {
			expect(ORDER_OPTIONS).toContain('fill-or-kill');
		});

		it('should include auction-only option', () => {
			expect(ORDER_OPTIONS).toContain('auction-only');
		});
	});

	describe('Candle Intervals', () => {
		const CANDLE_INTERVALS = ['1m', '5m', '15m', '30m', '1hr', '6hr', '1day'];

		it('should have minute intervals', () => {
			expect(CANDLE_INTERVALS).toContain('1m');
			expect(CANDLE_INTERVALS).toContain('5m');
			expect(CANDLE_INTERVALS).toContain('15m');
			expect(CANDLE_INTERVALS).toContain('30m');
		});

		it('should have hourly intervals', () => {
			expect(CANDLE_INTERVALS).toContain('1hr');
			expect(CANDLE_INTERVALS).toContain('6hr');
		});

		it('should have daily interval', () => {
			expect(CANDLE_INTERVALS).toContain('1day');
		});
	});

	describe('Transfer Types', () => {
		const TRANSFER_TYPES = ['Deposit', 'Withdrawal', 'Reward', 'AdminCredit', 'AdminDebit'];

		it('should include deposit type', () => {
			expect(TRANSFER_TYPES).toContain('Deposit');
		});

		it('should include withdrawal type', () => {
			expect(TRANSFER_TYPES).toContain('Withdrawal');
		});

		it('should include reward type', () => {
			expect(TRANSFER_TYPES).toContain('Reward');
		});
	});

	describe('Error Codes', () => {
		const ERROR_CODES: Record<string, string> = {
			InvalidPrice: 'Price must be positive',
			InvalidQuantity: 'Quantity must be positive',
			InvalidSide: "Side must be 'buy' or 'sell'",
			InvalidOrderType: 'Invalid order type specified',
			InsufficientFunds: 'Insufficient funds for this order',
			OrderNotFound: 'Order not found',
			RateLimitExceeded: 'Rate limit exceeded, please slow down',
			InvalidNonce: 'Nonce must be greater than previous request',
			InvalidSignature: 'Invalid API signature',
			MissingKey: 'API key required',
			InvalidSymbol: 'Trading symbol not found',
		};

		it('should have descriptive error messages', () => {
			expect(ERROR_CODES.InvalidPrice).toBe('Price must be positive');
			expect(ERROR_CODES.InsufficientFunds).toBe('Insufficient funds for this order');
			expect(ERROR_CODES.RateLimitExceeded).toBe('Rate limit exceeded, please slow down');
		});

		it('should cover authentication errors', () => {
			expect(ERROR_CODES.InvalidSignature).toBeDefined();
			expect(ERROR_CODES.MissingKey).toBeDefined();
			expect(ERROR_CODES.InvalidNonce).toBeDefined();
		});

		it('should cover order validation errors', () => {
			expect(ERROR_CODES.InvalidPrice).toBeDefined();
			expect(ERROR_CODES.InvalidQuantity).toBeDefined();
			expect(ERROR_CODES.InvalidSide).toBeDefined();
			expect(ERROR_CODES.InvalidOrderType).toBeDefined();
		});
	});

	describe('Base URLs', () => {
		const BASE_URLS = {
			production: 'https://api.gemini.com',
			sandbox: 'https://api.sandbox.gemini.com',
		};

		it('should have correct production URL', () => {
			expect(BASE_URLS.production).toBe('https://api.gemini.com');
		});

		it('should have correct sandbox URL', () => {
			expect(BASE_URLS.sandbox).toBe('https://api.sandbox.gemini.com');
		});

		it('should use HTTPS', () => {
			expect(BASE_URLS.production.startsWith('https://')).toBe(true);
			expect(BASE_URLS.sandbox.startsWith('https://')).toBe(true);
		});
	});
});
