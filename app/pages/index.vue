<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const { filters } = provideListingQuery()

const { data, error, status } = await useFetch('/api/products', {
  query: computed(() => route.query)
})

useListingSeo(filters, data)
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="t('products.title')"
      :description="data ? t('products.count', data.total) : undefined"
    />

    <ProductSearch class="mt-6" />

    <div class="grid gap-6 py-6 lg:grid-cols-4">
      <aside>
        <ProductFilters
          v-if="data"
          :facets="data.facets"
        />
      </aside>

      <section class="flex flex-col gap-4 lg:col-span-3">
        <div class="flex justify-end">
          <ProductSort />
        </div>

        <ProductResults
          :result="data"
          :failed="Boolean(error)"
          :loading="status === 'pending'"
        />
      </section>
    </div>
  </UContainer>
</template>
