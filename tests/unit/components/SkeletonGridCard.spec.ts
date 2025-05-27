import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SkeletonGridCard from '@/components/SkeletonGridCard.vue';

describe('SkeletonGridCard.vue', () => {
  it('renders without errors', () => {
    const wrapper = mount(SkeletonGridCard, {
      global: {
        stubs: {
          Card: {
            template: '<div><slot name="content"></slot></div>'
          },
          Skeleton: {
            template: '<div class="skeleton-stub"></div>'
          }
        }
      }
    });
    
    // Verificamos que el componente se monte correctamente
    expect(wrapper.vm).toBeDefined();
    
    // Verificamos que el HTML contenga elementos stubbed
    const html = wrapper.html();
    expect(html).toContain('div');
    expect(html).toContain('class="skeleton-stub"');
  });
});