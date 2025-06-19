import * as Types from './types';

export type ErrorFieldsFragment = { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any };

export type PaginationFieldsFragment = { __typename?: 'PaginationData', page: number, pageSize: number, total: number };

export type CategoryFieldsFragment = { __typename?: 'Category', id: number, name: string };

export type GetCategoriesQueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: { __typename?: 'CategoryList', message: Array<string>, statusCode: Types.HttpCode, data: Array<{ __typename?: 'Category', id: number, name: string }>, pagination: { __typename?: 'PaginationData', page: number, pageSize: number, total: number } } | { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } };

export type CreateCategoryMutationVariables = Types.Exact<{
  input: Types.CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'CategoryMutation', message: Array<string>, statusCode: Types.HttpCode, data: { __typename?: 'Category', id: number, name: string } } | { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } };

export type UpdateCategoryMutationVariables = Types.Exact<{
  input: Types.UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'CategoryMutation', message: Array<string>, statusCode: Types.HttpCode, data: { __typename?: 'Category', id: number, name: string } } | { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } };

export type DeleteCategoryMutationVariables = Types.Exact<{
  input: Types.DeleteCategoryInput;
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'BooleanMutation', message: Array<string>, statusCode: Types.HttpCode, data: boolean } | { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } };

export type MoneySourceFieldsFragment = { __typename?: 'MoneySource', id: number, name: string, value: number, createdAt: any };

export type GetMoneySourcesQueryVariables = Types.Exact<{
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type GetMoneySourcesQuery = { __typename?: 'Query', moneySources: { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } | { __typename?: 'MoneySourceList', data: Array<{ __typename?: 'MoneySource', id: number, name: string, value: number, createdAt: any }>, pagination: { __typename?: 'PaginationData', page: number, pageSize: number, total: number } } };

export type CreateMoneySourceMutationVariables = Types.Exact<{
  input: Types.CreateMoneySourceInput;
}>;


export type CreateMoneySourceMutation = { __typename?: 'Mutation', createMoneySource: { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } | { __typename?: 'MoneySourceMutation', message: Array<string>, data: { __typename?: 'MoneySource', id: number, name: string, value: number, createdAt: any } } };

export type UpdateMoneySourceMutationVariables = Types.Exact<{
  input: Types.UpdateMoneySourceInput;
}>;


export type UpdateMoneySourceMutation = { __typename?: 'Mutation', updateMoneySource: { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } | { __typename?: 'MoneySourceMutation', message: Array<string>, data: { __typename?: 'MoneySource', id: number, name: string, value: number, createdAt: any } } };

export type TransactionFieldsFragment = { __typename?: 'Transaction', id: number, description?: string | null, amount: number, createdAt: any, category: { __typename?: 'Category', id: number, name: string }, moneySource: { __typename?: 'MoneySource', id: number, name: string } };

export type GetTransactionsQueryVariables = Types.Exact<{
  filter: Types.GetTransactionInput;
  pagination?: Types.InputMaybe<Types.PaginationInput>;
}>;


export type GetTransactionsQuery = { __typename?: 'Query', transactions: { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } | { __typename?: 'TransactionList', message: Array<string>, statusCode: Types.HttpCode, data: Array<{ __typename?: 'Transaction', id: number, description?: string | null, amount: number, createdAt: any, category: { __typename?: 'Category', id: number, name: string }, moneySource: { __typename?: 'MoneySource', id: number, name: string } }>, pagination: { __typename?: 'PaginationData', page: number, pageSize: number, total: number } } };

export type CreateTransactionMutationVariables = Types.Exact<{
  input: Types.CreateTransactionInput;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } | { __typename?: 'TransactionMutation', message: Array<string>, statusCode: Types.HttpCode, data: { __typename?: 'Transaction', id: number, description?: string | null, amount: number, createdAt: any, category: { __typename?: 'Category', id: number, name: string }, moneySource: { __typename?: 'MoneySource', id: number, name: string } } } };

export type UpdateTransactionMutationVariables = Types.Exact<{
  input: Types.UpdateTransactionInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } | { __typename?: 'TransactionMutation', message: Array<string>, statusCode: Types.HttpCode, data: { __typename?: 'Transaction', id: number, description?: string | null, amount: number, createdAt: any, category: { __typename?: 'Category', id: number, name: string }, moneySource: { __typename?: 'MoneySource', id: number, name: string } } } };

export type GetSummaryQueryVariables = Types.Exact<{
  filter: Types.GetTransactionInput;
}>;


export type GetSummaryQuery = { __typename?: 'Query', summary: { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } | { __typename?: 'SummarySingle', message: Array<string>, statusCode: Types.HttpCode, data: { __typename?: 'Summary', sum: number } } };

export type UserFieldsFragment = { __typename?: 'User', id: number, email: string, name?: string | null, createdAt: any, updatedAt: any };

export type SignupMutationVariables = Types.Exact<{
  input: Types.SignupInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } | { __typename?: 'SignupMutation', message: Array<string>, statusCode: Types.HttpCode, data: { __typename?: 'Signup', success: boolean } } };

export type LoginMutationVariables = Types.Exact<{
  input: Types.LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } | { __typename?: 'LoginMutation', message: Array<string>, statusCode: Types.HttpCode, data: { __typename?: 'Login', token: string, user: { __typename?: 'User', id: number, email: string, name?: string | null, createdAt: any, updatedAt: any } } } };

export type GetCurrentUserQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', me: { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any } | { __typename?: 'UserSingle', message: Array<string>, statusCode: Types.HttpCode, data: { __typename?: 'User', id: number, email: string, name?: string | null, createdAt: any, updatedAt: any } } };
