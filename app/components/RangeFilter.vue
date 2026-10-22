<script setup lang="ts">
const props = defineProps<{
  param: RangeParam
  label: string
  range: NumberRange
  bounds: { min: number, max: number }
}>()

const { t, n } = useI18n()
const { applyFilter } = useListingQuery()

const minInput = ref<number | null | undefined>(props.range.min)
const maxInput = ref<number | null | undefined>(props.range.max)

watch([() => props.range.min, () => props.range.max], ([min, max]) => {
  minInput.value = min
  maxInput.value = max
})

const minAboveMax = computed(() => minInput.value != null && maxInput.value != null && minInput.value > maxInput.value)

const applyRange = (delay?: number) => {
  const min = minInput.value ?? undefined
  const max = maxInput.value ?? undefined
  const unchanged = min === props.range.min && max === props.range.max
  if (minAboveMax.value || unchanged) return
  applyFilter(rangeToQuery(props.param, { min, max }), delay)
}

const applyWhenFocusLeavesPair = (event: FocusEvent) => {
  const pair = event.currentTarget as HTMLElement
  if (!pair.contains(event.relatedTarget as Node | null)) applyRange()
}
</script>

<template>
  <UFormField
    :label="label"
    :error="minAboveMax ? t('filters.rangeError') : undefined"
  >
    <div
      class="grid grid-cols-2 gap-2"
      @focusout="applyWhenFocusLeavesPair"
      @keydown.enter="applyRange(0)"
    >
      <UInputNumber
        v-model="minInput"
        :min="0"
        :step="RANGE_STEP[param]"
        :increment="false"
        :decrement="false"
        :placeholder="`${t('filters.min')} ${n(bounds.min)}`"
        :aria-label="`${label} ${t('filters.min')}`"
      />
      <UInputNumber
        v-model="maxInput"
        :min="0"
        :step="RANGE_STEP[param]"
        :increment="false"
        :decrement="false"
        :placeholder="`${t('filters.max')} ${n(bounds.max)}`"
        :aria-label="`${label} ${t('filters.max')}`"
      />
    </div>
  </UFormField>
</template>
