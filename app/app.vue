<script setup lang="ts">
const { t } = useI18n()

useHead({
  link: [
    { rel: 'icon', href: '/energyicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: () => t('app.name')
})
</script>

<template>
  <UApp>
    <UHeader
      :title="t('app.name')"
      :toggle="false"
    />

    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
