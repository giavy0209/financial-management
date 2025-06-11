import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ),
  {
    rules: {
      "max-len": [
        "warning",
        {
          code: 80,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: false,
          ignoreTemplateLiterals: false,
          ignoreRegExpLiterals: true,
          ignoreComments: false,
        },
      ],
      "object-curly-newline": [
        "error",
        {
          ObjectExpression: {
            minProperties: 1,
            multiline: true,
            consistent: true,
          },
          ObjectPattern: {
            minProperties: 1,
            multiline: true,
            consistent: true,
          },
          ImportDeclaration: {
            minProperties: 2,
            multiline: true,
            consistent: true,
          },
          ExportDeclaration: {
            minProperties: 2,
            multiline: true,
            consistent: true,
          },
        },
      ],
      "object-property-newline": [
        "error",
        {
          allowAllPropertiesOnSameLine: false,
        },
      ],
      "array-element-newline": [
        "error",
        "always"
      ],
      "array-bracket-newline": [
        "error",
        {
          "multiline": true
        }
      ],
    },
  },
]

export default eslintConfig
