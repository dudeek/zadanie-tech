<script setup lang="ts">
defineProps<{ result?: ProductListResponse, failed: boolean, loading: boolean }>()

const { t } = useI18n()
const route = useRoute()
const { showAllProducts } = useListingQuery()

const emptyActions = computed(() => [
  { label: t('products.empty.action'), color: 'neutral' as const, variant: 'outline' as const, onClick: showAllProducts }
])

const pageLink = (page: number) => {
  return { query: { ...route.query, page: page > 1 ? page : undefined } }
}
</script>

<template>
  <div
    class="relative flex flex-col gap-4"
    :aria-busy="loading"
  >
    <UProgress
      v-if="loading"
      size="xs"
      class="absolute inset-x-0 -top-3"
      :get-value-label="() => t('products.loading')"
    />

    <div
      class="flex flex-col gap-4 transition-opacity"
      :class="{ 'pointer-events-none opacity-50': loading }"
    >
      <UAlert
        v-if="failed"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        :title="t('products.error')"
      />

      <UEmpty
        v-else-if="result?.total === 0"
        icon="i-lucide-search-x"
        :title="t('products.empty.title')"
        :description="t('products.empty.description')"
        :actions="emptyActions"
      />

      <template v-else-if="result">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ProductCard
            v-for="product in result.products"
            :key="product.name"
            :product="product"
          />
        </div>

        <UPagination
          v-if="result.pageCount > 1"
          class="flex justify-center"
          :page="result.page"
          :total="result.total"
          :items-per-page="PAGE_SIZE"
          :to="pageLink"
        />
      </template>
    </div>
  </div>
</template>
