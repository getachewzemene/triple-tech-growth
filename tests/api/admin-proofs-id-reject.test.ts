import { describe, it, expect } from '@jest/globals';
// Sample test data for reject proof
const mockRequest = { params: { id: 'proof123' } };

describe('POST /api/admin/proofs/[id]/reject', () => {
  it('should reject proof', async () => {
    // TODO: call handler and assert response
    expect(true).toBe(true);
  });
});