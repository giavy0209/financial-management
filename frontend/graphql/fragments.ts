/** @format */

import { gql } from "@apollo/client"

export const ERROR_FRAGMENT = gql`
  fragment ErrorFields on ErrorOutput {
    message
    statusCode
    errors
  }
`
