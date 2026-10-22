// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/api/defaults'
import { MatcherType, SelectorKind } from 'eslint-plugin-better-tailwindcss/api/types'
import eslintPluginJsonc from 'eslint-plugin-jsonc'

const localeFiles = ['i18n/locales/*.json']

export default withNuxt(
  eslintPluginJsonc.configs.base.map(config => ({ ...config, files: localeFiles })),
  {
    files: ['**/*.vue'],
    rules: {
      'vue/block-lang': ['error', { script: { lang: 'ts' } }]
    }
  },
  {
    files: ['app/**', 'server/**', 'shared/**', 'test/**'],
    rules: {
      'func-style': ['error', 'expression']
    }
  },
  {
    files: localeFiles,
    rules: {
      'jsonc/sort-keys': ['error', { pathPattern: '.*', order: { type: 'asc' } }]
    }
  },
  betterTailwindcss.configs['correctness-error'],
  betterTailwindcss.configs['stylistic-warn'],
  {
    rules: {
      'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', { printWidth: 100, preferSingleLine: true }]
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/css/main.css',
        rootFontSize: 16,
        selectors: [
          ...getDefaultSelectors(),
          { kind: SelectorKind.Attribute, name: '^v-bind:ui$', match: [{ type: MatcherType.ObjectValue }] }
        ]
      }
    }
  }
)
