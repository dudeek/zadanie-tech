<script setup lang="ts">
defineProps<{ product: Product }>()

const { t, n } = useI18n()
</script>

<template>
  <UCard :ui="{ root: 'flex flex-col', body: 'flex flex-1 flex-col gap-3' }">
    <div>
      <UBadge
        :label="t(`category.${product.category}`)"
        color="neutral"
        variant="subtle"
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

    <UTooltip
      :text="product.description"
      :content="{ side: 'top' }"
      :ui="{ content: 'h-auto max-w-sm text-sm', text: 'whitespace-normal' }"
    >
      <p class="line-clamp-3 text-sm text-toned">
        {{ product.description }}
      </p>
    </UTooltip>

    <div class="mt-auto flex items-center justify-between gap-2">
      <UBadge
        v-if="product.spec"
        :label="`${n(product.spec.value)} ${product.spec.unit}`"
        color="primary"
        variant="soft"
      />
      <p class="ml-auto text-lg font-semibold text-highlighted">
        {{ n(product.price, 'price') }}
      </p>
    </div>
  </UCard>
</template>
