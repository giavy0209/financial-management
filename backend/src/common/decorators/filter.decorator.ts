import { PipeTransform, Type } from '@nestjs/common';
import { Args } from '@nestjs/graphql';

export const Filters = (...pipes: (Type<PipeTransform> | PipeTransform)[]) => {
  return Args('filter', { nullable: true }, ...pipes);
};
