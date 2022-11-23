import { IsNotEmpty, IsNumber } from 'class-validator';
import { PublishRunPayloadDto } from 'src/api/api.dto';

export class MeasureDto extends PublishRunPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  index: number;
}
