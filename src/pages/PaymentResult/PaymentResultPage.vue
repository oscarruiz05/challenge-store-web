<script lang="ts" setup>
import { StatusTransactionEnum } from '@/enums/statusTransactionEnum';
import type { TransactionResponse } from '@/types/Transaction';
import formatCurrency from '@/utils/formatCurrency';
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import socket from '@/plugins/socket';

const router = useRouter();
const paymentResult = ref<TransactionResponse | null>();
const productInfo = ref<any>(null);
const isLoading = ref(false);

const isPending = computed(() => 
  paymentResult.value?.payment_status === StatusTransactionEnum.PENDING
);

const isSuccess = computed(() => 
  paymentResult.value?.payment_status === StatusTransactionEnum.APPROVED
);

onMounted(() => {
  const storedResult = localStorage.getItem('paymentResult');
  if (storedResult) {
    paymentResult.value = JSON.parse(storedResult);

    if (paymentResult.value?.order_id && isPending.value) {
      connectToSocket(paymentResult.value.order_id);
    }
  } else {
    router.push('/');
    return;
  }
  
  const storedPaymentData = localStorage.getItem('paymentData');
  if (storedPaymentData) {
    const paymentData = JSON.parse(storedPaymentData);
    productInfo.value = paymentData.product;
  }
});

onBeforeUnmount(() => {
  if (socket.connected) {
    socket.disconnect();
  }
});

const connectToSocket = (transactionId: string) => {
  try {
    if (!socket.connected) {
      socket.connect();
    }
    
    const channel = `transaction-status-${transactionId}`;
    
    socket.on(channel, (data) => {
      if (data && typeof data === 'object') {
        paymentResult.value = {
          ...paymentResult.value,
          ...data,
        }
        localStorage.setItem('paymentResult', JSON.stringify(paymentResult.value));
        
        // Si el pago ya no está pendiente, desconectar del socket
        if (paymentResult.value?.payment_status !== StatusTransactionEnum.PENDING) {
          socket.off(channel);
          if (socket.connected) {
            socket.disconnect();
          }
        }
      }
    });
    
    socket.on('connect_error', (error) => {
      console.error('Error de conexión al socket:', error);
    });
    
  } catch (error) {
    console.error('Error al conectar con el socket:', error);
  }
};

const goToStore = () => {
  localStorage.removeItem('paymentData');
  localStorage.removeItem('paymentResult');
  router.push('/');
};
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-2xl mx-auto">
      <div v-if="paymentResult" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div 
          :class="[
            'p-8 text-center', 
            isSuccess ? 'bg-green-50' : isPending ? 'bg-yellow-50' : 'bg-red-50'
          ]"
        >
          <div 
            :class="[
              'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4',
              isSuccess ? 'bg-green-100' : isPending ? 'bg-yellow-100' : 'bg-red-100'
            ]"
          >
            <i v-if="isLoading" class="pi pi-spin pi-spinner text-5xl text-blue-500"></i>
            <i 
              v-else
              :class="[
                'text-5xl',
                isSuccess ? 'pi pi-check text-green-500' : 
                isPending ? 'pi pi-clock text-yellow-500' : 'pi pi-times text-red-500'
              ]"
            ></i>
          </div>
          <h1 
            :class="[
              'text-3xl font-bold',
              isSuccess ? 'text-green-600' : 
              isPending ? 'text-yellow-600' : 'text-red-600'
            ]"
          >
            {{ isSuccess ? '¡Pago Exitoso!' : 
               isPending ? 'Pago en Proceso' : 'Pago Fallido' }}
          </h1>
          <p class="text-gray-600 mt-2">
            {{ isSuccess ? 'Tu pago ha sido procesado correctamente' : 
               isPending ? 'Tu pago está siendo procesado' : 
               'Hubo un problema al procesar tu pago' }}
          </p>
        </div>

        <div class="p-8">
          <!-- Caso exitoso -->
          <div v-if="isSuccess" class="space-y-6">
            <div>
              <h2 class="text-xl font-semibold mb-4 flex items-center">
                <i class="pi pi-shopping-cart mr-2"></i> Resumen de la Orden
              </h2>
              <div class="bg-gray-50 p-4 rounded-lg space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Número de orden:</span>
                  <span class="font-semibold">{{ paymentResult.order_id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Monto pagado:</span>
                  <span class="font-semibold">{{ formatCurrency(paymentResult.amount) }}</span>
                </div>
                
                <!-- Producto comprado -->
                <div v-if="productInfo" class="border-t border-gray-200 pt-3 mt-3">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      <img 
                        v-if="productInfo.image" 
                        :src="productInfo.image" 
                        :alt="productInfo.name"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <i class="pi pi-box text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <p class="font-medium">{{ productInfo.name }}</p>
                      <p class="text-sm text-gray-500">
                        {{ formatCurrency(productInfo.price) }} x {{ paymentResult.quantity || 1 }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Caso pendiente -->
          <div v-else-if="isPending" class="space-y-6">
            <!-- Resumen de la orden -->
            <div>
              <h2 class="text-xl font-semibold mb-4 flex items-center">
                <i class="pi pi-shopping-cart mr-2"></i> Resumen de la Orden
              </h2>
              <div class="bg-gray-50 p-4 rounded-lg space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Número de orden:</span>
                  <span class="font-semibold">{{ paymentResult.order_id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Monto:</span>
                  <span class="font-semibold">{{ formatCurrency(paymentResult.amount) }}</span>
                </div>
                <!-- Producto comprado -->
                <div v-if="productInfo" class="border-t border-gray-200 pt-3 mt-3">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      <img 
                        v-if="productInfo.image" 
                        :src="productInfo.image" 
                        :alt="productInfo.name"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <i class="pi pi-box text-gray-400"></i>
                      </div>
                    </div>
                    <div>
                      <p class="font-medium">{{ productInfo.name }}</p>
                      <p class="text-sm text-gray-500">
                        {{ formatCurrency(productInfo.price) }} x {{ paymentResult.quantity || 1 }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Información de estado pendiente -->
            <div class="bg-yellow-50 p-4 rounded-lg">
              <div class="flex items-start">
                <i class="pi pi-clock text-yellow-500 mr-3 mt-1"></i>
                <div>
                  <p class="text-yellow-800 font-medium">Pago en proceso</p>
                  <p class="text-yellow-700 text-sm mt-1">
                    Tu pago está siendo procesado. Este proceso puede tomar hasta 24 horas.
                    La página se actualizará automáticamente cuando el estado cambie.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Caso fallido -->
          <div v-else class="bg-red-50 p-4 rounded-lg">
            <div class="flex items-start">
              <i class="pi pi-exclamation-triangle text-red-500 mr-3 mt-1"></i>
              <div>
                <p class="text-red-800 font-medium">No se pudo procesar el pago</p>
                <p class="text-red-700 text-sm mt-1">
                  {{ paymentResult.message || 'Hubo un problema al procesar tu pago. Por favor intenta nuevamente.' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="mt-8 space-y-3">
            <Button @click="goToStore" class="w-full p-button-primary">
              <i class="pi pi-home mr-2"></i>
              Volver a la tienda
            </Button>
          </div>
        </div>
      </div>
      
      <div v-else class="bg-white shadow-md rounded-lg p-6 text-center">
        <i class="pi pi-exclamation-circle text-yellow-500 text-4xl mb-4"></i>
        <p class="text-lg">No se encontraron datos del resultado del pago.</p>
        <Button class="mt-4" @click="goToStore()">Volver a la tienda</Button>
      </div>
    </div>
  </div>
</template>