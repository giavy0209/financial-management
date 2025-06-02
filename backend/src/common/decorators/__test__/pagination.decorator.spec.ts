import { GqlExecutionContext } from '@nestjs/graphql';
import { HttpValidationPipe } from 'src/common/pipes/validation.pipe';
import { paginationFactory } from '../pagination.decorator';

// Mock ExecutionContext GqlExecutionContext
const createMockExecutionContext = (args: any) => ({
  getType: () => 'graphql',
  switchToHttp: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
  getClass: jest.fn(),
  getHandler: jest.fn(),
  getArgs: () => [{}, args, {}, {}],
  getArgByIndex: jest.fn(),
  getRequest: jest.fn(),
  getResponse: jest.fn(),
});

const createMockGqlExecutionContext = (args: any): GqlExecutionContext =>
  ({
    ...createMockExecutionContext(args),
    create: jest.fn().mockReturnValue(createMockExecutionContext(args)),
    getContext: jest.fn(),
    getRoot: jest.fn(),
    getInfo: jest.fn(),
  }) as any;

describe('paginationFactory', () => {
  let mockPipeTransform: jest.SpyInstance;

  beforeEach(() => {
    mockPipeTransform = jest.spyOn(HttpValidationPipe.prototype, 'transform');
  });

  afterEach(() => {
    mockPipeTransform.mockRestore();
  });

  it('should return default values (skip=0, take=MAX_SAFE_INTEGER) if no pagination input is provided', async () => {
    const mockContext = createMockGqlExecutionContext({});
    const result = await paginationFactory(null, mockContext);

    expect(result).toEqual({ skip: 0, take: Number.MAX_SAFE_INTEGER });
  });

  it('should calculate skip and take correctly with valid page and pageSize', async () => {
    const mockContext = createMockGqlExecutionContext({ pagination: { page: 2, pageSize: 20 } });
    const result = await paginationFactory(null, mockContext);
    expect(result).toEqual({ skip: 20, take: 20 });
  });

  it('should use default pageSize if only page is provided', async () => {
    const mockContext = createMockGqlExecutionContext({ pagination: { page: 3 } });
    const result = await paginationFactory(null, mockContext);
    expect(result).toEqual({ skip: 0, take: Number.MAX_SAFE_INTEGER });
  });

  it('should use default page if only pageSize is provided', async () => {
    const mockContext = createMockGqlExecutionContext({ pagination: { pageSize: 50 } });
    const result = await paginationFactory(null, mockContext);
    expect(result).toEqual({ skip: 0, take: 50 });
  });
  it('should handle page = 1 correctly', async () => {
    const mockContext = createMockGqlExecutionContext({ pagination: { page: 1, pageSize: 10 } });
    const result = await paginationFactory(null, mockContext);
    expect(result).toEqual({ skip: 0, take: 10 });
  });
  it('should handle missing pagination object', async () => {
    const mockContext = createMockGqlExecutionContext({});
    const result = await paginationFactory(null, mockContext);
    expect(result).toEqual({ skip: 0, take: Number.MAX_SAFE_INTEGER });
  });
});
