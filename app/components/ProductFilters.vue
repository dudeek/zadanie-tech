<script setup lang="ts">
defineProps<{ facets: Facets }>()

const { t } = useI18n()
const { filters, applyFilter } = useListingQuery()

const ALL_CATEGORIES = 'all'

const specParam = computed(() => (filters.value.category ? SPEC_PARAM_BY_CATEGORY[filters.value.category] : null))

const categoryItems = computed(() => [
  { label: t('filters.category.all'), value: ALL_CATEGORIES },
  ...CATEGORIES.map(value => ({ label: t(`category.${value}`), value }))
])

const selectCategory = (value: string) => {
  const newCategory = queryOneOf(value, CATEGORIES)
  applyFilter({
    category: newCategory,
    manufacturer: undefined,
    ...rangeToQuery('capacity', {}),
    ...rangeToQuery('power', {}),
    sort: allowedSort(filters.value.sort, newCategory)
  })
}

const selectManufacturer = (value: string | null) => {
  applyFilter({ manufacturer: value ?? undefined })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UFormField :label="t('filters.category.label')">
      <USelect
        class="w-full"
        :items="categoryItems"
        :model-value="filters.category ?? ALL_CATEGORIES"
        @update:model-value="selectCategory"
      />
    </UFormField>

    <UFormField :label="t('filters.manufacturer.label')">
      <USelectMenu
        class="w-full"
        clear
        :items="facets.manufacturers"
        :model-value="filters.manufacturers[0]"
        :placeholder="t('filters.manufacturer.placeholder')"
        @update:model-value="selectManufacturer"
      />
    </UFormField>

    <RangeFilter
      param="price"
      :label="t('filters.price')"
      :range="filters.price"
      :bounds="facets.price"
    />

    <RangeFilter
      v-if="specParam && facets.spec"
      :key="specParam"
      :param="specParam"
      :label="t(`filters.${specParam}`)"
      :range="filters.spec"
      :bounds="facets.spec"
    />

    <ResetFiltersButton />
  </div>
</template>
