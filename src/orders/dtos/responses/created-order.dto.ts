import { PickType } from '@nestjs/swagger';

import { PersistedOrderDto } from '@orders/dtos';

export class CreatedOrderDto extends PickType(PersistedOrderDto, [
  'id',
  'status',
  'price',
] as const) {}
