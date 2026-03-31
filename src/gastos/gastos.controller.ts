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
import { CreateGastoRutaDto } from './dto/create-gasto-ruta.dto';
import { UpdateGastoRutaDto } from './dto/update-gasto-ruta.dto';
import { GastosService } from './gastos.service';

@Controller('gastos-ruta')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Get()
  findAll(@Req() req: Request, @Query() query: PaginationQueryDto) {
    return this.gastosService.findAll(buildPaginationOptions(req, query));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Post()
  create(@Body() dto: CreateGastoRutaDto) {
    return this.gastosService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGastoRutaDto) {
    return this.gastosService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gastosService.remove(id);
  }
}
