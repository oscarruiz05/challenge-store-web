<script lang="ts" setup>
import { defineProps, defineEmits, computed, ref, reactive } from "vue";
import {
  createTokenCard,
  getAcceptanceTokens,
} from "@/services/payments/payments";
import type { Card } from "@/types/Card";
import type { FormData, FormErrors, PaymentData } from "@/types/Form";
import { cardPatterns } from "@/utils/cardPatterns";
import { validateForm } from "@/utils/validators";
import { formatCardNumber, formatExpiryDate } from "@/utils/formatters";
import formatCurrency from "@/utils/formatCurrency";

const props = defineProps<{
  visible: boolean;
  product: any;
  hasStock: boolean;
  quantity: number;
}>();

const emit = defineEmits(["update:visible", "payment-completed"]);

const dialogVisible = computed({
  get: () => props.visible && props.hasStock,
  set: (value: boolean) => emit("update:visible", value),
});

const formData = reactive<FormData>({
  cardNumber: "",
  expiry: "",
  cvc: "",
  cardName: "",
  name: "",
  last_name: "",
  email: "",
  address: "",
  phone: "",
});

const errors = reactive<FormErrors>({
  cardNumber: "",
  expiry: "",
  cvc: "",
  cardName: "",
  name: "",
  last_name: "",
  email: "",
  address: "",
  phone: "",
});

const cardType = ref("");
const isSubmitting = ref(false);

const detectCardType = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s+/g, "");
  for (const [type, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(cleanNumber)) {
      return type;
    }
  }
  return "";
};

const handleCardNumberInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  formData.cardNumber = formatCardNumber(input.value);
  cardType.value = detectCardType(formData.cardNumber);
};

const handleExpiryInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  formData.expiry = formatExpiryDate(input.value);
};

const createCardData = (): Card => {
  const [month, year] = formData.expiry.split("/");
  return {
    number: formData.cardNumber.replace(/\s+/g, ""),
    cvc: formData.cvc,
    exp_month: month,
    exp_year: year,
    card_holder: formData.cardName,
  };
};

const createPaymentData = (
  cardToken: string,
  cardLastFour: string,
  acceptanceTokens: any
): PaymentData => {
  return {
    product_id: props.product.id,
    quantity: props.quantity,
    card_token: cardToken,
    last_four: cardLastFour,
    acceptance_token: acceptanceTokens.acceptance_token,
    accept_personal_auth: acceptanceTokens.accept_personal_auth,
    customer: {
      name: formData.name,
      last_name: formData.last_name,
      email: formData.email,
      address: formData.address,
      number_phone: formData.phone,
    },
    product: props.product,
  };
};

const submitForm = async () => {
  if (!validateForm(formData)) return;
  try {
    isSubmitting.value = true;
    const cardData = createCardData();
    const tokenResponse = await createTokenCard(cardData);
    const acceptanceTokens = await getAcceptanceTokens();

    const paymentData = createPaymentData(
      tokenResponse.data.id,
      tokenResponse.data.last_four,
      acceptanceTokens
    );
    emit("payment-completed", paymentData);
    dialogVisible.value = false;
  } catch (error) {
    console.error("Error processing payment:", error);
    alert("Hubo un error al procesar el pago. Por favor intente nuevamente.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :close-on-escape="false"
    header="Información de Pago y Entrega"
    :style="{ width: '40rem' }"
  >
    <form class="space-y-6" @submit.prevent="submitForm">
      <!-- Resumen de compra -->
      <div class="bg-white border-1 border-gray-300 rounded-lg p-6">
        <div class="mb-4">
          <h2 class="text-2xl font-semibold">🛒 Resumen de Compra</h2>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="font-medium">Producto:</span>
            <span>{{ product?.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-medium">Cantidad:</span>
            <span>{{ quantity }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-medium">Precio unitario:</span>
            <span>{{ formatCurrency(product?.price)}}</span>
          </div>
          <div class="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>{{ formatCurrency(product?.price * quantity) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white border-1 border-gray-300 rounded-lg p-6">
        <div class="mb-4">
          <h2 class="flex items-center gap-2 text-2xl font-semibold">
            💳 Datos de Tarjeta
            <span v-if="cardType" class="text-sm bg-blue-100 px-2 py-1 rounded">
              {{
                cardType === "visa"
                  ? "VISA"
                  : cardType === "mastercard"
                  ? "MASTERCARD"
                  : cardType === "amex"
                  ? "AMEX"
                  : "DINERS"
              }}
            </span>
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
              v-model="formData.cardNumber"
              @input="handleCardNumberInput"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            <p v-if="errors.cardNumber" class="text-red-500 text-sm mt-1">
              {{ errors.cardNumber }}
            </p>
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
                v-model="formData.expiry"
                @input="handleExpiryInput"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              <p v-if="errors.expiry" class="text-red-500 text-sm mt-1">
                {{ errors.expiry }}
              </p>
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
                v-model="formData.cvc"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              <p v-if="errors.cvc" class="text-red-500 text-sm mt-1">
                {{ errors.cvc }}
              </p>
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
              v-model="formData.cardName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            <p v-if="errors.cardName" class="text-red-500 text-sm mt-1">
              {{ errors.cardName }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white border-1 border-gray-300 rounded-lg p-6">
        <div class="mb-4">
          <h2 class="text-2xl font-semibold">🚚 Datos de Entrega</h2>
        </div>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Nombre</label
              >
              <input
                id="name"
                type="text"
                placeholder="Tu nombre"
                v-model="formData.name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              <p v-if="errors.name" class="text-red-500 text-sm mt-1">
                {{ errors.name }}
              </p>
            </div>
            <div>
              <label
                for="last_name"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Apellido</label
              >
              <input
                id="last_name"
                type="text"
                placeholder="Tu nombre"
                v-model="formData.last_name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              <p v-if="errors.last_name" class="text-red-500 text-sm mt-1">
                {{ errors.last_name }}
              </p>
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
                v-model="formData.email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                {{ errors.email }}
              </p>
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
                v-model="formData.phone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
              <p v-if="errors.phone" class="text-red-500 text-sm mt-1">
                {{ errors.phone }}
              </p>
            </div>
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
              v-model="formData.address"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
            <p v-if="errors.address" class="text-red-500 text-sm mt-1">
              {{ errors.address }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-3">
        <Button
          severity="secondary"
          @click="dialogVisible = false"
          type="button"
          :disabled="isSubmitting"
          >Cancelar</Button
        >
        <Button
          type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          class="p-button-primary"
        >
          <i v-if="isSubmitting" class="pi pi-spin pi-spinner mr-2"></i>
          {{ isSubmitting ? "Procesando datos..." : "Procesar pago" }}
        </Button>
      </div>
    </form>
  </Dialog>
</template>
