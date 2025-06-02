import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from '../exception.interceptor';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockHost: ArgumentsHost;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockGqlHost: GqlArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      getRequest: jest.fn(),
      getResponse: jest.fn(),
      getType: jest.fn(),
    } as ArgumentsHost;

    mockGqlHost = {
      getType: jest.fn().mockReturnValue('graphql'),
      getArgs: jest.fn(),
      getContext: jest.fn(),
      getRoot: jest.fn(),
      getInfo: jest.fn(),
    } as any;
  });

  it('should handle HttpException and return formatted response', () => {
    const exception = new HttpException({ message: 'Test error message', errors: ['error1', 'error2'] }, HttpStatus.BAD_REQUEST);
    filter.catch(exception, mockHost);

    expect(mockHost.switchToHttp().getResponse().status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);

    expect(mockHost.switchToHttp().getResponse().json).toHaveBeenCalledWith({
      message: 'Test error message',
      errors: ['error1', 'error2'],
    });
  });

  it('should handle HttpException with string response', () => {
    const exception = new HttpException('Simple error message', HttpStatus.UNAUTHORIZED);
    filter.catch(exception, mockHost);

    expect(mockHost.switchToHttp().getResponse().status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockHost.switchToHttp().getResponse().json).toHaveBeenCalledWith({
      message: undefined,
      errors: [],
    });
  });

  it('should handle HttpException with only message in response', () => {
    const exception = new HttpException({ message: 'Only message' }, HttpStatus.FORBIDDEN);
    const result = filter.catch(exception, mockHost);

    expect(mockHost.switchToHttp().getResponse().status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockHost.switchToHttp().getResponse().json).toHaveBeenCalledWith({
      message: 'Only message',
      errors: [],
    });
  });

  it('should handle HttpException without errors field', () => {
    const exception = new HttpException({ message: 'No errors field' }, HttpStatus.NOT_FOUND);
    const result = filter.catch(exception, mockHost);

    expect(mockHost.switchToHttp().getResponse().status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockHost.switchToHttp().getResponse().json).toHaveBeenCalledWith({
      message: 'No errors field',
      errors: [],
    });
  });
  it('should handle exceptions where getResponse returns a string', () => {
    const exception = new HttpException('String response', HttpStatus.BAD_GATEWAY);
    filter.catch(exception, mockHost);

    expect(mockHost.switchToHttp().getResponse().status).toHaveBeenCalledWith(HttpStatus.BAD_GATEWAY);
    expect(mockHost.switchToHttp().getResponse().json).toHaveBeenCalledWith({
      message: undefined,
      errors: [],
    });
  });
});
