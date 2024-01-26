import { PickType } from '@nestjs/swagger';

import { OrderEntity } from './';

export class SearchOrdersEntity extends PickType(OrderEntity, [
  'id',
] as const) {}
