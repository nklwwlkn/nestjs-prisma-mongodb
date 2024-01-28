import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { IdParamDto } from '../dto';
import { ApiRoute } from '../decorators';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  CreatedOrderDto,
  SearchOrderQueryDto,
  FoundOrdersDto,
  UpdateOrderStatusDto,
  UpdatedOrderStatusDto,
} from './dto';

const ORDERS_RESOURCE = 'orders';

@ApiTags(ORDERS_RESOURCE)
@Controller(ORDERS_RESOURCE)
@SerializeOptions({
  excludePrefixes: ['_'],
  strategy: 'excludeAll',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBody({ description: 'The order payload', type: CreateOrderDto })
  @ApiRoute({
    description: 'Create an order',
    summary: 'Creates a new order',
    created: {
      description: 'Returns partial order document',
      type: CreatedOrderDto,
    },
    badRequest: { description: 'Invalid request body' },
  })
  async create(@Body() createOrderDto: CreateOrderDto) {
    const payload = await this.ordersService.create(createOrderDto);

    return plainToInstance(CreatedOrderDto, payload);
  }

  @Patch(':id/status')
  @ApiBody({
    description: 'New status of the order',
    type: UpdateOrderStatusDto,
  })
  @ApiRoute({
    description: `
    Sets new status of the order

    The following status transitions are allowed:
    - ${OrderStatus.CREATED}   -> ${OrderStatus.PICKED_UP}, ${OrderStatus.CANCELLED};
    - ${OrderStatus.PICKED_UP} -> ${OrderStatus.DELIVERED}, ${OrderStatus.RETURNING};
    - ${OrderStatus.RETURNING} -> ${OrderStatus.RETURNED};
    - ${OrderStatus.CANCELLED}, ${OrderStatus.DELIVERED}, ${OrderStatus.RETURNED} -> none.`,
    summary: 'Updates status of an order',
    notFound: { description: 'Order to update not found' },
    ok: { description: 'Order status updated', type: UpdatedOrderStatusDto },
    badRequest: {
      description: 'This kind of order status transition is not allowed',
    },
  })
  async updateStatus(
    @Param() param: IdParamDto,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const payload = await this.ordersService.updateStatus(
      param.id,
      updateOrderStatusDto,
    );

    return plainToInstance(UpdatedOrderStatusDto, payload);
  }

  @Get('search')
  @ApiRoute({
    description:
      'Search dropoff orders by partial address and full zipcode matches',
    summary: 'Searches dropoff orders',
    ok: { description: 'Orders` ids found', type: [FoundOrdersDto] },
    badRequest: { description: 'Invalid request query' },
  })
  @ApiQuery({ name: 'address', required: true })
  @ApiQuery({ name: 'zipcode', required: true })
  async searchByAddressAndZipcode(@Query() query: SearchOrderQueryDto) {
    const rawData = await this.ordersService.searchByAddressAndZipcode(
      query.address,
      query.zipcode,
    );

    return plainToInstance(FoundOrdersDto, rawData);
  }
}
