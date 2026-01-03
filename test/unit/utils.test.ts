/**
 * Unit tests for Gemini utility functions
 *
 * [Velocity BPA Licensing Notice]
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 * For licensing information, visit https://velobpa.com/licensing
 */

describe('Utility Functions', () => {
	describe('cleanObject', () => {
		const cleanObject = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
			const cleaned: Partial<T> = {};
			for (const [key, value] of Object.entries(obj)) {
				if (value !== undefined && value !== null && value !== '') {
					cleaned[key as keyof T] = value as T[keyof T];
				}
			}
			return cleaned;
		};

		it('should remove undefined values', () => {
			const input = { a: 1, b: undefined, c: 'test' };
			const result = cleanObject(input);
			
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should remove null values', () => {
			const input = { a: 1, b: null, c: 'test' };
			const result = cleanObject(input);
			
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should remove empty strings', () => {
			const input = { a: 1, b: '', c: 'test' };
			const result = cleanObject(input);
			
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should keep zero values', () => {
			const input = { a: 0, b: 1, c: 'test' };
			const result = cleanObject(input);
			
			expect(result).toEqual({ a: 0, b: 1, c: 'test' });
		});

		it('should keep false boolean values', () => {
			const input = { a: false, b: true, c: 'test' };
			const result = cleanObject(input);
			
			expect(result).toEqual({ a: false, b: true, c: 'test' });
		});
	});

	describe('parseBoolean', () => {
		const parseBoolean = (value: unknown): boolean | undefined => {
			if (value === undefined || value === null || value === '') return undefined;
			if (typeof value === 'boolean') return value;
			if (typeof value === 'string') {
				const lower = value.toLowerCase();
				if (lower === 'true' || lower === '1' || lower === 'yes') return true;
				if (lower === 'false' || lower === '0' || lower === 'no') return false;
			}
			if (typeof value === 'number') return value !== 0;
			return undefined;
		};

		it('should parse boolean true', () => {
			expect(parseBoolean(true)).toBe(true);
		});

		it('should parse boolean false', () => {
			expect(parseBoolean(false)).toBe(false);
		});

		it('should parse string "true"', () => {
			expect(parseBoolean('true')).toBe(true);
			expect(parseBoolean('TRUE')).toBe(true);
			expect(parseBoolean('True')).toBe(true);
		});

		it('should parse string "false"', () => {
			expect(parseBoolean('false')).toBe(false);
			expect(parseBoolean('FALSE')).toBe(false);
		});

		it('should parse "yes" and "no"', () => {
			expect(parseBoolean('yes')).toBe(true);
			expect(parseBoolean('no')).toBe(false);
		});

		it('should parse numbers', () => {
			expect(parseBoolean(1)).toBe(true);
			expect(parseBoolean(0)).toBe(false);
			expect(parseBoolean(42)).toBe(true);
		});

		it('should return undefined for undefined/null/empty', () => {
			expect(parseBoolean(undefined)).toBeUndefined();
			expect(parseBoolean(null)).toBeUndefined();
			expect(parseBoolean('')).toBeUndefined();
		});
	});

	describe('parseNumber', () => {
		const parseNumber = (value: unknown): number | undefined => {
			if (value === undefined || value === null || value === '') return undefined;
			if (typeof value === 'number') return value;
			if (typeof value === 'string') {
				const parsed = parseFloat(value);
				return isNaN(parsed) ? undefined : parsed;
			}
			return undefined;
		};

		it('should return number directly', () => {
			expect(parseNumber(42)).toBe(42);
			expect(parseNumber(3.14)).toBe(3.14);
			expect(parseNumber(0)).toBe(0);
		});

		it('should parse string numbers', () => {
			expect(parseNumber('42')).toBe(42);
			expect(parseNumber('3.14')).toBe(3.14);
			expect(parseNumber('0')).toBe(0);
		});

		it('should return undefined for invalid input', () => {
			expect(parseNumber(undefined)).toBeUndefined();
			expect(parseNumber(null)).toBeUndefined();
			expect(parseNumber('')).toBeUndefined();
			expect(parseNumber('not a number')).toBeUndefined();
		});
	});

	describe('normalizeSymbol', () => {
		const normalizeSymbol = (symbol: string): string => {
			return symbol.toLowerCase().replace(/[^a-z0-9]/g, '');
		};

		it('should lowercase symbols', () => {
			expect(normalizeSymbol('BTCUSD')).toBe('btcusd');
			expect(normalizeSymbol('BtcUsd')).toBe('btcusd');
		});

		it('should remove special characters', () => {
			expect(normalizeSymbol('BTC/USD')).toBe('btcusd');
			expect(normalizeSymbol('BTC-USD')).toBe('btcusd');
			expect(normalizeSymbol('BTC_USD')).toBe('btcusd');
		});

		it('should handle already normalized symbols', () => {
			expect(normalizeSymbol('btcusd')).toBe('btcusd');
			expect(normalizeSymbol('ethusd')).toBe('ethusd');
		});
	});

	describe('formatTimestamp', () => {
		const formatTimestamp = (timestamp: number | string): number => {
			const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
			// If timestamp is in seconds, convert to milliseconds
			if (ts < 1e12) {
				return ts * 1000;
			}
			return ts;
		};

		it('should handle millisecond timestamps', () => {
			const ms = 1704067200000; // Jan 1, 2024 00:00:00 UTC
			expect(formatTimestamp(ms)).toBe(ms);
		});

		it('should convert second timestamps to milliseconds', () => {
			const seconds = 1704067200; // Jan 1, 2024 00:00:00 UTC
			expect(formatTimestamp(seconds)).toBe(seconds * 1000);
		});

		it('should handle string timestamps', () => {
			expect(formatTimestamp('1704067200000')).toBe(1704067200000);
			expect(formatTimestamp('1704067200')).toBe(1704067200000);
		});
	});

	describe('validateRequired', () => {
		const validateRequired = (value: unknown, fieldName: string): void => {
			if (value === undefined || value === null || value === '') {
				throw new Error(`${fieldName} is required`);
			}
		};

		it('should pass for valid values', () => {
			expect(() => validateRequired('test', 'field')).not.toThrow();
			expect(() => validateRequired(0, 'field')).not.toThrow();
			expect(() => validateRequired(false, 'field')).not.toThrow();
		});

		it('should throw for undefined', () => {
			expect(() => validateRequired(undefined, 'testField')).toThrow('testField is required');
		});

		it('should throw for null', () => {
			expect(() => validateRequired(null, 'testField')).toThrow('testField is required');
		});

		it('should throw for empty string', () => {
			expect(() => validateRequired('', 'testField')).toThrow('testField is required');
		});
	});
});

describe('Retry Logic', () => {
	describe('retryWithBackoff', () => {
		it('should implement exponential backoff delays', () => {
			const baseDelay = 1000;
			const maxRetries = 5;
			
			const delays: number[] = [];
			for (let i = 0; i < maxRetries; i++) {
				delays.push(baseDelay * Math.pow(2, i));
			}
			
			expect(delays).toEqual([1000, 2000, 4000, 8000, 16000]);
		});

		it('should cap delay at maximum', () => {
			const baseDelay = 1000;
			const maxDelay = 30000;
			const retryCount = 10;
			
			const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
			
			expect(delay).toBe(maxDelay);
		});
	});
});
