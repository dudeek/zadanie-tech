<script setup lang="ts">
const { t } = useI18n()
const localeHead = useLocaleHead()

useHead(() => ({
  link: [
    { rel: 'icon', href: '/energyicon.ico' }
  ],
  htmlAttrs: localeHead.value.htmlAttrs
}))

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
