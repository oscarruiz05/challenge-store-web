<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Product } from "@/types/Product";
import { getProductById } from "@/services/products";
import ModalForm from "@/components/ModalForm.vue";
import ProductDetailCard from "./ProductDetailCard.vue";

const route = useRoute();

const product = ref<Product>();
const loading = ref<boolean>(true);
const visible = ref<boolean>(false);

const quantityProdcut = ref<number>(1);

onMounted(async () => {
  const productId = route.params.id as string;
  try {
    product.value = await getProductById(productId);
  } catch (error) {
    console.error("Error fetching product:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <RouterLink to="/">
          <Button><i class="pi pi-arrow-left"></i> Volver a productos</Button>
        </RouterLink>
      </div>

      <ProductDetailCard v-if="product" :product="product" @showDialog="visible = $event" />
    </div>

    <ModalForm
      v-model:visible="visible"
      :product="product"
      :quantity="quantityProdcut"
      @close="visible = false"
    />
  </div>
</template>
