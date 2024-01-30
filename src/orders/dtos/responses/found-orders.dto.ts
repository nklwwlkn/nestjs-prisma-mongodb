import { PickType } from '@nestjs/swagger';

import { PersistedOrderDto } from '@orders/dtos';

export class FoundOrdersDto extends PickType(PersistedOrderDto, [
  'id',
] as const) {}
