import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Check out the <a href="/docs">docs</a> endpoint for Swagger documentation."', () => {
      expect(appController.getHello()).toBe(
        'Check out the <a href="/docs">docs</a> endpoint for Swagger documentation.',
      );
    });
  });
});
