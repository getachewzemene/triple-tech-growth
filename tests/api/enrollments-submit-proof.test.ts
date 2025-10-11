import { describe, it, expect } from '@jest/globals';
// Sample test data for submit-proof
const mockRequest = { body: { enrollmentId: 'enroll123', proofUrl: 'https://example.com/proof.png' } };

describe('POST /api/enrollments/submit-proof', () => {
  it('should submit proof for enrollment', async () => {
    // TODO: call handler and assert response
    expect(true).toBe(true);
  });
});