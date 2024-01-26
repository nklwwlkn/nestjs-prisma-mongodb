import { PickType } from '@nestjs/swagger';

import { CreateLocationDto } from '..';

export class SearchQueryDto extends PickType(CreateLocationDto, [
  'address',
  'zipcode',
] as const) {}
