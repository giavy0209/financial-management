import { PipeTransform, Type } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
export const Input = (...pipes: (Type<PipeTransform> | PipeTransform)[]) => {
  return Args('input', ...pipes);
};
