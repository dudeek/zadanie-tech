<script setup lang="ts">
const { t } = useI18n()
const localeHead = useLocaleHead({ seo: { canonicalQueries: INDEXABLE_PARAMS } })

useHead(() => ({
  titleTemplate: title => (title ? `${title} | ${t('app.name')}` : t('app.name')),
  htmlAttrs: localeHead.value.htmlAttrs,
  link: [
    { rel: 'icon', href: '/energyicon.ico' },
    ...(localeHead.value.link ?? [])
  ],
  meta: [...(localeHead.value.meta ?? [])]
}))
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
