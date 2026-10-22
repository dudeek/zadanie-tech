<script setup lang="ts">
import type { Product } from '#shared/types/product'

defineProps<{ product: Product }>()

const { t, n } = useI18n()
</script>

<template>
  <UCard :ui="{ root: 'flex flex-col', body: 'flex flex-1 flex-col gap-3' }">
    <div class="flex flex-wrap items-center gap-2">
      <UBadge
        :label="t(`category.${product.category}`)"
        color="neutral"
        variant="subtle"
      />
      <UBadge
        v-if="product.spec"
        :label="`${n(product.spec.value)} ${product.spec.unit}`"
        color="primary"
        variant="soft"
      />
    </div>

    <div>
      <h2 class="font-semibold text-highlighted">
        {{ product.name }}
      </h2>
      <p class="text-sm text-muted">
        {{ product.manufacturer }}
      </p>
    </div>

    <p class="line-clamp-3 text-sm text-toned">
      {{ product.description }}
    </p>

    <p class="mt-auto text-lg font-semibold text-highlighted">
      {{ n(product.price, 'price') }}
    </p>
  </UCard>
</template>
