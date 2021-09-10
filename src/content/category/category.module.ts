import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ContentCategory } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ContentCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
