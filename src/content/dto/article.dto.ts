import { PartialType } from '@nestjs/swagger';

export class CreateArticleDto {}
export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
