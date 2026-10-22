<script setup lang="ts">
const { t } = useI18n()
const { filters, startNewSearch } = useListingQuery()

const isRangeSet = (range: NumberRange) => range.min !== undefined || range.max !== undefined

const hasActiveFilters = computed(() => {
  const { category, manufacturers, price, spec } = filters.value
  return Boolean(category) || manufacturers.length > 0 || isRangeSet(price) || isRangeSet(spec)
})

const resetFilters = () => {
  startNewSearch({ search: filters.value.search, sort: allowedSort(filters.value.sort) })
}
</script>

<template>
  <UButton
    v-if="hasActiveFilters"
    block
    color="neutral"
    variant="outline"
    icon="i-lucide-x"
    :label="t('filters.reset')"
    @click="resetFilters"
  />
</template>
