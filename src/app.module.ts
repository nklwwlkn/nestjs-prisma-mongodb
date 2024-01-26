import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { validateEnvs } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvs,
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env`,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
