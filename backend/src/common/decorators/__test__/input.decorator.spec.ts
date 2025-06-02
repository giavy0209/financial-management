import { PipeTransform } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { Input } from '../input.decorator';

jest.mock('@nestjs/graphql', () => ({
  Args: jest.fn(),
  ArgsOptions: jest.fn(),
}));

describe('Input Decorator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call Args with "input" and the provided pipes', () => {
    class MockPipe1 implements PipeTransform {
      transform(value: any) {
        return value;
      }
    }
    const mockPipe2: PipeTransform = {
      transform: (value: any) => value,
    };

    Input(MockPipe1, mockPipe2);

    expect(Args).toHaveBeenCalledWith('input', MockPipe1, mockPipe2);
  });

  it('should call Args with "input" when no pipes are provided', () => {
    Input();
    expect(Args).toHaveBeenCalledWith('input');
  });

  it('should handle a single pipe (class)', () => {
    class SingleMockPipe implements PipeTransform {
      transform(value: any) {
        return value;
      }
    }

    Input(SingleMockPipe);
    expect(Args).toHaveBeenCalledWith('input', SingleMockPipe);
  });

  it('should handle a single pipe (instance)', () => {
    const singleMockPipeInstance: PipeTransform = {
      transform: (value: any) => value,
    };

    Input(singleMockPipeInstance);
    expect(Args).toHaveBeenCalledWith('input', singleMockPipeInstance);
  });
});
