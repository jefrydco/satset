import { IsNotEmpty, IsNumber } from 'class-validator';
import { LoginDto } from 'src/browser/browser.dto';

export class MeasureDto extends LoginDto {
  @IsNotEmpty()
  @IsNumber()
  index: number;
}
