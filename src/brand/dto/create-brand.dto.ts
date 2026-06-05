import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateBrandDto {
  @IsString({ message: 'Brand name must be a string' })
  @IsNotEmpty({ message: 'Brand name is required' })
  @Length(2, 50, {
    message: 'Brand name must be between 2 and 50 characters',
  })
  name!: string;

  @IsString({ message: 'Image URL must be a string' })
  @IsNotEmpty({ message: 'Image URL is required' })
  @IsUrl({}, { message: 'Please provide a valid image URL' })
  imageUrl!: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  status?: boolean;
}
