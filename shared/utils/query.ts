export const queryString = (value: unknown): string | undefined => {
  const first: unknown = Array.isArray(value) ? value[0] : value
  return typeof first === 'string' ? first : undefined
}

export const queryList = (value: unknown): string[] => {
  return [value].flat().filter((item): item is string => typeof item === 'string' && item !== '')
}

export const queryNumber = (value: unknown): number | undefined => {
  const text = queryString(value)?.trim()
  if (!text) return undefined
  const number = Number(text)
  return Number.isFinite(number) && number >= 0 ? number : undefined
}

export const queryPage = (value: unknown): number => {
  const page = queryNumber(value)
  return page !== undefined && Number.isInteger(page) && page >= 1 ? page : 1
}

export const queryOneOf = <T extends string>(value: unknown, allowed: readonly T[]): T | undefined => {
  const text = queryString(value)
  return allowed.find(item => item === text)
}
