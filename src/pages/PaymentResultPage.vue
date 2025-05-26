<script lang="ts" setup>
import { ref } from "vue";

const success = ref<boolean>(false);
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white shadow-md rounded-lg">
      <div v-if="success" class="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-16 w-16 text-green-600 mx-auto mb-6"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>

        <h2 class="text-2xl font-bold text-green-800 mb-4">
          ¡Pago realizado con éxito!
        </h2>

        <div
          class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left"
        >
          <h3 class="font-semibold text-green-800 mb-2">
            Detalles de la transacción:
          </h3>
          <div class="space-y-1 text-sm">
            <p><span class="font-medium">ID de transacción:</span> ggggg</p>
            <p><span class="font-medium">Monto cobrado:</span> $2000</p>
            <p><span class="font-medium">Tarjeta utilizada:</span> **** 5454</p>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p class="text-blue-800 text-sm">
            📦 Tu producto será entregado a la dirección registrada en los
            próximos días hábiles.
          </p>
        </div>

        <button
          class="w-full mb-3 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
        >
          Volver a la tienda
        </button>

        <p class="text-xs text-gray-500">Regreso automático en 25 segundos</p>
      </div>

      <div v-else class="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-16 w-16 text-red-600 mx-auto mb-6"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>

        <h2 class="text-2xl font-bold text-red-800 mb-4">
          Pago rechazado o fallido
        </h2>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-800 text-sm">
            Tu pago no pudo ser procesado. Esto puede deberse a:
          </p>
          <ul class="text-red-700 text-sm mt-2 text-left">
            <li>• Fondos insuficientes</li>
            <li>• Tarjeta declinada por el banco</li>
            <li>• Datos incorrectos</li>
            <li>• Problemas técnicos temporales</li>
          </ul>
        </div>

        <div class="space-y-3">
          <button
            class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
          >
            Reintentar Pago
          </button>
          <button
            class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border border-gray-300 bg-white text-gray-700"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
