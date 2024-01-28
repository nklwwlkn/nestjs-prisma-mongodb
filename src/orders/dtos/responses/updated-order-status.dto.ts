import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

import { PersistedOrderDto } from '@orders/dtos';

export class UpdatedOrderStatusDto extends PickType(PersistedOrderDto, [
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
  oldStatus!: OrderStatus;
}
