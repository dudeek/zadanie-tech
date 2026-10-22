import { parse } from 'csv-parse/sync'
import type { Category, Product, Spec, SpecUnit } from '#shared/types/product'

interface CsvRow {
  name: string
  manufacturer: string
  price: string
  description: string
  category: string
}

const CATEGORY_BY_CSV_VALUE: Record<string, Category> = {
  'battery': 'battery',
  'solar panel': 'solar-panel',
  'connector': 'connector'
}

const UNIT_BY_CATEGORY: Record<Category, SpecUnit | null> = {
  'battery': 'kWh',
  'solar-panel': 'W',
  'connector': null
}

const SPEC_PATTERN: Record<SpecUnit, RegExp> = {
  kWh: /(\d+(?:\.\d+)?)kWh/,
  W: /(\d+(?:\.\d+)?)W\b/
}

const PRICE_FORMAT = /^\d+(\.\d{1,2})?$/
const TRAILING_NUMBER = /(\d+(?:\.\d+)?)$/

export interface ParseResult {
  products: Product[]
  warnings: string[]
}

export const parseProducts = (csv: string): ParseResult => {
  const rows = parse<CsvRow>(csv, { columns: true, skip_empty_lines: true })
  const products: Product[] = []
  const warnings: string[] = []
  const names = new Set<string>()

  for (const row of rows) {
    const category = CATEGORY_BY_CSV_VALUE[row.category]
    if (!category) {
      warnings.push(`${row.name}: unknown category "${row.category}", skipped`)
      continue
    }
    if (!PRICE_FORMAT.test(row.price)) {
      warnings.push(`${row.name}: invalid price "${row.price}", skipped`)
      continue
    }
    if (names.has(row.name)) {
      warnings.push(`${row.name}: duplicate name, skipped`)
      continue
    }
    names.add(row.name)

    const { spec, warning } = parseSpec(row, category)
    if (warning) warnings.push(warning)

    products.push({
      name: row.name,
      manufacturer: row.manufacturer,
      category,
      price: Number(row.price),
      description: row.description,
      spec
    })
  }

  return { products, warnings }
}

const parseSpec = (row: CsvRow, category: Category): { spec: Spec | null, warning?: string } => {
  const unit = UNIT_BY_CATEGORY[category]
  if (!unit) return { spec: null }

  const fromDescription = SPEC_PATTERN[unit].exec(row.description)?.[1]
  const fromName = TRAILING_NUMBER.exec(row.name)?.[1]
  if (fromDescription === undefined || fromName === undefined || Number(fromDescription) !== Number(fromName)) {
    return {
      spec: null,
      warning: `${row.name}: ${unit} in description (${fromDescription}) does not match name (${fromName})`
    }
  }

  return { spec: { value: Number(fromDescription), unit } }
}
