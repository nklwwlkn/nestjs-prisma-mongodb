import { Order, Package, Location, OrderStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class PersistedLocationDto implements Location {
  @ApiProperty({
    example: '742 Evergreen Terrace',
  })
  @Expose()
  address!: string;

  @ApiProperty({
    example: 'Springfield',
  })
  @Expose()
  city!: string;

  @ApiProperty({
    example: 'USA',
  })
  @Expose()
  country!: string;

  @ApiProperty({
    example: 'example@gmail.com',
  })
  @Expose()
  email!: string;

  @ApiProperty({
    example: 'Bart Simpson',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    example: '1234 AB',
  })
  @Expose()
  zipcode!: string;

  @ApiProperty({
    example: '+31631631631',
  })
  @Expose()
  phonenumber!: string;

  constructor(location: PersistedLocationDto) {
    Object.assign(this, location);
  }
}

class PersistedPackageDto implements Package {
  @ApiProperty({
    example: 50,
  })
  @Expose()
  height!: number;

  @ApiProperty({
    example: 20,
  })
  @Expose()
  length!: number;

  @ApiProperty({
    example: 10,
  })
  @Expose()
  width!: number;

  @ApiProperty({
    example: 50,
  })
  @Expose()
  weight!: number;

  constructor(pack: PersistedPackageDto) {
    Object.assign(this, pack);
  }
}

export class PersistedOrderDto implements Order {
  @ApiProperty({
    example: '65b2549ef79e89aeb7cde58d',
  })
  @Expose()
  id!: string;

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
  status!: OrderStatus;

  @ApiProperty({ type: PersistedLocationDto })
  @Expose()
  @Type(() => PersistedLocationDto)
  dropoff!: PersistedLocationDto;

  @ApiProperty({ type: PersistedLocationDto })
  @Expose()
  @Type(() => PersistedLocationDto)
  pickup!: PersistedLocationDto;

  @ApiProperty({ type: [PersistedPackageDto] })
  @Expose()
  @Type(() => PersistedPackageDto)
  packages!: PersistedPackageDto[];

  @ApiProperty({
    example: 7,
  })
  @Expose()
  price!: number;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  constructor(order: PersistedOrderDto) {
    Object.assign(this, order);
  }
}
