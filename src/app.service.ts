import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Check out the <a href="/docs">docs</a> endpoint for Swagger documentation.';
  }
}
