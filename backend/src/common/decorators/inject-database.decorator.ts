import { Inject } from '@nestjs/common';

export const DATABASE_TOKEN = 'DATABASE';

export const InjectDatabase = () => Inject(DATABASE_TOKEN);
