<script lang="ts" setup>
import { createTransaction } from '@/services/transactions';
import type { Transaction } from '@/types/Transaction';
import formatCurrency from '@/utils/formatCurrency';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const paymentData = ref<any>(null);
const product = ref<any>(null);
const isProcessing = ref(false);

const loadPaymentData = () => {
  const storedData = localStorage.getItem('paymentData');
  
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      console.log('Datos cargados:', parsedData);
      paymentData.value = parsedData;
      
      if (parsedData.product) {
        console.log('Producto encontrado en los datos:', parsedData.product);
        product.value = parsedData.product;
      } else {
        console.error('No se encontró el producto en los datos de pago');
      }
    } catch (error) {
      console.error('Error al parsear los datos:', error);
    }
  } else {
    console.error('No se encontraron datos en localStorage');
    router.push('/');
  }
};

onMounted(() => {
  loadPaymentData();
});

const getLastFourDigits = () => {
  if (!paymentData.value?.last_four) return '****';
  return paymentData.value.last_four.slice(-4);
};

const processPayment = async () => {
  if (!product.value) {
    alert('No se encontró información del producto');
    return;
  }
  
  try {
    isProcessing.value = true;

    const transactionData: Transaction = {
      product_id: product.value.id,
      quantity: paymentData.value.quantity,
      card_token: paymentData.value.card_token,
      acceptance_token: paymentData.value.acceptance_token,
      accept_personal_auth: paymentData.value.accept_personal_auth,
      customer: {
        name: paymentData.value.customer.name,
        last_name: paymentData.value.customer.last_name,
        email: paymentData.value.customer.email,
        address: paymentData.value.customer.address,
        number_phone: paymentData.value.customer.number_phone,
      },
    };
    const result = await createTransaction(transactionData);
    localStorage.setItem('paymentResult', JSON.stringify(result));

    router.push('/payment-result');
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    alert('Hubo un error al procesar el pago. Por favor intente nuevamente.');
  } finally {
    isProcessing.value = false;
  }
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <Button severity="contrast" @click="goBack">
          <i class="pi pi-arrow-left"></i>
          Volver a Editar
        </Button>
        <h1 class="text-3xl font-bold">Resumen de Compra</h1>
        <p class="text-gray-600 mt-2">
          Revisa los detalles antes de confirmar tu pago
        </p>
      </div>

      <div v-if="paymentData && product" class="space-y-6">
        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="mb-4">
            <h2 class="text-lg font-semibold flex items-center gap-2">
              📦 Producto
            </h2>
          </div>
          <div>
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-lg">{{ product.name }}</p>
                <p class="text-sm text-gray-600">Cantidad: {{ paymentData.quantity }} unidad(es)</p>
              </div>
              <p class="font-semibold text-xl">{{ formatCurrency(product.price) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="mb-4">
            <h2 class="text-lg font-semibold flex items-center gap-2">
              💰 Desglose de Costos
            </h2>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between text-lg">
              <span>Producto ({{ paymentData.quantity }} unidad(es))</span>
              <span>{{ formatCurrency(product.price * paymentData.quantity) }}</span>
            </div>
            <div class="flex justify-between text-lg">
              <span>Costo de Envío</span>
              <span>$0</span>
            </div>
            <div class="border-t border-gray-200 my-4"></div>
            <div class="flex justify-between text-2xl font-bold">
              <span>Total a Pagar</span>
              <span class="text-green-600">{{ formatCurrency(product.price * paymentData.quantity) }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="mb-4">
            <h2 class="text-lg font-semibold flex items-center gap-2">
              🚚 Información de Entrega
            </h2>
          </div>
          <div class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Nombre completo</p>
                <p class="font-medium">{{ paymentData.customer.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Correo electrónico</p>
                <p class="font-medium">{{ paymentData.customer.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Dirección</p>
                <p class="font-medium">{{ paymentData.customer.address }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Teléfono</p>
                <p class="font-medium">{{ paymentData.customer.number_phone }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="mb-4">
            <h2 class="text-lg font-semibold flex items-center gap-2">
              💳 Método de Pago
            </h2>
          </div>
          <div>
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-lg">Tarjeta de Crédito/Débito</p>
                <p class="text-gray-600">******{{ getLastFourDigits() }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-6">
          <Button 
            class="w-full" 
            @click="processPayment" 
            :loading="isProcessing"
            :disabled="isProcessing"
          >
            <i v-if="isProcessing" class="pi pi-spin pi-spinner mr-2"></i>
            {{ isProcessing ? 'Procesando...' : `Confirmar Pago - ${formatCurrency(product.price * paymentData.quantity)}` }}
          </Button>
        </div>
      </div>
      
      <div v-else class="bg-white shadow-md rounded-lg p-6 text-center">
        <p class="text-lg">No se encontraron datos de pago.</p>
        <Button class="mt-4" @click="router.push('/')">Volver a la tienda</Button>
      </div>
    </div>
  </div>
</template>