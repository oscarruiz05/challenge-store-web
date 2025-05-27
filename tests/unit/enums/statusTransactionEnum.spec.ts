import { describe, it, expect } from 'vitest';
import { StatusTransactionEnum } from '@/enums/statusTransactionEnum';

describe('StatusTransactionEnum', () => {
  it('should have the correct values', () => {
    expect(StatusTransactionEnum.PENDING).toBe('PENDING');
    expect(StatusTransactionEnum.APPROVED).toBe('APPROVED');
    expect(StatusTransactionEnum.DECLINED).toBe('DECLINED');
    expect(StatusTransactionEnum.VOIDED).toBe('VOIDED');
    expect(StatusTransactionEnum.ERROR).toBe('ERROR');
  });

  it('should have all required status types', () => {
    const expectedKeys = ['PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR'];
    const actualKeys = Object.keys(StatusTransactionEnum);
    
    expect(actualKeys).toEqual(expect.arrayContaining(expectedKeys));
    expect(actualKeys.length).toBe(expectedKeys.length);
  });
});