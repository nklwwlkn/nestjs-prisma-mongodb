import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
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
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
