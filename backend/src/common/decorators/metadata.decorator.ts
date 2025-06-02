import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'IS_PUBLIC_KEY';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_GET_LIST = 'IS_GET_LIST';
export const IsGetList = () => SetMetadata(IS_GET_LIST, true);
