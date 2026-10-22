<script setup lang="ts">
const { t } = useI18n()
const { filters, startNewSearch } = useListingQuery()

const searchInUrl = computed(() => filters.value.search)
const searchInput = ref(searchInUrl.value)

watch(searchInUrl, (value) => {
  searchInput.value = value
})

const submit = () => {
  const search = searchInput.value.trim()
  if (search === searchInUrl.value) return
  startNewSearch({ search, sort: allowedSort(filters.value.sort) })
}

const clear = () => {
  searchInput.value = ''
  submit()
}
</script>

<template>
  <form
    role="search"
    class="flex gap-2"
    @submit.prevent="submit"
  >
    <UInput
      v-model="searchInput"
      class="flex-1"
      icon="i-lucide-search"
      size="lg"
      :maxlength="SEARCH_MAX_LENGTH"
      :placeholder="t('filters.search.placeholder')"
      :aria-label="t('filters.search.label')"
    >
      <template
        v-if="searchInput"
        #trailing
      >
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="link"
          size="sm"
          :aria-label="t('filters.search.clear')"
          @click="clear"
        />
      </template>
    </UInput>
    <UButton
      type="submit"
      size="lg"
      :label="t('filters.search.submit')"
    />
  </form>
</template>
