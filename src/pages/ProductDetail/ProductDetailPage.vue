<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Product } from "@/types/Product";
import { getProductById } from "@/services/products";
import ModalForm from "@/components/ModalForm.vue";
import ProductDetailCard from "./ProductDetailCard.vue";

const route = useRoute();
const router = useRouter();

const product = ref<Product>();
const loading = ref<boolean>(true);
const visible = ref<boolean>(false);
const hasStock = ref<boolean>(false);
const quantity = ref<number>(1);

const handleQuantityChange = (value: number) => {
  quantity.value = value;
};

onMounted(async () => {
  const productId = route.params.id as string;
  try {
    product.value = await getProductById(productId);
    hasStock.value = product.value && product.value.stock > 0;
  } catch (error) {
    console.error("Error fetching product:", error);
  } finally {
    loading.value = false;
  }
});

const handlePaymentCompleted = (paymentData: any) => {
  localStorage.setItem("paymentData", JSON.stringify(paymentData));
  router.push("/summary");
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <RouterLink to="/">
          <Button><i class="pi pi-arrow-left"></i> Volver a productos</Button>
        </RouterLink>
      </div>

      <ProductDetailCard
        v-if="product"
        :product="product"
        @showDialog="visible = $event"
        @quantity-change="handleQuantityChange"
      />
    </div>

    <ModalForm
      v-model:visible="visible"
      :product="product"
      :hasStock="hasStock"
      :quantity="quantity"
      @payment-completed="handlePaymentCompleted"
    />
  </div>
</template>
