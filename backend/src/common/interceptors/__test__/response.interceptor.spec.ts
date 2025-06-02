import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { of } from 'rxjs';
import { PaginationMapInterceptor } from '../response.interceptor';

// Mock Reflector
const mockReflector = {
  getAllAndOverride: jest.fn(),
};

// Mock ExecutionContext và GqlExecutionContext
const createMockExecutionContext = (args: any, contextType: string = 'graphql', handler = jest.fn(), classRef = jest.fn()): ExecutionContext =>
  ({
    getType: () => contextType,
    switchToHttp: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getClass: () => classRef,
    getHandler: () => handler,
    getArgs: () => [{}, args, {}, {}], // Args for GraphQL are at index 1
    getArgByIndex: jest.fn(),
    getRequest: jest.fn(),
    getResponse: jest.fn(),
    contextType,
  }) as any;

const createMockGqlExecutionContext = (args: any, handler = jest.fn(), classRef = jest.fn()): AppExecutionContext =>
  ({
    ...createMockExecutionContext(args, 'graphql', handler, classRef),
    create: jest.fn().mockReturnValue(createMockExecutionContext(args, 'graphql', handler, classRef)),
    getContext: jest.fn(),
    getRoot: jest.fn(),
    getInfo: jest.fn(),
  }) as any;

// Mock CallHandler
const createMockCallHandler = (data: any) => ({
  handle: jest.fn(() => of(data)),
});

describe('PaginationMapInterceptor', () => {
  let interceptor: PaginationMapInterceptor;

  beforeEach(() => {
    interceptor = new PaginationMapInterceptor();
    (interceptor as any).reflector = mockReflector; // Inject the mock reflector
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should transform the response for a list with pagination', (done) => {
    const mockArgs = { pagination: { page: 2, pageSize: 10 } };
    const mockHandler = jest.fn();
    const mockClass = jest.fn();
    const mockContext = createMockGqlExecutionContext(mockArgs, mockHandler, mockClass);
    const mockResult = { data: [{ id: 1 }, { id: 2 }], total: 25, message: 'Custom message' };
    const mockCallHandler = createMockCallHandler(mockResult);

    mockReflector.getAllAndOverride.mockReturnValue(true);

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          data: [{ id: 1 }, { id: 2 }],
          pagination: {
            total: 25,
            page: 2,
            pageSize: 10,
            cursorLeft: 1,
            cursorRight: 2,
          },
          message: 'Custom message',
          statusCode: HttpStatus.OK,
        });
        done();
      },
      error: done,
    });
  });

  it('should transform the response for a list with default pagination values', (done) => {
    const mockContext = createMockGqlExecutionContext({}); // No pagination provided
    const mockResult = { data: [{ id: 5 }], total: 1 };
    const mockCallHandler = createMockCallHandler(mockResult);

    mockReflector.getAllAndOverride.mockReturnValue(true);

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          data: [{ id: 5 }],
          pagination: {
            total: 1,
            page: 1,
            pageSize: Number.MAX_SAFE_INTEGER,
            cursorLeft: 5,
            cursorRight: 5,
          },
          message: 'Query successfully',
          statusCode: HttpStatus.OK,
        });
        done();
      },
      error: done,
    });
  });

  it('should transform the response for a non-list', (done) => {
    const mockHandler = jest.fn();
    const mockClass = jest.fn();
    const mockContext = createMockGqlExecutionContext({}, mockHandler, mockClass);
    const mockResult = { data: { id: 1, name: 'Test' }, message: 'Success' };
    const mockCallHandler = createMockCallHandler(mockResult);

    mockReflector.getAllAndOverride.mockReturnValue(false); // Not a list

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          data: { id: 1, name: 'Test' },
          message: 'Success',
          statusCode: HttpStatus.OK,
        });
        done();
      },
      error: done,
    });
  });
});
