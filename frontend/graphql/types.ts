export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type BaseResponse = {
  message: Array<Scalars['String']['output']>;
  statusCode: HttpCode;
};

export type BooleanMutation = BaseResponse & {
  __typename?: 'BooleanMutation';
  data: Scalars['Boolean']['output'];
  message: Array<Scalars['String']['output']>;
  statusCode: HttpCode;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  transactions: Array<Transaction>;
};

export type CategoryList = BaseResponse & {
  __typename?: 'CategoryList';
  data: Array<Category>;
  message: Array<Scalars['String']['output']>;
  pagination: PaginationData;
  statusCode: HttpCode;
};

export type CategoryMutation = BaseResponse & {
  __typename?: 'CategoryMutation';
  data: Category;
  message: Array<Scalars['String']['output']>;
  statusCode: HttpCode;
};

export type CreateCategoryInput = {
  name: Scalars['String']['input'];
};

export type CreateTransactionInput = {
  amount: Scalars['Float']['input'];
  categoryId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteCategoryInput = {
  id: Scalars['Int']['input'];
};

export type ErrorOutput = BaseResponse & {
  __typename?: 'ErrorOutput';
  errors: Scalars['JSON']['output'];
  message: Array<Scalars['String']['output']>;
  statusCode: HttpCode;
};

export type GetTransactionInput = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  fromAmount?: InputMaybe<Scalars['Float']['input']>;
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  toAmount?: InputMaybe<Scalars['Float']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export enum HttpCode {
  Accepted = 'ACCEPTED',
  AlreadyReported = 'ALREADY_REPORTED',
  Ambiguous = 'AMBIGUOUS',
  BadGateway = 'BAD_GATEWAY',
  BadRequest = 'BAD_REQUEST',
  Conflict = 'CONFLICT',
  ContentDifferent = 'CONTENT_DIFFERENT',
  Continue = 'CONTINUE',
  Created = 'CREATED',
  Earlyhints = 'EARLYHINTS',
  ExpectationFailed = 'EXPECTATION_FAILED',
  FailedDependency = 'FAILED_DEPENDENCY',
  Forbidden = 'FORBIDDEN',
  Found = 'FOUND',
  GatewayTimeout = 'GATEWAY_TIMEOUT',
  Gone = 'GONE',
  HttpVersionNotSupported = 'HTTP_VERSION_NOT_SUPPORTED',
  InsufficientStorage = 'INSUFFICIENT_STORAGE',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  IAmATeapot = 'I_AM_A_TEAPOT',
  LengthRequired = 'LENGTH_REQUIRED',
  Locked = 'LOCKED',
  LoopDetected = 'LOOP_DETECTED',
  MethodNotAllowed = 'METHOD_NOT_ALLOWED',
  Misdirected = 'MISDIRECTED',
  MovedPermanently = 'MOVED_PERMANENTLY',
  MultiStatus = 'MULTI_STATUS',
  NonAuthoritativeInformation = 'NON_AUTHORITATIVE_INFORMATION',
  NotAcceptable = 'NOT_ACCEPTABLE',
  NotFound = 'NOT_FOUND',
  NotImplemented = 'NOT_IMPLEMENTED',
  NotModified = 'NOT_MODIFIED',
  NoContent = 'NO_CONTENT',
  Ok = 'OK',
  PartialContent = 'PARTIAL_CONTENT',
  PayloadTooLarge = 'PAYLOAD_TOO_LARGE',
  PaymentRequired = 'PAYMENT_REQUIRED',
  PermanentRedirect = 'PERMANENT_REDIRECT',
  PreconditionFailed = 'PRECONDITION_FAILED',
  PreconditionRequired = 'PRECONDITION_REQUIRED',
  Processing = 'PROCESSING',
  ProxyAuthenticationRequired = 'PROXY_AUTHENTICATION_REQUIRED',
  RequestedRangeNotSatisfiable = 'REQUESTED_RANGE_NOT_SATISFIABLE',
  RequestTimeout = 'REQUEST_TIMEOUT',
  ResetContent = 'RESET_CONTENT',
  SeeOther = 'SEE_OTHER',
  ServiceUnavailable = 'SERVICE_UNAVAILABLE',
  SwitchingProtocols = 'SWITCHING_PROTOCOLS',
  TemporaryRedirect = 'TEMPORARY_REDIRECT',
  TooManyRequests = 'TOO_MANY_REQUESTS',
  Unauthorized = 'UNAUTHORIZED',
  UnprocessableEntity = 'UNPROCESSABLE_ENTITY',
  UnrecoverableError = 'UNRECOVERABLE_ERROR',
  UnsupportedMediaType = 'UNSUPPORTED_MEDIA_TYPE',
  UriTooLong = 'URI_TOO_LONG'
}

export type Login = {
  __typename?: 'Login';
  token: Scalars['String']['output'];
  user: User;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginMutation = BaseResponse & {
  __typename?: 'LoginMutation';
  data: Login;
  message: Array<Scalars['String']['output']>;
  statusCode: HttpCode;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: ResultUnionCategoryMutation;
  createTransaction: ResultUnionTransactionMutation;
  deleteCategory: ResultUnionBooleanMutation;
  login: ResultUnionLoginMutation;
  signup: ResultUnionSignupMutation;
  updateCategory: ResultUnionCategoryMutation;
  updateTransaction: ResultUnionTransactionMutation;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput;
};


export type MutationDeleteCategoryArgs = {
  input: DeleteCategoryInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateTransactionArgs = {
  input: UpdateTransactionInput;
};

export type PaginationData = {
  __typename?: 'PaginationData';
  cursorLeft?: Maybe<Scalars['Float']['output']>;
  cursorRight?: Maybe<Scalars['Float']['output']>;
  page: Scalars['Float']['output'];
  pageSize: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

export type PaginationInput = {
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  categories: ResultUnionCategoryList;
  me: ResultUnionUserSingle;
  transactions: ResultUnionTransactionList;
};


export type QueryCategoriesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryTransactionsArgs = {
  filter?: InputMaybe<GetTransactionInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type ResultUnionBooleanMutation = BooleanMutation | ErrorOutput;

export type ResultUnionCategoryList = CategoryList | ErrorOutput;

export type ResultUnionCategoryMutation = CategoryMutation | ErrorOutput;

export type ResultUnionLoginMutation = ErrorOutput | LoginMutation;

export type ResultUnionSignupMutation = ErrorOutput | SignupMutation;

export type ResultUnionTransactionList = ErrorOutput | TransactionList;

export type ResultUnionTransactionMutation = ErrorOutput | TransactionMutation;

export type ResultUnionUserSingle = ErrorOutput | UserSingle;

export type Signup = {
  __typename?: 'Signup';
  success: Scalars['Boolean']['output'];
};

export type SignupInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type SignupMutation = BaseResponse & {
  __typename?: 'SignupMutation';
  data: Signup;
  message: Array<Scalars['String']['output']>;
  statusCode: HttpCode;
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float']['output'];
  category: Category;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
};

export type TransactionList = BaseResponse & {
  __typename?: 'TransactionList';
  data: Array<Transaction>;
  message: Array<Scalars['String']['output']>;
  pagination: PaginationData;
  statusCode: HttpCode;
};

export type TransactionMutation = BaseResponse & {
  __typename?: 'TransactionMutation';
  data: Transaction;
  message: Array<Scalars['String']['output']>;
  statusCode: HttpCode;
};

export type UpdateCategoryInput = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type UpdateTransactionInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

export type User = {
  __typename?: 'User';
  categories: Array<Category>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserSingle = BaseResponse & {
  __typename?: 'UserSingle';
  data: User;
  message: Array<Scalars['String']['output']>;
  statusCode: HttpCode;
};
