import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';

export class CreateTaskAttachmentDto {
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  fileType: string;

  @IsInt()
  @Min(1)
  @Max(4_194_304)
  @ApiProperty()
  fileSize: number;
}
