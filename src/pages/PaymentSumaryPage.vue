<script lang="ts" setup></script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <button
          class="mb-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a Editar
        </button>
        <h1 class="text-3xl font-bold">Resumen de Compra</h1>
        <p class="text-gray-600 mt-2">
          Revisa los detalles antes de confirmar tu pago
        </p>
      </div>

      <div class="space-y-6">
        <div class="bg-white shadow-md rounded-lg p-6">
          <div class="mb-4">
            <h2 class="text-lg font-semibold flex items-center gap-2">
              📦 Producto
            </h2>
          </div>
          <div>
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-lg">fff</p>
                <p class="text-sm text-gray-600">Cantidad: 1 unidad</p>
              </div>
              <p class="font-semibold text-xl">$2000</p>
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
              <span>Producto</span>
              <span>$2000</span>
            </div>
            <div class="flex justify-between text-lg">
              <span>Costo Base</span>
              <span>$2000</span>
            </div>
            <div class="flex justify-between text-lg">
              <span>Costo de Envío</span>
              <span>$0</span>
            </div>
            <div class="border-t border-gray-200 my-4"></div>
            <div class="flex justify-between text-2xl font-bold">
              <span>Total a Pagar</span>
              <span class="text-green-600">$2000</span>
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
                <p class="font-medium">asasas</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Correo electrónico</p>
                <p class="font-medium">sdsdsds</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Dirección</p>
                <p class="font-medium">sdsdsd</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Teléfono</p>
                <p class="font-medium">sdsdsd</p>
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
                <p class="text-gray-600">******5225</p>
                <p class="text-gray-600">sdsdsd</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">Expira</p>
                <p class="font-medium">sdsdsdsd</p>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-6">
          <button
            class="w-full text-lg py-6 inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirmar Pago - $20000
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
