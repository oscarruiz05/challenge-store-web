<script lang="ts" setup>
import formatCurrency from "@/utils/formatCurrency";
import { defineProps } from "vue";

const props = defineProps<{
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}>();
</script>

<template>
  <Card class="overflow-hidden hover:shadow-lg transition-shadow">
    <template #header>
      <img
        alt="user header"
        :src="props.image"
      />
    </template>
    <template #title>{{ props.title }}</template>
    <template #subtitle>{{ formatCurrency(props.price) }}</template>
    <template #content>
      <p class="m-0">
        {{ props.description }}
      </p>
    </template>
    <template #footer>
      <RouterLink :to="`/products/${props.id}`">
        <Button class="w-full bottom-0">Ver producto</Button>
      </RouterLink>
    </template>
  </Card>
</template>
