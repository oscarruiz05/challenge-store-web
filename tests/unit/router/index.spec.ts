import { describe, it, expect } from 'vitest';
import router from '@/router';
import Home from '@/pages/Home.vue';
import ProductDetail from '@/pages/ProductDetail/ProductDetailPage.vue';
import PaymentSumaryPage from '@/pages/PaymenSummary/PaymentSumaryPage.vue';
import PaymentResultPage from '@/pages/PaymentResult/PaymentResultPage.vue';

describe('Router', () => {
  it('should have the correct routes', () => {
    const routes = router.getRoutes();
    
    // Check number of routes
    expect(routes.length).toBe(4);
    
    // Check home route
    const homeRoute = routes.find(route => route.name === 'Home');
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.path).toBe('/');
    expect(homeRoute?.components?.default).toBe(Home);
    
    // Check product detail route
    const productDetailRoute = routes.find(route => route.name === 'ProductDetail');
    expect(productDetailRoute).toBeDefined();
    expect(productDetailRoute?.path).toBe('/products/:id');
    expect(productDetailRoute?.components?.default).toBe(ProductDetail);
    
    // Check payment summary route
    const paymentSummaryRoute = routes.find(route => route.name === 'PaymentSumaryPage');
    expect(paymentSummaryRoute).toBeDefined();
    expect(paymentSummaryRoute?.path).toBe('/summary');
    expect(paymentSummaryRoute?.components?.default).toBe(PaymentSumaryPage);
    
    // Check payment result route
    const paymentResultRoute = routes.find(route => route.name === 'PaymentResultPage');
    expect(paymentResultRoute).toBeDefined();
    expect(paymentResultRoute?.path).toBe('/payment-result');
    expect(paymentResultRoute?.components?.default).toBe(PaymentResultPage);
  });
});