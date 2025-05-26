<script lang="ts" setup>
import ProductGrid from "@/components/ProductGrid.vue";
import SkeletonGridCard from "@/components/SkeletonGridCard.vue";
import { getProducts } from "@/services/products";
import type { Product } from "@/types/Product";
import { ref, onMounted } from "vue";

const products = ref<Product[]>([]);
const loading = ref(true);

onMounted(async () => {
  localStorage.removeItem('paymentData');
  localStorage.removeItem('paymentResult');
  try {
    products.value = await getProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-4">Productos</h1>
        <p class="text-gray-600">Descubre nuestros mejores productos</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductGrid
          v-if="!loading"
          v-for="product in products"
          :key="product.id"
          :id="product.id"
          :title="product.name"
          :description="product.description"
          :price="product.price"
          :image="product.image"
        />
        <SkeletonGridCard v-else v-for="n in 10" :key="n" />
      </div>
    </div>
  </div>
</template>
