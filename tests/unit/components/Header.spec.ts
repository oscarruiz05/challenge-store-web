import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Header from '../../../src/components/Header.vue';
import { createRouter, createWebHistory } from 'vue-router';

describe('Header.vue', () => {
  it('renders properly', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: {} }]
    });
    
    const wrapper = mount(Header, {
      global: {
        plugins: [router]
      }
    });
    
    expect(wrapper.find('h1').text()).toBe('Store Web');
    expect(wrapper.find('.pi-shop').exists()).toBe(true);
  });
  
  it('has a link to the home page', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: {} }]
    });
    
    const wrapper = mount(Header, {
      global: {
        plugins: [router]
      }
    });
    
    const routerLink = wrapper.findComponent({ name: 'RouterLink' });
    expect(routerLink.props('to')).toBe('/');
  });
});