<script setup lang="ts">
import { PAGE_SIZE } from '#shared/utils/constants'

const { t } = useI18n()
const route = useRoute()

// The URL is the state: SSR and client navigation fetch with the same query.
const { data, error } = await useFetch('/api/products', {
  query: computed(() => route.query)
})

// Real links, so pages are crawlable and each page is a history entry.
function pageLink(page: number) {
  return { query: { ...route.query, page: page > 1 ? page : undefined } }
}
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="t('products.title')"
      :description="data ? t('products.count', data.total) : undefined"
    />

    <UAlert
      v-if="error"
      class="my-6"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="t('products.error')"
    />

    <UEmpty
      v-else-if="data?.total === 0"
      class="my-6"
      icon="i-lucide-search-x"
      :title="t('products.empty.title')"
      :description="t('products.empty.description')"
    />

    <template v-else-if="data">
      <div class="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard
          v-for="product in data.products"
          :key="product.name"
          :product="product"
        />
      </div>

      <UPagination
        v-if="data.pageCount > 1"
        class="flex justify-center pb-10"
        :page="data.page"
        :total="data.total"
        :items-per-page="PAGE_SIZE"
        :to="pageLink"
      />
    </template>
  </UContainer>
</template>
