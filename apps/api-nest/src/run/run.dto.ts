import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsNumberString,
} from 'class-validator';

export class RunStatusRequestPayloadDto {
  @IsNotEmpty()
  @IsString()
  measureMongoId: string;
}

export class RunListRequestPayloadDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export class RunRequestPayloadDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  loginUrl: string;

  @IsNotEmpty()
  @IsString()
  usernameSelector: string;

  @IsNotEmpty()
  @IsString()
  passwordSelector: string;

  @IsNotEmpty()
  @IsString()
  submitSelector: string;

  @IsOptional()
  @IsBoolean()
  hasPin: boolean;

  @IsNotEmpty()
  @IsString()
  pinSelector: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  pin: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsString()
  count: string;
}

export class PublishRunPayloadDto extends RunRequestPayloadDto {
  @IsNotEmpty()
  @IsString()
  measureMongoId: string;
}
