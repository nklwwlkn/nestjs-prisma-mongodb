import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPort,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';

export class EnvVariables {
  @IsUrl({
    protocols: ['mongodb'],
    allow_underscores: true,
    require_tld: false,
  })
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  NODE_ENV!: string;

  @IsPort()
  @IsNotEmpty()
  PORT!: string;

  @IsBoolean()
  @IsOptional()
  DEBUG?: boolean;
}

export function validateEnvs(config: Record<string, unknown>): EnvVariables {
  const validatedConfig = plainToClass(EnvVariables, config);

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const formattedErrors = errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
    }));

    throw new Error(
      `Environment Variable Validation Error: ${JSON.stringify(
        formattedErrors,
        null,
        2,
      )}`,
    );
  }

  return validatedConfig;
}
