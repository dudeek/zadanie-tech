<script setup lang="ts">
const { t } = useI18n()
const { filters, applyFilter } = useListingQuery()

const sortItems = computed(() => sortsFor(filters.value.category).map(value => ({ label: t(`sort.${value}`), value })))

const selectSort = (value: string) => {
  applyFilter({ sort: value })
}
</script>

<template>
  <USelect
    class="w-56"
    :items="sortItems"
    :model-value="filters.sort"
    :aria-label="t('sort.label')"
    @update:model-value="selectSort"
  />
</template>
