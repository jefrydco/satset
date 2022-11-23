import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PublishRunPayloadDto } from 'src/api/api.dto';

export class MeasureDto extends PublishRunPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  index: number;

  @IsNotEmpty()
  @IsString()
  measureMongoId: string;
}
