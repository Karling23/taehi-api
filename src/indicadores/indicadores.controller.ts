import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { buildPaginationOptions } from '../common/utils/pagination.util';
import { CreateIndicadorMesDto } from './dto/create-indicador-mes.dto';
import { UpdateIndicadorMesDto } from './dto/update-indicador-mes.dto';
import { IndicadoresService } from './indicadores.service';

@Controller('indicadores')
export class IndicadoresController {
  constructor(private readonly indicadoresService: IndicadoresService) {}

  @Get()
  findAll(@Req() req: Request, @Query() query: PaginationQueryDto) {
    return this.indicadoresService.findAll(buildPaginationOptions(req, query));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Post()
  create(@Body() dto: CreateIndicadorMesDto) {
    return this.indicadoresService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIndicadorMesDto) {
    return this.indicadoresService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.indicadoresService.remove(id);
  }
}
