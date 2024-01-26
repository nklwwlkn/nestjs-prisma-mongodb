import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class IdParamDto {
  @ApiProperty({
    description: 'An id of the resource',
    example: '65b2549ef79e89aeb7cde58d',
  })
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
