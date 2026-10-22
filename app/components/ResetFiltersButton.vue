<script setup lang="ts">
const { t } = useI18n()
const { filters, clearFilters } = useListingQuery()

const isVisible = computed(() => hasActiveFilters(filters.value))
</script>

<template>
  <UButton
    v-if="isVisible"
    block
    color="neutral"
    variant="outline"
    icon="i-lucide-x"
    :label="t('filters.reset')"
    @click="clearFilters"
  />
</template>
