/** @format */

export const config = {
  graphqlUrl:
    process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql",
  pageSize: Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 10,
} as const

// Type for the config object
export type Config = typeof config
