import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as _ from 'lodash';

import { CreateOrderDto, CreatePackageDto, UpdateOrderStatusDto } from './dto';

type CalculatePriceOptions = {
  pricePerPackage?: number;
  pricePerKg?: number;
  pricePerExtraVolume?: number;
  volumeThreshold?: number;
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        ...createOrderDto,
        price: this.calculatePrice(createOrderDto.packages),
      },
    });
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ${id} does not exist.`);
    }

    if (
      !this.isStatusTransitionAllowed(order.status, updateOrderStatusDto.status)
    ) {
      throw new BadRequestException(
        `Order status transition from ${order.status} to ${updateOrderStatusDto.status} is not allowed.`,
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        ...updateOrderStatusDto,
      },
    });

    return {
      id: order.id,
      oldStatus: order.status,
      status: updatedOrder.status,
    };
  }

  searchByAddressAndZipcode(address: string, zipcode: string) {
    return this.prisma.order.aggregateRaw({
      pipeline: [
        {
          $match: {
            'dropoff.zipcode': zipcode,
            'dropoff.address': { $regex: address, $options: 'i' },
          },
        },
        {
          $project: {
            id: { $toString: '$_id' },
          },
        },
      ],
    });
  }

  /**
   * Determines whether a transition between two order statuses is allowed.
   *
   * @param fromStatus - The current status of the order, of type `OrderStatus`.
   * @param toStatus - The desired new status for the order, of type `OrderStatus`.
   *
   * @remarks
   * This function checks if an order can transition from its current status (`fromStatus`)
   * to a new status (`toStatus`) based on predefined rules. The allowed transitions are:
   * - From `CREATED` to either `PICKED_UP` or `CANCELLED`.
   * - From `PICKED_UP` to either `DELIVERED` or `RETURNING`.
   * - From `RETURNING` to `RETURNED`.
   * - Transitions from `CANCELLED`, `DELIVERED`, and `RETURNED` to any other status are not allowed.
   *
   * If the current status does not match any of the predefined cases or the transition is not allowed,
   * the function returns `false`.
   *
   * @returns `true` if the status transition is allowed, otherwise `false`.
   */
  private isStatusTransitionAllowed(
    fromStatus: OrderStatus,
    toStatus: OrderStatus,
  ) {
    switch (fromStatus) {
      case OrderStatus.CREATED:
        return (
          toStatus === OrderStatus.PICKED_UP ||
          toStatus === OrderStatus.CANCELLED
        );

      case OrderStatus.PICKED_UP:
        return (
          toStatus === OrderStatus.DELIVERED ||
          toStatus === OrderStatus.RETURNING
        );

      case OrderStatus.RETURNING:
        return toStatus === OrderStatus.RETURNED;

      case OrderStatus.CANCELLED:
      case OrderStatus.DELIVERED:
      case OrderStatus.RETURNED:
        return false;

      default:
        return false;
    }
  }

  /**
   * Calculates the total shipping cost for a set of packages based on their dimensions, weight, and defined pricing options.
   *
   * The function iterates through each package, calculating the cost based on the package's base price, additional cost for
   * extra volume (if applicable), and weight. The total cost for all packages is then returned.
   *
   * @param packages - An array of `CreatePackageDto` objects, each representing a package.
   * @param options - An optional `CalculatePriceOptions` object to specify pricing parameters. Defaults to:
   *   - `pricePerPackage`: 1 (Base price for each package)
   *   - `pricePerKg`: 0.1 (Price per kilogram for the package's weight)
   *   - `pricePerExtraVolume`: 0.5 (Additional price for each unit of volume exceeding the volume threshold)
   *   - `volumeThreshold`: 5000 (Volume threshold in cubic units for extra volume charge)
   *
   *  @remarks
   * If `options` is not provided, default values are used for the calculation.
   *
   * @returns The total price for shipping all the packages in the `packages` array.
   */
  private calculatePrice(
    packages: CreatePackageDto[],
    options: CalculatePriceOptions = {
      pricePerPackage: 1,
      pricePerKg: 0.1,
      pricePerExtraVolume: 0.5,
      volumeThreshold: 5000,
    },
  ) {
    const {
      pricePerPackage,
      pricePerKg,
      pricePerExtraVolume,
      volumeThreshold,
    } = options;

    let price = 0;

    for (const pack of packages) {
      if (
        pack.height <= 0 ||
        pack.width <= 0 ||
        pack.length <= 0 ||
        pack.weight <= 0
      ) {
        throw new Error('Package properties must be greater than 0.');
      }

      let packageCost = pricePerPackage;

      const volume = pack.height * pack.width * pack.length;
      if (volume >= volumeThreshold) {
        const extraVolumeUnits = Math.floor(volume / volumeThreshold);
        packageCost += extraVolumeUnits * pricePerExtraVolume;
      }

      const weightCost = pack.weight * pricePerKg;

      price += packageCost + weightCost;
    }

    return _.round(price, 1);
  }
}
