import { PickType } from '@nestjs/swagger';

import { PersistedOrderDto } from './persisted-order.dto';

export class FoundOrdersDto extends PickType(PersistedOrderDto, [
  'id',
] as const) {}
