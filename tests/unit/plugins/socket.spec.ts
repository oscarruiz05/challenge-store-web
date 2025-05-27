import { describe, it, expect, vi } from 'vitest';
import { Socket } from 'socket.io-client';
import socket from '../../../src/plugins/socket';

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    autoConnect: false
  }))
}));

describe('socket', () => {
  it('should export a Socket instance', () => {
    expect(socket).toBeDefined();
  });
});