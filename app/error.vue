<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()

const kind = computed(() => (props.error.status === 404 ? 'notFound' : 'unexpected'))

const displayedError = computed(() => ({
  status: props.error.status,
  statusText: t(`error.${kind.value}.title`),
  message: t(`error.${kind.value}.description`)
}))

useHead(() => ({ title: displayedError.value.statusText }))
</script>

<template>
  <UApp>
    <UHeader
      :title="t('app.name')"
      :toggle="false"
    />

    <UError
      :error="displayedError"
      :icon="kind === 'notFound' ? 'i-lucide-search-x' : 'i-lucide-circle-alert'"
      :clear="{ label: t('error.backToProducts') }"
    />
  </UApp>
</template>
