import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('OrderService', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('calculatePrice', () => {
      describe('calculable', () => {
        const testCases = [
          {
            packages: [
              {
                height: 50,
                length: 20,
                width: 10,
                weight: 50,
              },
            ],
            when: '1 package, 10000 volume, 50 weight',
            expected: 7,
          },
          {
            packages: [],
            when: 'no packages',
            expected: 0,
          },
          {
            packages: [
              {
                height: 0.1,
                length: 0.1,
                width: 0.1,
                weight: 0.1,
              },
            ],
            when: '1 package, no extra volume, no extra weight',
            expected: 1,
          },
          {
            packages: [
              {
                height: 20,
                length: 15,
                width: 50,
                weight: 0.1,
              },
            ],
            when: '1 package, 15000 volume, no extra weight',
            expected: 2.5,
          },
          {
            packages: [
              {
                height: 20,
                length: 15,
                width: 50,
                weight: 0.1,
              },
              {
                height: 20,
                length: 15,
                width: 50,
                weight: 0.1,
              },
            ],
            when: '2 packages, 30000 volume, no extra weight',
            expected: 5,
          },
          {
            packages: [
              {
                height: 0.1,
                length: 0.1,
                width: 0.1,
                weight: 5,
              },
              {
                height: 0.1,
                length: 0.1,
                width: 0.1,
                weight: 5,
              },
            ],
            when: '2 packages, no extra volume, 10 weight',
            expected: 3,
          },
          /// etc...
        ];

        testCases.forEach(({ packages, when, expected }) => {
          it(`should return ${expected}, ${when}`, () => {
            expect(service['calculatePrice'](packages)).toBeCloseTo(
              expected,
              1,
            );
          });
        });
      });

      describe('throwable', () => {
        const expected = 'Package properties must be greater than 0.';

        const testCases = [
          {
            packages: [
              {
                height: 0,
                length: 0,
                width: 0,
                weight: 0,
              },
            ],
            when: '1 package, all properties 0',
            expected,
          },
          {
            packages: [
              {
                height: -1,
                length: -1,
                width: -1,
                weight: -1,
              },
            ],
            when: '1 package, negative volume, negative weight',
            expected,
          },
          /// etc...
        ];

        testCases.forEach(({ packages, when, expected }) => {
          it(`should throw ${expected}, ${when}`, () => {
            expect(() => service['calculatePrice'](packages)).toThrow(expected);
          });
        });
      });
    });

    describe('isStatusTransitionAllowed', () => {
      const testCases = [
        // From CREATED:
        {
          from: OrderStatus.CREATED,
          to: OrderStatus.PICKED_UP,
          expected: true,
        },
        {
          from: OrderStatus.CREATED,
          to: OrderStatus.CANCELLED,
          expected: true,
        },
        {
          from: OrderStatus.CREATED,
          to: OrderStatus.DELIVERED,
          expected: false,
        },
        {
          from: OrderStatus.CREATED,
          to: OrderStatus.CREATED,
          expected: false,
        },
        {
          from: OrderStatus.CREATED,
          to: OrderStatus.RETURNING,
          expected: false,
        },
        {
          from: OrderStatus.CREATED,
          to: OrderStatus.RETURNED,
          expected: false,
        },

        // From PICKED_UP:
        {
          from: OrderStatus.PICKED_UP,
          to: OrderStatus.DELIVERED,
          expected: true,
        },
        {
          from: OrderStatus.PICKED_UP,
          to: OrderStatus.RETURNING,
          expected: true,
        },
        {
          from: OrderStatus.PICKED_UP,
          to: OrderStatus.CREATED,
          expected: false,
        },
        {
          from: OrderStatus.PICKED_UP,
          to: OrderStatus.CANCELLED,
          expected: false,
        },
        {
          from: OrderStatus.PICKED_UP,
          to: OrderStatus.RETURNED,
          expected: false,
        },
        {
          from: OrderStatus.PICKED_UP,
          to: OrderStatus.PICKED_UP,
          expected: false,
        },

        // From RETURNING:
        {
          from: OrderStatus.RETURNING,
          to: OrderStatus.RETURNED,
          expected: true,
        },
        {
          from: OrderStatus.RETURNING,
          to: OrderStatus.CREATED,
          expected: false,
        },
        {
          from: OrderStatus.RETURNING,
          to: OrderStatus.PICKED_UP,
          expected: false,
        },
        {
          from: OrderStatus.RETURNING,
          to: OrderStatus.CANCELLED,
          expected: false,
        },
        {
          from: OrderStatus.RETURNING,
          to: OrderStatus.DELIVERED,
          expected: false,
        },
        {
          from: OrderStatus.RETURNING,
          to: OrderStatus.RETURNING,
          expected: false,
        },

        // From CANCELLED:
        {
          from: OrderStatus.CANCELLED,
          to: OrderStatus.CREATED,
          expected: false,
        },
        {
          from: OrderStatus.CANCELLED,
          to: OrderStatus.PICKED_UP,
          expected: false,
        },
        {
          from: OrderStatus.CANCELLED,
          to: OrderStatus.CANCELLED,
          expected: false,
        },
        {
          from: OrderStatus.CANCELLED,
          to: OrderStatus.DELIVERED,
          expected: false,
        },
        {
          from: OrderStatus.CANCELLED,
          to: OrderStatus.RETURNING,
          expected: false,
        },
        {
          from: OrderStatus.CANCELLED,
          to: OrderStatus.RETURNED,
          expected: false,
        },

        // From DELIVERED:
        {
          from: OrderStatus.DELIVERED,
          to: OrderStatus.CREATED,
          expected: false,
        },
        {
          from: OrderStatus.DELIVERED,
          to: OrderStatus.PICKED_UP,
          expected: false,
        },
        {
          from: OrderStatus.DELIVERED,
          to: OrderStatus.CANCELLED,
          expected: false,
        },
        {
          from: OrderStatus.DELIVERED,
          to: OrderStatus.DELIVERED,
          expected: false,
        },
        {
          from: OrderStatus.DELIVERED,
          to: OrderStatus.RETURNING,
          expected: false,
        },
        {
          from: OrderStatus.DELIVERED,
          to: OrderStatus.RETURNED,
          expected: false,
        },

        // From RETURNED:
        {
          from: OrderStatus.RETURNED,
          to: OrderStatus.CREATED,
          expected: false,
        },
        {
          from: OrderStatus.RETURNED,
          to: OrderStatus.PICKED_UP,
          expected: false,
        },
        {
          from: OrderStatus.RETURNED,
          to: OrderStatus.CANCELLED,
          expected: false,
        },
        {
          from: OrderStatus.RETURNED,
          to: OrderStatus.DELIVERED,
          expected: false,
        },
        {
          from: OrderStatus.RETURNED,
          to: OrderStatus.RETURNING,
          expected: false,
        },
        {
          from: OrderStatus.RETURNED,
          to: OrderStatus.RETURNED,
          expected: false,
        },
      ];

      testCases.forEach(({ from, to, expected }) => {
        it(`should return ${expected} when transitioning from ${from} to ${to}`, () => {
          expect(service['isStatusTransitionAllowed'](from, to)).toBe(expected);
        });
      });
    });
  });
});
