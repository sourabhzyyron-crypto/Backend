import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  IsUrl,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Category name must be a string' })
  @MinLength(3, {
    message: 'Category name must be at least 3 characters long',
  })
  name!: string;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value' })
  status?: boolean;
}
