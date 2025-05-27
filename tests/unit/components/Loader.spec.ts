import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Loader from '../../../src/components/Loader.vue';

describe('Loader.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(Loader);
    
    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('Procesando pago...');
    expect(wrapper.find('p').text()).toContain('Por favor espera mientras procesamos tu transacción');
  });
});