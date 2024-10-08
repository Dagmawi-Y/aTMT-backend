import { IsString, IsOptional, IsNumber, IsIn, Min } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  image: string;

  @IsString()
  category: string;

  @IsString()
  subCategory: string;

  @IsString()
  content: string;

  @IsString()
  author: String;

  @IsString()
  readDuration: String;

  @IsString()
  authorAvatar: String;
}

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  subCategory?: string;

  @IsString()
  @IsOptional()
  content?: string;
}

export class BlogFilterDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  subCategory?: string;
}
