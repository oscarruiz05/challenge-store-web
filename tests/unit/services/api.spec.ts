import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/services';

// Mock axios correctly
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn()
    }))
  }
}));

// Mock import.meta.env
vi.stubGlobal('import.meta', {
  env: {
    VITE_API_URL: 'http://localhost:3000'
  }
});

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should be defined', () => {
    expect(api).toBeDefined();
  });
  
  it('should have methods for API calls', () => {
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
  });
});