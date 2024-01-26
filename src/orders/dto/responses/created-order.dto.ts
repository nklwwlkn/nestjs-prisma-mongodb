import { PickType } from '@nestjs/swagger';

import { PersistedOrderDto } from './persisted-order.dto';

export class CreatedOrderDto extends PickType(PersistedOrderDto, [
  'id',
  'status',
  'price',
] as const) {}
