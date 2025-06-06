import * as Types from './types';

export type ErrorFieldsFragment = { __typename?: 'ErrorOutput', message: Array<string>, statusCode: Types.HttpCode, errors: any };

export type CategoryFieldsFragment = { __typename?: 'Category', id: number, name: string };

export type GetCategoriesQueryVariables = Types.Exact<{
  pagination: Types.PaginationInput;
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
