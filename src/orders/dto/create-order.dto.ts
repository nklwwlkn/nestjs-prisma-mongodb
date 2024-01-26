import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  MinLength,
  IsPhoneNumber,
  IsString,
  IsEmail,
  IsNumber,
  ValidateNested,
  ArrayMinSize,
  ArrayNotEmpty,
  Min,
} from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    example: '742 Evergreen Terrace',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: 'Springfield',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    example: 'USA',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    example: 'example@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Bart Simpson',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Transform(({ value }) => value?.replace(/\s/g, ''))
  @ApiProperty({
    example: '1234 AB',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  zipcode: string;

  @ApiProperty({
    example: '+31631631631',
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phonenumber: string;
}

export class CreatePackageDto {
  @ApiProperty({
    example: 50,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.001)
  height: number;

  @ApiProperty({
    example: 20,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.001)
  length: number;

  @ApiProperty({
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.001)
  width: number;

  @ApiProperty({
    example: 50,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.001)
  weight: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: CreateLocationDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateLocationDto)
  pickup: CreateLocationDto;

  @ApiProperty({ type: CreateLocationDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateLocationDto)
  dropoff: CreateLocationDto;

  @ApiProperty({ type: CreatePackageDto, isArray: true })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePackageDto)
  packages: CreatePackageDto[];
}
