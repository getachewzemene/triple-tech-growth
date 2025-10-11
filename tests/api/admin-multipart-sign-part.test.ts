import { describe, it, expect } from 'vitest';
// Sample test data for sign-part
const mockRequest = { body: { uploadId: 'id123', partNumber: 1 } };

describe('POST /api/admin/multipart/sign-part', () => {
  it('should sign part', async () => {
    // TODO: call handler and assert response
    expect(true).toBe(true);
  });
});