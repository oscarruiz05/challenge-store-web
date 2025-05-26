<script lang="ts" setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(["update:visible"]);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value),
});
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :close-on-escape="false"
    header="Información de Pago y Entrega"
    :style="{ width: '40rem' }"
  >
    <form class="space-y-6">
      <div class="bg-white shadow-md rounded-lg p-6">
        <div class="mb-4">
          <h2 class="flex items-center gap-2 text-2xl font-semibold">
            💳 Datos de Tarjeta
            <!-- <span v-if="cardType" class="text-sm bg-blue-100 px-2 py-1 rounded">
            {{ cardType === 'visa' ? 'VISA' : 'MASTERCARD' }}
          </span> -->
          </h2>
        </div>
        <div class="space-y-4">
          <div>
            <label
              for="cardNumber"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Número de Tarjeta</label
            >
            <input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            <!-- <p v-if="errors.cardNumber" class="text-red-500 text-sm mt-1">{{ errors.cardNumber }}</p> -->
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="expiry"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Fecha de Expiración</label
              >
              <input
                id="expiry"
                type="text"
                placeholder="MM/AA"
                maxlength="5"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              <!-- <p v-if="errors.expiry" class="text-red-500 text-sm mt-1">{{ errors.expiry }}</p> -->
            </div>

            <div>
              <label
                for="cvc"
                class="block text-sm font-medium text-gray-700 mb-1"
                >CVC</label
              >
              <input
                id="cvc"
                type="text"
                placeholder="123"
                maxlength="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              <!-- <p v-if="errors.cvc" class="text-red-500 text-sm mt-1">{{ errors.cvc }}</p> -->
            </div>
          </div>

          <div>
            <label
              for="cardName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Nombre del Titular</label
            >
            <input
              id="cardName"
              type="text"
              placeholder="Nombre como aparece en la tarjeta"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            <!-- <p v-if="errors.cardName" class="text-red-500 text-sm mt-1">{{ errors.cardName }}</p> -->
          </div>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-lg p-6">
        <div class="mb-4">
          <h2 class="text-2xl font-semibold">🚚 Datos de Entrega</h2>
        </div>
        <div class="space-y-4">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Nombre Completo</label
            >
            <input
              id="name"
              type="text"
              placeholder="Tu nombre completo"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            <!-- <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p> -->
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Correo Electrónico</label
            >
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            <!-- <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p> -->
          </div>

          <div>
            <label
              for="address"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Dirección de Envío</label
            >
            <input
              id="address"
              type="text"
              placeholder="Calle, número, ciudad, código postal"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            <!-- <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p> -->
          </div>

          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Teléfono de Contacto</label
            >
            <input
              id="phone"
              type="text"
              placeholder="+57 300 123 4567"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            <!-- <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p> -->
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-3">
        <Button severity="secondary" @click="dialogVisible = false">Volver</Button>
        <RouterLink to="/summary">
          <Button>Continuar al Resumen</Button>
        </RouterLink>
      </div>
    </form>
  </Dialog>
</template>
