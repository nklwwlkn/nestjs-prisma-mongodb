import { PickType } from '@nestjs/swagger';

import { CreateLocationDto } from '@orders/dtos';

export class SearchOrderQueryDto extends PickType(CreateLocationDto, [
  'address',
  'zipcode',
] as const) {}
