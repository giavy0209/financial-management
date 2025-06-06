/** @format */

import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "http://localhost:3001/graphql",
  documents: ["**/*.ts"],
  generates: {
    "./graphql/queries.ts": {
      preset: "import-types",
      plugins: ["typescript-operations"],
      presetConfig: {
        typesPath: "./types",
      },
    },

    "./graphql/types.ts": {
      plugins: ["typescript"],
      config: {
        arrayInputCoercion: false,
      },
    },
  },

  ignoreNoDocuments: true,
}

export default config
