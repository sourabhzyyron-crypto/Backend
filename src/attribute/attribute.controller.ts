import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.createAttribute(createAttributeDto);
  }

  @Get()
  findAll() {
    return this.attributeService.getAllAttributes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeService.getAttributeById(+id);
  }
  @Get('category/:categoryId')
  findAttributesByCategoryId(@Param('categoryId') categoryId: string) {
    return this.attributeService.findAttributesByCategoryId(+categoryId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributeService.updateAttribute(+id, updateAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeService.removeAttribute(+id);
  }
}
