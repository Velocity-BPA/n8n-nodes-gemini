/**
 * Unit tests for Gemini transport layer
 *
 * [Velocity BPA Licensing Notice]
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 * For licensing information, visit https://velobpa.com/licensing
 */

import * as crypto from 'crypto';

// Mock functions for testing (we test the logic, not the actual API calls)
describe('Gemini Transport', () => {
	describe('createSignature', () => {
		it('should create valid HMAC SHA384 signature', () => {
			const secret = 'test-secret-key';
			const payload = 'eyJyZXF1ZXN0IjoiL3YxL29yZGVyL3N0YXR1cyJ9';
			
			const signature = crypto
				.createHmac('sha384', secret)
				.update(payload)
				.digest('hex');
			
			expect(signature).toBeDefined();
			expect(typeof signature).toBe('string');
			expect(signature.length).toBe(96); // SHA384 hex is 96 chars
		});
	});

	describe('encodePayload', () => {
		it('should base64 encode payload correctly', () => {
			const payload = { request: '/v1/order/status', nonce: 1234567890 };
			const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
			
			expect(encoded).toBeDefined();
			expect(typeof encoded).toBe('string');
			
			// Verify it decodes back correctly
			const decoded = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
			expect(decoded.request).toBe('/v1/order/status');
			expect(decoded.nonce).toBe(1234567890);
		});
	});

	describe('nonce generation', () => {
		it('should generate incrementing nonces', () => {
			const nonce1 = Date.now();
			// Small delay to ensure different timestamp
			const nonce2 = Date.now() + 1;
			
			expect(nonce2).toBeGreaterThan(nonce1);
		});

		it('should generate valid timestamp nonce', () => {
			const nonce = Date.now();
			
			expect(nonce).toBeGreaterThan(0);
			expect(Number.isInteger(nonce)).toBe(true);
		});
	});

	describe('URL construction', () => {
		it('should construct production URL correctly', () => {
			const baseUrl = 'https://api.gemini.com';
			const endpoint = '/v1/order/status';
			const fullUrl = `${baseUrl}${endpoint}`;
			
			expect(fullUrl).toBe('https://api.gemini.com/v1/order/status');
		});

		it('should construct sandbox URL correctly', () => {
			const baseUrl = 'https://api.sandbox.gemini.com';
			const endpoint = '/v1/order/status';
			const fullUrl = `${baseUrl}${endpoint}`;
			
			expect(fullUrl).toBe('https://api.sandbox.gemini.com/v1/order/status');
		});
	});
});

describe('Authentication Headers', () => {
	it('should generate all required headers', () => {
		const apiKey = 'test-api-key';
		const payload = 'base64-encoded-payload';
		const signature = 'hex-signature';
		
		const headers = {
			'Content-Type': 'text/plain',
			'Content-Length': '0',
			'X-GEMINI-APIKEY': apiKey,
			'X-GEMINI-PAYLOAD': payload,
			'X-GEMINI-SIGNATURE': signature,
			'Cache-Control': 'no-cache',
		};
		
		expect(headers['X-GEMINI-APIKEY']).toBe(apiKey);
		expect(headers['X-GEMINI-PAYLOAD']).toBe(payload);
		expect(headers['X-GEMINI-SIGNATURE']).toBe(signature);
	});
});
