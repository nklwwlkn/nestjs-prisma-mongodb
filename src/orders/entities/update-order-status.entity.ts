import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

import { OrderEntity } from './order.entity';

export class UpdateOrderStatusEntity extends PickType(OrderEntity, [
  'id',
  'status',
] as const) {
  @ApiProperty({
    examples: [
      OrderStatus.CREATED,
      OrderStatus.PICKED_UP,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.RETURNING,
      OrderStatus.RETURNED,
    ],
    example: OrderStatus.CREATED,
  })
  @Expose()
  oldStatus: OrderStatus;
}
