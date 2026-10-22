<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const { startNewSearch } = provideListingQuery()

const { data, error } = await useFetch('/api/products', {
  query: computed(() => route.query)
})

const pageLink = (page: number) => {
  return { query: { ...route.query, page: page > 1 ? page : undefined } }
}
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="t('products.title')"
      :description="data ? t('products.count', data.total) : undefined"
    />

    <ProductSearch class="mt-6" />

    <div class="grid gap-6 py-6 lg:grid-cols-4">
      <div>
        <ProductFilters
          v-if="data"
          :facets="data.facets"
        />
      </div>

      <div class="flex flex-col gap-4 lg:col-span-3">
        <div class="flex justify-end">
          <ProductSort />
        </div>

        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :title="t('products.error')"
        />

        <UEmpty
          v-else-if="data?.total === 0"
          icon="i-lucide-search-x"
          :title="t('products.empty.title')"
          :description="t('products.empty.description')"
          :actions="[{ label: t('filters.reset'), color: 'neutral', variant: 'outline', onClick: () => startNewSearch({}) }]"
        />

        <template v-else-if="data">
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ProductCard
              v-for="product in data.products"
              :key="product.name"
              :product="product"
            />
          </div>

          <UPagination
            v-if="data.pageCount > 1"
            class="flex justify-center"
            :page="data.page"
            :total="data.total"
            :items-per-page="PAGE_SIZE"
            :to="pageLink"
          />
        </template>
      </div>
    </div>
  </UContainer>
</template>
