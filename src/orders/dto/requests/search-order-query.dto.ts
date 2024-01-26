import { PickType } from '@nestjs/swagger';

import { CreateLocationDto } from '..';

export class SearchOrderQueryDto extends PickType(CreateLocationDto, [
  'address',
  'zipcode',
] as const) {}
