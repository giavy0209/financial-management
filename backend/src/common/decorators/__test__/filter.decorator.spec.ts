import { PipeTransform } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { Filters } from '../filter.decorator';

jest.mock('@nestjs/graphql', () => ({
  Args: jest.fn(),
}));

describe('Filters Decorator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call Args with "filter" and the provided pipes', () => {
    class MockPipe1 implements PipeTransform {
      transform(value: any) {
        return value;
      }
    }
    const mockPipe2: PipeTransform = {
      transform: (value: any) => value,
    };

    Filters(MockPipe1, mockPipe2);

    expect(Args).toHaveBeenCalledWith('filter', { nullable: true }, MockPipe1, mockPipe2);
  });

  it('should call Args with "filter" and no pipes when no pipes are provided', () => {
    Filters();
    expect(Args).toHaveBeenCalledWith('filter', { nullable: true });
  });

  it('should handle a single pipe (class)', () => {
    class SingleMockPipe implements PipeTransform {
      transform(value: any) {
        return value;
      }
    }

    Filters(SingleMockPipe);
    expect(Args).toHaveBeenCalledWith('filter', { nullable: true }, SingleMockPipe);
  });

  it('should handle a single pipe (instance)', () => {
    const singleMockPipeInstance: PipeTransform = {
      transform: (value: any) => value,
    };

    Filters(singleMockPipeInstance);
    expect(Args).toHaveBeenCalledWith('filter', { nullable: true }, singleMockPipeInstance);
  });
});
