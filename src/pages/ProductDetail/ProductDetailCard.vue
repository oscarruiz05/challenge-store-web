<script lang="ts" setup>
import { defineProps, ref } from "vue";
import type { Product } from "@/types/Product";
import formatCurrency from "@/utils/formatCurrency";

const props = defineProps<{
  product: Product;
}>();
const emit = defineEmits<{
  (e: "showDialog", value: boolean): void;
}>();

const quantityProdcut = ref<number>(1);
const quantityError = ref<string | null>(null);

const validateQuantity = (value: number) => {
  if (!props.product) return;

  if (value <= 0) {
    quantityError.value = "Debe seleccionar al menos 1 unidad.";
  } else if (value > props.product.stock) {
    quantityError.value = `Solo hay ${props.product.stock} unidades disponibles.`;
  } else {
    quantityError.value = null;
    quantityProdcut.value = value;
  }
};

const showDialog = () => {
  emit("showDialog", true);
};
</script>

<template>
  <Card class="overflow-hidden hover:shadow-lg transition-shadow">
    <template #content>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="p-6">
          <div
            class="relative w-full overflow-hidden rounded-lg bg-gray-100"
            style="padding-top: 100%"
          >
            <img
              :src="props.product.image"
              :alt="props.product.name"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div class="p-6">
          <div class="px-0 pt-0 mb-4">
            <h1 class="text-3xl font-bold">{{ props.product.name }}</h1>
            <p class="text-lg text-gray-600">
              {{ props.product.description }}
            </p>
          </div>

          <div class="px-0 mb-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-5">
                <span class="text-3xl font-bold text-green-600">
                  {{ formatCurrency(props.product.price as number) }}
                </span>
                <div class="text-right">
                  <template v-if="product && product.stock > 0">
                    <FloatLabel variant="on">
                      <InputNumber
                        :model-value="quantityProdcut"
                        inputId="quantity_prodcut"
                        :min="0"
                        :max="100"
                        fluid
                        @update:model-value="validateQuantity"
                      />
                      <label for="quantity_prodcut">Seleccione cantidad</label>
                    </FloatLabel>
                  </template>
                </div>
              </div>

              <div
                v-if="quantityError"
                class="bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <p class="text-red-800 text-sm">❌ {{ quantityError }}</p>
              </div>

              <template v-if="product && product.stock > 0 && !quantityError">
                <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p class="text-green-800 text-sm">
                    ✅ Producto disponible para envío inmediato
                  </p>
                </div>
              </template>

              <div
                v-else-if="!quantityError"
                class="bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <p class="text-red-800 text-sm">❌ Producto agotado</p>
              </div>
            </div>
          </div>

          <div class="px-0 pb-0">
            <Button
              class="w-full"
              :disabled="product && product.stock === 0"
              @click="
                () => {
                    if (!quantityError) showDialog();
                }
              "
              >{{
                product && product.stock > 0 ? "Pagar con tarjeta" : "Agotado"
              }}</Button
            >
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
