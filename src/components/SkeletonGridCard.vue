<script lang="ts" setup></script>

<template>
  <Card class="overflow-hidden hover:shadow-lg transition-shadow">
    <template #content>
      <Skeleton class="mb-2" width="100%" height="8rem"></Skeleton>
      <Skeleton class="mb-2"></Skeleton>
      <Skeleton class="mb-2" width="6rem"></Skeleton>
      <Skeleton class="mb-2"></Skeleton>
      <div class="flex justify-center">
        <Skeleton width="8rem" height="2rem"></Skeleton>
      </div>
    </template>
  </Card>
</template>
