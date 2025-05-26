<script lang="ts" setup></script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white shadow-md rounded-lg">
      <div class="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>

        <h2 class="text-xl font-semibold mb-2">Procesando pago...</h2>
        <p class="text-gray-600">
          Por favor espera mientras procesamos tu transacción
        </p>
      </div>
    </div>
  </div>
</template>
